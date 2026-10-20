import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type {
  Conversation,
  ConversationAttachment,
  ConversationMessage,
  ConversationSegment,
  SenderRole,
  TransferTarget,
} from '../types/conversation';
import { CURRENT_USER_ID, repairConversationId } from '../types/conversation';
import { conversationSeed, CONVERSATION_SEED_VERSION } from '../utils/conversation-data';
import { isCaseClosed, findRepairRecord, isRepairStatusClosed } from '../utils/conversation-status';
import { planAutoReply, planEngineerIntro, planQuickEntryReply } from '../utils/inquiry-auto-reply';
import { ensureDemoRepair } from '../utils/repair-data';
import { activeRepairIdOfDevice } from '../utils/device-summary';
import type { QuickEntryPayload, ScheduledReply } from '../utils/inquiry-auto-reply';

interface IncomingMessage {
  senderRole: SenderRole;
  senderName?: string;
  type: ConversationMessage['type'];
  content: string;
  attachments?: ConversationAttachment[];
  originWorkOrderId?: string;
  deviceId?: string;
  caseId?: string;
  transferTo?: TransferTarget;
}

interface SendContext {
  engineerName?: string;
  originWorkOrderId?: string;
}

type ConversationState = {
  conversations: Conversation[];
  promptedIds: string[];
  sendMessage: (conversationId: string, text: string, attachments: ConversationAttachment[], context: SendContext) => void;
  /** 已有/新建的报修对话都返回它的 id，调用方据此跳转 */
  submitQuickEntry: (conversationId: string, text: string, payload: QuickEntryPayload) => string | undefined;
  startNewInquirySession: (conversationId: string) => void;
  retryMessage: (conversationId: string, messageId: string) => void;
  receiveMessage: (conversationId: string, message: IncomingMessage) => void;
  /** CCC 建单并把用户转到报修对话，工程师随后在那边开口 */
  escalateToRepair: (fromConversationId: string, caseId: string) => void;
  recordTransfer: (fromConversationId: string, target: TransferTarget) => void;
  closeActiveSegment: (conversationId: string) => void;
  markRead: (conversationId: string) => void;
  markPrompted: (conversationId: string) => void;
};

const nowIso = () => new Date().toISOString();

const createId = (prefix: string) => `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;

const openSegmentFor = (conversation: Conversation, timestamp: string): ConversationSegment => ({
  id: createId('seg'),
  kind: conversation.scope === 'general' ? 'inquiry' : 'work-order',
  caseId: conversation.caseRef?.id ?? createId('inq'),
  status: 'open',
  startedAt: timestamp,
  messages: [],
});

const withMessage = (conversation: Conversation, message: ConversationMessage): Conversation => {
  const last = conversation.segments[conversation.segments.length - 1];

  if (last?.status === 'open') {
    return {
      ...conversation,
      updatedAt: message.createdAt,
      segments: conversation.segments
        .slice(0, -1)
        .concat({ ...last, messages: [...last.messages, message] }),
    };
  }

  const fresh = openSegmentFor(conversation, message.createdAt);
  return {
    ...conversation,
    updatedAt: message.createdAt,
    segments: conversation.segments.concat({ ...fresh, messages: [...fresh.messages, message] }),
  };
};

const mapConversation = (
  conversations: Conversation[],
  conversationId: string,
  update: (conversation: Conversation) => Conversation
) => conversations.map((item) => (item.id === conversationId ? update(item) : item));

const newInquirySegment = (): ConversationSegment => ({
  id: createId('seg'),
  kind: 'inquiry',
  caseId: createId('inq'),
  status: 'open',
  startedAt: nowIso(),
  messages: [],
});

/** 报修 case 是现成的，缺的只是挂在它下面的对话——没有就建一条空的 */
const withRepairConversation = (conversations: Conversation[], caseId: string): Conversation[] => {
  const id = repairConversationId(caseId, CURRENT_USER_ID);
  if (conversations.some((item) => item.id === id)) return conversations;

  const record = findRepairRecord(caseId);
  if (!record) return conversations;

  const now = nowIso();
  return conversations.concat({
    id,
    scope: 'repair',
    caseRef: {
      kind: 'repair',
      id: caseId,
      displayNo: record.repairId,
      deviceName: record.deviceName,
    },
    ownerId: CURRENT_USER_ID,
    ownerName: '我',
    createdAt: now,
    updatedAt: now,
    segments: [
      {
        id: createId('seg'),
        kind: 'work-order',
        caseId,
        status: 'open',
        startedAt: now,
        messages: [],
      },
    ],
  });
};

const INQUIRY_IDLE_MS = 2 * 60 * 60 * 1000;

const msOf = (iso: string): number => new Date(iso.replace(' ', 'T')).getTime();

/** 静默超过 2 小时就收掉这一段咨询，下一条消息会开新的一段并重新给欢迎卡 */
const rotateIdleInquiry = (conversation: Conversation): Conversation => {
  if (conversation.scope !== 'general') return conversation;
  const last = conversation.segments[conversation.segments.length - 1];
  if (!last || last.status !== 'open' || last.messages.length === 0) return conversation;

  const lastAt = msOf(last.messages[last.messages.length - 1].createdAt);
  if (Number.isNaN(lastAt) || Date.now() - lastAt < INQUIRY_IDLE_MS) return conversation;

  return {
    ...conversation,
    segments: conversation.segments
      .slice(0, -1)
      .concat({ ...last, status: 'closed', closedAt: last.messages[last.messages.length - 1].createdAt }),
  };
};

const scheduleReplies = (
  get: () => ConversationState,
  conversationId: string,
  replies: ScheduledReply[]
) => {
  replies.forEach(({ delayMs, escalateCaseId, ...reply }) => {
    window.setTimeout(() => {
      if (escalateCaseId) get().escalateToRepair(conversationId, escalateCaseId);
      else get().receiveMessage(conversationId, reply);
    }, delayMs);
  });
};

export const useConversationStore = create<ConversationState>()(
  persist(
    (set, get) => ({
      conversations: conversationSeed,
      promptedIds: [],

      sendMessage: (conversationId, text, attachments, context) => {
        const target = get().conversations.find((item) => item.id === conversationId);
        // 报修单本身关闭才禁止发言；远程工单关闭只是换成 CCC 接待
        if (!target || isCaseClosed(target)) return;

        const message: ConversationMessage = {
          id: createId('msg'),
          senderRole: 'customer',
          type: attachments.length > 0 ? 'image' : 'text',
          content: text,
          attachments: attachments.length > 0 ? attachments : undefined,
          createdAt: nowIso(),
          isRead: true,
        };

        set((state) => ({
          conversations: mapConversation(state.conversations, conversationId, (conversation) =>
            withMessage(rotateIdleInquiry(conversation), message)
          ),
        }));

        const conversation = get().conversations.find((item) => item.id === conversationId);
        if (!conversation) return;

        const activeSegment = conversation.segments[conversation.segments.length - 1];
        const engineerName =
          activeSegment?.kind === 'work-order' ? activeSegment.engineerName : undefined;

        scheduleReplies(
          get,
          conversationId,
          planAutoReply(text, {
            engineerName,
            originWorkOrderId: context.originWorkOrderId,
            fallbackEngineerName: context.engineerName,
            isGeneral: conversation.scope === 'general',
          })
        );
      },

      submitQuickEntry: (conversationId, text, payload) => {
        const target = get().conversations.find((item) => item.id === conversationId);
        if (!target || isCaseClosed(target)) return undefined;

        const record = payload.caseId ? findRepairRecord(payload.caseId) : undefined;
        const goesToRepair = Boolean(payload.caseId && record && !isRepairStatusClosed(record.status));

        set((state) => ({
          conversations: mapConversation(state.conversations, conversationId, (conversation) =>
            withMessage(rotateIdleInquiry(conversation), {
              id: createId('msg'),
              senderRole: 'customer',
              type: 'text',
              content: text,
              createdAt: nowIso(),
              isRead: true,
            })
          ),
        }));

        if (goesToRepair && payload.caseId) {
          const caseId = payload.caseId;
          set((state) => ({ conversations: withRepairConversation(state.conversations, caseId) }));

          const repair = get().conversations.find(
            (item) => item.id === repairConversationId(caseId, CURRENT_USER_ID)
          );
          if (repair?.caseRef) {
            get().recordTransfer(conversationId, {
              conversationId: repair.id,
              displayNo: repair.caseRef.displayNo,
              deviceName: repair.caseRef.deviceName,
            });
            return repair.id;
          }
        }

        scheduleReplies(get, conversationId, planQuickEntryReply(payload));
        return undefined;
      },

      startNewInquirySession: (conversationId) =>
        set((state) => ({
          conversations: mapConversation(state.conversations, conversationId, (conversation) => {
            if (conversation.scope !== 'general') return conversation;
            const last = conversation.segments[conversation.segments.length - 1];
            if (!last || last.messages.length === 0) return conversation;
            return {
              ...conversation,
              segments: conversation.segments.slice(0, -1).concat(
                { ...last, status: 'closed', closedAt: last.messages[last.messages.length - 1].createdAt },
                newInquirySegment()
              ),
            };
          }),
        })),

      receiveMessage: (conversationId, message) =>
        set((state) => ({
          conversations: mapConversation(state.conversations, conversationId, (conversation) =>
            withMessage(conversation, {
              ...message,
              // 设备卡存下发出这一刻的报修状况，之后建单也不该回头改历史
              repairSnapshot:
                message.type === 'device-summary' && message.deviceId
                  ? activeRepairIdOfDevice(message.deviceId)
                  : undefined,
              id: createId('msg'),
              createdAt: nowIso(),
              isRead: message.senderRole === 'customer',
            })
          ),
        })),
      retryMessage: (conversationId, messageId) =>
        set((state) => ({
          conversations: mapConversation(state.conversations, conversationId, (conversation) => ({
            ...conversation,
            segments: conversation.segments.map((segment) => ({
              ...segment,
              messages: segment.messages.map((item) =>
                item.id === messageId ? { ...item, deliveryStatus: 'sent' as const, createdAt: nowIso() } : item
              ),
            })),
          })),
        })),

      escalateToRepair: (fromConversationId, caseId) => {
        ensureDemoRepair(caseId);
        set((state) => ({ conversations: withRepairConversation(state.conversations, caseId) }));

        const repair = get().conversations.find(
          (item) => item.id === repairConversationId(caseId, CURRENT_USER_ID)
        );
        if (!repair?.caseRef) return;

        get().recordTransfer(fromConversationId, {
          conversationId: repair.id,
          displayNo: repair.caseRef.displayNo,
          deviceName: repair.caseRef.deviceName,
        });
        scheduleReplies(get, repair.id, planEngineerIntro());
      },

      recordTransfer: (fromConversationId, target) =>
        set((state) => ({
          conversations: mapConversation(state.conversations, fromConversationId, (conversation) =>
            withMessage(conversation, {
              id: createId('msg'),
              senderRole: 'system',
              type: 'system',
              content: `已转到报修 ${target.displayNo} 的对话`,
              createdAt: nowIso(),
              isRead: true,
              transferTo: target,
            })
          ),
        })),

      closeActiveSegment: (conversationId) =>
        set((state) => ({
          conversations: mapConversation(state.conversations, conversationId, (conversation) => {
            const last = conversation.segments[conversation.segments.length - 1];
            if (!last || last.status === 'closed') return conversation;
            const closedAt = nowIso();
            return {
              ...conversation,
              updatedAt: closedAt,
              segments: conversation.segments
                .slice(0, -1)
                .concat({ ...last, status: 'closed', closedAt }),
            };
          }),
        })),

      markRead: (conversationId) =>
        set((state) => ({
          conversations: mapConversation(state.conversations, conversationId, (conversation) => ({
            ...conversation,
            segments: conversation.segments.map((segment) => ({
              ...segment,
              messages: segment.messages.map((item) => (item.isRead ? item : { ...item, isRead: true })),
            })),
          })),
        })),

      markPrompted: (conversationId) =>
        set((state) => ({
          promptedIds: state.promptedIds.includes(conversationId)
            ? state.promptedIds
            : [...state.promptedIds, conversationId],
        })),
    }),
    {
      name: 'weconnect-conversations',
      version: CONVERSATION_SEED_VERSION,
      migrate: () => ({
        conversations: conversationSeed,
        promptedIds: [],
      }),
      partialize: (state) => ({
        conversations: state.conversations.map((conversation) => ({
          ...conversation,
          segments: conversation.segments.map((segment) => ({
            ...segment,
            messages: segment.messages.map(({ attachments: _drop, ...rest }) => rest),
          })),
        })),
        promptedIds: state.promptedIds,
      }),
    }
  )
);

// 刷新后演示里已经建过的那张单要跟着回来，否则对话指向一张不存在的报修
useConversationStore
  .getState()
  .conversations.forEach((conversation) => {
    if (conversation.caseRef) ensureDemoRepair(conversation.caseRef.id);
  });
