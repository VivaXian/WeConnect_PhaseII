import { useMemo } from 'react';
import type { Conversation } from '../types/conversation';
import { useConversationStore } from '../stores/conversation-store';
import { allMessages, isConversationClosed } from '../utils/conversation-status';
import { isOwnConversation } from '../utils/conversation-grouping';

const countUnread = (conversation: Conversation): number =>
  !isOwnConversation(conversation) || isConversationClosed(conversation)
    ? 0
    : allMessages(conversation).filter((message) => !message.isRead && message.senderRole !== 'customer').length;

export interface ConversationUnread {
  total: number;
  byConversationId: Record<string, number>;
  byCaseId: Record<string, number>;
  firstUnread?: Conversation;
}

export const useConversationUnread = (): ConversationUnread => {
  const conversations = useConversationStore((state) => state.conversations);

  return useMemo(() => {
    const byConversationId = conversations.reduce<Record<string, number>>((acc, conversation) => {
      const count = countUnread(conversation);
      return count > 0 ? { ...acc, [conversation.id]: count } : acc;
    }, {});

    const byCaseId = conversations.reduce<Record<string, number>>((acc, conversation) => {
      const count = byConversationId[conversation.id] ?? 0;
      return conversation.caseRef && count > 0 ? { ...acc, [conversation.caseRef.id]: count } : acc;
    }, {});

    const total = Object.values(byConversationId).reduce((sum, count) => sum + count, 0);
    const firstUnread = conversations.find((conversation) => (byConversationId[conversation.id] ?? 0) > 0);

    return { total, byConversationId, byCaseId, firstUnread };
  }, [conversations]);
};
