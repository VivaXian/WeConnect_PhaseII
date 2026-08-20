import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type MigrationStatus = 'none' | 'pending' | 'done';

const BATCH_WEEKDAY = 1;

export const nextBatchDate = (from: Date = new Date()): Date => {
  const offset = (BATCH_WEEKDAY - from.getDay() + 7) % 7 || 7;
  const target = new Date(from);
  target.setDate(target.getDate() + offset);
  return target;
};

export const formatBatchDate = (iso: string): string => {
  const date = new Date(iso);
  return `${date.getMonth() + 1}月${date.getDate()}日`;
};

type MigrationState = {
  status: MigrationStatus;
  expectedAt: string;
  noticeSeen: boolean;
  migratedCount: number;
  doneNoticeSeen: boolean;
  doneBannerDismissed: boolean;
  startPending: () => void;
  markNoticeSeen: () => void;
  complete: (count: number) => void;
  markDoneNoticeSeen: () => void;
  dismissDoneBanner: () => void;
  clear: () => void;
};

const INITIAL = {
  status: 'none' as MigrationStatus,
  expectedAt: '',
  noticeSeen: false,
  migratedCount: 0,
  doneNoticeSeen: false,
  doneBannerDismissed: false,
};

export const useMigrationStore = create<MigrationState>()(
  persist(
    (set) => ({
      ...INITIAL,
      startPending: () =>
        set({
          ...INITIAL,
          status: 'pending',
          expectedAt: nextBatchDate().toISOString(),
        }),
      markNoticeSeen: () => set({ noticeSeen: true }),
      complete: (count) =>
        set({
          ...INITIAL,
          status: 'done',
          noticeSeen: true,
          migratedCount: count,
        }),
      markDoneNoticeSeen: () => set({ doneNoticeSeen: true }),
      dismissDoneBanner: () => set({ doneBannerDismissed: true }),
      clear: () => set(INITIAL),
    }),
    { name: 'device-migration', version: 1 }
  )
);
