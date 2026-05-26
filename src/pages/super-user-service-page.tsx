import { Text } from '@filament/react/text';
import clsx from 'clsx';
import { useMemo, useState } from 'react';
import { RepairList } from '../components/repair-list';
import { useLoadMore } from '../hooks/use-load-more';
import type { Device } from '../types/device';
import type { MonthGroup, RepairSource, RepairStatus } from '../types/repair';
import { deviceList } from '../utils/device-data';
import { repairData } from '../utils/repair-data';
import { suServiceStyles } from './super-user-service-page.css';

type StatusFilter = 'all' | RepairStatus;
type TimeFilter = 'all' | '3m' | '6m' | '1y';
type SourceFilter = 'all' | RepairSource;

const STATUS_CHIPS: { key: StatusFilter; label: string }[] = [
  { key: 'all', label: '全部' },
  { key: 'reported', label: '已报修' },
  { key: 'in-service', label: '服务中' },
  { key: 'completed-pending', label: '已完成' },
  { key: 'cancelled', label: '已取消' },
];

const TIME_CHIPS: { key: TimeFilter; label: string }[] = [
  { key: 'all', label: '不限' },
  { key: '3m', label: '近3月' },
  { key: '6m', label: '近6月' },
  { key: '1y', label: '近1年' },
];

const SOURCE_CHIPS: { key: SourceFilter; label: string }[] = [
  { key: 'all', label: '全渠道' },
  { key: 'mini-program', label: '小程序' },
  { key: 'phone', label: '电话' },
  { key: 'service-account', label: '服务号' },
];

const REF_DATE = new Date('2026-05-21');
function cutoffDate(months: number): Date {
  const d = new Date(REF_DATE);
  d.setMonth(d.getMonth() - months);
  return d;
}
const TIME_CUTOFFS: Record<Exclude<TimeFilter, 'all'>, Date> = {
  '3m': cutoffDate(3),
  '6m': cutoffDate(6),
  '1y': cutoffDate(12),
};

function applyFilters(
  search: string,
  status: StatusFilter,
  time: TimeFilter,
  source: SourceFilter,
): MonthGroup[] {
  const q = search.trim().toLowerCase();
  const cutoff = time !== 'all' ? TIME_CUTOFFS[time] : null;
  const filtered = repairData
    .flatMap((g) => g.records)
    .filter((r) => {
      if (q && !r.deviceName.toLowerCase().includes(q) && !r.hospital.toLowerCase().includes(q)) return false;
      if (status !== 'all' && r.status !== status) return false;
      if (cutoff && r.repairTime && new Date(r.repairTime) < cutoff) return false;
      if (source !== 'all' && r.source !== source) return false;
      return true;
    });
  if (filtered.length === 0) return [];
  return [{ month: `筛选结果（${filtered.length} 条）`, records: filtered }];
}

interface SuperUserServicePageProps {
  title?: string;
  subtitle?: string;
  onDevicePress?: (device: Device) => void;
  onRepairDetailPress?: (repairId: string) => void;
  onServiceEvalPress?: (repairId: string) => void;
}

export const SuperUserServicePage = ({
  title = '报修',
  subtitle = 'WeConnect医院 · 全院视图',
  onDevicePress,
  onRepairDetailPress,
  onServiceEvalPress,
}: SuperUserServicePageProps) => {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [timeFilter, setTimeFilter] = useState<TimeFilter>('all');
  const [sourceFilter, setSourceFilter] = useState<SourceFilter>('all');
  const [filterOpen, setFilterOpen] = useState(false);

  const activeFilterCount =
    (statusFilter !== 'all' ? 1 : 0) +
    (timeFilter !== 'all' ? 1 : 0) +
    (sourceFilter !== 'all' ? 1 : 0);

  const groups = useMemo(() => {
    const hasFilter =
      search.trim() !== '' || statusFilter !== 'all' || timeFilter !== 'all' || sourceFilter !== 'all';
    return hasFilter
      ? applyFilters(search, statusFilter, timeFilter, sourceFilter)
      : repairData;
  }, [search, statusFilter, timeFilter, sourceFilter]);

  const allRecords = useMemo(() => groups.flatMap((g) => g.records), [groups]);
  const { hasMore: repairsHasMore, loadMore: repairsLoadMore, total: repairsTotal, shown: repairsShown } = useLoadMore(allRecords, 5);

  const visibleGroups = useMemo((): MonthGroup[] => {
    let remaining = repairsShown;
    const result: MonthGroup[] = [];
    for (const g of groups) {
      if (remaining <= 0) break;
      const take = Math.min(g.records.length, remaining);
      result.push({ ...g, records: g.records.slice(0, take) });
      remaining -= take;
    }
    return result;
  }, [groups, repairsShown]);

  const handleDevicePress = (deviceName: string) => {
    const device = deviceList.find((d) => d.name === deviceName);
    if (device && onDevicePress) onDevicePress(device);
  };

  const handleReset = () => {
    setStatusFilter('all');
    setTimeFilter('all');
    setSourceFilter('all');
  };

  return (
    <div className={suServiceStyles.page}>
      <div className={suServiceStyles.topBar}>
        <div className={suServiceStyles.topBarTitle}>{title}</div>
        <div className={suServiceStyles.topBarSub}>{subtitle}</div>
      </div>

      <div className={suServiceStyles.body}>
        <div className={suServiceStyles.scanRow}>
          <div className={suServiceStyles.scanBanner}>
            <div className={suServiceStyles.scanBannerText}>
              <div className={suServiceStyles.scanBannerTitle}>扫码报修</div>
              <div className={suServiceStyles.scanBannerSub}>扫描设备二维码，快速提交报修申请</div>
            </div>
            <button className={suServiceStyles.scanBtn}>扫码</button>
          </div>
        </div>

        <div className={suServiceStyles.searchRow}>
          <input
            type="search"
            placeholder="搜索设备名称 / 医院"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className={suServiceStyles.searchInput}
            aria-label="搜索报修记录"
          />
          <button
            className={clsx(
              suServiceStyles.filterToggleBtn,
              (filterOpen || activeFilterCount > 0) && suServiceStyles.filterToggleBtnActive,
            )}
            onClick={() => setFilterOpen((v) => !v)}
          >
            筛选{activeFilterCount > 0 ? ` · ${activeFilterCount}` : ''}
          </button>
        </div>

        <div className={suServiceStyles.listScrollArea}>
          <div className={suServiceStyles.listHeader}>
            <Text variant="body-s" color="secondary">共 {repairsTotal} 条记录</Text>
          </div>
          {visibleGroups.length > 0 ? (
            <>
              <RepairList
                groups={visibleGroups}
                onDevicePress={handleDevicePress}
                onRepairDetailPress={onRepairDetailPress}
                onServiceEvalPress={onServiceEvalPress}
              />
              {repairsHasMore && (
                <div className={suServiceStyles.loadMoreWrap}>
                  <button type="button" className={suServiceStyles.loadMoreBtn} onClick={repairsLoadMore}>
                    加载更多
                  </button>
                </div>
              )}
            </>
          ) : (
            <div className={suServiceStyles.emptyState}>
              <Text variant="body-m" color="secondary">暂无相关记录</Text>
            </div>
          )}
        </div>
      </div>

      {filterOpen && (
        <div className={suServiceStyles.filterOverlay} onClick={() => setFilterOpen(false)}>
          <div className={suServiceStyles.filterBackdrop} />
          <div className={suServiceStyles.filterSheet} onClick={(e) => e.stopPropagation()}>
            <div className={suServiceStyles.filterSheetHandle} />
            <div className={suServiceStyles.filterSheetHeader}>
              <button className={suServiceStyles.filterSheetResetBtn} onClick={handleReset}>重置</button>
              <span className={suServiceStyles.filterSheetTitle}>筛选</span>
              <button className={suServiceStyles.filterSheetDoneBtn} onClick={() => setFilterOpen(false)}>完成</button>
            </div>
            <div className={suServiceStyles.filterSheetBody}>
              <div className={suServiceStyles.filterSheetGroupTitle}>报修状态</div>
              <div className={suServiceStyles.filterSheetChips}>
                {STATUS_CHIPS.map(({ key, label }) => (
                  <button
                    key={key}
                    className={clsx(suServiceStyles.filterSheetChip, statusFilter === key && suServiceStyles.filterSheetChipActive)}
                    onClick={() => setStatusFilter(key)}
                  >{label}</button>
                ))}
              </div>
              <div className={suServiceStyles.filterSheetGroupTitle}>报修时间</div>
              <div className={suServiceStyles.filterSheetChips}>
                {TIME_CHIPS.map(({ key, label }) => (
                  <button
                    key={key}
                    className={clsx(suServiceStyles.filterSheetChip, timeFilter === key && suServiceStyles.filterSheetChipActive)}
                    onClick={() => setTimeFilter(key)}
                  >{label}</button>
                ))}
              </div>
              <div className={suServiceStyles.filterSheetGroupTitle}>报修渠道</div>
              <div className={suServiceStyles.filterSheetChips}>
                {SOURCE_CHIPS.map(({ key, label }) => (
                  <button
                    key={key}
                    className={clsx(suServiceStyles.filterSheetChip, sourceFilter === key && suServiceStyles.filterSheetChipActive)}
                    onClick={() => setSourceFilter(key)}
                  >{label}</button>
                ))}
              </div>
            </div>
            <div className={suServiceStyles.filterSheetFooter}>
              <button
                className={suServiceStyles.filterSheetApplyBtn}
                onClick={() => setFilterOpen(false)}
              >
                查看结果{activeFilterCount > 0 ? `（${repairsTotal} 条）` : ''}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
