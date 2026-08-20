export type SenderRole = 'customer' | 'ccc' | 'rse' | 'system';
export type MessageType = 'text' | 'image' | 'system' | 'device-summary';
export type ConversationScope = 'general' | 'repair';
export type SegmentKind = 'inquiry' | 'work-order';
export type SegmentStatus = 'open' | 'closed';
export type DeliveryStatus = 'sent' | 'failed';

export interface ConversationAttachment {
  id: string;
  fileType: 'image';
  url: string;
  name?: string;
}

export interface TransferTarget {
  conversationId: string;
  displayNo: string;
  deviceName: string;
}

export interface ConversationMessage {
  id: string;
  senderRole: SenderRole;
  senderName?: string;
  type: MessageType;
  content: string;
  attachments?: ConversationAttachment[];
  createdAt: string;
  isRead: boolean;
  deliveryStatus?: DeliveryStatus;
  originWorkOrderId?: string;
  deviceId?: string;
  caseId?: string;
  transferTo?: TransferTarget;
}

export interface CaseRef {
  kind: 'repair' | 'inquiry-case';
  id: string;
  displayNo: string;
  deviceName: string;
}

export interface ConversationSegment {
  id: string;
  kind: SegmentKind;
  caseId: string;
  workOrderNo?: string;
  engineerName?: string;
  status: SegmentStatus;
  startedAt: string;
  closedAt?: string;
  messages: ConversationMessage[];
}

export interface Conversation {
  id: string;
  scope: ConversationScope;
  caseRef?: CaseRef;
  ownerId: string;
  ownerName: string;
  segments: ConversationSegment[];
  createdAt: string;
  updatedAt: string;
}

export const CURRENT_USER_ID = 'me';

export const GENERAL_CONVERSATION_ID = 'conv-general';

export const SENDER_LABEL: Record<SenderRole, string> = {
  customer: '我',
  ccc: '客户响应中心',
  rse: '远程服务工程师',
  system: '系统',
};

export const repairConversationId = (caseId: string, ownerId: string): string =>
  `conv-${caseId}--${ownerId}`;
