import clsx from 'clsx';
import type { ContractPeriod, Device } from '../types/device';
import { CONTRACT_PERIOD_DESC, CONTRACT_PERIOD_LABEL } from '../types/device';
import { detailStyles } from './device-detail-page.css';

interface ContractTabProps {
  device: Device;
  contractStatus: 'good' | 'warning' | 'expired' | 'none';
  contractDays: number | null;
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

export const DeviceDetailContractTab = ({ device, contractStatus, contractDays }: ContractTabProps) => {
  const periods = [...(device.contractHistory ?? [])].reverse();

  return (
    <div className={detailStyles.tabContent}>
      {contractStatus === 'expired' && (
        <div className={detailStyles.alertBannerDanger}>
          <span>🔴</span>
          <span className={detailStyles.alertText}>服务合同已到期，设备当前无厂商服务保障</span>
        </div>
      )}
      {contractStatus === 'warning' && contractDays !== null && (
        <div className={detailStyles.alertBannerWarn}>
          <span>⏰</span>
          <span className={detailStyles.alertText}>
            服务合同将在 {contractDays} 天后到期，请关注续约事宜
          </span>
        </div>
      )}

      <div className={detailStyles.section}>
        <div className={detailStyles.sectionHead}>
          <span className={detailStyles.sectionTitle}>合同时间线</span>
          {contractStatus !== 'none' && (
            <span className={clsx(
              detailStyles.daysChip,
              contractStatus === 'good' && detailStyles.chipGood,
              contractStatus === 'warning' && detailStyles.chipWarn,
              contractStatus === 'expired' && detailStyles.chipDanger,
            )}>
              {contractStatus === 'expired' ? '已出保' : contractStatus === 'warning' ? `${contractDays}天后出保` : '在保'}
            </span>
          )}
        </div>

        {periods.length === 0 ? (
          <div className={detailStyles.contractEmpty}>暂无合同记录</div>
        ) : (
          periods.map((period, idx) => {
            const status = periodStatus(period);
            const isLast = idx === periods.length - 1;
            return (
              <div key={idx} className={clsx(detailStyles.contractPeriodRow, !isLast && detailStyles.contractPeriodRowBorder)}>
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
                  <div className={detailStyles.contractPeriodHeader}>
                    <span className={detailStyles.contractTypeLabel}>
                      {CONTRACT_PERIOD_LABEL[period.type]}
                    </span>
                    <span className={detailStyles.contractTypeDesc}>
                      {CONTRACT_PERIOD_DESC[period.type]}
                    </span>
                    <span className={clsx(
                      detailStyles.contractStatusChip,
                      status === 'active' && detailStyles.contractChipActive,
                      status === 'expired' && detailStyles.contractChipExpired,
                      status === 'upcoming' && detailStyles.contractChipUpcoming,
                    )}>
                      {status === 'active' ? '在保' : status === 'expired' ? '已出保' : '待生效'}
                    </span>
                  </div>
                  <div className={detailStyles.contractPeriodDates}>
                    {period.type === 'warranty' ? (
                      <span>合同到期时间：{period.endDate}</span>
                    ) : (
                      <span>{period.startDate} ~ {period.endDate}</span>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {!device.contractHistory && device.contractEnd && (
        <div className={detailStyles.section}>
          <div className={detailStyles.sectionHead}>
            <span className={detailStyles.sectionTitle}>当前合同</span>
          </div>
          <div className={detailStyles.infoRowLast}>
            <span className={detailStyles.infoLabel}>结束日期</span>
            <span className={detailStyles.infoValue}>{device.contractEnd}</span>
          </div>
        </div>
      )}
    </div>
  );
};
