import { useState } from 'react';
import clsx from 'clsx';
import type { ContractPeriod, Device } from '../types/device';
import { CONTRACT_PERIOD_LABEL } from '../types/device';
import { detailStyles } from './device-detail-page.css';
import { BizConsultSheet } from '../components/biz-consult-sheet';

interface ContractTabProps {
  device: Device;
  contractStatus: 'good' | 'warning' | 'expired' | 'none';
  contractDays: number | null;
  warrantyUnsupported?: boolean;
}

function daysFromToday(dateStr: string): number {
  const today = new Date();
  const target = new Date(dateStr);
  return Math.round((target.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
}

function periodStatus(period: ContractPeriod): 'active' | 'expired' | 'upcoming' {
  const startDays = daysFromToday(period.startDate);
  const endDays = daysFromToday(period.endDate);
  if (startDays > 0) return 'upcoming';
  if (endDays < 0) return 'expired';
  return 'active';
}

function monthsSinceDate(dateStr: string): number {
  const today = new Date();
  const d = new Date(dateStr);
  return (today.getFullYear() - d.getFullYear()) * 12 + today.getMonth() - d.getMonth();
}

function formatDateCN(dateStr: string): string {
  const [y, m, day] = dateStr.split('-').map(Number);
  return `${y}年${m}月${day}日`;
}

function addSixMonths(dateStr: string): string {
  const d = new Date(dateStr);
  d.setMonth(d.getMonth() + 6);
  return `${d.getFullYear()}年${d.getMonth() + 1}月${d.getDate()}日`;
}

function consultKey(deviceId: string): string {
  return `contractConsult_${deviceId}`;
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

export const DeviceDetailContractTab = ({ device, contractStatus, contractDays, warrantyUnsupported }: ContractTabProps) => {
  const [showBizConsult, setShowBizConsult] = useState(false);
  const [contractConsultDone, setContractConsultDone] = useState(() => isConsultActive(device.id));

  const allPeriods = [...(device.contractHistory ?? [])].sort(
    (a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime()
  );
  const isDistributed = warrantyUnsupported ?? false;
  const showUnsupportedNote = isDistributed && device.businessContract !== 'none';
  const visiblePeriods = isDistributed
    ? allPeriods.filter((p) => p.type === 'csa')
    : allPeriods;
  const activePeriod = visiblePeriods.find((p) => periodStatus(p) === 'active');
  const isWithinSixMonths = !device.acceptancePending
    && device.installDate != null
    && monthsSinceDate(device.installDate) < 6;
  const showHistory = !device.acceptancePending && !isWithinSixMonths && !(isDistributed && contractStatus === 'none') && (visiblePeriods.length > 0 || showUnsupportedNote);

  return (
    <div className={detailStyles.tabContent}>
      {/* Single status card — one source of truth, drives user action */}
      {device.acceptancePending ? (
        <div className={clsx(detailStyles.contractStatusCard, detailStyles.contractStatusWarn)}>
          <span className={clsx(detailStyles.contractStatusBadge, detailStyles.contractStatusBadgeWarn)}>待验收</span>
          <span className={detailStyles.contractStatusTitle}>设备当前无保障</span>
          <span className={detailStyles.contractStatusDetail}>
            {device.installDate && `装机日期：${formatDateCN(device.installDate)}。`}完成验收后质保将自动开始计算，建议尽快安排验收以获得服务保障。
          </span>
          <span className={detailStyles.contractStatusCta}>如需了解详情，请联系飞利浦销售团队</span>
        </div>
      ) : isWithinSixMonths ? (
        <div className={clsx(detailStyles.contractStatusCard, detailStyles.contractStatusNone)}>
          <span className={clsx(detailStyles.contractStatusBadge, detailStyles.contractStatusBadgeNeutral)}>合同未知</span>
          <span className={detailStyles.contractStatusTitle}>合同信息录入中</span>
          {device.canShowInstallDate && device.installDate ? (
            <span className={detailStyles.contractStatusDetail}>
              该设备于 {formatDateCN(device.installDate)} 完成装机，合同信息预计将于 {addSixMonths(device.installDate)} 起可查
            </span>
          ) : (
            <span className={detailStyles.contractStatusDetail}>
              合同文件通常在装机后 6 个月内完成录入，届时可在此查看保障信息
            </span>
          )}
          <span className={detailStyles.contractStatusCta}>如需提前了解保障方案，请联系飞利浦销售团队</span>
        </div>
      ) : contractStatus === 'expired' ? (
        <div className={clsx(detailStyles.contractStatusCard, detailStyles.contractStatusDanger)}>
          <span className={clsx(detailStyles.contractStatusBadge, detailStyles.contractStatusBadgeDanger)}>无保</span>
          <span className={detailStyles.contractStatusTitle}>设备当前无厂商服务保障</span>
          <span className={detailStyles.contractStatusDetail}>服务合同已到期</span>
          <div className={detailStyles.contractCtaRow}>
            <span className={detailStyles.contractStatusCta}>建议尽快联系飞利浦销售团队续保</span>
            <button type="button" className={detailStyles.contractWarnBtn} onClick={() => setShowBizConsult(true)}>
              {contractConsultDone ? '再次咨询' : '续保咨询'}
            </button>
          </div>
        </div>
      ) : contractStatus === 'warning' ? (
        <div className={clsx(detailStyles.contractStatusCard, detailStyles.contractStatusWarn)}>
          <span className={clsx(detailStyles.contractStatusBadge, detailStyles.contractStatusBadgeWarn)}>即将出保</span>
          <span className={detailStyles.contractStatusTitle}>服务合同将在 {contractDays} 天后到期</span>
          {activePeriod && (
            <span className={detailStyles.contractStatusDetail}>
              {CONTRACT_PERIOD_LABEL[activePeriod.type]}{activePeriod.subType && ` · ${activePeriod.subType}`}，有效期至 {activePeriod.endDate}
            </span>
          )}
          <div className={detailStyles.contractCtaRow}>
            <span className={detailStyles.contractStatusCta}>建议尽快联系飞利浦销售团队续保</span>
            <button type="button" className={detailStyles.contractWarnBtn} onClick={() => setShowBizConsult(true)}>
              {contractConsultDone ? '再次咨询' : '续保咨询'}
            </button>
          </div>
        </div>      ) : contractStatus === 'none' ? (
        <div className={clsx(detailStyles.contractStatusCard, detailStyles.contractStatusNone)}>
          <span className={clsx(detailStyles.contractStatusBadge, detailStyles.contractStatusBadgeNeutral)}>合同未知</span>
          <span className={detailStyles.contractStatusTitle}>暂无合同信息</span>
          <span className={detailStyles.contractStatusDetail}>当前设备无在保合同记录，如需了解服务保障方案，请联系飞利浦销售团队</span>
          <span className={detailStyles.contractStatusCta}>如需了解详情，请联系飞利浦销售团队</span>
        </div>      ) : (
        <div className={clsx(detailStyles.contractStatusCard, detailStyles.contractStatusGood)}>
          <span className={clsx(detailStyles.contractStatusBadge, detailStyles.contractStatusBadgeGood)}>在保中</span>
          {activePeriod && (
            <span className={detailStyles.contractStatusTitle}>
              {CONTRACT_PERIOD_LABEL[activePeriod.type]}{activePeriod.subType && ` · ${activePeriod.subType}`}
            </span>
          )}
          {activePeriod && (
            <span className={detailStyles.contractStatusDetail}>
              有效期至 {activePeriod.endDate}{contractDays !== null && ` · 还有 ${contractDays} 天`}
            </span>
          )}
          <span className={detailStyles.contractStatusCta}>如需了解详情，请联系飞利浦销售团队</span>
        </div>
      )}

      {/* Contract history — reverse chronological */}
      {showHistory && (
        <>
          <div className={detailStyles.pmLabelRow}>
            <span className={detailStyles.pmLabelTitle}>服务合同历程</span>
          </div>
          <div className={detailStyles.section}>
            {showUnsupportedNote && (
              <div className={detailStyles.contractHistoryNote}>
                部分合同记录暂未同步至系统，此处仅展示已归档的合同信息
              </div>
            )}
            <div className={detailStyles.contractHistoryList}>
            {visiblePeriods.map((period, idx) => {
              const status = periodStatus(period);
              const isLast = idx === visiblePeriods.length - 1;
              return (
                <div
                  key={idx}
                  className={clsx(
                    detailStyles.contractPeriodRow,
                    !isLast && detailStyles.contractPeriodRowBorder,
                    status === 'active' && detailStyles.contractPeriodRowActive,
                  )}
                >
                  <div className={detailStyles.contractTimeline}>
                    <div className={clsx(
                      detailStyles.contractTimelineTopLine,
                      idx === 0 && detailStyles.contractTimelineLineHidden,
                    )} />
                    <div className={clsx(
                      detailStyles.contractDot,
                      status === 'active' && detailStyles.contractDotActive,
                      status === 'expired' && detailStyles.contractDotExpired,
                      status === 'upcoming' && detailStyles.contractDotUpcoming,
                    )} />
                    <div className={clsx(
                      detailStyles.contractTimelineBottomLine,
                      isLast && detailStyles.contractTimelineLineHidden,
                    )} />
                  </div>
                  <div className={detailStyles.contractPeriodInfo}>
                    <div className={detailStyles.contractPeriodHeader}>
                      <span className={clsx(
                        detailStyles.contractTypeLabel,
                        status === 'expired' && detailStyles.contractTypeLabelExpired,
                      )}>
                        {CONTRACT_PERIOD_LABEL[period.type]}
                        {period.subType && <span className={clsx(
                          detailStyles.contractSubType,
                          status === 'expired' && detailStyles.contractSubTypeExpired,
                        )}> · {period.subType}</span>}
                      </span>
                      <span className={clsx(
                        detailStyles.contractStatusChip,
                        status === 'active' && detailStyles.contractChipActive,
                        status === 'expired' && detailStyles.contractChipExpired,
                        status === 'upcoming' && detailStyles.contractChipUpcoming,
                      )}>
                        {status === 'active' ? '当前' : status === 'expired' ? '已到期' : '未开始'}
                      </span>
                    </div>
                    <div className={detailStyles.contractPeriodDates}>
                      {period.type === 'warranty'
                        ? `截止 ${period.endDate}`
                        : `${period.startDate} ~ ${period.endDate}`
                      }
                    </div>
                  </div>
                </div>
              );
            })}
            </div>
          </div>
        </>
      )}
      {showBizConsult && (
        <BizConsultSheet
          onClose={() => setShowBizConsult(false)}
          defaultDescription="咨询服务合同续保"
          onSubmitted={() => {
            localStorage.setItem(consultKey(device.id), new Date().toISOString());
            setContractConsultDone(true);
            setShowBizConsult(false);
          }}
        />
      )}
    </div>
  );
};
