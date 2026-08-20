import { create } from 'zustand';

export type ToastAction = {
  label: string;
  onAction: () => void;
};

type ToastItem = {
  id: number;
  message: string;
  actions: ToastAction[];
};

type ToastState = {
  current: ToastItem | null;
  showToast: (message: string, action?: ToastAction | ToastAction[]) => void;
  dismiss: () => void;
};

let dismissTimer: ReturnType<typeof setTimeout> | null = null;
let nextId = 1;

const TOAST_DURATION = 4000;

export const useToastStore = create<ToastState>((set) => ({
  current: null,
  showToast: (message, action) => {
    if (dismissTimer) clearTimeout(dismissTimer);
    const id = nextId++;
    const actions = action ? (Array.isArray(action) ? action : [action]) : [];
    set({ current: { id, message, actions } });
    dismissTimer = setTimeout(() => {
      set((s) => (s.current?.id === id ? { current: null } : s));
    }, TOAST_DURATION);
  },
  dismiss: () => {
    if (dismissTimer) clearTimeout(dismissTimer);
    set({ current: null });
  },
}));
