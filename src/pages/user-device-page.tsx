import { Text } from '@filament/react/text';
import clsx from 'clsx';
import { useMemo, useState } from 'react';
import { DeviceCard } from '../components/device-card';
import type { Device, UserFilterStatus } from '../types/device';
import { deviceList } from '../utils/device-data';
import { useDeviceCustomNamesStore } from '../stores/device-custom-names-store';
import { userDeviceStyles } from './user-device-page.css';

const USER_STAT_CHIPS: { key: UserFilterStatus; label: string }[] = [
  { key: 'all', label: '全部设备' },
  { key: 'pm-risk', label: 'PM风险' },
  { key: 'in-repair', label: '报修中' },
];

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

function pmThisMonth(d: Device): boolean {
  if (!d.pmNextDate) return false;
  return daysFromToday(d.pmNextDate) >= 0 && daysFromToday(d.pmNextDate) <= 30;
}

function isInRepair(d: Device): boolean {
  return d.status === 'under-repair' || d.status === 'pending-repair';
}

function getModality(device: Device): '磁共振' | 'CT' | '血管机' | '超声' | null {
  const t = device.type;
  if (t.includes('磁共振')) return '磁共振';
  if (t.includes('CT') || t.includes('PET')) return 'CT';
  if (t.includes('血管')) return '血管机';
  if (t.includes('超声')) return '超声';
  return null;
}

function matchesUserFilter(d: Device, filter: UserFilterStatus): boolean {
  switch (filter) {
    case 'all': return true;
    case 'pm-risk': return d.pmRisk === true;
    case 'in-repair': return isInRepair(d);
  }
}

function statusTag(d: Device) {
  const tags: { label: string; signal?: 'success' | 'warning' | 'caution' | 'error' }[] = [];
  if (isInRepair(d)) tags.push({ label: '报修中', signal: 'warning' });
  if (d.pmRisk) {
    tags.push({ label: 'PM高风险', signal: 'error' });
  } else if (pmThisMonth(d) && d.pmNextDate) {
    const [, month, day] = d.pmNextDate.split('-');
    tags.push({ label: `本月PM · ${month}-${day}` });
  }
  return tags;
}

const allCampuses = Array.from(
  new Set(deviceList.map((d) => d.campus).filter(Boolean))
) as string[];
const CAMPUS_OPTIONS = [
  { key: 'all', label: '全部院区' },
  ...allCampuses.map((c) => ({ key: c, label: c })),
];

interface UserDevicePageProps {
  onDevicePress?: (device: Device) => void;
  onScanRepair?: () => void;
  onScanSparePartAuth?: () => void;
}

export const UserDevicePage = ({ onDevicePress, onScanRepair, onScanSparePartAuth }: UserDevicePageProps) => {
  const [searchValue, setSearchValue] = useState('');
  const [activeFilter, setActiveFilter] = useState<UserFilterStatus>('all');
  const [activeCampus, setActiveCampus] = useState('all');
  const [campusOpen, setCampusOpen] = useState(false);
  const [activeModality, setActiveModality] = useState('all');
  const customNames = useDeviceCustomNamesStore((state) => state.names);

  const campusFilteredList = useMemo(
    () => activeCampus === 'all' ? deviceList : deviceList.filter((d) => d.campus === activeCampus),
    [activeCampus]
  );

  const statCounts = useMemo(() => ({
    all: campusFilteredList.length,
    'pm-risk': campusFilteredList.filter((d) => d.pmRisk === true).length,
    'in-repair': campusFilteredList.filter(isInRepair).length,
  }), [campusFilteredList]);

  const filteredDevices = useMemo(() => {
    let list = campusFilteredList.filter((d) => matchesUserFilter(d, activeFilter));
    if (activeModality !== 'all') list = list.filter((d) => getModality(d) === activeModality);
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
  }, [campusFilteredList, activeFilter, activeModality, searchValue]);

  return (
    <div className={userDeviceStyles.page}>
      <div className={userDeviceStyles.topBar}>
        <div className={userDeviceStyles.topBarTitle}>我的设备</div>
        <div className={userDeviceStyles.campusSelectorRow}>
          <button
            type="button"
            className={userDeviceStyles.campusSelectorBtn}
            onClick={() => setCampusOpen((prev) => !prev)}
          >
            {activeCampus === 'all' ? '全部院区' : activeCampus}
            <span className={userDeviceStyles.campusChevron}>▾</span>
          </button>
          {campusOpen && (
            <>
              <div className={userDeviceStyles.campusBackdrop} onClick={() => setCampusOpen(false)} />
              <div className={userDeviceStyles.campusDropdown}>
                {CAMPUS_OPTIONS.map((opt) => (
                  <button
                    key={opt.key}
                    type="button"
                    className={clsx(
                      userDeviceStyles.campusDropdownItem,
                      activeCampus === opt.key && userDeviceStyles.campusDropdownItemActive
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
        <div className={userDeviceStyles.statsScrollRow}>
          <div className={userDeviceStyles.statsRow}>
            {USER_STAT_CHIPS.map((chip) => (
              <button
                key={chip.key}
                type="button"
                className={clsx(
                  userDeviceStyles.statCard,
                  activeFilter === chip.key && userDeviceStyles.statCardActive
                )}
                onClick={() => setActiveFilter(chip.key)}
              >
                <div className={userDeviceStyles.statNumber}>{statCounts[chip.key]}</div>
                <div className={userDeviceStyles.statLabel}>{chip.label}</div>
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className={userDeviceStyles.searchRow}>
        <div className={userDeviceStyles.searchWrap}>
          <svg className={userDeviceStyles.searchIcon} width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <circle cx="11" cy="11" r="8" stroke="currentColor" strokeWidth="2"/>
            <path d="m21 21-4.35-4.35" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          </svg>
          <input
            type="text"
            className={userDeviceStyles.searchInput}
            placeholder="搜索设备名称 / 科室 / 型号"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            aria-label="搜索设备"
          />
        </div>
        <button
          type="button"
          className={userDeviceStyles.scanBtn}
          onClick={onScanRepair}
          aria-label="扫码报修"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <rect x="3" y="3" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="1.8"/>
            <rect x="3" y="14" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="1.8"/>
            <rect x="14" y="3" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="1.8"/>
            <rect x="5" y="5" width="3" height="3" fill="currentColor"/>
            <rect x="5" y="16" width="3" height="3" fill="currentColor"/>
            <rect x="16" y="5" width="3" height="3" fill="currentColor"/>
            <rect x="14" y="14" width="3" height="3" fill="currentColor"/>
            <rect x="17" y="17" width="3" height="3" fill="currentColor"/>
          </svg>
          扫码报修
        </button>
      </div>

      {/* 设备类型 filter */}
      <div className={userDeviceStyles.filterRow}>
        <div className={userDeviceStyles.chipGroup}>
          {MODALITY_OPTIONS.map((opt) => (
            <button
              key={opt.key}
              type="button"
              className={clsx(userDeviceStyles.chip, activeModality === opt.key && userDeviceStyles.chipActive)}
              onClick={() => setActiveModality(opt.key)}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* 备件防伪 banner */}
      <button
        type="button"
        className={userDeviceStyles.antiCounterfeitSectionBanner}
        onClick={onScanSparePartAuth}
      >
        <div className={userDeviceStyles.antiCounterfeitBannerIcon}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <rect x="3" y="3" width="7" height="7" rx="1" stroke="#ffffff" strokeWidth="1.8"/>
            <rect x="3" y="14" width="7" height="7" rx="1" stroke="#ffffff" strokeWidth="1.8"/>
            <rect x="14" y="3" width="7" height="7" rx="1" stroke="#ffffff" strokeWidth="1.8"/>
            <rect x="5" y="5" width="3" height="3" fill="#ffffff"/>
            <rect x="5" y="16" width="3" height="3" fill="#ffffff"/>
            <rect x="16" y="5" width="3" height="3" fill="#ffffff"/>
            <rect x="14" y="14" width="3" height="3" fill="#ffffff"/>
            <rect x="17" y="17" width="3" height="3" fill="#ffffff"/>
          </svg>
        </div>
        <div className={userDeviceStyles.antiCounterfeitBannerContent}>
          <div className={userDeviceStyles.antiCounterfeitBannerTitle}>备件防伪</div>
          <div className={userDeviceStyles.antiCounterfeitBannerDesc}>扫描二维码验证正品</div>
        </div>
      </button>

      <div className={userDeviceStyles.listSection}>
        <div className={userDeviceStyles.sectionHeader}>
          <Text variant="body-s" color="secondary">共 {filteredDevices.length} 台设备</Text>
        </div>
        {filteredDevices.map((d) => (
          <DeviceCard key={d.id} device={d} customName={customNames[d.id]} tags={statusTag(d)} onPress={() => onDevicePress?.(d)} />
        ))}
        {filteredDevices.length === 0 && (
          <div className={userDeviceStyles.emptyState}>
            <Text variant="body-m" color="secondary">未找到匹配设备</Text>
          </div>
        )}
      </div>
    </div>
  );
};
