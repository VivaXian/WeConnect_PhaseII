import { useState } from 'react';
import clsx from 'clsx';
import type { Device, PmWorkOrderEntry } from '../types/device';
import { workOrderData } from '../utils/work-order-data';
import { detailStyles } from './device-detail-page.css';
import { BizConsultSheet } from '../components/biz-consult-sheet';

interface PmTabProps {
  device: Device;
  pmRiskLevel: 'ok' | 'high';
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

function consultKey(deviceId: string): string {
  return `pmConsult_${deviceId}`;
}

function isConsultActive(deviceId: string): boolean {
  const stored = localStorage.getItem(consultKey(deviceId));
  if (!stored) return false;
  const reset = new Date(stored);
  reset.setDate(reset.getDate() + 1);
  while (reset.getDay() === 0 || reset.getDay() === 6) {
    reset.setDate(reset.getDate() + 1);
  }
  reset.setHours(0, 0, 0, 0);
  return new Date() < reset;
}

function cutoffDate(range: DateRange): Date {
  const d = new Date(REF_DATE);
  d.setDate(d.getDate() - (range === '3m' ? 90 : range === '6m' ? 180 : 365));
  return d;
}

export const DeviceDetailPmTab = ({ device, pmRiskLevel, daysSincePm, showPmSoon, isAdmin, pmWorkOrders, onWorkOrderPress }: PmTabProps) => {
  const [dateRange, setDateRange] = useState<DateRange>('3m');
  const [loadedCount, setLoadedCount] = useState(BATCH_SIZE);
  const [showBizConsult, setShowBizConsult] = useState(false);
  const [bizConsultDone, setBizConsultDone] = useState(() => isConsultActive(device.id));
  const navigableIds = new Set(workOrderData.flatMap((g) => g.orders.map((o) => o.id)));

  const cutoff = cutoffDate(dateRange);
  const filteredPmWOs = pmWorkOrders.filter((wo) => !wo.date || new Date(wo.date) >= cutoff);
  const visiblePmWOs = filteredPmWOs.slice(0, loadedCount);
  const canLoadMore = filteredPmWOs.length > loadedCount;

  const handleRangeChange = (range: DateRange) => {
    setDateRange(range);
    setLoadedCount(BATCH_SIZE);
  };

  const isUltrasound = device.type.includes('超声');

  return (
    <div className={detailStyles.tabContent}>
      {isUltrasound && (
        <div className={clsx(detailStyles.contractStatusCard, detailStyles.contractStatusNone)}>
          <span className={clsx(detailStyles.contractStatusBadge, detailStyles.contractStatusBadgeNeutral)}>功能完善中</span>
          <span className={detailStyles.contractStatusTitle}>超声设备保养数据完善中</span>
          <span className={detailStyles.contractStatusDetail}>部分功能暂未上线，敬请期待。保养记录以实际情况为准。</span>
        </div>
      )}
      {pmRiskLevel !== 'ok' && (
        <div className={clsx(detailStyles.contractStatusCard, detailStyles.contractStatusCaution)}>
          <span className={clsx(detailStyles.contractStatusBadge, detailStyles.contractStatusBadgeCaution)}>保养风险</span>
          <span className={detailStyles.contractStatusTitle}>
            {daysSincePm !== null ? `设备已 ${daysSincePm} 天未保养` : '设备长时间未保养'}
          </span>
          <div className={detailStyles.contractCtaRow}>
            <span className={detailStyles.contractStatusCta}>建议尽快采购专业保养服务</span>
            <button type="button" className={detailStyles.pmContactBtn} onClick={() => setShowBizConsult(true)}>
              {bizConsultDone ? '再次咨询' : '保养咨询'}
            </button>
          </div>
        </div>
      )}
      {pmRiskLevel === 'ok' && showPmSoon && device.pmNextDate && (
        <div className={clsx(detailStyles.contractStatusCard, detailStyles.contractStatusInfo)}>
          <span className={clsx(detailStyles.contractStatusBadge, detailStyles.contractStatusBadgeInfo)}>本月保养</span>
          <span className={detailStyles.contractStatusTitle}>
            计划于 {formatPmDate(device.pmNextDate)} 进行保养
          </span>
          <span className={detailStyles.contractStatusCta}>建议提前安排相关工作</span>
        </div>
      )}
      <div className={detailStyles.pmLabelRow}>
        <span className={detailStyles.pmLabelTitle}>保养状态</span>
      </div>
      <div className={detailStyles.section}>
        <div className={detailStyles.infoRow}>
          <span className={detailStyles.infoLabel}>上次保养</span>
          <span className={detailStyles.infoValue}>
            {device.pmLastDate ?? '暂无记录'}
            {daysSincePm !== null && (
              <span className={detailStyles.infoValueMuted}> · {daysSincePm} 天前</span>
            )}
          </span>
        </div>
        <div className={detailStyles.infoRowLast}>
          <span className={detailStyles.infoLabel}>下次计划</span>
          {isUltrasound ? (
            <span className={clsx(detailStyles.infoValue, detailStyles.infoValueMuted)}>功能暂未上线</span>
          ) : device.pmNextDate ? (
            <span className={detailStyles.infoValue}>{device.pmNextDate}</span>
          ) : (
            <span className={clsx(detailStyles.infoValue, detailStyles.infoValueMuted)}>—</span>
          )}
        </div>
      </div>

      <div className={detailStyles.pmLabelRow}>
        <span className={detailStyles.pmLabelTitle}>保养工单</span>
        <span className={detailStyles.sectionCount}>{filteredPmWOs.length} 条</span>
      </div>
      <div className={detailStyles.section}>
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
        <div className={detailStyles.pmScopeNotice}>{isAdmin ? '完整历史请联系飞利浦销售团队' : '仅显示本账号相关工单，完整历史请联系飞利浦销售团队'}</div>
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
      {showBizConsult && <BizConsultSheet onClose={() => setShowBizConsult(false)} defaultDescription="咨询保养服务" onSubmitted={() => { localStorage.setItem(consultKey(device.id), new Date().toISOString()); setBizConsultDone(true); setShowBizConsult(false); }} />}
    </div>
  );
};
