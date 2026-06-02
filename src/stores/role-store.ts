import { create } from 'zustand';
import { useMessageStore } from './message-store';

export type UserRole = 'user' | 'admin';

/** 申请升级状态机 */
export type UpgradeStatus = 'not-applied' | 'pending' | 'cooldown';

/** 院区扩展申请状态机 */
export type CampusStatus = 'not-applied' | 'pending' | 'cooldown';

type RoleState = {
  role: UserRole;
  upgradeStatus: UpgradeStatus;
  upgradeSubmittedAt: string | null; // 'YYYY-MM-DD'
  upgradeHospitals: string[];
  upgradeSalesName: string;
  upgradeSalesPhone: string;
  adminCampuses: string[];
  campusStatus: CampusStatus;
  campusPendingAt: string | null;
  campusPendingList: string[];
  campusSalesName: string;
  campusSalesPhone: string;
  username: string;
  setRole: (role: UserRole) => void;
  submitUpgrade: (hospitals: string[], salesName: string, salesPhone: string) => void;
  approveUpgrade: () => void;
  /** Demo helper — simulates rejection or 30-day timeout */
  rejectUpgrade: () => void;
  /** Demo helper — simulates 30-day cooldown expiry, re-opens apply button */
  resetUpgrade: () => void;
  submitCampusExpansion: (campuses: string[], salesName: string, salesPhone: string) => void;
  approveCampusExpansion: () => void;
  rejectCampusExpansion: () => void;
  resetCampusExpansion: () => void;
  setUsername: (name: string) => void;
};

const todayStr = () => new Date().toISOString().slice(0, 10);

export const useRoleStore = create<RoleState>((set) => ({
  role: 'admin',
  upgradeStatus: 'not-applied',
  upgradeSubmittedAt: null,
  upgradeHospitals: [],
  upgradeSalesName: '',
  upgradeSalesPhone: '',
  adminCampuses: ['WeConnect医院', 'WeConnect医院（南院）'],
  campusStatus: 'not-applied',
  campusPendingAt: null,
  campusPendingList: [],
  campusSalesName: '',
  campusSalesPhone: '',
  username: 'user_1234',
  setRole: (role) =>
    set((state) => ({
      role,
      upgradeStatus: role === 'user' ? state.upgradeStatus : 'not-applied',
      upgradeSubmittedAt: role === 'user' ? state.upgradeSubmittedAt : null,
      upgradeHospitals: role === 'user' ? state.upgradeHospitals : [],
    })),
  submitUpgrade: (hospitals, salesName, salesPhone) =>
    set({ upgradeStatus: 'pending', upgradeSubmittedAt: todayStr(), upgradeHospitals: hospitals, upgradeSalesName: salesName, upgradeSalesPhone: salesPhone }),
  approveUpgrade: () =>
    set({ role: 'admin', upgradeStatus: 'not-applied', upgradeSubmittedAt: null, upgradeHospitals: [], upgradeSalesName: '', upgradeSalesPhone: '' }),
  rejectUpgrade: () =>
    set({ upgradeStatus: 'cooldown' }),
  resetUpgrade: () =>
    set({ upgradeStatus: 'not-applied', upgradeSubmittedAt: null, upgradeHospitals: [], upgradeSalesName: '', upgradeSalesPhone: '' }),
  submitCampusExpansion: (campuses, salesName, salesPhone) =>
    set({ campusStatus: 'pending', campusPendingAt: todayStr(), campusPendingList: campuses, campusSalesName: salesName, campusSalesPhone: salesPhone }),
  approveCampusExpansion: () =>
    set((state) => {
      const pendingList = [...state.campusPendingList];
      useMessageStore.getState().addMessage({
        id: `msg-campus-${Date.now()}`,
        category: 'permission-upgrade',
        title: '已授权院区调整成功',
        body: `您申请新增的 ${pendingList.length} 个院区已通过审核，新增：${pendingList.join('、')}。现在可查看该院区的全院区设备与报修信息。`,
        time: new Date().toISOString().slice(0, 10),
        isRead: false,
        forAdminOnly: true,
      });
      return {
        adminCampuses: Array.from(new Set([...state.adminCampuses, ...state.campusPendingList])),
        campusStatus: 'not-applied',
        campusPendingAt: null,
        campusPendingList: [],
        campusSalesName: '',
        campusSalesPhone: '',
      };
    }),
  rejectCampusExpansion: () =>
    set({ campusStatus: 'cooldown' }),
  resetCampusExpansion: () =>
    set({ campusStatus: 'not-applied', campusPendingAt: null, campusPendingList: [], campusSalesName: '', campusSalesPhone: '' }),
  setUsername: (name) => set({ username: name }),
}));
