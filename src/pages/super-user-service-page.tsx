import { Text } from '@filament/react/text';
import clsx from 'clsx';
import { useMemo, useState } from 'react';
import { RepairList } from '../components/repair-list';
import type { Device } from '../types/device';
import type { MonthGroup } from '../types/repair';
import { deviceList } from '../utils/device-data';
import { repairData } from '../utils/repair-data';
import { suServiceStyles } from './super-user-service-page.css';

interface SuperUserServicePageProps {
  onDevicePress?: (device: Device) => void;
  onRepairDetailPress?: (repairId: string) => void;
  onServiceEvalPress?: (repairId: string) => void;
}

type ServiceFilter = 'all' | 'in-service' | 'pending-sign' | 'pm' | 'risk';

const FILTERS: { key: ServiceFilter; label: string }[] = [
  { key: 'all', label: '全部' },
  { key: 'in-service', label: '服务中' },
  { key: 'pending-sign', label: '待签字' },
  { key: 'pm', label: '本月PM' },
  { key: 'risk', label: '风险设备' },
];

const FULL_RECORDS: MonthGroup[] = [
  {
    month: '2025年11月 (3)',
    records: [
      ...repairData[0].records,
      {
        id: 'nov-3',
        repairId: 'D-12126561',
        deviceName: 'Vereos PET/CT',
        hospital: 'WeConnect医院',
        department: '核医学科',
        status: 'completed-pending' as const,
        progress: {
          icon: 'checkmark-circle' as const,
          label: '服务完成',
          date: '2025-11-15 14:22:00',
          detail: '有1个待签字确认工单',
        },
        buttons: ['评价服务', '设备详情', '报修详情'],
      },
    ],
  },
  ...repairData.slice(1),
];

function filterGroups(filter: ServiceFilter): MonthGroup[] {
  if (filter === 'all') return FULL_RECORDS;
  if (filter === 'in-service') {
    return FULL_RECORDS.map((g) => ({
      ...g,
      records: g.records.filter((r) => r.status === 'in-service'),
    })).filter((g) => g.records.length > 0);
  }
  if (filter === 'pending-sign') {
    return FULL_RECORDS.map((g) => ({
      ...g,
      records: g.records.filter((r) => r.status === 'completed-pending'),
    })).filter((g) => g.records.length > 0);
  }
  return [];
}

export const SuperUserServicePage = ({ onDevicePress, onRepairDetailPress, onServiceEvalPress }: SuperUserServicePageProps) => {
  const [activeFilter, setActiveFilter] = useState<ServiceFilter>('all');

  const groups = useMemo(() => filterGroups(activeFilter), [activeFilter]);
  const totalRecords = groups.reduce((sum, g) => sum + g.records.length, 0);

  const handleDevicePress = (deviceName: string) => {
    const device = deviceList.find((d) => d.name === deviceName);
    if (device && onDevicePress) onDevicePress(device);
  };

  return (
    <div className={suServiceStyles.page}>
      {/* Blue header */}
      <div className={suServiceStyles.topBar}>
        <div className={suServiceStyles.topBarTitle}>报修</div>
        <div className={suServiceStyles.topBarSub}>WeConnect医院 · 全院视图</div>
      </div>

      <div className={suServiceStyles.body}>
        {/* Compact repair entry */}
        <div className={suServiceStyles.scanRow}>
          <div className={suServiceStyles.scanBanner}>
            <div className={suServiceStyles.scanBannerText}>
              <div className={suServiceStyles.scanBannerTitle}>扫码报修</div>
              <div className={suServiceStyles.scanBannerSub}>扫描设备二维码，快速提交报修申请</div>
            </div>
            <button className={suServiceStyles.scanBtn}>扫码</button>
          </div>
        </div>

        {/* Task filter chips */}
        <div className={suServiceStyles.filterRow}>
          <div className={suServiceStyles.chipGroup}>
            {FILTERS.map(({ key, label }) => (
              <button
                key={key}
                className={clsx(
                  suServiceStyles.chip,
                  activeFilter === key && suServiceStyles.chipActive
                )}
                onClick={() => setActiveFilter(key)}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Service records list */}
        <div className={suServiceStyles.listSection}>
          <div className={suServiceStyles.listHeader}>
            <Text variant="body-s" color="secondary">共 {totalRecords} 条记录</Text>
          </div>
          {groups.length > 0 ? (
            <RepairList groups={groups} onDevicePress={handleDevicePress} onRepairDetailPress={onRepairDetailPress} onServiceEvalPress={onServiceEvalPress} />
          ) : (
            <div className={suServiceStyles.emptyState}>
              <Text variant="body-m" color="secondary">暂无相关记录</Text>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
