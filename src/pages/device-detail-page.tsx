import clsx from 'clsx';
import { useState } from 'react';
import type { Device } from '../types/device';
import {
  BUSINESS_CONTRACT_LABEL,
  CONTRACT_LABEL,
  DEVICE_STATUS_LABEL,
} from '../types/device';
import { useRoleStore } from '../stores/role-store';
import { repairData } from '../utils/repair-data';
import { detailStyles } from './device-detail-page.css';

function daysFromToday(dateStr: string): number {
  const today = new Date();
  const target = new Date(dateStr);
  return Math.round((target.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
}

function pmSoon(dateStr: string | undefined): boolean {
  if (!dateStr) return false;
  const d = daysFromToday(dateStr);
  return d >= 0 && d <= 30;
}

function formatPmDate(dateStr: string): string {
  const [, month, day] = dateStr.split('-');
  return `${parseInt(month, 10)}月${parseInt(day, 10)}日`;
}

type DetailTab = 'info' | 'history';

const STATUS_LABEL: Record<string, string> = {
  'in-service': '服务中',
  'completed-pending': '待签字',
  cancelled: '已取消',
};

interface DeviceDetailPageProps {
  device: Device;
  onBack: () => void;
  onRepairDetailPress?: (repairId: string) => void;
}

export const DeviceDetailPage = ({ device, onBack, onRepairDetailPress }: DeviceDetailPageProps) => {
  const { role } = useRoleStore();
  const isAdmin = role === 'admin';
  const [activeTab, setActiveTab] = useState<DetailTab>('history');

  const allRecords = repairData.flatMap((g) => g.records);
  const deviceRecords = allRecords.filter((r) => r.deviceName === device.name);
  const activeRepair = deviceRecords.find((r) => r.status === 'in-service');

  // Regular users only see their own repairs; in prototype, show first record to simulate this
  const historyRecords = isAdmin ? deviceRecords : deviceRecords.slice(0, 1);

  const contractDays = device.contractEnd ? daysFromToday(device.contractEnd) : null;
  const contractStatus =
    contractDays === null
      ? 'none'
      : contractDays > 120
      ? 'good'
      : contractDays > 0
      ? 'warning'
      : 'expired';

  // Days since last PM (positive = days ago)
  const daysSincePm = device.pmLastDate
    ? Math.abs(daysFromToday(device.pmLastDate))
    : null;

  // PM risk level for admin: high/concern/ok
  const pmRiskLevel =
    device.pmRisk
      ? 'high'
      : device.pmLastDate && Math.abs(daysFromToday(device.pmLastDate)) > 180
      ? 'concern'
      : 'ok';

  const showPmSoon = pmSoon(device.pmNextDate);

  return (
    <div className={detailStyles.page}>
      {/* Blue header */}
      <div className={detailStyles.header}>
        <div className={detailStyles.headerTop}>
          <button className={detailStyles.backBtn} onClick={onBack} aria-label="返回">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path
                d="M12 4L6 10L12 16"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
          <div className={detailStyles.headerName}>{device.name}</div>
        </div>
        <div className={detailStyles.headerMeta}>
          {device.department} · {device.location}
        </div>
        {/* Multi-chip status row */}
        <div className={detailStyles.headerChips}>
          {/* Operational status — always shown */}
          <span className={clsx(
            detailStyles.chip,
            device.status === 'normal' && detailStyles.chipSuccess,
            device.status === 'under-repair' && detailStyles.chipWarning,
            device.status === 'pending-repair' && detailStyles.chipWarning,
            device.status === 'offline' && detailStyles.chipError,
          )}>
            {DEVICE_STATUS_LABEL[device.status]}
          </span>
          {/* Active repair — shown when in service */}
          {activeRepair && (
            <span className={clsx(detailStyles.chip, detailStyles.chipActive)}>
              ● 服务中
            </span>
          )}
          {/* Contract status — admin only */}
          {isAdmin && (
            <span className={clsx(
              detailStyles.chip,
              contractStatus === 'good' && detailStyles.chipSuccess,
              contractStatus === 'warning' && detailStyles.chipWarning,
              contractStatus === 'expired' && detailStyles.chipError,
              contractStatus === 'none' && detailStyles.chipNeutral,
            )}>
              {contractStatus === 'good' ? '合同保障中' : contractStatus === 'warning' ? '合同即将到期' : contractStatus === 'expired' ? '已脱保' : '无合同'}
            </span>
          )}
          {/* PM risk — admin only */}
          {isAdmin && (
            <span className={clsx(
              detailStyles.chip,
              pmRiskLevel === 'ok' && detailStyles.chipSuccess,
              pmRiskLevel === 'concern' && detailStyles.chipWarning,
              pmRiskLevel === 'high' && detailStyles.chipError,
            )}>
              {pmRiskLevel === 'ok' ? 'PM正常' : pmRiskLevel === 'concern' ? 'PM需关注' : 'PM高风险'}
            </span>
          )}
        </div>
      </div>

      {/* Tab bar — 历史报修 is Tab 1 */}
      <div className={detailStyles.tabBar}>
        <button
          className={clsx(detailStyles.tabBtn, activeTab === 'history' && detailStyles.tabBtnActive)}
          onClick={() => setActiveTab('history')}
        >
          历史报修
          {deviceRecords.length > 0 && (
            <span style={{ marginLeft: 4, fontSize: 12, opacity: 0.8 }}>
              ({isAdmin ? deviceRecords.length : historyRecords.length})
            </span>
          )}
        </button>
        <button
          className={clsx(detailStyles.tabBtn, activeTab === 'info' && detailStyles.tabBtnActive)}
          onClick={() => setActiveTab('info')}
        >
          设备信息
        </button>
      </div>

      {/* Tab: 设备信息 */}
      {activeTab === 'info' && (
        <div className={detailStyles.tabContent}>
          {!isAdmin && device.pmRisk && (
            <div className={detailStyles.alertBannerDanger}>
              <span>⚠️</span>
              <span className={detailStyles.alertText}>该设备保养间隔较长，建议关注设备维护状态</span>
            </div>
          )}
          {!isAdmin && showPmSoon && !device.pmRisk && (
            <div className={detailStyles.alertBannerInfo}>
              <span>📅</span>
              <span className={detailStyles.alertText}>本月有保养计划，预计 {device.pmNextDate ? formatPmDate(device.pmNextDate) : ''} 执行</span>
            </div>
          )}
          {isAdmin && contractStatus === 'expired' && (
            <div className={detailStyles.alertBannerDanger}>
              <span>🔴</span>
              <span className={detailStyles.alertText}>服务合同已到期，设备当前无厂商服务保障</span>
            </div>
          )}
          {isAdmin && contractStatus === 'warning' && contractDays !== null && (
            <div className={detailStyles.alertBannerWarn}>
              <span>⏰</span>
              <span className={detailStyles.alertText}>
                服务合同将在 {contractDays} 天后到期，请关注续约事宜
              </span>
            </div>
          )}
          {isAdmin && device.pmRisk && (
            <div className={detailStyles.alertBannerDanger}>
              <span>⚠️</span>
              <span className={detailStyles.alertText}>该设备已出保，无服务合同保障，建议尽快续约</span>
            </div>
          )}
          {isAdmin && showPmSoon && !device.pmRisk && (
            <div className={detailStyles.alertBannerInfo}>
              <span>📅</span>
              <span className={detailStyles.alertText}>本月有保养计划，预计 {device.pmNextDate ? formatPmDate(device.pmNextDate) : ''} 执行</span>
            </div>
          )}

          <div className={detailStyles.section}>
            <div className={detailStyles.sectionHead}>
              <span className={detailStyles.sectionTitle}>设备信息</span>
            </div>
            <div className={detailStyles.infoRow}>
              <span className={detailStyles.infoLabel}>类型</span>
              <span className={detailStyles.infoValue}>{device.type}</span>
            </div>
            <div className={detailStyles.infoRow}>
              <span className={detailStyles.infoLabel}>科室</span>
              <span className={detailStyles.infoValue}>{device.department}</span>
            </div>
            <div className={detailStyles.infoRow}>
              <span className={detailStyles.infoLabel}>位置</span>
              <span className={detailStyles.infoValue}>{device.location}</span>
            </div>
            <div className={detailStyles.infoRowLast}>
              <span className={detailStyles.infoLabel}>序列号</span>
              <span className={detailStyles.infoValue}>{device.serialNumber}</span>
            </div>
          </div>

          {activeRepair && (
            <div className={detailStyles.section}>
              <div className={detailStyles.sectionHead}>
                <span className={detailStyles.sectionTitle}>当前服务</span>
              </div>
              <div className={detailStyles.serviceRow}>
                <div className={detailStyles.serviceDot} />
                <div className={detailStyles.serviceInfo}>
                  <div className={detailStyles.serviceLabel}>{activeRepair.progress.label}</div>
                  <div className={detailStyles.serviceDate}>{activeRepair.progress.date}</div>
                  {activeRepair.progress.engineer && (
                    <div className={detailStyles.serviceEngineer}>
                      {activeRepair.progress.engineer.name} · {activeRepair.progress.engineer.role}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {isAdmin && (
            <div className={detailStyles.section}>
              <div className={detailStyles.sectionHead}>
                <span className={detailStyles.sectionTitle}>合同信息</span>
                {contractDays !== null && (
                  <span
                    className={clsx(
                      detailStyles.daysChip,
                      contractStatus === 'good' && detailStyles.chipGood,
                      contractStatus === 'warning' && detailStyles.chipWarn,
                      contractStatus === 'expired' && detailStyles.chipDanger
                    )}
                  >
                    {contractStatus === 'expired' ? '已过期' : contractStatus === 'warning' ? `还剩 ${contractDays} 天` : '有效'}
                  </span>
                )}
              </div>
              <div className={detailStyles.infoRow}>
                <span className={detailStyles.infoLabel}>合同类型</span>
                <span className={detailStyles.infoValueAccent}>
                  {device.businessContract ? BUSINESS_CONTRACT_LABEL[device.businessContract] : '—'}
                </span>
              </div>
              <div className={detailStyles.infoRow}>
                <span className={detailStyles.infoLabel}>服务等级</span>
                <span className={detailStyles.infoValue}>{CONTRACT_LABEL[device.contract]}</span>
              </div>
              {device.contractStart && (
                <div className={detailStyles.infoRow}>
                  <span className={detailStyles.infoLabel}>开始日期</span>
                  <span className={detailStyles.infoValue}>{device.contractStart}</span>
                </div>
              )}
              <div className={detailStyles.infoRowLast}>
                <span className={detailStyles.infoLabel}>结束日期</span>
                <span className={detailStyles.infoValue}>{device.contractEnd ?? '该设备暂无服务合同'}</span>
              </div>
            </div>
          )}

          <div className={detailStyles.section}>
            <div className={detailStyles.sectionHead}>
              <span className={detailStyles.sectionTitle}>保养信息</span>
              {isAdmin && (
                <span className={clsx(
                  detailStyles.daysChip,
                  pmRiskLevel === 'ok' && detailStyles.chipGood,
                  pmRiskLevel === 'concern' && detailStyles.chipWarn,
                  pmRiskLevel === 'high' && detailStyles.chipDanger
                )}>
                  {pmRiskLevel === 'high' ? '高风险' : pmRiskLevel === 'concern' ? '需关注' : '正常'}
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
                <span className={detailStyles.infoValue}>{daysSincePm} 天</span>
              </div>
            )}
            <div className={detailStyles.infoRow}>
              <span className={detailStyles.infoLabel}>下次计划</span>
              <span className={detailStyles.infoValue}>{device.pmNextDate ?? '待排期'}</span>
            </div>
            <div className={detailStyles.infoRowLast}>
              <span className={detailStyles.infoLabel}>风险提示</span>
              <span className={detailStyles.infoValue}>
                {isAdmin
                  ? (device.pmRisk ? '合同到期，保养风险高' : pmRiskLevel === 'concern' ? '保养间隔较长，建议评估' : '保养间隔正常')
                  : (device.pmRisk ? '设备保养间隔较长，建议联系服务团队' : '保养间隔正常')}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Tab: 历史报修 */}
      {activeTab === 'history' && (
        <div className={detailStyles.tabContent}>
          {!isAdmin && (
            <div className={detailStyles.noteBanner}>
              <span style={{ fontSize: 16 }}>ℹ️</span>
              <span className={detailStyles.noteBannerText}>
                您只能查看自己对该台设备的历史报修记录
              </span>
            </div>
          )}

          {historyRecords.length === 0 ? (
            <div className={detailStyles.emptyHistory}>暂无报修记录</div>
          ) : (
            historyRecords.map((record) => {
              const lastCompletedNode = record.timeline
                ?.filter((n) => n.isCompleted)
                .slice(-1)[0];
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
                      <span className={detailStyles.repairHistoryId}>
                        报修号：{record.repairId}
                      </span>
                      <span
                        className={clsx(
                          detailStyles.repairHistoryStatusTag,
                          record.status === 'in-service' && detailStyles.repairHistoryStatusInService,
                          record.status === 'completed-pending' && detailStyles.repairHistoryStatusCompleted,
                          record.status === 'cancelled' && detailStyles.repairHistoryStatusCancelled,
                        )}
                      >
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
                      <div className={detailStyles.repairHistoryDesc}>
                        {record.problemDescription}
                      </div>
                    )}
                  </div>
                  <span className={detailStyles.repairHistoryChevron}>›</span>
                </div>
              );
            })
          )}
        </div>
      )}
    </div>
  );
};
