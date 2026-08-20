import { Text } from '@filament/react/text';
import { Item } from '@filament/react/common';
import { Search } from '@filament/react/search';
import { Button } from '@filament/react/button';
import { DownloadCloud } from '@filament/react/icons/download-cloud';
import { CheckmarkCircle } from '@filament/react/icons/checkmark-circle';
import { Cross } from '@filament/react/icons/cross';
import { ChevronRight } from '@filament/react/icons/chevron-right';
import { Scan } from '@filament/react/icons/scan';
import { Keyboard } from '@filament/react/icons/keyboard';
import { FolderEmpty } from '@filament/react/pictograms/folder-empty';
import { DownloadCloud as DownloadCloudPictogram } from '@filament/react/pictograms/download-cloud';
import { NoResult } from '@filament/react/pictograms/no-result';
import clsx from 'clsx';
import { useMemo, useState, Fragment } from 'react';
import { useShallow } from 'zustand/react/shallow';
import { DeviceCard } from '../components/device-card';
import { DeviceSortControl } from '../components/device-sort-control';
import { ConfirmDialog } from '../components/confirm-dialog';
import { RecentlyUnboundSheet } from '../components/recently-unbound-sheet';
import { ModalityChipScroller } from '../components/modality-chip-scroller';
import { useLoadMore } from '../hooks/use-load-more';
import type { Device, UserFilterStatus } from '../types/device';
import { deviceList } from '../utils/device-data';
import { useDeviceCustomNamesStore } from '../stores/device-custom-names-store';
import {
  useDeviceBindingStore,
  isWithinRetention,
  daysLeftInRecycle,
  RECYCLE_RETENTION_DAYS,
} from '../stores/device-binding-store';
import { useToastStore } from '../stores/toast-store';
import { useMigrationStore, formatBatchDate } from '../stores/migration-store';
import { useUserDeviceFilterStore } from '../stores/device-list-filter-store';
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

const MODALITY_GROUP_ORDER = ['CT', '磁共振', '血管机', '超声', '其他'];

function modalityGroup(device: Device): string {
  return getModality(device) ?? '其他';
}

function modalityGroupIndex(device: Device): number {
  return MODALITY_GROUP_ORDER.indexOf(modalityGroup(device));
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
  onInputDevice?: () => void;
}

export const UserDevicePage = ({ onDevicePress, onScanRepair, onInputDevice }: UserDevicePageProps) => {
  const [searchValue, setSearchValue] = useState('');
  const { activeFilter, activeCampus, activeModality, sortBy, sortDir, setActiveFilter, setActiveCampus, setActiveModality, setSortBy, toggleSortDir } = useUserDeviceFilterStore(
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
  const customNames = useDeviceCustomNamesStore((state) => state.names);
  const [manageMode, setManageMode] = useState(false);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [showUnbindConfirm, setShowUnbindConfirm] = useState(false);
  const [showRecentSheet, setShowRecentSheet] = useState(false);
  const showToast = useToastStore((state) => state.showToast);
  const { removedIds, removedAt, purgedIds, unbindMany, restore } = useDeviceBindingStore(
    useShallow((s) => ({
      removedIds: s.removedIds,
      removedAt: s.removedAt,
      purgedIds: s.purgedIds,
      unbindMany: s.unbindMany,
      restore: s.restore,
    }))
  );

  const boundList = useMemo(
    () => deviceList.filter((d) => !removedIds.includes(d.id) && !purgedIds.includes(d.id)),
    [removedIds, purgedIds]
  );

  const { migrationStatus, migrationExpectedAt, migrationNoticeSeen, markNoticeSeen, migratedCount, doneNoticeSeen, doneBannerDismissed, markDoneNoticeSeen, dismissDoneBanner } =
    useMigrationStore(
      useShallow((s) => ({
        migrationStatus: s.status,
        migrationExpectedAt: s.expectedAt,
        migrationNoticeSeen: s.noticeSeen,
        markNoticeSeen: s.markNoticeSeen,
        migratedCount: s.migratedCount,
        doneNoticeSeen: s.doneNoticeSeen,
        doneBannerDismissed: s.doneBannerDismissed,
        markDoneNoticeSeen: s.markDoneNoticeSeen,
        dismissDoneBanner: s.dismissDoneBanner,
      }))
    );
  const migrationPending = migrationStatus === 'pending';
  const migrationDone = migrationStatus === 'done';
  const showMigrationNotice = migrationPending && !migrationNoticeSeen;
  const showMigrationDoneNotice = migrationDone && !doneNoticeSeen;

  const campusFilteredList = useMemo(
    () => activeCampus === 'all' ? boundList : boundList.filter((d) => d.campus === activeCampus),
    [activeCampus, boundList]
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
    const dir = sortDir === 'desc' ? -1 : 1;
    switch (sortBy) {
      case 'name':
        return list.sort((a, b) => dir * a.name.localeCompare(b.name, 'zh-Hans-CN'));
      case 'type-group':
        return list.sort((a, b) => {
          const diff = modalityGroupIndex(a) - modalityGroupIndex(b);
          return dir * (diff !== 0 ? diff : a.name.localeCompare(b.name, 'zh-Hans-CN'));
        });
      case 'install-date':
        return list.sort((a, b) => dir * (a.installDate ?? '').localeCompare(b.installDate ?? ''));
      case 'created-date':
        return list.sort((a, b) => dir * (a.createdAt ?? '').localeCompare(b.createdAt ?? ''));
      default:
        return list.sort((a, b) => dir * a.name.localeCompare(b.name, 'zh-Hans-CN'));
    }
  }, [campusFilteredList, activeFilter, activeModality, searchValue, customNames, sortBy, sortDir]);

  const { visibleItems: visibleDevices, hasMore: devicesHasMore, loadMore: devicesLoadMore, total: devicesTotal } = useLoadMore(filteredDevices, 6);

  const displayName = (d: Device) => customNames[d.id] ?? d.customName ?? d.name;
  const noteOf = (d: Device) => customNames[d.id] ?? d.customName ?? '';

  const recentlyUnbound = useMemo(
    () =>
      deviceList
        .filter(
          (d) =>
            removedIds.includes(d.id) &&
            !purgedIds.includes(d.id) &&
            isWithinRetention(removedAt[d.id])
        )
        .sort((a, b) => (removedAt[b.id] ?? '').localeCompare(removedAt[a.id] ?? '')),
    [removedIds, purgedIds, removedAt]
  );

  const allSelected = visibleDevices.length > 0 && visibleDevices.every((d) => selectedIds.includes(d.id));

  const exitManageMode = () => {
    setManageMode(false);
    setSelectedIds([]);
  };

  const hasActiveFilters =
    searchValue.trim() !== '' || activeFilter !== 'all' || activeModality !== 'all' || activeCampus !== 'all';

  const clearFilters = () => {
    setSearchValue('');
    setActiveFilter('all');
    setActiveModality('all');
    setActiveCampus('all');
  };

  const toggleSelected = (id: string) =>
    setSelectedIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));

  const toggleSelectAll = () =>
    setSelectedIds(allSelected ? [] : visibleDevices.map((d) => d.id));

  const confirmUnbind = () => {
    const ids = [...selectedIds];
    setShowUnbindConfirm(false);
    exitManageMode();
    unbindMany(ids);
    showToast(`已解绑 ${ids.length} 台设备`, [
      { label: '查看', onAction: () => setShowRecentSheet(true) },
      { label: '撤销', onAction: () => ids.forEach((id) => restore(id)) },
    ]);
  };

  const handleRestore = (device: Device) => {
    restore(device.id);
    showToast(`已恢复「${displayName(device)}」`);
  };

  return (
    <div className={userDeviceStyles.page}>
      <div className={userDeviceStyles.topBar}>
        <div className={userDeviceStyles.topBarHeaderRow}>
          <div className={userDeviceStyles.topBarTitle}>我的设备</div>
          <button
            type="button"
            className={userDeviceStyles.scanBtnTop}
            onClick={() => onScanRepair?.()}
          >
            <Scan aria-hidden="true" width={16} height={16} />
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

      {/* 备件防伪 banner removed — entry moved to 我的 page */}

      <div className={clsx(userDeviceStyles.listSection, manageMode && userDeviceStyles.listSectionManaging)}>
        {migrationPending && boundList.length > 0 && (
          <div className={userDeviceStyles.migrationBanner}>
            <DownloadCloud aria-hidden="true" width={15} height={15} />
            <span>历史设备与数据迁移中，预计 {formatBatchDate(migrationExpectedAt)}前完成</span>
          </div>
        )}
        {migrationDone && !doneBannerDismissed && (
          <div className={clsx(userDeviceStyles.migrationBanner, userDeviceStyles.migrationBannerDone)}>
            <CheckmarkCircle aria-hidden="true" width={15} height={15} />
            <span>已迁入 {migratedCount} 台历史设备及报修记录</span>
            <button
              type="button"
              className={userDeviceStyles.migrationBannerClose}
              aria-label="关闭提示"
              onClick={dismissDoneBanner}
            >
              <Cross aria-hidden="true" width={14} height={14} />
            </button>
          </div>
        )}
        <div className={userDeviceStyles.sectionHeader}>
          <div className={userDeviceStyles.sectionHeaderLeft}>
            <Text variant="body-s" color="secondary">共 {devicesTotal} 台设备</Text>
            {!manageMode && devicesTotal > 0 && (
              <>
                <span className={userDeviceStyles.headerDivider} aria-hidden="true" />
                <button
                  type="button"
                  className={userDeviceStyles.manageEntryBtn}
                  onClick={() => setManageMode(true)}
                >
                  管理
                </button>
              </>
            )}
          </div>
          {manageMode ? (
            recentlyUnbound.length > 0 && (
              <button
                type="button"
                className={userDeviceStyles.recentUnboundEntry}
                onClick={() => setShowRecentSheet(true)}
              >
                最近解绑
                <span className={userDeviceStyles.recentUnboundCount}>{recentlyUnbound.length}</span>
                <ChevronRight aria-hidden="true" width={14} height={14} />
              </button>
            )
          ) : (
            <DeviceSortControl
              sortBy={sortBy}
              sortDir={sortDir}
              onSortByChange={setSortBy}
              onToggleDir={toggleSortDir}
            />
          )}
        </div>
        {visibleDevices.map((d, idx) => {
          const group = modalityGroup(d);
          const showGroupHeader =
            sortBy === 'type-group' &&
            (idx === 0 || modalityGroup(visibleDevices[idx - 1]) !== group);
          return (
            <Fragment key={d.id}>
              {showGroupHeader && (
                <div className={userDeviceStyles.groupHeader}>
                  <span className={userDeviceStyles.groupHeaderLabel}>{group}</span>
                  <span className={userDeviceStyles.groupHeaderCount}>
                    {filteredDevices.filter((item) => modalityGroup(item) === group).length}
                  </span>
                </div>
              )}
              <DeviceCard
                device={d}
                customName={customNames[d.id]}
                tags={statusTag(d)}
                showHospital={hasMultipleCampuses && activeCampus === 'all'}
                selectable={manageMode}
                isSelected={selectedIds.includes(d.id)}
                onPress={() => (manageMode ? toggleSelected(d.id) : onDevicePress?.(d))}
              />
            </Fragment>
          );
        })}
        {devicesTotal === 0 && (
          <div className={userDeviceStyles.emptyState}>
            {boundList.length === 0 ? (
              <>
                <div className={userDeviceStyles.emptyActions}>
                  <button type="button" className={userDeviceStyles.emptyAction} onClick={onScanRepair}>
                    <span className={userDeviceStyles.emptyActionIcon}>
                      <Scan aria-hidden="true" width={20} height={20} />
                    </span>
                    <span className={userDeviceStyles.emptyActionLabel}>扫设备码</span>
                    <span className={userDeviceStyles.emptyActionSub}>报修 / 绑定</span>
                  </button>
                  <button type="button" className={userDeviceStyles.emptyAction} onClick={onInputDevice}>
                    <span className={userDeviceStyles.emptyActionIcon}>
                      <Keyboard aria-hidden="true" width={20} height={20} />
                    </span>
                    <span className={userDeviceStyles.emptyActionLabel}>输入编号</span>
                    <span className={userDeviceStyles.emptyActionSub}>报修 / 绑定</span>
                  </button>
                </div>
                {migrationPending ? (
                  <>
                    <DownloadCloudPictogram size="medium" aria-hidden="true" />
                    <div className={userDeviceStyles.emptyCopy}>
                      <span className={userDeviceStyles.emptyTitle}>历史设备与数据迁移中</span>
                      <span className={userDeviceStyles.emptyHint}>
                        预计 {formatBatchDate(migrationExpectedAt)}前完成
                      </span>
                    </div>
                  </>
                ) : (
                  <>
                    <FolderEmpty size="medium" aria-hidden="true" />
                    <span className={userDeviceStyles.emptyTitle}>暂无绑定设备</span>
                  </>
                )}
                {recentlyUnbound.length > 0 && (
                  <button
                    type="button"
                    className={userDeviceStyles.emptyRecentLink}
                    onClick={() => setShowRecentSheet(true)}
                  >
                    查看最近解绑
                    <span className={userDeviceStyles.recentUnboundCount}>{recentlyUnbound.length}</span>
                    <ChevronRight aria-hidden="true" width={14} height={14} />
                  </button>
                )}
              </>
            ) : (
              <>
                <NoResult size="medium" aria-hidden="true" />
                <span className={userDeviceStyles.emptyTitle}>无匹配设备</span>
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
          <div className={userDeviceStyles.loadMoreWrap}>
            <button type="button" className={userDeviceStyles.loadMoreBtn} onClick={devicesLoadMore}>
              加载更多
            </button>
          </div>
        )}
      </div>

      {manageMode && (
        <div className={userDeviceStyles.manageActionBar}>
          <button type="button" className={userDeviceStyles.manageSelectAllBtn} onClick={toggleSelectAll}>
            {allSelected ? '取消全选' : '全选'}
          </button>
          <span className={userDeviceStyles.manageActionBarLabel}>已选 {selectedIds.length} 台</span>
          <div className={userDeviceStyles.manageActionBarBtns}>
            <Button variant="quiet" shape="round" onPress={exitManageMode}>
              取消
            </Button>
            <Button
              variant="primary"
              signal="danger"
              shape="round"
              isDisabled={selectedIds.length === 0}
              onPress={() => setShowUnbindConfirm(true)}
            >
              解绑设备
            </Button>
          </div>
        </div>
      )}

      {showMigrationNotice && (
        <ConfirmDialog
          title="历史设备与数据迁移中"
          message={
            `原报修平台的设备与报修记录将自动迁移，预计 ${formatBatchDate(migrationExpectedAt)}前完成。\n` +
            '期间可扫码或输入编号自助报修。'
          }
          confirmLabel="知道了"
          hideCancel
          onConfirm={markNoticeSeen}
          onCancel={markNoticeSeen}
        />
      )}

      {showMigrationDoneNotice && (
        <ConfirmDialog
          title="历史设备与数据迁移完成"
          message={`已为你迁入 ${migratedCount} 台设备及其历史报修记录。`}
          confirmLabel="知道了"
          hideCancel
          onConfirm={markDoneNoticeSeen}
          onCancel={markDoneNoticeSeen}
        />
      )}

      {showUnbindConfirm && (
        <ConfirmDialog
          title={`解绑所选 ${selectedIds.length} 台设备？`}
          message={`仅从「我的设备」移除，设备相关数据仍保留在飞利浦服务器，可再次绑定或${RECYCLE_RETENTION_DAYS}天内通过「最近解绑」恢复`}
          confirmLabel="解绑设备"
          cancelLabel="取消"
          destructive
          onConfirm={confirmUnbind}
          onCancel={() => setShowUnbindConfirm(false)}
        />
      )}

      {showRecentSheet && (
        <RecentlyUnboundSheet
          devices={recentlyUnbound}
          retentionDays={RECYCLE_RETENTION_DAYS}
          noteOf={noteOf}
          showCampus={hasMultipleCampuses}
          daysLeft={(device) => daysLeftInRecycle(removedAt[device.id])}
          onRestore={handleRestore}
          onClose={() => setShowRecentSheet(false)}
        />
      )}
    </div>
  );
};
