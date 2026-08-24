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
import { conversationSeed, CONVERSATION_SEED_VERSION } from '../utils/conversation-data';
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

interface SendContext {
  engineerName?: string;
  originWorkOrderId?: string;
}

type ConversationState = {
  conversations: Conversation[];
  promptedIds: string[];
  isRseAvailable: boolean;
  sendMessage: (conversationId: string, text: string, attachments: ConversationAttachment[], context: SendContext) => void;
  retryMessage: (conversationId: string, messageId: string) => void;
  receiveMessage: (conversationId: string, message: IncomingMessage) => void;
  recordTransfer: (fromConversationId: string, target: TransferTarget) => void;
  closeActiveSegment: (conversationId: string) => void;
  markRead: (conversationId: string) => void;
  markPrompted: (conversationId: string) => void;
  setRseAvailable: (value: boolean) => void;
};

const nowIso = () => new Date().toISOString();

const createId = (prefix: string) => `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;

const openSegmentFor = (conversation: Conversation, timestamp: string): ConversationSegment => ({
  id: createId('seg'),
  kind: 'work-order',
  caseId: conversation.caseRef?.id ?? '',
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
        const engineerName = context.engineerName ?? activeSegment?.engineerName;
        if (!engineerName) return;

        window.setTimeout(() => {
          get().receiveMessage(conversationId, {
            senderRole: 'rse',
            senderName: engineerName,
            type: 'text',
            content: '收到，我看一下您发的信息，稍后回复您。',
            originWorkOrderId: context.originWorkOrderId,
          });
        }, 1200);
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
