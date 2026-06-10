import { useState } from 'react';
import clsx from 'clsx';
import type { RepairRecord } from '../types/repair';
import { detailStyles } from './device-detail-page.css';

const STATUS_LABEL: Record<string, string> = {
  'in-service': '服务中',
  'completed-pending': '待签字',
  cancelled: '已取消',
};

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

interface RepairTabProps {
  records: RepairRecord[];
  isAdmin: boolean;
  onRepairDetailPress?: (repairId: string) => void;
}

export const DeviceDetailRepairTab = ({ records, isAdmin, onRepairDetailPress }: RepairTabProps) => {
  const [dateRange, setDateRange] = useState<DateRange>('3m');
  const [loadedCount, setLoadedCount] = useState(BATCH_SIZE);

  const cutoff = cutoffDate(dateRange);
  const filtered = records.filter((r) => {
    if (!r.repairTime) return true;
    return new Date(r.repairTime.slice(0, 10)) >= cutoff;
  });
  const visible = filtered.slice(0, loadedCount);
  const canLoadMore = filtered.length > loadedCount;

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
      <div className={detailStyles.pmScopeNotice}>{isAdmin ? '完整历史请联系飞利浦销售团队' : '仅显示本账号相关记录，完整历史请联系飞利浦销售团队'}</div>
      {visible.length === 0 ? (
        <div className={detailStyles.emptyHistory}>该时间段内暂无报修记录</div>
      ) : (
        visible.map((record) => {
          const lastCompletedNode = record.timeline?.filter((n) => n.isCompleted).slice(-1)[0];
          const completedTime = record.status !== 'in-service' ? lastCompletedNode?.date : undefined;
          return (
            <div
              key={record.id}
              className={detailStyles.repairHistoryCard}
              onClick={() => onRepairDetailPress?.(record.id)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => e.key === 'Enter' && onRepairDetailPress?.(record.id)}
            >
              <div className={detailStyles.repairHistoryLeft}>
                <div className={detailStyles.repairHistoryTopRow}>
                  <span className={detailStyles.repairHistoryId}>报修号：{record.repairId}</span>
                  <span className={clsx(
                    detailStyles.repairHistoryStatusTag,
                    record.status === 'in-service' && detailStyles.repairHistoryStatusInService,
                    record.status === 'completed-pending' && detailStyles.repairHistoryStatusCompleted,
                    record.status === 'cancelled' && detailStyles.repairHistoryStatusCancelled,
                  )}>
                    {STATUS_LABEL[record.status]}
                  </span>
                </div>
                <div className={detailStyles.repairHistoryMeta}>
                  {record.repairTime && (
                    <div className={detailStyles.repairHistoryMetaRow}>
                      <span className={detailStyles.repairHistoryMetaLabel}>报修时间</span>
                      <span>{record.repairTime}</span>
                    </div>
                  )}
                  {completedTime && (
                    <div className={detailStyles.repairHistoryMetaRow}>
                      <span className={detailStyles.repairHistoryMetaLabel}>完成时间</span>
                      <span>{completedTime}</span>
                    </div>
                  )}
                </div>
                {record.problemDescription && (
                  <div className={detailStyles.repairHistoryDesc}>{record.problemDescription}</div>
                )}
              </div>
              <span className={detailStyles.repairHistoryChevron}>›</span>
            </div>
          );
        })
      )}
      {canLoadMore && (
        <div className={detailStyles.tabLoadMoreWrap}>
          <button type="button" className={detailStyles.tabLoadMoreBtn} onClick={() => setLoadedCount((p) => p + BATCH_SIZE)}>
            加载更多
          </button>
        </div>
      )}
    </div>
  );
};
