import { create } from 'zustand';

type LocationEntry = {
  department?: string;
  location?: string;
};

type DeviceLocationsState = {
  locations: Record<string, LocationEntry>;
  setLocation: (deviceId: string, entry: LocationEntry) => void;
};

export const useDeviceLocationsStore = create<DeviceLocationsState>((set) => ({
  locations: {},
  setLocation: (deviceId, entry) =>
    set((state) => ({
      locations: { ...state.locations, [deviceId]: entry },
    })),
}));
