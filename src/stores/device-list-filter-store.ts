import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { FilterStatus, UserFilterStatus } from '../types/device';

export type SortBy = 'name' | 'type-group' | 'install-date' | 'created-date';
export type SortDir = 'asc' | 'desc';

export const SORT_OPTIONS: { key: SortBy; label: string }[] = [
  { key: 'name', label: '设备名称' },
  { key: 'type-group', label: '设备类型' },
  { key: 'install-date', label: '装机日期' },
  { key: 'created-date', label: '录入时间' },
];

type DeviceListFilterState = {
  activeFilter: FilterStatus;
  activeCampus: string;
  activeModality: string;
  sortBy: SortBy;
  sortDir: SortDir;
  setActiveFilter: (v: FilterStatus) => void;
  setActiveCampus: (v: string) => void;
  setActiveModality: (v: string) => void;
  setSortBy: (v: SortBy) => void;
  setSortDir: (v: SortDir) => void;
  toggleSortDir: () => void;
};

type UserDeviceFilterState = {
  activeFilter: UserFilterStatus;
  activeCampus: string;
  activeModality: string;
  sortBy: SortBy;
  sortDir: SortDir;
  setActiveFilter: (v: UserFilterStatus) => void;
  setActiveCampus: (v: string) => void;
  setActiveModality: (v: string) => void;
  setSortBy: (v: SortBy) => void;
  setSortDir: (v: SortDir) => void;
  toggleSortDir: () => void;
};

const LEGACY_SORT_MAP: Record<string, { sortBy: SortBy; sortDir: SortDir }> = {
  'name-asc': { sortBy: 'name', sortDir: 'asc' },
  'type-group': { sortBy: 'type-group', sortDir: 'asc' },
  'install-date-desc': { sortBy: 'install-date', sortDir: 'desc' },
  'created-date-desc': { sortBy: 'created-date', sortDir: 'desc' },
};

function migrateLegacySort(persisted: unknown): Record<string, unknown> {
  const state = (persisted ?? {}) as Record<string, unknown>;
  const legacy = LEGACY_SORT_MAP[state.sortBy as string];
  if (legacy) {
    return { ...state, sortBy: legacy.sortBy, sortDir: state.sortDir ?? legacy.sortDir };
  }
  return state;
}

export const useDeviceListFilterStore = create<DeviceListFilterState>()(
  persist(
    (set) => ({
      activeFilter: 'all',
      activeCampus: 'all',
      activeModality: 'all',
      sortBy: 'name',
      sortDir: 'asc',
      setActiveFilter: (v) => set({ activeFilter: v }),
      setActiveCampus: (v) => set({ activeCampus: v }),
      setActiveModality: (v) => set({ activeModality: v }),
      setSortBy: (v) => set({ sortBy: v }),
      setSortDir: (v) => set({ sortDir: v }),
      toggleSortDir: () => set((s) => ({ sortDir: s.sortDir === 'asc' ? 'desc' : 'asc' })),
    }),
    { name: 'device-list-filter', version: 1, migrate: (p) => migrateLegacySort(p) as DeviceListFilterState }
  )
);

export const useUserDeviceFilterStore = create<UserDeviceFilterState>()(
  persist(
    (set) => ({
      activeFilter: 'all',
      activeCampus: 'all',
      activeModality: 'all',
      sortBy: 'name',
      sortDir: 'asc',
      setActiveFilter: (v) => set({ activeFilter: v }),
      setActiveCampus: (v) => set({ activeCampus: v }),
      setActiveModality: (v) => set({ activeModality: v }),
      setSortBy: (v) => set({ sortBy: v }),
      setSortDir: (v) => set({ sortDir: v }),
      toggleSortDir: () => set((s) => ({ sortDir: s.sortDir === 'asc' ? 'desc' : 'asc' })),
    }),
    { name: 'user-device-filter', version: 1, migrate: (p) => migrateLegacySort(p) as UserDeviceFilterState }
  )
);
