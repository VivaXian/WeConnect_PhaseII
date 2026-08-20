import type { Conversation } from '../types/conversation';
import { CURRENT_USER_ID } from '../types/conversation';
import { allMessages, isConversationClosed } from './conversation-status';

const parseTime = (value?: string): number => {
  if (!value) return 0;
  const time = new Date(value.replace(' ', 'T')).getTime();
  return Number.isNaN(time) ? 0 : time;
};

export const isOwnConversation = (conversation: Conversation): boolean =>
  conversation.ownerId === CURRENT_USER_ID;

export const hasCustomerActivity = (conversation: Conversation): boolean =>
  allMessages(conversation).some((message) => message.senderRole === 'customer');

const byRecency = (a: Conversation, b: Conversation) =>
  parseTime(b.updatedAt) - parseTime(a.updatedAt);

const hasResponderFollowUp = (conversation: Conversation): boolean =>
  allMessages(conversation).length > 1;

const listable = (conversation: Conversation) =>
  conversation.scope === 'repair'
  && isOwnConversation(conversation)
  && (hasCustomerActivity(conversation) || hasResponderFollowUp(conversation));

export const generalConversationOf = (conversations: Conversation[]): Conversation | undefined =>
  conversations.find((item) => item.scope === 'general' && isOwnConversation(item));

export const repairConversations = (conversations: Conversation[]): Conversation[] =>
  conversations
    .filter((conversation) => listable(conversation) && !isConversationClosed(conversation))
    .sort(byRecency);

export const archivedRepairConversations = (conversations: Conversation[]): Conversation[] =>
  conversations
    .filter((conversation) => listable(conversation) && isConversationClosed(conversation))
    .sort(byRecency);

export const activeConversations = (conversations: Conversation[]): Conversation[] =>
  repairConversations(conversations);

export const caseConversations = (conversations: Conversation[], caseId: string): Conversation[] =>
  conversations
    .filter((conversation) => conversation.scope === 'repair' && conversation.caseRef?.id === caseId)
    .sort((a, b) => {
      if (isOwnConversation(a) !== isOwnConversation(b)) return isOwnConversation(a) ? -1 : 1;
      return byRecency(a, b);
    });
