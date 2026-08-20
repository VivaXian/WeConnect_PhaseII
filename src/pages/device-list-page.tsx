import { Text } from '@filament/react/text';
import { Item } from '@filament/react/common';
import { Search } from '@filament/react/search';
import { Scan } from '@filament/react/icons/scan';
import { FolderEmpty } from '@filament/react/pictograms/folder-empty';
import { NoResult } from '@filament/react/pictograms/no-result';
import { Button } from '@filament/react/button';
import clsx from 'clsx';
import { useMemo, useState, Fragment } from 'react';
import { DeviceCard } from '../components/device-card';
import { DeviceSortControl } from '../components/device-sort-control';
import { ModalityChipScroller } from '../components/modality-chip-scroller';
import { useLoadMore } from '../hooks/use-load-more';
import { useDeviceListFilterStore } from '../stores/device-list-filter-store';
import { useShallow } from 'zustand/react/shallow';
import type { FilterStatus } from '../types/device';
import type { Device } from '../types/device';
import { deviceList } from '../utils/device-data';
import { useDeviceCustomNamesStore } from '../stores/device-custom-names-store';
import { useDeviceBindingStore } from '../stores/device-binding-store';
import { deviceListPageStyles } from './device-list-page.css';

const EMPTY_RESULTS: never[] = [];

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

function isPmRisk(device: Device): boolean {
  if (isUltrasoundDevice(device)) return false;
  const hasContract = device.contractEnd ? daysFromToday(device.contractEnd) > 0 : false;
  return !hasContract && !device.pmNextDate;
}

function getModality(device: Device): '磁共振' | 'CT' | '血管机' | '超声' | null {
  const t = device.type;
  if (t.includes('磁共振')) return '磁共振';
  if (t.includes('CT') || t.includes('PET')) return 'CT';
  if (t.includes('血管')) return '血管机';
  if (t.includes('超声')) return '超声';
  return null;
}

const MODALITY_GROUP_ORDER = ['CT', '磁共振', '血管机', '超声', '其他'];

function modalityGroup(device: Device): string {
  return getModality(device) ?? '其他';
}

function modalityGroupIndex(device: Device): number {
  return MODALITY_GROUP_ORDER.indexOf(modalityGroup(device));
}

function matchesFilter(device: Device, filter: FilterStatus): boolean {
  switch (filter) {
    case 'all': return true;
    case 'contract-risk': return contractRisk(device) || device.acceptancePending === true;
    case 'pm-risk': return isPmRisk(device);
    case 'in-repair': return isInRepair(device);
    case 'pm-plan': return pmThisMonth(device);
  }
}

type DeviceTag = { label: string; signal: 'error' | 'warning' | 'caution' | 'success' | 'information' | undefined };

function computeDeviceTags(device: Device, activeFilter: FilterStatus): DeviceTag[] {
  if (activeFilter === 'pm-plan' && device.pmNextDate) {
    return [
      {
        label: formatPmPlanTag(device.pmNextDate),
        signal: 'information',
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
    tags.push({ label: '报修中', signal: 'information' });
  }
  if (isPmRisk(device)) {
    tags.push({ label: '保养风险', signal: 'caution' });
  } else if (pmThisMonth(device)) {
    tags.push({ label: pmDateLabel(device), signal: 'information' });
  }
  return tags;
}

interface DeviceListPageProps {
  onDevicePress?: (device: Device) => void;
  onScanRepair?: () => void;
}

const allCampuses = Array.from(
  new Set(deviceList.map((d) => d.campus).filter(Boolean))
).sort((a, b) => (a as string).localeCompare(b as string, 'zh-Hans-CN')) as string[];
const CAMPUS_OPTIONS = [
  { key: 'all', label: '全部院区' },
  ...allCampuses.map((c) => ({ key: c, label: c })),
];
const hasMultipleCampuses = allCampuses.length > 1;

const runtimeNow = new Date();

export const DeviceListPage = ({ onDevicePress, onScanRepair }: DeviceListPageProps) => {
  const [searchValue, setSearchValue] = useState('');
  const { activeFilter, activeCampus, activeModality, sortBy, sortDir, setActiveFilter, setActiveCampus, setActiveModality, setSortBy, toggleSortDir } = useDeviceListFilterStore(
    useShallow((s) => ({
      activeFilter: s.activeFilter,
      activeCampus: s.activeCampus,
      activeModality: s.activeModality,
      sortBy: s.sortBy,
      sortDir: s.sortDir,
      setActiveFilter: s.setActiveFilter,
      setActiveCampus: s.setActiveCampus,
      setActiveModality: s.setActiveModality,
      setSortBy: s.setSortBy,
      toggleSortDir: s.toggleSortDir,
    }))
  );
  const [campusOpen, setCampusOpen] = useState(false);
  const [calYear, setCalYear] = useState(runtimeNow.getFullYear());
  const [calMonth, setCalMonth] = useState(runtimeNow.getMonth() + 1);
  const customNames = useDeviceCustomNamesStore((state) => state.names);
  const { removedIds, purgedIds } = useDeviceBindingStore(
    useShallow((s) => ({ removedIds: s.removedIds, purgedIds: s.purgedIds }))
  );


  const handleFilterChange = (filter: FilterStatus) => {
    setActiveFilter(filter);
  };

  const boundList = useMemo(
    () => deviceList.filter((d) => !removedIds.includes(d.id) && !purgedIds.includes(d.id)),
    [removedIds, purgedIds]
  );

  const campusFilteredList = useMemo(
    () => activeCampus === 'all' ? boundList : boundList.filter((d) => d.campus === activeCampus),
    [activeCampus, boundList]
  );

  const statCounts = useMemo(() => ({
    all: campusFilteredList.length,
    'contract-risk': campusFilteredList.filter((d) => contractRisk(d) || d.acceptancePending === true).length,
    'pm-risk': campusFilteredList.filter(isPmRisk).length,
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
    if (activeFilter === 'pm-plan') {
      return list.sort(comparePmPlanDevice);
    }
    const dir = sortDir === 'desc' ? -1 : 1;
    const base = (a: Device, b: Device): number => {
      switch (sortBy) {
        case 'type-group': {
          const diff = modalityGroupIndex(a) - modalityGroupIndex(b);
          return diff !== 0 ? diff : a.name.localeCompare(b.name, 'zh-Hans-CN');
        }
        case 'install-date':
          return (a.installDate ?? '').localeCompare(b.installDate ?? '');
        case 'created-date':
          return (a.createdAt ?? '').localeCompare(b.createdAt ?? '');
        case 'name':
        default:
          return a.name.localeCompare(b.name, 'zh-Hans-CN');
      }
    };
    return list.sort((a, b) => dir * base(a, b));
  }, [campusFilteredList, activeFilter, activeModality, searchValue, calYear, calMonth, customNames, sortBy, sortDir]);

  const { visibleItems: visibleDevices, hasMore: devicesHasMore, loadMore: devicesLoadMore, total: devicesTotal } = useLoadMore(filteredDevices, 6);

  const hasActiveFilters =
    searchValue.trim() !== '' || activeFilter !== 'all' || activeModality !== 'all' || activeCampus !== 'all';

  const clearFilters = () => {
    setSearchValue('');
    setActiveFilter('all');
    setActiveModality('all');
    setActiveCampus('all');
  };

  return (
    <div className={deviceListPageStyles.page}>
      <div className={deviceListPageStyles.topBar}>
        <div className={deviceListPageStyles.topBarHeaderRow}>
          <div className={deviceListPageStyles.topBarTitle}>设备管理</div>
          <button
            type="button"
            className={deviceListPageStyles.scanBtnTop}
            onClick={onScanRepair}
            aria-label="扫码报修/绑定"
          >
            <Scan aria-hidden="true" width={16} height={16} />
            扫码报修/绑定
          </button>
        </div>
        <div className={deviceListPageStyles.campusSelectorRow}>
          {hasMultipleCampuses ? (
            <>
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
            </>
          ) : (
            <span className={deviceListPageStyles.campusSelectorSingle}>{allCampuses[0] ?? ''}</span>
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
        {/* 搜索 + 设备类型 filter 同行 */}
        <div className={deviceListPageStyles.searchFilterRow}>
          <div className={deviceListPageStyles.searchBox}>
            <Search
              items={EMPTY_RESULTS}
              aria-label="搜索设备"
              placeholder="搜索"
              onInputChange={setSearchValue}
              inputValue={searchValue}
              isFullWidth
            >
              {() => <Item key="empty">{null}</Item>}
            </Search>
          </div>
          <ModalityChipScroller
            options={MODALITY_OPTIONS}
            activeKey={activeModality}
            onSelect={setActiveModality}
          />
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
              共 {devicesTotal} 台设备
            </Text>
            <DeviceSortControl
              sortBy={sortBy}
              sortDir={sortDir}
              onSortByChange={setSortBy}
              onToggleDir={toggleSortDir}
            />
          </div>
          {activeFilter === 'pm-plan' && (
            <div className={deviceListPageStyles.pmUltrasoundNote}>
              超声设备保养计划暂未接入系统，列表中不含超声设备
            </div>
          )}
          {activeFilter === 'pm-risk' && (
            <div className={deviceListPageStyles.pmUltrasoundNote}>
              超声设备保养计划暂未接入系统，不参与保养风险筛选
            </div>
          )}

          {visibleDevices.map((device, idx) => {
            const group = modalityGroup(device);
            const showGroupHeader =
              sortBy === 'type-group' &&
              activeFilter !== 'pm-plan' &&
              (idx === 0 || modalityGroup(visibleDevices[idx - 1]) !== group);
            return (
              <Fragment key={device.id}>
                {showGroupHeader && (
                  <div className={deviceListPageStyles.groupHeader}>
                    <span className={deviceListPageStyles.groupHeaderLabel}>{group}</span>
                    <span className={deviceListPageStyles.groupHeaderCount}>
                      {filteredDevices.filter((d) => modalityGroup(d) === group).length}
                    </span>
                  </div>
                )}
                <DeviceCard
                  device={device}
                  customName={customNames[device.id]}
                  tags={computeDeviceTags(device, activeFilter)}
                  showHospital={hasMultipleCampuses && activeCampus === 'all'}
                  onPress={() => onDevicePress?.(device)}
                />
              </Fragment>
            );
          })}

          {devicesTotal === 0 && (
            <div className={deviceListPageStyles.emptyState}>
              {activeFilter === 'pm-plan' ? (
                <>
                  <FolderEmpty size="medium" aria-hidden="true" />
                  <span className={deviceListPageStyles.emptyTitle}>{calMonth} 月暂无保养计划</span>
                </>
              ) : (
                <>
                  <NoResult size="medium" aria-hidden="true" />
                  <span className={deviceListPageStyles.emptyTitle}>无匹配设备</span>
                  {hasActiveFilters && (
                    <Button variant="secondary" shape="round" onPress={clearFilters}>
                      清除筛选条件
                    </Button>
                  )}
                </>
              )}
            </div>
          )}
          {devicesHasMore && (
            <div className={deviceListPageStyles.loadMoreWrap}>
              <button type="button" className={deviceListPageStyles.loadMoreBtn} onClick={devicesLoadMore}>
                加载更多
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
