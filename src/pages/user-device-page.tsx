import { Text } from '@filament/react/text';
import { Item } from '@filament/react/common';
import { Search } from '@filament/react/search';
import clsx from 'clsx';
import { useMemo, useState, useRef, useEffect } from 'react';
import { useShallow } from 'zustand/react/shallow';
import { DeviceCard } from '../components/device-card';
import { useLoadMore } from '../hooks/use-load-more';
import type { Device, UserFilterStatus } from '../types/device';
import { deviceList } from '../utils/device-data';
import { useDeviceCustomNamesStore } from '../stores/device-custom-names-store';
import { useUserDeviceFilterStore, SORT_OPTIONS } from '../stores/device-list-filter-store';
import { userDeviceStyles } from './user-device-page.css';

const EMPTY_RESULTS: never[] = [];

const USER_STAT_CHIPS: { key: UserFilterStatus; label: string }[] = [
  { key: 'all', label: '全部设备' },
  { key: 'pm-risk', label: '保养风险' },
  { key: 'in-repair', label: '报修中' },
  { key: 'pm-plan', label: '本月保养' },
];

const TODAY = new Date();

const MODALITY_OPTIONS = [
  { key: 'CT', label: 'CT' },
  { key: '磁共振', label: '磁共振' },
  { key: '血管机', label: '血管机' },
  { key: '超声', label: '超声' },
  { key: '其他', label: '其他' },
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

function isPmRisk(d: Device): boolean {
  if (d.type.includes('超声')) return false;
  const hasContract = d.contractEnd ? daysFromToday(d.contractEnd) > 0 : false;
  return !hasContract && !d.pmNextDate;
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
    case 'pm-risk': return isPmRisk(d);
    case 'in-repair': return isInRepair(d);
    case 'pm-plan': return pmThisMonth(d);
  }
}

function statusTag(d: Device) {
  const tags: { label: string; signal?: 'success' | 'warning' | 'caution' | 'error' | 'information' }[] = [];
  if (isInRepair(d)) tags.push({ label: '报修中', signal: 'information' });
  if (isPmRisk(d)) {
    tags.push({ label: '保养风险', signal: 'caution' });
  } else if (pmThisMonth(d) && d.pmNextDate) {
    const [, month, day] = d.pmNextDate.split('-');
    tags.push({ label: `本月保养·${month}月${day}日`, signal: 'information' });
  }
  return tags;
}

const allCampuses = Array.from(
  new Set(deviceList.map((d) => d.campus).filter(Boolean))
).sort((a, b) => (a as string).localeCompare(b as string, 'zh-Hans-CN')) as string[];
const CAMPUS_OPTIONS = [
  { key: 'all', label: '全部院区' },
  ...allCampuses.map((c) => ({ key: c, label: c })),
];
const hasMultipleCampuses = allCampuses.length > 1;

interface UserDevicePageProps {
  onDevicePress?: (device: Device) => void;
  onScanRepair?: () => void;
}

export const UserDevicePage = ({ onDevicePress, onScanRepair }: UserDevicePageProps) => {
  const [searchValue, setSearchValue] = useState('');
  const { activeFilter, activeCampus, activeModality, sortBy, setActiveFilter, setActiveCampus, setActiveModality, setSortBy } = useUserDeviceFilterStore(
    useShallow((s) => ({
      activeFilter: s.activeFilter,
      activeCampus: s.activeCampus,
      activeModality: s.activeModality,
      sortBy: s.sortBy,
      setActiveFilter: s.setActiveFilter,
      setActiveCampus: s.setActiveCampus,
      setActiveModality: s.setActiveModality,
      setSortBy: s.setSortBy,
    }))
  );
  const [campusOpen, setCampusOpen] = useState(false);
  const [sortOpen, setSortOpen] = useState(false);
  const customNames = useDeviceCustomNamesStore((state) => state.names);
  const chipScrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (activeModality === 'all') return;
    const container = chipScrollRef.current;
    if (!container) return;
    const activeChip = container.querySelector('[data-active="true"]') as HTMLElement | null;
    if (!activeChip) return;
    const chipLeft = activeChip.offsetLeft;
    const chipWidth = activeChip.offsetWidth;
    const containerWidth = container.offsetWidth;
    container.scrollLeft = chipLeft - (containerWidth - chipWidth) / 2;
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const campusFilteredList = useMemo(
    () => activeCampus === 'all' ? deviceList : deviceList.filter((d) => d.campus === activeCampus),
    [activeCampus]
  );

  const statCounts = useMemo(() => ({
    all: campusFilteredList.length,
    'pm-risk': campusFilteredList.filter(isPmRisk).length,
    'in-repair': campusFilteredList.filter(isInRepair).length,
    'pm-plan': campusFilteredList.filter(pmThisMonth).length,
  }), [campusFilteredList]);

  const filteredDevices = useMemo(() => {
    let list = campusFilteredList.filter((d) => matchesUserFilter(d, activeFilter));
    if (activeModality !== 'all') list = list.filter((d) => activeModality === '其他' ? getModality(d) === null : getModality(d) === activeModality);
    if (searchValue.trim()) {
      const q = searchValue.trim().toLowerCase();
      list = list.filter((d) => {
        const haystack = [
          d.name,
          customNames[d.id] ?? d.customName ?? '',
          d.type,
          getModality(d) ?? '',
          d.department,
          d.location,
          d.campus ?? '',
          d.serialNumber ?? '',
          d.eqNumber ?? '',
        ];
        return haystack.some((field) => field.toLowerCase().includes(q));
      });
    }
    switch (sortBy) {
      case 'name-asc':
        return list.sort((a, b) => a.name.localeCompare(b.name, 'zh-Hans-CN'));
      case 'install-date-desc':
        return list.sort((a, b) => (b.installDate ?? '').localeCompare(a.installDate ?? ''));
      case 'created-date-desc':
        return list.sort((a, b) => (b.createdAt ?? '').localeCompare(a.createdAt ?? ''));
      default:
        return list.sort((a, b) => a.name.localeCompare(b.name, 'zh-Hans-CN'));
    }
  }, [campusFilteredList, activeFilter, activeModality, searchValue, customNames, sortBy]);

  const { visibleItems: visibleDevices, hasMore: devicesHasMore, loadMore: devicesLoadMore, total: devicesTotal } = useLoadMore(filteredDevices, 6);

  return (
    <div className={userDeviceStyles.page}>
      <div className={userDeviceStyles.topBar}>
        <div className={userDeviceStyles.topBarHeaderRow}>
          <div className={userDeviceStyles.topBarTitle}>我的设备</div>
          <button
            type="button"
            className={userDeviceStyles.scanBtnTop}
            onClick={onScanRepair}
            aria-label="扫码报修/绑定"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M2 7V4a1 1 0 0 1 1-1h3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
              <path d="M22 7V4a1 1 0 0 0-1-1h-3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
              <path d="M2 17v3a1 1 0 0 0 1 1h3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
              <path d="M22 17v3a1 1 0 0 1-1 1h-3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
              <line x1="2" y1="12" x2="22" y2="12" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
            </svg>
            扫码报修/绑定
          </button>
        </div>
        <div className={userDeviceStyles.campusSelectorRow}>
          {hasMultipleCampuses ? (
            <>
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
            </>
          ) : (
            <span className={userDeviceStyles.campusSelectorSingle}>{allCampuses[0] ?? ''}</span>
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

      {/* 搜索 + 设备类型 filter 同行 */}
      <div className={userDeviceStyles.searchFilterRow}>
        <div className={userDeviceStyles.searchBox}>
          <Search
            items={EMPTY_RESULTS}
            aria-label="搜索设备"
            placeholder="搜索设备"
            onInputChange={setSearchValue}
            inputValue={searchValue}
            isFullWidth
          >
            {() => <Item key="empty">{null}</Item>}
          </Search>
        </div>
        <div className={userDeviceStyles.chipScroll} ref={chipScrollRef}>
          <div className={userDeviceStyles.chipGroupInline}>
            {MODALITY_OPTIONS.map((opt) => (
              <button
                key={opt.key}
                type="button"
                data-active={activeModality === opt.key ? 'true' : undefined}
                className={clsx(userDeviceStyles.chip, activeModality === opt.key && userDeviceStyles.chipActive)}
                onClick={() => setActiveModality(activeModality === opt.key ? 'all' : opt.key)}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 备件防伪 banner removed — entry moved to 我的 page */}

      <div className={userDeviceStyles.listSection}>
        <div className={userDeviceStyles.sectionHeader}>
          <Text variant="body-s" color="secondary">共 {devicesTotal} 台设备</Text>
          <div className={userDeviceStyles.sortBtnWrap}>
            <button
              type="button"
              className={userDeviceStyles.sortBtn}
              onClick={() => setSortOpen((prev) => !prev)}
            >
              <svg width="13" height="13" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                <path d="M2 4h12M4 8h8M6 12h4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
              按{SORT_OPTIONS.find((o) => o.key === sortBy)?.label ?? '设备名称'}排序
            </button>
            {sortOpen && (
              <>
                <div className={userDeviceStyles.sortBackdrop} onClick={() => setSortOpen(false)} />
                <div className={userDeviceStyles.sortDropdown}>
                  {SORT_OPTIONS.map((opt) => (
                    <button
                      key={opt.key}
                      type="button"
                      className={clsx(
                        userDeviceStyles.sortDropdownItem,
                        sortBy === opt.key && userDeviceStyles.sortDropdownItemActive
                      )}
                      onClick={() => { setSortBy(opt.key); setSortOpen(false); }}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
        {visibleDevices.map((d) => (
          <DeviceCard key={d.id} device={d} customName={customNames[d.id]} tags={statusTag(d)} showHospital={hasMultipleCampuses && activeCampus === 'all'} onPress={() => onDevicePress?.(d)} />
        ))}
        {devicesTotal === 0 && (
          <div className={userDeviceStyles.emptyState}>
            <Text variant="body-m" color="secondary">未找到匹配设备</Text>
          </div>
        )}
        {devicesHasMore && (
          <div className={userDeviceStyles.loadMoreWrap}>
            <button type="button" className={userDeviceStyles.loadMoreBtn} onClick={devicesLoadMore}>
              加载更多
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
