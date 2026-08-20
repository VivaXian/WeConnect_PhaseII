import type { ConversationMessage } from '../types/conversation';

export type HandoffRole = 'ccc' | 'rse';

export interface Handoff {
  role: HandoffRole;
  name?: string;
}

const isResponder = (message: ConversationMessage): boolean =>
  message.senderRole === 'ccc' || message.senderRole === 'rse';

export const handoffAt = (messages: ConversationMessage[], index: number): Handoff | null => {
  const message = messages[index];
  if (!isResponder(message)) return null;

  const previous = messages.slice(0, index).reverse().find(isResponder);
  if (!previous) return message.senderRole === 'rse' ? { role: 'rse', name: message.senderName } : null;
  if (previous.senderRole === message.senderRole && previous.senderName === message.senderName) return null;

  return { role: message.senderRole as HandoffRole, name: message.senderName };
};
