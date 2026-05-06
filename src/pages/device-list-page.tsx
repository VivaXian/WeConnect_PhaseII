import { Item } from '@filament/react/common';
import { Search } from '@filament/react/search';
import { Text } from '@filament/react/text';
import clsx from 'clsx';
import { useMemo, useState } from 'react';
import { DeviceCard } from '../components/device-card';
import { PmCalendarView } from '../components/pm-calendar-view';
import type { FilterStatus } from '../types/device';
import type { Device } from '../types/device';
import { deviceList } from '../utils/device-data';
import { deviceListPageStyles } from './device-list-page.css';

const FILTER_CHIPS: { key: FilterStatus; label: string }[] = [
  { key: 'all', label: '全部设备' },
  { key: 'pm-this-month', label: '本月保养' },
  { key: 'expiring-soon', label: '即将脱保' },
  { key: 'at-risk', label: '风险设备' },
  { key: 'in-repair', label: '报修中' },
];

const EMPTY_SEARCH_RESULTS: never[] = [];

// Today: April 29, 2026
const TODAY = new Date('2026-04-29');

function daysFromToday(dateStr: string): number {
  const target = new Date(dateStr);
  return Math.round((target.getTime() - TODAY.getTime()) / (1000 * 60 * 60 * 24));
}

function pmThisMonth(device: Device): boolean {
  if (!device.pmNextDate) return false;
  const d = daysFromToday(device.pmNextDate);
  return d >= 0 && d <= 30;
}

// Format pmNextDate as 'MM-DD' for tag display
function pmDateLabel(device: Device): string {
  if (!device.pmNextDate) return '本月PM';
  const [, month, day] = device.pmNextDate.split('-');
  return `本月PM · ${month}-${day}`;
}

function expiringSoon(device: Device): boolean {
  if (!device.contractEnd) return false;
  const d = daysFromToday(device.contractEnd);
  return d >= 0 && d <= 120;
}

function contractExpired(device: Device): boolean {
  if (!device.contractEnd) return false;
  return daysFromToday(device.contractEnd) < 0;
}

function isInRepair(device: Device): boolean {
  return device.status === 'under-repair' || device.status === 'pending-repair';
}

function matchesFilter(device: Device, filter: FilterStatus): boolean {
  switch (filter) {
    case 'all': return true;
    case 'pm-this-month': return pmThisMonth(device);
    case 'expiring-soon': return expiringSoon(device);
    case 'at-risk': return device.pmRisk === true;
    case 'in-repair': return isInRepair(device);
  }
}

type DeviceTag = { label: string; signal: 'error' | 'warning' | 'caution' | 'success' | undefined };

function computeDeviceTags(device: Device): DeviceTag[] {
  const tags: DeviceTag[] = [];
  const contractDays = device.contractEnd ? daysFromToday(device.contractEnd) : null;

  if (contractDays !== null && contractDays < 0) {
    tags.push({ label: '脱保', signal: 'error' });
  } else if (contractDays !== null && contractDays <= 120) {
    tags.push({ label: '即将脱保', signal: 'warning' });
  }
  if (isInRepair(device)) {
    tags.push({ label: '报修中', signal: 'warning' });
  }
  if (device.pmRisk) {
    tags.push({ label: '有PM风险', signal: 'caution' });
  }
  if (pmThisMonth(device)) {
    tags.push({ label: pmDateLabel(device), signal: undefined });
  }
  if (tags.length === 0) {
    tags.push({ label: '正常', signal: 'success' });
  }
  return tags;
}

interface DeviceListPageProps {
  onDevicePress?: (device: Device) => void;
}

// Device-focused stats for the admin global view
const totalDevices = deviceList.length;
const inRepairCount = deviceList.filter(isInRepair).length;
const expiringCount = deviceList.filter((d) => expiringSoon(d) || contractExpired(d)).length;
const pmThisMonthCount = deviceList.filter(pmThisMonth).length;

const runtimeNow = new Date();

export const DeviceListPage = ({ onDevicePress }: DeviceListPageProps) => {
  const [searchValue, setSearchValue] = useState('');
  const [activeFilter, setActiveFilter] = useState<FilterStatus>('all');
  const [calYear, setCalYear] = useState(runtimeNow.getFullYear());
  const [calMonth, setCalMonth] = useState(runtimeNow.getMonth() + 1);
  const [selectedPmDate, setSelectedPmDate] = useState<string | null>(null);

  const handleFilterChange = (filter: FilterStatus) => {
    setActiveFilter(filter);
    if (filter !== 'pm-this-month') setSelectedPmDate(null);
  };

  const handleMonthChange = (year: number, month: number) => {
    setCalYear(year);
    setCalMonth(month);
    setSelectedPmDate(null);
  };

  const filteredDevices = useMemo(() => {
    const byFilter = deviceList.filter((d) => matchesFilter(d, activeFilter));
    const byDate =
      activeFilter === 'pm-this-month' && selectedPmDate
        ? byFilter.filter((d) => d.pmNextDate === selectedPmDate)
        : byFilter;
    if (!searchValue.trim()) return byDate;
    const q = searchValue.trim().toLowerCase();
    return byDate.filter(
      (d) =>
        d.name.toLowerCase().includes(q) ||
        d.type.toLowerCase().includes(q) ||
        d.department.toLowerCase().includes(q)
    );
  }, [activeFilter, selectedPmDate, searchValue]);

  return (
    <div className={deviceListPageStyles.page}>
      <div className={deviceListPageStyles.topBar}>
        <div className={deviceListPageStyles.topBarTitle}>设备管理</div>
        <div className={deviceListPageStyles.topBarSub}>WeConnect医院 · 全院设备视图</div>
        <div className={deviceListPageStyles.statsRow}>
          <div className={deviceListPageStyles.statCard}>
            <div className={deviceListPageStyles.statNumber}>{totalDevices}</div>
            <div className={deviceListPageStyles.statLabel}>设备总数</div>
          </div>
          <div className={deviceListPageStyles.statCard}>
            <div className={deviceListPageStyles.statNumber}>{inRepairCount}</div>
            <div className={deviceListPageStyles.statLabel}>报修中</div>
          </div>
          <div className={deviceListPageStyles.statCard}>
            <div className={deviceListPageStyles.statNumber}>{expiringCount}</div>
            <div className={deviceListPageStyles.statLabel}>合同风险</div>
          </div>
          <div className={deviceListPageStyles.statCard}>
            <div className={deviceListPageStyles.statNumber}>{pmThisMonthCount}</div>
            <div className={deviceListPageStyles.statLabel}>本月PM</div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className={deviceListPageStyles.content}>
        <div className={deviceListPageStyles.searchRow}>
          <Search
            items={EMPTY_SEARCH_RESULTS}
            aria-label="搜索设备"
            placeholder="搜索设备名称 / 科室"
            onInputChange={setSearchValue}
            inputValue={searchValue}
            isFullWidth
          >
            {() => <Item key="empty">{null}</Item>}
          </Search>
        </div>

        {/* Scrollable chip filters */}
        <div className={deviceListPageStyles.filterRow}>
          <div className={deviceListPageStyles.chipGroup}>
            {FILTER_CHIPS.map((chip) => (
              <button
                key={chip.key}
                className={clsx(
                  deviceListPageStyles.chip,
                  activeFilter === chip.key && deviceListPageStyles.chipActive
                )}
                onClick={() => handleFilterChange(chip.key)}
              >
                {chip.label}
              </button>
            ))}
          </div>
        </div>

        {/* PM calendar – visible when 本月保养 filter is active */}
        {activeFilter === 'pm-this-month' && (
          <PmCalendarView
            devices={deviceList}
            year={calYear}
            month={calMonth}
            onMonthChange={handleMonthChange}
            selectedDate={selectedPmDate}
            onDateSelect={setSelectedPmDate}
          />
        )}

        {/* Device list */}
        <div className={deviceListPageStyles.listSection}>
          <div className={deviceListPageStyles.sectionHeader}>
            <Text variant="body-s" color="secondary">
              共 {filteredDevices.length} 台设备
            </Text>
          </div>

          {filteredDevices.map((device) => (
            <DeviceCard
              key={device.id}
              device={device}
              tags={computeDeviceTags(device)}
              onPress={() => onDevicePress?.(device)}
            />
          ))}

          {filteredDevices.length === 0 && (
            <Text variant="body-m" color="secondary" textAlign="center">
              未找到匹配设备
            </Text>
          )}
        </div>
      </div>
    </div>
  );
};
