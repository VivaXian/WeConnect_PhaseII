import { useState } from 'react';
import clsx from 'clsx';
import type { Device, PmWorkOrderEntry } from '../types/device';
import { workOrderData } from '../utils/work-order-data';
import { detailStyles } from './device-detail-page.css';

interface PmTabProps {
  device: Device;
  pmRiskLevel: 'ok' | 'concern' | 'high';
  daysSincePm: number | null;
  showPmSoon: boolean;
  isAdmin: boolean;
  pmWorkOrders: PmWorkOrderEntry[];
  onWorkOrderPress?: (orderId: string) => void;
}

function formatPmDate(dateStr: string): string {
  const [, m, d] = dateStr.split('-');
  return `${parseInt(m, 10)}月${parseInt(d, 10)}日`;
}

const PM_STATUS_COLOR: Record<string, string> = {
  '已完成': '#16a34a',
  '进行中': '#0161de',
  '待确认': '#d97706',
  'completed': '#16a34a',
  'in-progress': '#0161de',
  'pending-sign': '#d97706',
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

export const DeviceDetailPmTab = ({ device, pmRiskLevel, daysSincePm, showPmSoon, isAdmin, pmWorkOrders, onWorkOrderPress }: PmTabProps) => {
  const [dateRange, setDateRange] = useState<DateRange>('3m');
  const [loadedCount, setLoadedCount] = useState(BATCH_SIZE);
  const navigableIds = new Set(workOrderData.flatMap((g) => g.orders.map((o) => o.id)));

  const cutoff = cutoffDate(dateRange);
  const filteredPmWOs = pmWorkOrders.filter((wo) => !wo.date || new Date(wo.date) >= cutoff);
  const visiblePmWOs = filteredPmWOs.slice(0, loadedCount);
  const canLoadMore = filteredPmWOs.length > loadedCount;

  const handleRangeChange = (range: DateRange) => {
    setDateRange(range);
    setLoadedCount(BATCH_SIZE);
  };

  return (
    <div className={detailStyles.tabContent}>
      {device.pmRisk && (
        <div className={detailStyles.alertBannerDanger}>
          <span>⚠️</span>
          <span className={detailStyles.alertText}>
            {isAdmin ? '合同已出保，保养计划存在风险，建议尽快续约' : '该设备保养间隔较长，建议联系服务团队'}
          </span>
        </div>
      )}
      {showPmSoon && !device.pmRisk && (
        <div className={detailStyles.alertBannerInfo}>
          <span>📅</span>
          <span className={detailStyles.alertText}>
            本月有保养计划，预计 {device.pmNextDate ? formatPmDate(device.pmNextDate) : ''} 执行
          </span>
        </div>
      )}

      <div className={detailStyles.section}>
        <div className={detailStyles.sectionHead}>
          <span className={detailStyles.sectionTitle}>保养状态</span>
          {pmRiskLevel !== 'ok' && (
            <span className={clsx(
              detailStyles.daysChip,
              pmRiskLevel === 'concern' && detailStyles.chipWarn,
              pmRiskLevel === 'high' && detailStyles.chipDanger,
            )}>
              {pmRiskLevel === 'high' ? '高风险' : '需关注'}
            </span>
          )}
        </div>
        <div className={detailStyles.infoRow}>
          <span className={detailStyles.infoLabel}>上次保养</span>
          <span className={detailStyles.infoValue}>{device.pmLastDate ?? '暂无记录'}</span>
        </div>
        {daysSincePm !== null && (
          <div className={detailStyles.infoRow}>
            <span className={detailStyles.infoLabel}>距上次</span>
            <span className={detailStyles.infoValue}>{daysSincePm} 天前</span>
          </div>
        )}
        <div className={detailStyles.infoRowLast}>
          <span className={detailStyles.infoLabel}>下次计划</span>
          <span className={detailStyles.infoValue}>{device.pmNextDate ?? '待排期'}</span>
        </div>
      </div>

      <div className={detailStyles.section}>
        <div className={detailStyles.sectionHead}>
          <span className={detailStyles.sectionTitle}>保养工单</span>
          <span className={detailStyles.sectionCount}>{pmWorkOrders.length} 条</span>
        </div>
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
            ℹ️ 仅显示与您账号相关的保养工单，完整记录请联系管理员查看
          </div>
        )}
        {visiblePmWOs.length === 0 ? (
          <div className={detailStyles.emptyHistory}>该时间段内暂无保养记录</div>
        ) : (
          visiblePmWOs.map((wo, idx) => {
            const isLast = idx === visiblePmWOs.length - 1;
            const canNavigate = navigableIds.has(wo.id);
            const statusColor = PM_STATUS_COLOR[wo.status] ?? '#666';
            return (
              <div
                key={wo.id}
                className={clsx(
                  detailStyles.pmTimelineRow,
                  !isLast && detailStyles.pmTimelineRowBorder,
                  canNavigate && detailStyles.workOrderRowClickable,
                )}
                onClick={() => canNavigate && onWorkOrderPress?.(wo.id)}
                role={canNavigate ? 'button' : undefined}
                tabIndex={canNavigate ? 0 : undefined}
                onKeyDown={(e) => canNavigate && e.key === 'Enter' && onWorkOrderPress?.(wo.id)}
              >
                <div className={detailStyles.pmTimelineDotCol}>
                  <div className={clsx(
                    detailStyles.pmTimelineDot,
                    wo.status === '已完成' || wo.status === 'completed' ? detailStyles.pmDotCompleted : detailStyles.pmDotActive,
                  )} />
                  {!isLast && <div className={detailStyles.pmTimelineLine} />}
                </div>
                <div className={detailStyles.pmTimelineContent}>
                  <div className={detailStyles.pmTimelineHeader}>
                    <span className={detailStyles.pmTimelineDate}>{wo.date}</span>
                    <span className={detailStyles.pmTimelineStatus} style={{ color: statusColor }}>
                      {wo.status}
                    </span>
                    {canNavigate && <span className={detailStyles.workOrderChevron}>›</span>}
                  </div>
                  <div className={detailStyles.pmTimelineWoNo}>{wo.workOrderNo}</div>
                </div>
              </div>
            );
          })
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
    </div>
  );
};
