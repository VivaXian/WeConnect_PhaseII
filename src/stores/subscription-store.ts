import { create } from 'zustand';

export type SubscriptionKey = 'contract-alert' | 'acceptance' | 'pm-plan' | 'pm-risk' | 'account-notify';

type SubscriptionState = {
  subscriptions: Record<SubscriptionKey, boolean>;
  hasSeenPrompt: boolean;
  toggle: (key: SubscriptionKey) => void;
  markPromptSeen: () => void;
};

export const useSubscriptionStore = create<SubscriptionState>((set) => ({
  subscriptions: {
    'contract-alert': false,
    'acceptance': false,
    'pm-plan': false,
    'pm-risk': false,
    'account-notify': false,
  },
  hasSeenPrompt: false,
  toggle: (key) =>
    set((state) => ({
      subscriptions: { ...state.subscriptions, [key]: !state.subscriptions[key] },
    })),
  markPromptSeen: () => set({ hasSeenPrompt: true }),
}));
