import { create } from 'zustand';

export type UserRole = 'user' | 'admin';

type RoleState = {
  role: UserRole;
  upgradeRequestSubmitted: boolean;
  setRole: (role: UserRole) => void;
  requestUpgrade: () => void;
};

export const useRoleStore = create<RoleState>((set) => ({
  role: 'admin',
  upgradeRequestSubmitted: false,
  setRole: (role) => set({ role }),
  requestUpgrade: () => set({ upgradeRequestSubmitted: true }),
}));
