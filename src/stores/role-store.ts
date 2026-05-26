import { create } from 'zustand';

export type UserRole = 'user' | 'admin';

/** 申请升级状态机 */
export type UpgradeStatus = 'not-applied' | 'pending' | 'cooldown';

type RoleState = {
  role: UserRole;
  upgradeStatus: UpgradeStatus;
  upgradeSubmittedAt: string | null; // 'YYYY-MM-DD'
  upgradeHospitals: string[];
  username: string;
  setRole: (role: UserRole) => void;
  submitUpgrade: (hospitals: string[]) => void;
  approveUpgrade: () => void;
  /** Demo helper — simulates rejection or 30-day timeout */
  rejectUpgrade: () => void;
  /** Demo helper — simulates 30-day cooldown expiry, re-opens apply button */
  resetUpgrade: () => void;
  setUsername: (name: string) => void;
};

const todayStr = () => new Date().toISOString().slice(0, 10);

export const useRoleStore = create<RoleState>((set) => ({
  role: 'admin',
  upgradeStatus: 'not-applied',
  upgradeSubmittedAt: null,
  upgradeHospitals: [],
  username: 'user_1234',
  setRole: (role) =>
    set((state) => ({
      role,
      upgradeStatus: role === 'user' ? state.upgradeStatus : 'not-applied',
      upgradeSubmittedAt: role === 'user' ? state.upgradeSubmittedAt : null,
      upgradeHospitals: role === 'user' ? state.upgradeHospitals : [],
    })),
  submitUpgrade: (hospitals) =>
    set({ upgradeStatus: 'pending', upgradeSubmittedAt: todayStr(), upgradeHospitals: hospitals }),
  approveUpgrade: () =>
    set({ role: 'admin', upgradeStatus: 'not-applied', upgradeSubmittedAt: null, upgradeHospitals: [] }),
  rejectUpgrade: () =>
    set({ upgradeStatus: 'cooldown' }),
  resetUpgrade: () =>
    set({ upgradeStatus: 'not-applied', upgradeSubmittedAt: null, upgradeHospitals: [] }),
  setUsername: (name) => set({ username: name }),
}));
