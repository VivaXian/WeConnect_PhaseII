import clsx from 'clsx';
import type { Device } from '../types/device';
import { DEVICE_STATUS_LABEL } from '../types/device';
import type { RepairRecord } from '../types/repair';
import { detailStyles } from './device-detail-page.css';

interface InfoTabProps {
  device: Device;
  activeRepair?: RepairRecord;
  showPmSoon: boolean;
}

export const DeviceDetailInfoTab = ({ device, activeRepair, showPmSoon }: InfoTabProps) => {
  const formatPmDate = (dateStr: string) => {
    const [, m, d] = dateStr.split('-');
    return `${parseInt(m, 10)}月${parseInt(d, 10)}日`;
  };

  return (
    <div className={detailStyles.tabContent}>
      {device.pmRisk && (
        <div className={detailStyles.alertBannerDanger}>
          <span>⚠️</span>
          <span className={detailStyles.alertText}>该设备保养间隔较长，建议关注设备维护状态</span>
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
        <div className={detailStyles.infoRow}>
          <span className={detailStyles.infoLabel}>序列号</span>
          <span className={detailStyles.infoValue}>{device.serialNumber}</span>
        </div>
        <div className={detailStyles.infoRowLast}>
          <span className={detailStyles.infoLabel}>运行状态</span>
          <span className={detailStyles.infoValue}>{DEVICE_STATUS_LABEL[device.status]}</span>
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
    </div>
  );
};
