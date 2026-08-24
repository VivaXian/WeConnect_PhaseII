import type { Conversation, ConversationMessage } from '../types/conversation';
import { allMessages, findRepairRecord, isCaseClosed, lastMessageOf } from './conversation-status';

const FALLBACK_TITLE = '飞利浦服务';

const formatRepairDate = (value?: string): string => {
  if (!value) return '';
  const date = new Date(value.replace(' ', 'T'));
  if (Number.isNaN(date.getTime())) return '';
  return `${date.getMonth() + 1}月${date.getDate()}日报修`;
};

export const conversationTitle = (conversation: Conversation): string =>
  conversation.caseRef ? conversation.caseRef.deviceName : FALLBACK_TITLE;

export const conversationMeta = (conversation: Conversation): string => {
  if (!conversation.caseRef) return '';
  const reportedAt = formatRepairDate(findRepairRecord(conversation.caseRef.id)?.repairTime);
  return reportedAt
    ? `${reportedAt} · ${conversation.caseRef.displayNo}`
    : conversation.caseRef.displayNo;
};

/** 列表行上的状态标说的是**报修**，不是对话能不能回复 */
export const conversationStatus = (conversation: Conversation): string | null => {
  if (!conversation.caseRef || isCaseClosed(conversation)) return null;
  return findRepairRecord(conversation.caseRef.id)?.statusTitle ?? '服务中';
};

export const lastResponderMessage = (conversation: Conversation): ConversationMessage | null =>
  [...allMessages(conversation)]
    .reverse()
    .find((message) => message.senderRole !== 'customer' && message.senderRole !== 'system') ?? null;

export const isEngineerConversation = (conversation: Conversation): boolean =>
  lastResponderMessage(conversation)?.senderRole === 'rse';

export const lastMessageText = (conversation: Conversation): string => {
  const last = lastMessageOf(conversation);
  if (!last) return '';
  if (last.type === 'image') return last.content || '[图片]';
  if (last.type === 'device-summary') return '[设备状态]';
  return last.content;
};

export const formatConversationTime = (iso: string): string => {
  const date = new Date(iso.replace(' ', 'T'));
  if (Number.isNaN(date.getTime())) return '';
  const now = new Date();
  const month = `${date.getMonth() + 1}`.padStart(2, '0');
  const day = `${date.getDate()}`.padStart(2, '0');
  if (date.getFullYear() !== now.getFullYear()) return `${date.getFullYear()}/${month}/${day}`;
  const isSameDay = date.getMonth() === now.getMonth() && date.getDate() === now.getDate();
  if (isSameDay) return `${date.getHours()}:${date.getMinutes().toString().padStart(2, '0')}`;
  return `${month}/${day}`;
};

/** 对话的对方——取最后一位发言的工程师，而不是报修单上当前服务的工程师 */
export const conversationPartnerName = (conversation: Conversation): string | undefined =>
  lastResponderMessage(conversation)?.senderName;
