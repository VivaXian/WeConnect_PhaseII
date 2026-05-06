import { Text } from '@filament/react/text';
import clsx from 'clsx';
import { useMemo, useState } from 'react';
import type { Device } from '../types/device';
import type { MonthGroup, RepairStatus } from '../types/repair';
import { deviceList } from '../utils/device-data';
import { repairData } from '../utils/repair-data';
import { RepairList } from './repair-list';
import { homePageStyles } from '../pages/home-page.css';

type FilterChip = 'all' | RepairStatus;

const CHIPS: { key: FilterChip; label: string }[] = [
  { key: 'all', label: '全部' },
  { key: 'in-service', label: '服务中' },
  { key: 'completed-pending', label: '待签字' },
  { key: 'cancelled', label: '已取消' },
];

interface RepairRecordPanelProps {
  onDevicePress?: (device: Device) => void;
  onRepairDetailPress?: (repairId: string) => void;
  onServiceEvalPress?: (repairId: string) => void;
  showScanEntry?: boolean;
}

export const RepairRecordPanel = ({
  onDevicePress,
  onRepairDetailPress,
  onServiceEvalPress,
  showScanEntry = false,
}: RepairRecordPanelProps) => {
  const [activeChip, setActiveChip] = useState<FilterChip>('all');

  const handleDevicePress = (deviceName: string) => {
    const device = deviceList.find((item) => item.name === deviceName);
    if (device) {
      onDevicePress?.(device);
    }
  };

  const filteredGroups = useMemo<MonthGroup[]>(() => {
    if (activeChip === 'all') {
      return repairData;
    }

    const records = repairData
      .flatMap((group) => group.records)
      .filter((record) => record.status === activeChip);

    return records.length > 0 ? [{ month: '筛选结果', records }] : [];
  }, [activeChip]);

  return (
    <>
      {showScanEntry && (
        <div className={homePageStyles.scanRow}>
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
            <rect x="2" y="2" width="6" height="6" rx="1" stroke="#0072db" strokeWidth="1.5" />
            <rect x="12" y="2" width="6" height="6" rx="1" stroke="#0072db" strokeWidth="1.5" />
            <rect x="2" y="12" width="6" height="6" rx="1" stroke="#0072db" strokeWidth="1.5" />
            <path
              d="M12 12h2M16 12h2M12 16v2M16 14v4M18 14h-2"
              stroke="#0072db"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </svg>
          <span className={homePageStyles.scanLabel}>扫码报修</span>
          <span className={homePageStyles.scanSecondary}>输入设备编号 →</span>
        </div>
      )}

      <div className={homePageStyles.filterRow}>
        <div className={homePageStyles.chipGroup}>
          {CHIPS.map((chip) => (
            <button
              key={chip.key}
              className={clsx(
                homePageStyles.chip,
                activeChip === chip.key && homePageStyles.chipActive
              )}
              onClick={() => setActiveChip(chip.key)}
            >
              {chip.label}
            </button>
          ))}
        </div>
      </div>

      <div className={homePageStyles.listSection}>
        {filteredGroups.length === 0 ? (
          <div className={homePageStyles.emptyState}>
            <Text variant="body-s" color="secondary">暂无相关记录</Text>
          </div>
        ) : (
          <RepairList groups={filteredGroups} onDevicePress={handleDevicePress} onRepairDetailPress={onRepairDetailPress} onServiceEvalPress={onServiceEvalPress} />
        )}
      </div>
    </>
  );
};