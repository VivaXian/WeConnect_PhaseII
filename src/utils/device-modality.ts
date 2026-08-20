import { deviceList } from './device-data';
import mrIcon from '../assets/icons/MR_core.svg?url';
import ctIcon from '../assets/icons/CT_core.svg?url';
import igtIcon from '../assets/icons/igt_core.svg?url';
import usIcon from '../assets/icons/US_core.svg?url';
import compassIcon from '../assets/icons/Compass_core.svg?url';

export type ModalityKey = 'mr' | 'ct' | 'igt' | 'us' | 'other';

export interface Modality {
  key: ModalityKey;
  label: string;
  icon: string;
}

export const getModality = (type: string): Modality => {
  if (type.includes('磁共振') || type.includes('MR')) return { key: 'mr', label: '磁共振', icon: mrIcon };
  if (type.includes('CT') || type.includes('PET')) return { key: 'ct', label: 'CT', icon: ctIcon };
  if (type.includes('血管')) return { key: 'igt', label: '血管机', icon: igtIcon };
  if (type.includes('超声')) return { key: 'us', label: '超声', icon: usIcon };
  return { key: 'other', label: '其他', icon: compassIcon };
};

export const findDeviceByName = (deviceName: string) =>
  deviceList.find((device) => device.name === deviceName);

export const modalityForDeviceName = (deviceName: string): Modality =>
  getModality(findDeviceByName(deviceName)?.type ?? deviceName);
