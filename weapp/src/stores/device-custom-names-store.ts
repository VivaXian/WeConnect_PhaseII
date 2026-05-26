import { create } from 'zustand';

type DeviceCustomNamesState = {
  names: Record<string, string>;
  setName: (deviceId: string, name: string) => void;
};

export const useDeviceCustomNamesStore = create<DeviceCustomNamesState>((set) => ({
  names: {},
  setName: (deviceId, name) =>
    set((state) => {
      const trimmed = name.trim();
      if (!trimmed) {
        const { [deviceId]: _removed, ...rest } = state.names;
        return { names: rest };
      }
      return { names: { ...state.names, [deviceId]: trimmed } };
    }),
}));
