import { Text } from '@filament/react/text';
import clsx from 'clsx';
import { useMemo, useState } from 'react';
import { DeviceCard } from '../components/device-card';
import type { FilterStatus } from '../types/device';
import type { Device } from '../types/device';
import { deviceList } from '../utils/device-data';
import { useDeviceCustomNamesStore } from '../stores/device-custom-names-store';
import { deviceListPageStyles } from './device-list-page.css';

const SU_STAT_CHIPS: { key: FilterStatus; label: string }[] = [
  { key: 'all', label: '全部设备' },
  { key: 'contract-risk', label: '合同风险' },
  { key: 'pm-risk', label: '保养风险' },
  { key: 'in-repair', label: '报修中' },
  { key: 'pm-plan', label: '保养计划' },
];

// Today computed at runtime
const TODAY = new Date();

const MODALITY_OPTIONS = [
  { key: 'CT', label: 'CT' },
  { key: '磁共振', label: '磁共振' },
  { key: '血管机', label: '血管机' },
  { key: '超声', label: '超声' },
  { key: '其他', label: '其他' },
];

const ALL_MONTHS = Array.from({ length: 12 }, (_, i) => i + 1);

function daysFromToday(dateStr: string): number {
  const target = new Date(dateStr);
  return Math.round((target.getTime() - TODAY.getTime()) / (1000 * 60 * 60 * 24));
}

function isUltrasoundDevice(device: Device): boolean {
  return device.type.includes('超声');
}

function isPmInMonth(device: Device, year: number, month: number): boolean {
  if (!device.pmNextDate) return false;
  if (isUltrasoundDevice(device)) return false;
  const target = new Date(device.pmNextDate);
  return target.getFullYear() === year && target.getMonth() + 1 === month;
}

function pmThisMonth(device: Device): boolean {
  return isPmInMonth(device, TODAY.getFullYear(), TODAY.getMonth() + 1);
}

function pmDateLabel(device: Device): string {
  if (!device.pmNextDate) return '本月保养';
  const [, month, day] = device.pmNextDate.split('-');
  return `本月保养·${month}月${day}日`;
}

function formatPmPlanTag(dateStr: string): string {
  const [, month, day] = dateStr.split('-');
  return `计划保养·${parseInt(month, 10)}月${parseInt(day, 10)}日`;
}

function parseDateStart(dateStr: string): Date {
  const d = new Date(dateStr);
  return new Date(d.getFullYear(), d.getMonth(), d.getDate());
}

function comparePmPlanDevice(a: Device, b: Device): number {
  if (!a.pmNextDate || !b.pmNextDate) return 0;
  const aDate = parseDateStart(a.pmNextDate);
  const bDate = parseDateStart(b.pmNextDate);
  return aDate.getTime() - bDate.getTime();
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
    case 'contract-risk': return contractRisk(device) || device.acceptancePending === true;
    case 'pm-risk': return device.pmRisk === true;
    case 'in-repair': return isInRepair(device);
    case 'pm-plan': return pmThisMonth(device);
  }
}

type DeviceTag = { label: string; signal: 'error' | 'warning' | 'caution' | 'success' | undefined };

function computeDeviceTags(device: Device, activeFilter: FilterStatus): DeviceTag[] {
  if (activeFilter === 'pm-plan' && device.pmNextDate) {
    return [
      {
        label: formatPmPlanTag(device.pmNextDate),
        signal: 'caution',
      },
    ];
  }

  const tags: DeviceTag[] = [];
  const contractDays = device.contractEnd ? daysFromToday(device.contractEnd) : null;

  // Acceptance & contract tags (admin page always shows these)
  if (device.acceptancePending) {
    tags.push({ label: '设备待验收', signal: 'warning' });
  } else {
    const isUltrasoundOrIS = device.type.includes('超声') || device.type.includes('影像工作站') || device.type.includes('信息系统');
    const isDistributedWithContract = device.isDistributedDevice === true && isUltrasoundOrIS;
    const installDate = device.installDate ? new Date(device.installDate) : null;
    const now = new Date();
    const monthsSince = installDate
      ? (now.getFullYear() - installDate.getFullYear()) * 12 + now.getMonth() - installDate.getMonth()
      : null;
    const isWithinSixMonths = monthsSince !== null && monthsSince < 6;
    if (isDistributedWithContract || isWithinSixMonths) {
      tags.push({ label: '合同未知', signal: undefined });
    } else if (device.businessContract === 'none' || (contractDays !== null && contractDays < 0)) {
      tags.push({ label: '无保', signal: 'error' });
    } else if (contractDays !== null && contractDays <= 120) {
      tags.push({ label: '即将出保', signal: 'warning' });
    }
  }

  if (isInRepair(device)) {
    tags.push({ label: '报修中', signal: 'caution' });
  }
  if (device.pmRisk) {
    tags.push({ label: '保养风险', signal: 'error' });
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
  const customNames = useDeviceCustomNamesStore((state) => state.names);

  const handleFilterChange = (filter: FilterStatus) => {
    setActiveFilter(filter);
  };

  const campusFilteredList = useMemo(
    () => activeCampus === 'all' ? deviceList : deviceList.filter((d) => d.campus === activeCampus),
    [activeCampus]
  );

  const statCounts = useMemo(() => ({
    all: campusFilteredList.length,
    'contract-risk': campusFilteredList.filter((d) => contractRisk(d) || d.acceptancePending === true).length,
    'pm-risk': campusFilteredList.filter((d) => d.pmRisk === true).length,
    'in-repair': campusFilteredList.filter(isInRepair).length,
    'pm-plan': campusFilteredList.filter(pmThisMonth).length,
  }), [campusFilteredList]);

  const filteredDevices = useMemo(() => {
    let list = campusFilteredList.filter((d) => (
      activeFilter === 'pm-plan' ? isPmInMonth(d, calYear, calMonth) : matchesFilter(d, activeFilter)
    ));
    if (activeModality !== 'all') {
      list = list.filter((d) => activeModality === '其他' ? getModality(d) === null : getModality(d) === activeModality);
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
    if (activeFilter === 'pm-plan') {
      return list.sort(comparePmPlanDevice);
    }

    return list.sort((a, b) => (b.installDate ?? '').localeCompare(a.installDate ?? ''));
  }, [campusFilteredList, activeFilter, activeModality, searchValue, calYear, calMonth]);

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
                onClick={() => setActiveModality(activeModality === opt.key ? 'all' : opt.key)}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        {/* PM date picker – single row: year nav + scrollable months */}
        {activeFilter === 'pm-plan' && (
          <div className={deviceListPageStyles.pmDatePicker}>
            <div className={deviceListPageStyles.pmYearPart}>
              <button type="button" className={deviceListPageStyles.pmYearArrow} onClick={() => setCalYear((y) => y - 1)} aria-label="上一年">‹</button>
              <span className={deviceListPageStyles.pmYearLabel}>{calYear}</span>
              <button type="button" className={deviceListPageStyles.pmYearArrow} onClick={() => setCalYear((y) => y + 1)} aria-label="下一年">›</button>
            </div>
            <div className={deviceListPageStyles.pmMonthStrip}>
              {ALL_MONTHS.map((m) => {
                const isSelected = calMonth === m;
                const isToday = calYear === TODAY.getFullYear() && TODAY.getMonth() + 1 === m;
                return (
                  <button
                    key={m}
                    type="button"
                    className={clsx(
                      deviceListPageStyles.pmMonthStripItem,
                      isSelected && deviceListPageStyles.pmMonthStripItemActive,
                      !isSelected && isToday && deviceListPageStyles.pmMonthStripItemToday
                    )}
                    onClick={() => setCalMonth(m)}
                  >
                    {m}月
                  </button>
                );
              })}
            </div>
          </div>
        )}

        <div className={deviceListPageStyles.listSection}>
          <div className={deviceListPageStyles.sectionHeader}>
            <Text variant="body-s" color="secondary">
              共 {filteredDevices.length} 台设备
            </Text>
          </div>
          {activeFilter === 'pm-plan' && (
            <div className={deviceListPageStyles.pmUltrasoundNote}>
              超声设备保养计划暂未开放，列表中不含超声设备
            </div>
          )}

          {filteredDevices.map((device) => (
            <DeviceCard
              key={device.id}
              device={device}
              customName={customNames[device.id]}
              tags={computeDeviceTags(device, activeFilter)}
              onPress={() => onDevicePress?.(device)}
            />
          ))}

          {filteredDevices.length === 0 && (
            <Text variant="body-m" color="secondary" textAlign="center">
              {activeFilter === 'pm-plan' ? `${calMonth}月暂无保养计划` : '未找到匹配设备'}
            </Text>
          )}
        </div>
      </div>
    </div>
  );
};
