import { create } from 'zustand';
import type { AppMessage } from '../types/message';
import { messageData } from '../utils/message-data';

type MessageState = {
  messages: AppMessage[];
  addMessage: (message: AppMessage) => void;
  markRead: (id: string) => void;
  markAllRead: (ids: string[]) => void;
  deleteMessage: (id: string) => void;
  deleteMessages: (ids: string[]) => void;
};

export const useMessageStore = create<MessageState>((set) => ({
  messages: messageData,
  addMessage: (message) => set((state) => ({
    messages: [message, ...state.messages],
  })),
  markRead: (id) => set((state) => ({
    messages: state.messages.map((message) => (
      message.id === id ? { ...message, isRead: true } : message
    )),
  })),
  markAllRead: (ids) => set((state) => {
    const targetIds = new Set(ids);

    return {
      messages: state.messages.map((message) => (
        targetIds.has(message.id) ? { ...message, isRead: true } : message
      )),
    };
  }),
  deleteMessage: (id) => set((state) => ({
    messages: state.messages.filter((message) => message.id !== id),
  })),
  deleteMessages: (ids) => set((state) => {
    const targetIds = new Set(ids);

    return {
      messages: state.messages.filter((message) => !targetIds.has(message.id)),
    };
  }),
}));