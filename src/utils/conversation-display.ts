import type { Conversation, ConversationMessage } from '../types/conversation';
import { allMessages, findRepairRecord, isConversationClosed, lastMessageOf, openSegmentOf } from './conversation-status';

const CCC_NAME = '客户响应中心';

const formatRepairDate = (value?: string): string => {
  if (!value) return '';
  const date = new Date(value.replace(' ', 'T'));
  if (Number.isNaN(date.getTime())) return '';
  return `${date.getMonth() + 1}月${date.getDate()}日报修`;
};

export const conversationTitle = (conversation: Conversation): string =>
  conversation.caseRef ? `报修号：${conversation.caseRef.displayNo}` : CCC_NAME;

export const conversationMeta = (conversation: Conversation): string => {
  if (!conversation.caseRef) return '';
  const reportedAt = formatRepairDate(findRepairRecord(conversation.caseRef.id)?.repairTime);
  return reportedAt
    ? `${conversation.caseRef.deviceName} · ${reportedAt}`
    : conversation.caseRef.deviceName;
};

export type ConversationStatusTone = 'active' | 'waiting';

export interface ConversationStatus {
  label: string;
  tone: ConversationStatusTone;
}

export const conversationStatus = (conversation: Conversation): ConversationStatus | null => {
  if (conversation.scope === 'general' || isConversationClosed(conversation)) return null;
  return openSegmentOf(conversation)
    ? { label: '服务中', tone: 'active' }
    : { label: '等待重新安排', tone: 'waiting' };
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
  const isSameDay = date.getFullYear() === now.getFullYear()
    && date.getMonth() === now.getMonth()
    && date.getDate() === now.getDate();
  if (isSameDay) return `${date.getHours()}:${date.getMinutes().toString().padStart(2, '0')}`;
  return `${date.getMonth() + 1}-${date.getDate()}`;
};
