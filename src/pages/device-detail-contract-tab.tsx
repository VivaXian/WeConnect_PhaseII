import clsx from 'clsx';
import type { ContractPeriod, Device } from '../types/device';
import { CONTRACT_PERIOD_LABEL } from '../types/device';
import { detailStyles } from './device-detail-page.css';

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

export const DeviceDetailContractTab = ({ device, contractStatus, contractDays, warrantyUnsupported }: ContractTabProps) => {
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
          <span className={detailStyles.contractStatusCta}>如需了解详情，请联系相关销售人员</span>
        </div>
      ) : isDistributed && contractStatus === 'none' ? (
        <div className={clsx(detailStyles.contractStatusCard, detailStyles.contractStatusNone)}>
          <span className={clsx(detailStyles.contractStatusBadge, detailStyles.contractStatusBadgeNeutral)}>合同未知</span>
          <span className={detailStyles.contractStatusTitle}>合同信息暂时无法查询</span>
          <span className={detailStyles.contractStatusDetail}>部分设备合同信息暂未同步至系统，功能正在逐步完善中</span>
          <span className={detailStyles.contractStatusCta}>如需了解详情，请联系相关销售人员</span>
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
          <span className={detailStyles.contractStatusCta}>如需提前了解保障方案，请联系 Philips 销售人员</span>
        </div>
      ) : contractStatus === 'none' ? (
        <div className={clsx(detailStyles.contractStatusCard, detailStyles.contractStatusNone)}>
          <span className={clsx(detailStyles.contractStatusBadge, detailStyles.contractStatusBadgeNeutral)}>无保</span>
          <span className={detailStyles.contractStatusTitle}>当前无有效合同记录</span>
          <span className={detailStyles.contractStatusCta}>如需了解服务保障方案，请联系 Philips 销售团队</span>
        </div>
      ) : contractStatus === 'expired' ? (
        <div className={clsx(detailStyles.contractStatusCard, detailStyles.contractStatusDanger)}>
          <span className={clsx(detailStyles.contractStatusBadge, detailStyles.contractStatusBadgeDanger)}>无保</span>
          <span className={detailStyles.contractStatusTitle}>设备当前无厂商服务保障</span>
          <span className={detailStyles.contractStatusDetail}>
            服务合同已到期，建议尽快联系 Philips 销售团队续签，以恢复设备的服务保障
          </span>
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
          <span className={detailStyles.contractStatusCta}>建议提前联系 Philips 销售团队，安排合同续签</span>
        </div>
      ) : (
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
          <span className={detailStyles.contractStatusCta}>如需了解合同详情或续签方案，请联系 Philips 销售团队</span>
        </div>
      )}

      {/* Contract history — reverse chronological, no status chips on rows */}
      {showHistory && (
        <div className={detailStyles.section}>
          <div className={detailStyles.sectionHead}>
            <span className={detailStyles.sectionTitle}>服务合同历程</span>
          </div>
          {showUnsupportedNote && (
            <div className={detailStyles.contractHistoryNote}>
              部分合同记录暂未同步至系统，此处仅展示已归档的合同信息
            </div>
          )}
          {visiblePeriods.map((period, idx) => {
            const status = periodStatus(period);
            const isLast = idx === visiblePeriods.length - 1;
            return (
              <div
                key={idx}
                className={clsx(detailStyles.contractPeriodRow, !isLast && detailStyles.contractPeriodRowBorder)}
              >
                <div className={detailStyles.contractTimeline}>
                  <div className={clsx(
                    detailStyles.contractDot,
                    status === 'active' && detailStyles.contractDotActive,
                    status === 'expired' && detailStyles.contractDotExpired,
                    status === 'upcoming' && detailStyles.contractDotUpcoming,
                  )} />
                  {!isLast && <div className={detailStyles.contractLine} />}
                </div>
                <div className={detailStyles.contractPeriodInfo}>
                  <span className={detailStyles.contractTypeLabel}>
                    {CONTRACT_PERIOD_LABEL[period.type]}
                    {period.subType && <span className={detailStyles.contractSubType}> · {period.subType}</span>}
                  </span>
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
      )}
    </div>
  );
};
