import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const RECYCLE_RETENTION_DAYS = 30;
const RETENTION_MS = RECYCLE_RETENTION_DAYS * 24 * 60 * 60 * 1000;

type DeviceBindingState = {
  removedIds: string[];
  removedAt: Record<string, string>;
  purgedIds: string[];
  unbind: (id: string) => void;
  unbindMany: (ids: string[]) => void;
  restore: (id: string) => void;
  purge: (id: string) => void;
  purgeAll: () => void;
  purgeMany: (ids: string[]) => void;
  resetBindings: () => void;
  bindSelf: (id: string) => void;
};

const addUnique = (list: string[], id: string): string[] =>
  list.includes(id) ? list : [...list, id];

const nowIso = () => new Date().toISOString();

const withoutKey = (map: Record<string, string>, id: string): Record<string, string> => {
  const { [id]: _omit, ...rest } = map;
  return rest;
};

function migrateBinding(persisted: unknown): Partial<DeviceBindingState> {
  const state = (persisted ?? {}) as Record<string, unknown>;
  return {
    removedIds: Array.isArray(state.removedIds) ? (state.removedIds as string[]) : [],
    removedAt: (state.removedAt as Record<string, string>) ?? {},
    purgedIds: Array.isArray(state.purgedIds) ? (state.purgedIds as string[]) : [],
  };
}

export const useDeviceBindingStore = create<DeviceBindingState>()(
  persist(
    (set) => ({
      removedIds: [],
      removedAt: {},
      purgedIds: [],
      unbind: (id) =>
        set((s) => ({
          removedIds: addUnique(s.removedIds, id),
          removedAt: { ...s.removedAt, [id]: s.removedAt[id] ?? nowIso() },
        })),
      unbindMany: (ids) =>
        set((s) => {
          const stamp = nowIso();
          const removedAt = { ...s.removedAt };
          ids.forEach((id) => {
            if (!removedAt[id]) removedAt[id] = stamp;
          });
          return {
            removedIds: ids.reduce((acc, id) => addUnique(acc, id), s.removedIds),
            removedAt,
          };
        }),
      restore: (id) =>
        set((s) => ({
          removedIds: s.removedIds.filter((r) => r !== id),
          removedAt: withoutKey(s.removedAt, id),
          purgedIds: s.purgedIds.filter((p) => p !== id),
        })),
      purge: (id) =>
        set((s) => ({
          removedIds: s.removedIds.filter((r) => r !== id),
          removedAt: withoutKey(s.removedAt, id),
          purgedIds: addUnique(s.purgedIds, id),
        })),
      purgeAll: () =>
        set((s) => ({
          purgedIds: s.removedIds.reduce((acc, id) => addUnique(acc, id), s.purgedIds),
          removedIds: [],
          removedAt: {},
        })),
      purgeMany: (ids) =>
        set((s) => ({
          purgedIds: ids.reduce((acc, id) => addUnique(acc, id), s.purgedIds),
          removedIds: s.removedIds.filter((r) => !ids.includes(r)),
          removedAt: ids.reduce((acc, id) => withoutKey(acc, id), s.removedAt),
        })),
      resetBindings: () => set({ removedIds: [], removedAt: {}, purgedIds: [] }),
      bindSelf: (id) =>
        set((s) => ({
          removedIds: s.removedIds.filter((r) => r !== id),
          removedAt: withoutKey(s.removedAt, id),
          purgedIds: s.purgedIds.filter((p) => p !== id),
        })),
    }),
    { name: 'device-binding', version: 2, migrate: migrateBinding }
  )
);

export const isWithinRetention = (removedAtIso: string | undefined): boolean => {
  if (!removedAtIso) return true;
  return Date.now() - new Date(removedAtIso).getTime() < RETENTION_MS;
};

export const daysLeftInRecycle = (removedAtIso: string | undefined): number => {
  if (!removedAtIso) return RECYCLE_RETENTION_DAYS;
  const elapsed = Date.now() - new Date(removedAtIso).getTime();
  return Math.max(0, Math.ceil((RETENTION_MS - elapsed) / (24 * 60 * 60 * 1000)));
};
