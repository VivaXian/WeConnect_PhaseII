import { Text } from '@filament/react/text';
import clsx from 'clsx';
import { useMemo, useState } from 'react';
import { DeviceCard } from '../components/device-card';
import { PmCalendarView } from '../components/pm-calendar-view';
import type { FilterStatus } from '../types/device';
import type { Device } from '../types/device';
import { deviceList } from '../utils/device-data';
import { useDeviceCustomNamesStore } from '../stores/device-custom-names-store';
import { deviceListPageStyles } from './device-list-page.css';

const SU_STAT_CHIPS: { key: FilterStatus; label: string }[] = [
  { key: 'all', label: '全部设备' },
  { key: 'contract-risk', label: '合同风险' },
  { key: 'pm-risk', label: 'PM风险' },
  { key: 'in-repair', label: '报修中' },
  { key: 'pm-plan', label: '保养计划' },
];

// Today: April 29, 2026
const TODAY = new Date('2026-04-29');

const MODALITY_OPTIONS = [
  { key: 'all', label: '全部类型' },
  { key: 'CT', label: 'CT' },
  { key: '磁共振', label: '磁共振' },
  { key: '血管机', label: '血管机' },
  { key: '超声', label: '超声' },
];

function daysFromToday(dateStr: string): number {
  const target = new Date(dateStr);
  return Math.round((target.getTime() - TODAY.getTime()) / (1000 * 60 * 60 * 24));
}

function pmThisMonth(device: Device): boolean {
  if (!device.pmNextDate) return false;
  const d = daysFromToday(device.pmNextDate);
  return d >= 0 && d <= 30;
}

function pmDateLabel(device: Device): string {
  if (!device.pmNextDate) return '本月PM';
  const [, month, day] = device.pmNextDate.split('-');
  return `本月PM · ${month}-${day}`;
}

function contractRisk(device: Device): boolean {
  if (!device.contractEnd) return false;
  return daysFromToday(device.contractEnd) <= 120;
}

function isInRepair(device: Device): boolean {
  return device.status === 'under-repair' || device.status === 'pending-repair';
}

function getModality(device: Device): '磁共振' | 'CT' | '血管机' | '超声' | null {
  const t = device.type;
  if (t.includes('磁共振')) return '磁共振';
  if (t.includes('CT') || t.includes('PET')) return 'CT';
  if (t.includes('血管')) return '血管机';
  if (t.includes('超声')) return '超声';
  return null;
}

function matchesFilter(device: Device, filter: FilterStatus): boolean {
  switch (filter) {
    case 'all': return true;
    case 'contract-risk': return contractRisk(device);
    case 'pm-risk': return device.pmRisk === true;
    case 'in-repair': return isInRepair(device);
    case 'pm-plan': return pmThisMonth(device);
  }
}

type DeviceTag = { label: string; signal: 'error' | 'warning' | 'caution' | 'success' | undefined };

function computeDeviceTags(device: Device): DeviceTag[] {
  const tags: DeviceTag[] = [];
  const contractDays = device.contractEnd ? daysFromToday(device.contractEnd) : null;

  if (contractDays !== null && contractDays < 0) {
    tags.push({ label: '已出保', signal: 'error' });
  } else if (contractDays !== null && contractDays <= 120) {
    tags.push({ label: '即将出保', signal: 'warning' });
  }
  if (isInRepair(device)) {
    tags.push({ label: '报修中', signal: 'warning' });
  }
  if (device.pmRisk) {
    tags.push({ label: 'PM高风险', signal: 'error' });
  } else if (pmThisMonth(device)) {
    tags.push({ label: pmDateLabel(device), signal: undefined });
  }
  return tags;
}

interface DeviceListPageProps {
  onDevicePress?: (device: Device) => void;
  onScanRepair?: () => void;
}

const allCampuses = Array.from(
  new Set(deviceList.map((d) => d.campus).filter(Boolean))
) as string[];
const CAMPUS_OPTIONS = [
  { key: 'all', label: '全部院区' },
  ...allCampuses.map((c) => ({ key: c, label: c })),
];

const runtimeNow = new Date();

export const DeviceListPage = ({ onDevicePress, onScanRepair }: DeviceListPageProps) => {
  const [searchValue, setSearchValue] = useState('');
  const [activeFilter, setActiveFilter] = useState<FilterStatus>('all');
  const [activeCampus, setActiveCampus] = useState('all');
  const [campusOpen, setCampusOpen] = useState(false);
  const [activeModality, setActiveModality] = useState('all');
  const [calYear, setCalYear] = useState(runtimeNow.getFullYear());
  const [calMonth, setCalMonth] = useState(runtimeNow.getMonth() + 1);
  const [selectedPmDate, setSelectedPmDate] = useState<string | null>(null);
  const customNames = useDeviceCustomNamesStore((state) => state.names);

  const handleFilterChange = (filter: FilterStatus) => {
    setActiveFilter(filter);
    if (filter !== 'pm-plan') setSelectedPmDate(null);
  };

  const handleMonthChange = (year: number, month: number) => {
    setCalYear(year);
    setCalMonth(month);
    setSelectedPmDate(null);
  };

  const campusFilteredList = useMemo(
    () => activeCampus === 'all' ? deviceList : deviceList.filter((d) => d.campus === activeCampus),
    [activeCampus]
  );

  const statCounts = useMemo(() => ({
    all: campusFilteredList.length,
    'contract-risk': campusFilteredList.filter(contractRisk).length,
    'pm-risk': campusFilteredList.filter((d) => d.pmRisk === true).length,
    'in-repair': campusFilteredList.filter(isInRepair).length,
    'pm-plan': campusFilteredList.filter(pmThisMonth).length,
  }), [campusFilteredList]);

  const filteredDevices = useMemo(() => {
    let list = campusFilteredList.filter((d) => matchesFilter(d, activeFilter));
    if (activeFilter === 'pm-plan' && selectedPmDate) {
      list = list.filter((d) => d.pmNextDate === selectedPmDate);
    }
    if (activeModality !== 'all') {
      list = list.filter((d) => getModality(d) === activeModality);
    }
    if (searchValue.trim()) {
      const q = searchValue.trim().toLowerCase();
      list = list.filter(
        (d) =>
          d.name.toLowerCase().includes(q) ||
          d.type.toLowerCase().includes(q) ||
          d.department.toLowerCase().includes(q)
      );
    }
    return list;
  }, [campusFilteredList, activeFilter, selectedPmDate, activeModality, searchValue]);

  return (
    <div className={deviceListPageStyles.page}>
      <div className={deviceListPageStyles.topBar}>
        <div className={deviceListPageStyles.topBarTitle}>设备管理</div>
        <div className={deviceListPageStyles.campusSelectorRow}>
          <button
            type="button"
            className={deviceListPageStyles.campusSelectorBtn}
            onClick={() => setCampusOpen((prev) => !prev)}
          >
            {activeCampus === 'all' ? '全部院区' : activeCampus}
            <span className={deviceListPageStyles.campusChevron}>▾</span>
          </button>
          {campusOpen && (
            <>
              <div className={deviceListPageStyles.campusBackdrop} onClick={() => setCampusOpen(false)} />
              <div className={deviceListPageStyles.campusDropdown}>
                {CAMPUS_OPTIONS.map((opt) => (
                  <button
                    key={opt.key}
                    type="button"
                    className={clsx(
                      deviceListPageStyles.campusDropdownItem,
                      activeCampus === opt.key && deviceListPageStyles.campusDropdownItemActive
                    )}
                    onClick={() => { setActiveCampus(opt.key); setCampusOpen(false); }}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
        <div className={deviceListPageStyles.statsScrollRow}>
          <div className={deviceListPageStyles.statsRow}>
            {SU_STAT_CHIPS.map((chip) => (
              <button
                key={chip.key}
                type="button"
                className={clsx(
                  deviceListPageStyles.statCard,
                  activeFilter === chip.key && deviceListPageStyles.statCardActive
                )}
                onClick={() => handleFilterChange(chip.key)}
              >
                <div className={deviceListPageStyles.statNumber}>{statCounts[chip.key]}</div>
                <div className={deviceListPageStyles.statLabel}>{chip.label}</div>
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className={deviceListPageStyles.content}>
        <div className={deviceListPageStyles.searchRow}>
          <div className={deviceListPageStyles.searchWrap}>
            <svg className={deviceListPageStyles.searchIcon} width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <circle cx="11" cy="11" r="8" stroke="currentColor" strokeWidth="2"/>
              <path d="m21 21-4.35-4.35" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
            <input
              type="text"
              className={deviceListPageStyles.searchInput}
              placeholder="搜索设备名称 / 科室 / 型号"
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              aria-label="搜索设备"
            />
          </div>
          <button
            type="button"
            className={deviceListPageStyles.scanBtn}
            onClick={onScanRepair}
            aria-label="扫码报修/绑定"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M2 7V4a1 1 0 0 1 1-1h3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
              <path d="M22 7V4a1 1 0 0 0-1-1h-3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
              <path d="M2 17v3a1 1 0 0 0 1 1h3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
              <path d="M22 17v3a1 1 0 0 1-1 1h-3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
              <line x1="2" y1="12" x2="22" y2="12" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
            </svg>
            报修/绑定
          </button>
        </div>

        {/* 设备类型 filter */}
        <div className={deviceListPageStyles.filterRow}>
          <div className={deviceListPageStyles.chipGroup}>
            {MODALITY_OPTIONS.map((opt) => (
              <button
                key={opt.key}
                type="button"
                className={clsx(
                  deviceListPageStyles.chip,
                  activeModality === opt.key && deviceListPageStyles.chipActive
                )}
                onClick={() => setActiveModality(opt.key)}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        {/* PM calendar – visible when 保养计划 is active */}
        {activeFilter === 'pm-plan' && (
          <PmCalendarView
            devices={deviceList}
            year={calYear}
            month={calMonth}
            onMonthChange={handleMonthChange}
            selectedDate={selectedPmDate}
            onDateSelect={setSelectedPmDate}
          />
        )}

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
              customName={customNames[device.id]}
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
