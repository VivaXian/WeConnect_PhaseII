import clsx from 'clsx';
import { useState } from 'react';
import { useShallow } from 'zustand/react/shallow';
import type { Device } from '../types/device';
import { DEVICE_STATUS_LABEL } from '../types/device';
import type { LinkedWorkOrder } from '../types/repair';
import { useRoleStore } from '../stores/role-store';
import { useDeviceCustomNamesStore } from '../stores/device-custom-names-store';
import { useDeviceLocationsStore } from '../stores/device-locations-store';
import { repairData } from '../utils/repair-data';
import { detailStyles } from './device-detail-page.css';
import { DeviceDetailContractTab } from './device-detail-contract-tab';
import { DeviceDetailPmTab } from './device-detail-pm-tab';
import { DeviceDetailRepairTab } from './device-detail-repair-tab';
import { DeviceDetailWorkOrderTab } from './device-detail-workorder-tab';

function daysFromToday(dateStr: string): number {
  const today = new Date();
  const target = new Date(dateStr);
  return Math.round((target.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
}

type DetailTab = 'repair' | 'pm' | 'workorder' | 'contract';

interface DeviceDetailPageProps {
  device: Device;
  onBack: () => void;
  onRepairDetailPress?: (repairId: string) => void;
  onWorkOrderPress?: (orderId: string) => void;
  onQuickRepair?: () => void;
}

export const DeviceDetailPage = ({ device, onBack, onRepairDetailPress, onWorkOrderPress, onQuickRepair }: DeviceDetailPageProps) => {
  const { role } = useRoleStore();
  const isAdmin = role === 'admin';
  const [activeTab, setActiveTab] = useState<DetailTab>('workorder');
  const [isHeaderExpanded, setIsHeaderExpanded] = useState(false);
  const { names: customNames, setName } = useDeviceCustomNamesStore(
    useShallow((state) => ({ names: state.names, setName: state.setName }))
  );
  const customName = customNames[device.id] ?? device.customName ?? '';
  const [isEditingName, setIsEditingName] = useState(false);
  const [editNameDraft, setEditNameDraft] = useState('');

  const { locations, setLocation } = useDeviceLocationsStore(
    useShallow((state) => ({ locations: state.locations, setLocation: state.setLocation }))
  );
  const locationOverride = locations[device.id];
  const displayDept = locationOverride?.department ?? device.department;
  const displayLocation = locationOverride?.location ?? device.location;
  const [isEditingLocation, setIsEditingLocation] = useState(false);
  const [deptDraft, setDeptDraft] = useState('');
  const [locationDraft, setLocationDraft] = useState('');

  const handleEditLocationStart = () => {
    setDeptDraft(displayDept);
    setLocationDraft(displayLocation);
    setIsEditingLocation(true);
  };
  const handleLocationSave = () => {
    setLocation(device.id, { department: deptDraft.trim() || device.department, location: locationDraft.trim() || device.location });
    setIsEditingLocation(false);
  };

  const allRecords = repairData.flatMap((g) => g.records);
  const deviceRecords = allRecords.filter((r) => r.deviceName === device.name);
  const activeRepair = deviceRecords.find((r) => r.status === 'in-service');
  const historyRecords = isAdmin ? deviceRecords : deviceRecords.slice(0, 1);
  const allWorkOrders: LinkedWorkOrder[] = [
    ...deviceRecords.flatMap((r) => r.linkedWorkOrders ?? []),
    ...(device.pmWorkOrders ?? []).map((pm) => ({
      id: pm.id,
      type: 'maintenance' as const,
      workOrderNo: pm.workOrderNo,
      status: pm.status,
      date: pm.date,
    })),
    ...(device.deviceWorkOrders ?? []),
  ];

  const contractDays = device.contractEnd ? daysFromToday(device.contractEnd) : null;
  const contractStatus =
    contractDays === null ? 'none'
    : contractDays > 120 ? 'good'
    : contractDays > 0 ? 'warning'
    : 'expired';

  const hasActiveContract = contractStatus === 'good' || contractStatus === 'warning';
  const daysSincePm = device.pmLastDate ? Math.abs(daysFromToday(device.pmLastDate)) : null;
  const pmRiskLevel =
    device.pmRisk ? 'high'
    : (daysSincePm !== null && daysSincePm > 180 && (!hasActiveContract || !device.pmNextDate)) ? 'concern'
    : 'ok';
  const showPmSoon = (() => {
    if (!device.pmNextDate) return false;
    const d = daysFromToday(device.pmNextDate);
    return d >= 0 && d <= 30;
  })();

  const tabs: { key: DetailTab; label: string }[] = [
    { key: 'workorder', label: '全部工单' },
    { key: 'repair', label: '报修记录' },
    { key: 'pm', label: '保养记录' },
    ...(isAdmin ? [{ key: 'contract' as DetailTab, label: '合同信息' }] : []),
  ];

  const displayName = customName || device.name;

  const handleEditStart = () => {
    setEditNameDraft(customName);
    setIsEditingName(true);
  };

  const handleEditConfirm = () => {
    setName(device.id, editNameDraft.trim());
    setIsEditingName(false);
  };

  const formatPmDate = (dateStr: string) => {
    const [, m, d] = dateStr.split('-');
    return `${parseInt(m, 10)}月${parseInt(d, 10)}日`;
  };

  return (
    <div className={detailStyles.page}>
      <div className={detailStyles.header}>
        <div className={detailStyles.headerTop}>
          <button className={detailStyles.backBtn} onClick={onBack} aria-label="返回">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M12 4L6 10L12 16" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
          <div className={detailStyles.headerNameRow}>
            {isEditingName ? (
              <input
                className={detailStyles.nameEditInput}
                value={editNameDraft}
                onChange={(e) => setEditNameDraft(e.target.value)}
                onBlur={handleEditConfirm}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleEditConfirm();
                  if (e.key === 'Escape') setIsEditingName(false);
                }}
                autoFocus
                placeholder={device.name}
              />
            ) : (
              <>
                <span className={detailStyles.headerName}>{displayName}</span>
                <button className={detailStyles.editNameBtn} onClick={handleEditStart} aria-label="编辑备注名">
                  <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
                    <path d="M8.5 1.5L11.5 4.5L4.5 11.5H1.5V8.5L8.5 1.5Z" stroke="rgba(255,255,255,0.6)" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
              </>
            )}
          </div>
          <button
            className={detailStyles.headerExpandBtn}
            onClick={() => setIsHeaderExpanded(!isHeaderExpanded)}
            aria-label={isHeaderExpanded ? '收起' : '展开'}
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path
                d={isHeaderExpanded ? 'M4 10L8 6L12 10' : 'M4 6L8 10L12 6'}
                stroke="rgba(255,255,255,0.75)"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>

        <div className={detailStyles.headerMetaRow}>
          <span className={detailStyles.headerMetaText}>
            {customName && <>{device.name} · </>}{displayDept || '未填写科室'} · {displayLocation || '未填写位置'}
          </span>
          <button
            className={detailStyles.headerMetaEditBtn}
            onClick={handleEditLocationStart}
            aria-label="编辑科室和位置"
          >
            <svg width="12" height="12" viewBox="0 0 13 13" fill="none">
              <path d="M8.5 1.5L11.5 4.5L4.5 11.5H1.5V8.5L8.5 1.5Z" stroke="rgba(255,255,255,0.9)" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>

        <div className={detailStyles.headerChips}>
          {device.status !== 'normal' && !activeRepair && (
            <span className={clsx(
              detailStyles.chip,
              (device.status === 'under-repair' || device.status === 'pending-repair') && detailStyles.chipWarning,
              device.status === 'offline' && detailStyles.chipError,
            )}>
              {DEVICE_STATUS_LABEL[device.status]}
            </span>
          )}
          {activeRepair && (
            <span className={clsx(detailStyles.chip, detailStyles.chipActive)}>● 服务中</span>
          )}
          {isAdmin && (contractStatus === 'warning' || contractStatus === 'expired') && (
            <span className={clsx(
              detailStyles.chip,
              contractStatus === 'warning' && detailStyles.chipWarning,
              contractStatus === 'expired' && detailStyles.chipError,
            )}>
              {contractStatus === 'warning' ? '即将出保' : '已出保'}
            </span>
          )}
          {isAdmin && contractStatus === 'none' && (
            <span className={clsx(detailStyles.chip, detailStyles.chipNeutral)}>无合同</span>
          )}
          {(isAdmin ? pmRiskLevel !== 'ok' : pmRiskLevel === 'high') && (
            <span className={clsx(
              detailStyles.chip,
              pmRiskLevel === 'concern' && detailStyles.chipWarning,
              pmRiskLevel === 'high' && detailStyles.chipError,
            )}>
              {pmRiskLevel === 'concern' ? 'PM需关注' : 'PM高风险'}
            </span>
          )}
        </div>

        <div className={detailStyles.headerActions}>
          <a
            href="tel:400-800-8008"
            className={detailStyles.headerActionBtnOutline}
            aria-label="电话咨询"
          >
            <svg width="13" height="13" viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <path d="M3 2h3l1.5 3.5-1.75 1.05A9.5 9.5 0 008.45 9.25L9.5 7.5 13 9v3a1 1 0 01-1 1C5.82 13 2 9.18 2 4a1 1 0 011-2z" fill="rgba(255,255,255,0.65)"/>
            </svg>
            电话咨询
          </a>
          <button
            className={detailStyles.headerActionBtnFill}
            onClick={onQuickRepair}
            aria-label="极速报修"
          >
            <svg width="13" height="13" viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <path d="M9 1L3 9h5l-1 6 7-9h-5L9 1z" fill="#0161de"/>
            </svg>
            极速报修
          </button>
        </div>

        {isHeaderExpanded && (
          <div className={detailStyles.headerExpandedInfo}>
            {device.eqNumber && (
              <div className={detailStyles.headerInfoRow}>
                <span className={detailStyles.headerInfoLabel}>EQ</span>
                <span className={detailStyles.headerInfoValue}>{device.eqNumber}</span>
              </div>
            )}
            <div className={detailStyles.headerInfoRow}>
              <span className={detailStyles.headerInfoLabel}>序列号</span>
              <span className={detailStyles.headerInfoValue}>{device.serialNumber}</span>
            </div>
          </div>
        )}
      </div>

      {isEditingLocation && (
        <div className={detailStyles.locationEditPanel}>
          <div className={detailStyles.locationEditRow}>
            <span className={detailStyles.locationEditLabel}>科室</span>
            <input
              className={detailStyles.locationEditInput}
              value={deptDraft}
              onChange={(e) => setDeptDraft(e.target.value)}
              placeholder="例：影像科"
            />
          </div>
          <div className={detailStyles.locationEditRow}>
            <span className={detailStyles.locationEditLabel}>位置</span>
            <input
              className={detailStyles.locationEditInput}
              value={locationDraft}
              onChange={(e) => setLocationDraft(e.target.value)}
              placeholder="例：南楼2层"
            />
          </div>
          <div className={detailStyles.locationEditActions}>
            <button className={detailStyles.locationEditCancel} onClick={() => setIsEditingLocation(false)}>取消</button>
            <button className={detailStyles.locationEditSave} onClick={handleLocationSave}>保存</button>
          </div>
        </div>
      )}

      {showPmSoon && (
        <div className={detailStyles.pmAlertBanner}>
          <span className={detailStyles.pmAlertIcon}>📅</span>
          <span className={detailStyles.pmAlertText}>
            本月保养计划 — 预计 {device.pmNextDate ? formatPmDate(device.pmNextDate) : ''} 执行
          </span>
          <button className={detailStyles.pmAlertTabBtn} onClick={() => setActiveTab('pm')}>
            查看 ›
          </button>
        </div>
      )}

      <div className={detailStyles.tabBar}>
        {tabs.map((tab) => (
          <button
            key={tab.key}
            className={clsx(detailStyles.tabBtn, activeTab === tab.key && detailStyles.tabBtnActive)}
            onClick={() => setActiveTab(tab.key)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === 'repair' && (
        <DeviceDetailRepairTab records={historyRecords} isAdmin={isAdmin} onRepairDetailPress={onRepairDetailPress} />
      )}
      {activeTab === 'pm' && (
        <DeviceDetailPmTab
          device={device}
          pmRiskLevel={pmRiskLevel}
          daysSincePm={daysSincePm}
          showPmSoon={showPmSoon}
          isAdmin={isAdmin}
          pmWorkOrders={device.pmWorkOrders ?? []}
          onWorkOrderPress={onWorkOrderPress}
        />
      )}
      {activeTab === 'workorder' && (
        <DeviceDetailWorkOrderTab workOrders={allWorkOrders} isAdmin={isAdmin} onWorkOrderPress={onWorkOrderPress} />
      )}
      {activeTab === 'contract' && isAdmin && (
        <DeviceDetailContractTab device={device} contractStatus={contractStatus} contractDays={contractDays} />
      )}
    </div>
  );
};
