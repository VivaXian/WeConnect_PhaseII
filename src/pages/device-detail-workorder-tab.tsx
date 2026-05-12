import { useState, useMemo } from 'react';
import clsx from 'clsx';
import type { LinkedWorkOrder } from '../types/repair';
import type { WorkOrderType } from '../types/work-order';
import { WORK_ORDER_TYPE_LABEL } from '../types/work-order';
import { workOrderData } from '../utils/work-order-data';
import { detailStyles } from './device-detail-page.css';

interface WorkOrderTabProps {
  workOrders: LinkedWorkOrder[];
  isAdmin: boolean;
  onWorkOrderPress?: (orderId: string) => void;
}

const WO_STATUS_COLOR: Record<string, string> = {
  '待签字': '#d97706',
  '已签字': '#16a34a',
  '已完成': '#16a34a',
  '已失效': '#9ca3af',
  '进行中': '#0161de',
};

const TYPE_ORDER: WorkOrderType[] = ['repair', 'maintenance', 'fco', 'install'];

type DateRange = '3m' | '6m' | '12m';
const DATE_RANGE_OPTIONS: { key: DateRange; label: string }[] = [
  { key: '3m', label: '近3个月' },
  { key: '6m', label: '近6个月' },
  { key: '12m', label: '近一年' },
];
const BATCH_SIZE = 5;
const REF_DATE = new Date('2026-04-29');

function cutoffDate(range: DateRange): Date {
  const d = new Date(REF_DATE);
  d.setDate(d.getDate() - (range === '3m' ? 90 : range === '6m' ? 180 : 365));
  return d;
}

export const DeviceDetailWorkOrderTab = ({ workOrders, isAdmin, onWorkOrderPress }: WorkOrderTabProps) => {
  const [dateRange, setDateRange] = useState<DateRange>('3m');
  const [loadedCount, setLoadedCount] = useState(BATCH_SIZE);

  const navigableIds = useMemo(
    () => new Set(workOrderData.flatMap((g) => g.orders.map((o) => o.id))),
    []
  );

  const cutoff = cutoffDate(dateRange);
  const allFiltered = workOrders
    .filter((wo) => !wo.date || new Date(wo.date) >= cutoff)
    .sort((a, b) => (b.date ?? '').localeCompare(a.date ?? ''));

  const visibleItems = allFiltered.slice(0, loadedCount);
  const canLoadMore = allFiltered.length > loadedCount;

  const groups = TYPE_ORDER
    .map((type) => ({
      type,
      items: visibleItems.filter((wo) => wo.type === type),
    }))
    .filter((g) => g.items.length > 0);

  const handleRangeChange = (range: DateRange) => {
    setDateRange(range);
    setLoadedCount(BATCH_SIZE);
  };

  return (
    <div className={detailStyles.tabContent}>
      <div className={detailStyles.dateRangeRow}>
        {DATE_RANGE_OPTIONS.map((opt) => (
          <button
            key={opt.key}
            type="button"
            className={clsx(detailStyles.dateRangeChip, dateRange === opt.key && detailStyles.dateRangeChipActive)}
            onClick={() => handleRangeChange(opt.key)}
          >
            {opt.label}
          </button>
        ))}
      </div>
      {!isAdmin && (
        <div className={detailStyles.pmScopeNotice}>
          ℹ️ 仅显示与您账号相关的工单记录，完整记录请联系管理员查看
        </div>
      )}
      {groups.length === 0 ? (
        <div className={detailStyles.emptyHistory}>该时间段内暂无工单记录</div>
      ) : (
        groups.map((group) => (
          <div key={group.type} className={detailStyles.section}>
            <div className={detailStyles.sectionHead}>
              <span className={detailStyles.sectionTitle}>{WORK_ORDER_TYPE_LABEL[group.type]}工单</span>
              <span className={detailStyles.sectionCount}>{group.items.length} 条</span>
            </div>
            {group.items.map((wo, idx) => {
              const isLast = idx === group.items.length - 1;
              const statusColor = WO_STATUS_COLOR[wo.status] ?? '#666';
              const canNavigate = navigableIds.has(wo.id);
              return (
                <div
                  key={wo.id}
                  className={clsx(
                    isLast ? detailStyles.workOrderRowLast : detailStyles.workOrderRow,
                    canNavigate && detailStyles.workOrderRowClickable,
                  )}
                  onClick={() => canNavigate && onWorkOrderPress?.(wo.id)}
                  role={canNavigate ? 'button' : undefined}
                  tabIndex={canNavigate ? 0 : undefined}
                  onKeyDown={(e) => canNavigate && e.key === 'Enter' && onWorkOrderPress?.(wo.id)}
                >
                  <div className={detailStyles.workOrderInfo}>
                    <div className={detailStyles.workOrderNo}>{wo.workOrderNo}</div>
                    {wo.date && <div className={detailStyles.workOrderDate}>{wo.date}</div>}
                  </div>
                  <span className={detailStyles.workOrderStatus} style={{ color: statusColor }}>
                    {wo.status}
                  </span>
                  {canNavigate && <span className={detailStyles.workOrderChevron}>›</span>}
                </div>
              );
            })}
          </div>
        ))
      )}
      {canLoadMore && (
        <div className={detailStyles.tabLoadMoreWrap}>
          <button
            type="button"
            className={detailStyles.tabLoadMoreBtn}
            onClick={() => setLoadedCount((p) => p + BATCH_SIZE)}
          >
            加载更多
          </button>
        </div>
      )}
    </div>
  );
};
