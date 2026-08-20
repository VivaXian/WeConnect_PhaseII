import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type {
  CaseRef,
  Conversation,
  ConversationAttachment,
  ConversationMessage,
  ConversationSegment,
  SenderRole,
  TransferTarget,
} from '../types/conversation';
import { CURRENT_USER_ID, GENERAL_CONVERSATION_ID, repairConversationId } from '../types/conversation';
import { conversationSeed, CONVERSATION_SEED_VERSION } from '../utils/conversation-data';
import { planAutoReply, planQuickEntryReply } from '../utils/inquiry-auto-reply';
import { isConversationClosed } from '../utils/conversation-status';

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

interface QuickEntrySubmission {
  text: string;
  topic?: string;
  deviceId?: string;
  caseId?: string;
}

interface SendContext {
  engineerName?: string;
  originWorkOrderId?: string;
}

type ConversationState = {
  conversations: Conversation[];
  promptedIds: string[];
  isRseAvailable: boolean;
  sendMessage: (conversationId: string, text: string, attachments: ConversationAttachment[], context: SendContext) => void;
  submitQuickEntry: (conversationId: string, pick: QuickEntrySubmission) => void;
  retryMessage: (conversationId: string, messageId: string) => void;
  receiveMessage: (conversationId: string, message: IncomingMessage) => void;
  ensureRepairConversation: (caseRef: CaseRef) => string;
  recordTransfer: (fromConversationId: string, target: TransferTarget) => void;
  closeActiveSegment: (conversationId: string) => void;
  markRead: (conversationId: string) => void;
  markPrompted: (conversationId: string) => void;
  setRseAvailable: (value: boolean) => void;
};

const nowIso = () => new Date().toISOString();

const createId = (prefix: string) => `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;

const inquiryCaseId = () => `inq-${Date.now().toString(36)}`;

const openSegmentFor = (conversation: Conversation, timestamp: string): ConversationSegment => ({
  id: createId('seg'),
  kind: conversation.scope === 'general' ? 'inquiry' : 'work-order',
  caseId: conversation.scope === 'general' ? inquiryCaseId() : conversation.caseRef?.id ?? '',
  status: 'open',
  startedAt: timestamp,
  messages: conversation.scope === 'general'
    ? []
    : [
        {
          id: createId('msg'),
          senderRole: 'system',
          type: 'system',
          content: '客户响应中心已接手，将为您重新安排',
          createdAt: timestamp,
          isRead: true,
        },
      ],
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

export const useConversationStore = create<ConversationState>()(
  persist(
    (set, get) => ({
      conversations: conversationSeed,
      promptedIds: [],
      isRseAvailable: true,

      sendMessage: (conversationId, text, attachments, context) => {
        const target = get().conversations.find((item) => item.id === conversationId);
        if (!target || isConversationClosed(target)) return;

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
            withMessage(conversation, message)
          ),
        }));

        const conversation = get().conversations.find((item) => item.id === conversationId);
        if (!conversation) return;

        const activeSegment = conversation.segments[conversation.segments.length - 1];
        const hasEngineerJoined = activeSegment?.messages.some((item) => item.senderRole === 'rse') ?? false;

        planAutoReply(text, {
          engineerName: context.engineerName ?? activeSegment?.engineerName,
          originWorkOrderId: context.originWorkOrderId,
          isRseAvailable: get().isRseAvailable,
          hasEngineerJoined,
        }).forEach((reply) => {
          window.setTimeout(() => {
            get().receiveMessage(conversationId, {
              senderRole: reply.senderRole,
              senderName: reply.senderName,
              type: reply.type,
              content: reply.content,
              originWorkOrderId: reply.originWorkOrderId,
            });
          }, reply.delayMs);
        });
      },

      submitQuickEntry: (conversationId, pick) => {
        const target = get().conversations.find((item) => item.id === conversationId);
        if (!target || isConversationClosed(target)) return;

        const message: ConversationMessage = {
          id: createId('msg'),
          senderRole: 'customer',
          type: 'text',
          content: pick.text,
          createdAt: nowIso(),
          isRead: true,
        };

        set((state) => ({
          conversations: mapConversation(state.conversations, conversationId, (conversation) =>
            withMessage(conversation, message)
          ),
        }));

        planQuickEntryReply({ topic: pick.topic, deviceId: pick.deviceId, caseId: pick.caseId }).forEach((reply) => {
          window.setTimeout(() => {
            get().receiveMessage(conversationId, {
              senderRole: reply.senderRole,
              type: reply.type,
              content: reply.content,
              deviceId: reply.deviceId,
              caseId: reply.caseId,
            });
          }, reply.delayMs);
        });
      },

      receiveMessage: (conversationId, message) =>
        set((state) => ({
          conversations: mapConversation(state.conversations, conversationId, (conversation) =>
            withMessage(conversation, {
              ...message,
              id: createId('msg'),
              createdAt: nowIso(),
              isRead: false,
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

      ensureRepairConversation: (caseRef) => {
        const id = repairConversationId(caseRef.id, CURRENT_USER_ID);
        if (get().conversations.some((conversation) => conversation.id === id)) return id;

        const timestamp = nowIso();
        set((state) => ({
          conversations: [
            ...state.conversations,
            {
              id,
              scope: 'repair',
              caseRef,
              ownerId: CURRENT_USER_ID,
              ownerName: '我',
              createdAt: timestamp,
              updatedAt: timestamp,
              segments: [
                {
                  id: createId('seg'),
                  kind: 'work-order',
                  caseId: caseRef.id,
                  status: 'open',
                  startedAt: timestamp,
                  messages: [
                    {
                      id: createId('msg'),
                      senderRole: 'ccc',
                      type: 'text',
                      content: `您好，这里是客户响应中心。关于报修 ${caseRef.displayNo}（${caseRef.deviceName}），您可以在这里补充说明或上传照片。`,
                      createdAt: timestamp,
                      isRead: true,
                    },
                  ],
                },
              ],
            },
          ],
        }));
        return id;
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

      setRseAvailable: (value) => set({ isRseAvailable: value }),
    }),
    {
      name: 'weconnect-conversations',
      version: CONVERSATION_SEED_VERSION,
      migrate: () => ({
        conversations: conversationSeed,
        promptedIds: [],
        isRseAvailable: true,
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
        isRseAvailable: state.isRseAvailable,
      }),
    }
  )
);
