import type { RepairRecord } from '../types/repair';
import { repairData } from './repair-data';

const OPEN_STATUS: RepairRecord['status'][] = ['reported', 'in-service'];

export const activeRepairs = (): RepairRecord[] =>
  repairData.flatMap((group) => group.records).filter((record) => OPEN_STATUS.includes(record.status));

export const repairById = (id: string): RepairRecord | undefined =>
  repairData.flatMap((group) => group.records).find((record) => record.id === id);

export const activeRepairOfDevice = (deviceName: string): RepairRecord | undefined =>
  activeRepairs().find((record) => record.deviceName === deviceName);
