import type { RepairRecord } from '../types/repair';

export const REPAIR_SYNC_CUTOFF = '2026-04-18';

export const REPAIR_SYNC_CUTOFF_LABEL = '2026年4月18日';

export const isPreCutoffRepair = (record: Pick<RepairRecord, 'repairTime'>): boolean =>
  record.repairTime !== undefined && record.repairTime < REPAIR_SYNC_CUTOFF;
