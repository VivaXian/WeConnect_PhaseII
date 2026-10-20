import type { RepairRecord } from '../types/repair';
import { deviceList } from './device-data';
import { repairData } from './repair-data';

const OPEN_STATUS: RepairRecord['status'][] = ['reported', 'in-service'];

export const activeRepairs = (): RepairRecord[] =>
  repairData.flatMap((group) => group.records).filter((record) => OPEN_STATUS.includes(record.status));

export const repairById = (id: string): RepairRecord | undefined =>
  repairData.flatMap((group) => group.records).find((record) => record.id === id);

export const activeRepairOfDevice = (deviceName: string): RepairRecord | undefined =>
  activeRepairs().find((record) => record.deviceName === deviceName);

export const activeRepairIdOfDevice = (deviceId: string): string | null => {
  const device = deviceList.find((item) => item.id === deviceId);
  return (device ? activeRepairOfDevice(device.name)?.id : undefined) ?? null;
};
