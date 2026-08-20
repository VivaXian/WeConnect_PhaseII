import type { Conversation, ConversationMessage, ConversationSegment } from '../types/conversation';
import type { RepairStatus } from '../types/repair';
import { repairData } from './repair-data';

const CLOSED_REPAIR_STATUS: RepairStatus[] = ['completed-pending', 'cancelled'];

const allRepairRecords = () => repairData.flatMap((group) => group.records);

export const findRepairRecord = (caseId: string) =>
  allRepairRecords().find((record) => record.id === caseId);

export const isRepairStatusClosed = (status?: RepairStatus): boolean =>
  status !== undefined && CLOSED_REPAIR_STATUS.includes(status);

export const isConversationClosed = (conversation: Conversation): boolean => {
  if (conversation.scope === 'general') return false;
  return isRepairStatusClosed(findRepairRecord(conversation.caseRef?.id ?? '')?.status);
};

export const allMessages = (conversation: Conversation): ConversationMessage[] =>
  conversation.segments.flatMap((segment) => segment.messages);

export const lastMessageOf = (conversation: Conversation): ConversationMessage | undefined => {
  const messages = allMessages(conversation);
  return messages[messages.length - 1];
};

export const openSegmentOf = (conversation: Conversation): ConversationSegment | undefined => {
  const last = conversation.segments[conversation.segments.length - 1];
  return last?.status === 'open' ? last : undefined;
};

export const activeEngineerName = (conversation: Conversation): string | undefined =>
  openSegmentOf(conversation)?.engineerName;

export const lastClosedSegment = (conversation: Conversation): ConversationSegment | undefined =>
  [...conversation.segments].reverse().find((segment) => segment.status === 'closed');
