import type { Conversation } from '../types/conversation';
import { CURRENT_USER_ID } from '../types/conversation';
import { allMessages, isCaseClosed } from './conversation-status';

const parseTime = (value?: string): number => {
  if (!value) return 0;
  const time = new Date(value.replace(' ', 'T')).getTime();
  return Number.isNaN(time) ? 0 : time;
};

export const isOwnConversation = (conversation: Conversation): boolean =>
  conversation.ownerId === CURRENT_USER_ID;

const byRecency = (a: Conversation, b: Conversation) =>
  parseTime(b.updatedAt) - parseTime(a.updatedAt);

// 只要不是空对话就算数：工程师主动发的那一条也得浮上来
const listable = (conversation: Conversation) =>
  conversation.scope === 'repair'
  && isOwnConversation(conversation)
  && allMessages(conversation).length > 0;

export const generalConversationOf = (conversations: Conversation[]): Conversation | undefined =>
  conversations.find((item) => item.scope === 'general' && isOwnConversation(item));

export const repairConversations = (conversations: Conversation[]): Conversation[] =>
  conversations
    .filter((conversation) => listable(conversation) && !isCaseClosed(conversation))
    .sort(byRecency);

export const archivedRepairConversations = (conversations: Conversation[]): Conversation[] =>
  conversations
    .filter((conversation) => listable(conversation) && isCaseClosed(conversation))
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
