import clsx from 'clsx';
import { useState } from 'react';
import { useShallow } from 'zustand/react/shallow';
import type { Device } from '../types/device';
import { DEVICE_STATUS_LABEL } from '../types/device';
import type { LinkedWorkOrder } from '../types/repair';
import { useRoleStore } from '../stores/role-store';
import { useDeviceCustomNamesStore } from '../stores/device-custom-names-store';
import { repairData } from '../utils/repair-data';
import { MiniProgramNav } from '../components/mini-program-nav';
import { detailStyles } from './device-detail-page.css';
import { DeviceDetailInfoTab } from './device-detail-info-tab';
import { DeviceDetailContractTab } from './device-detail-contract-tab';
import { DeviceDetailPmTab } from './device-detail-pm-tab';
import { DeviceDetailRepairTab } from './device-detail-repair-tab';
import { DeviceDetailWorkOrderTab } from './device-detail-workorder-tab';

function daysFromToday(dateStr: string): number {
  const today = new Date();
  const target = new Date(dateStr);
  return Math.round((target.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
}

type DetailTab = 'repair' | 'pm' | 'workorder' | 'contract' | 'info';

interface DeviceDetailPageProps {
  device: Device;
  onBack: () => void;
  onRepairDetailPress?: (repairId: string) => void;
  onWorkOrderPress?: (orderId: string) => void;
  onQuickRepair?: () => void;
  initialTab?: DetailTab;
}

export const DeviceDetailPage = ({ device, onBack, onRepairDetailPress, onWorkOrderPress, onQuickRepair, initialTab }: DeviceDetailPageProps) => {
  const { role } = useRoleStore();
  const isAdmin = role === 'admin';
  const [activeTab, setActiveTab] = useState<DetailTab>(initialTab ?? 'info');
  const { names: customNames } = useDeviceCustomNamesStore(
    useShallow((state) => ({ names: state.names }))
  );
  const customName = customNames[device.id] ?? device.customName ?? '';

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
  const pmRiskLevel = (
    !device.type.includes('超声') && !hasActiveContract && !device.pmNextDate
  ) ? 'high' : 'ok';
  const showPmSoon = (() => {
    if (!device.pmNextDate) return false;
    const d = daysFromToday(device.pmNextDate);
    return d >= 0 && d <= 30;
  })();

  const isUltrasound = device.type.includes('超声');
  const isInfoSystem = device.type.includes('影像工作站') || device.type.includes('信息系统');
  const warrantyUnsupported = (device.isDistributedDevice === true) && (isUltrasound || isInfoSystem);
  const installDateObj = device.installDate ? new Date(device.installDate) : null;
  const todayDate = new Date();
  const monthsSinceInstall = installDateObj
    ? (todayDate.getFullYear() - installDateObj.getFullYear()) * 12 + todayDate.getMonth() - installDateObj.getMonth()
    : null;
  const isWithinSixMonths = !device.acceptancePending && monthsSinceInstall !== null && monthsSinceInstall < 6;

  const tabs: { key: DetailTab; label: string }[] = [
    { key: 'info' as DetailTab, label: '总览' },
    ...(isAdmin ? [{ key: 'contract' as DetailTab, label: '合同' }] : []),
    { key: 'repair', label: '报修' },
    { key: 'pm', label: '保养' },
    { key: 'workorder', label: '工单' },
  ];

  const displayName = customName || device.name;

  const formatPmDate = (dateStr: string) => {
    const [, m, d] = dateStr.split('-');
    return `${parseInt(m, 10)}月${parseInt(d, 10)}日`;
  };

  return (
    <div className={detailStyles.page}>
      <MiniProgramNav variant="back" title="设备详情" onBack={onBack} />
      <div className={detailStyles.header}>
        <div className={detailStyles.headerMain}>
          <div className={detailStyles.headerTextCol}>
            <span className={detailStyles.headerName}>{displayName}</span>
            {customName && (
              <span className={detailStyles.headerModelSub}>{device.name}</span>
            )}
          </div>
          <button
            className={detailStyles.heroRepairBtn}
            onClick={onQuickRepair}
            aria-label="极速报修"
          >
            <svg width="15" height="15" viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <path d="M9 1L3 9h5l-1 6 7-9h-5L9 1z" fill="currentColor"/>
            </svg>
            极速报修
          </button>
        </div>
      </div>

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

      {activeTab === 'info' && (
        <DeviceDetailInfoTab
          device={device}
          isAdmin={isAdmin}
          contractStatus={contractStatus}
          contractDays={contractDays}
          warrantyUnsupported={warrantyUnsupported}
          isWithinSixMonths={isWithinSixMonths}
          pmRiskLevel={pmRiskLevel}
          showPmSoon={showPmSoon}
          activeRepair={activeRepair}
          onNavigate={(tab) => setActiveTab(tab)}
        />
      )}
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
        <DeviceDetailContractTab device={device} contractStatus={contractStatus} contractDays={contractDays} warrantyUnsupported={warrantyUnsupported} />
      )}
    </div>
  );
};
