import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { FilterStatus, UserFilterStatus } from '../types/device';

export type SortBy = 'name-asc' | 'install-date-desc' | 'created-date-desc';

export const SORT_OPTIONS: { key: SortBy; label: string }[] = [
  { key: 'name-asc', label: '设备名称' },
  { key: 'install-date-desc', label: '装机日期' },
  { key: 'created-date-desc', label: '录入时间' },
];

type DeviceListFilterState = {
  activeFilter: FilterStatus;
  activeCampus: string;
  activeModality: string;
  sortBy: SortBy;
  setActiveFilter: (v: FilterStatus) => void;
  setActiveCampus: (v: string) => void;
  setActiveModality: (v: string) => void;
  setSortBy: (v: SortBy) => void;
};

type UserDeviceFilterState = {
  activeFilter: UserFilterStatus;
  activeCampus: string;
  activeModality: string;
  sortBy: SortBy;
  setActiveFilter: (v: UserFilterStatus) => void;
  setActiveCampus: (v: string) => void;
  setActiveModality: (v: string) => void;
  setSortBy: (v: SortBy) => void;
};

export const useDeviceListFilterStore = create<DeviceListFilterState>()(
  persist(
    (set) => ({
      activeFilter: 'all',
      activeCampus: 'all',
      activeModality: 'all',
      sortBy: 'name-asc',
      setActiveFilter: (v) => set({ activeFilter: v }),
      setActiveCampus: (v) => set({ activeCampus: v }),
      setActiveModality: (v) => set({ activeModality: v }),
      setSortBy: (v) => set({ sortBy: v }),
    }),
    { name: 'device-list-filter' }
  )
);

export const useUserDeviceFilterStore = create<UserDeviceFilterState>()(
  persist(
    (set) => ({
      activeFilter: 'all',
      activeCampus: 'all',
      activeModality: 'all',
      sortBy: 'name-asc',
      setActiveFilter: (v) => set({ activeFilter: v }),
      setActiveCampus: (v) => set({ activeCampus: v }),
      setActiveModality: (v) => set({ activeModality: v }),
      setSortBy: (v) => set({ sortBy: v }),
    }),
    { name: 'user-device-filter' }
  )
);
