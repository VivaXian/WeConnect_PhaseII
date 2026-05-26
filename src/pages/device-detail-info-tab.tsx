import clsx from 'clsx';
import { useState } from 'react';
import { useShallow } from 'zustand/react/shallow';
import type { Device } from '../types/device';
import type { RepairRecord } from '../types/repair';
import { useDeviceCustomNamesStore } from '../stores/device-custom-names-store';
import { useDeviceLocationsStore } from '../stores/device-locations-store';
import { detailStyles } from './device-detail-page.css';
import { infoTabStyles } from './device-detail-info-tab.css';

type StatusVariant = 'danger' | 'warning' | 'neutral' | 'active';
type NavTab = 'repair' | 'pm' | 'contract';

interface StatusItem {
  variant: StatusVariant;
  label: string;
  description: string;
  tab?: NavTab;
}

interface Props {
  device: Device;
  isAdmin: boolean;
  contractStatus: 'good' | 'warning' | 'expired' | 'none';
  contractDays: number | null;
  warrantyUnsupported: boolean;
  isWithinSixMonths: boolean;
  pmRiskLevel: 'ok' | 'concern' | 'high';
  showPmSoon: boolean;
  activeRepair: RepairRecord | undefined;
  onNavigate: (tab: NavTab) => void;
}

function formatPmDate(dateStr: string): string {
  const [, m, d] = dateStr.split('-');
  return `${parseInt(m, 10)}月${parseInt(d, 10)}日`;
}

function formatInstallDate(dateStr: string): string {
  const [y, m, d] = dateStr.split('-');
  return `${y}年${parseInt(m, 10)}月${parseInt(d, 10)}日`;
}

function buildStatusItems(props: Props): StatusItem[] {
  const { device, isAdmin, contractStatus, contractDays, pmRiskLevel, showPmSoon, activeRepair } = props;
  const items: StatusItem[] = [];

  if (device.acceptancePending) {
    const installStr = device.installDate ? `设备于${formatInstallDate(device.installDate)}装机完成，` : '';
    items.push({ variant: 'danger', label: '待验收', description: `${installStr}请尽快完成验收以开启保修，设备当前无保`, tab: 'contract' });
  }
  if (activeRepair || device.status === 'under-repair' || device.status === 'pending-repair') {
    items.push({ variant: 'active', label: '报修中', description: '设备当前有进行中的报修，工程师处理中', tab: 'repair' });
  }
  if (isAdmin && !device.acceptancePending) {
    if (contractStatus === 'warning' && contractDays !== null) {
      items.push({ variant: 'warning', label: '即将出保', description: `服务合同将在 ${contractDays} 天后到期，建议提前续签`, tab: 'contract' });
    } else if (contractStatus === 'expired' || (contractStatus === 'none' && device.isDistributedDevice !== true)) {
      items.push({
        variant: 'danger',
        label: '无保',
        description: contractStatus === 'expired' ? '合同已到期，设备当前无厂商服务保障' : '当前无有效合同记录',
        tab: 'contract',
      });
    }
  }
  const showPmRisk = isAdmin ? pmRiskLevel !== 'ok' : pmRiskLevel === 'high';
  if (showPmRisk) {
    items.push({
      variant: pmRiskLevel === 'high' ? 'danger' : 'warning',
      label: '保养风险',
      description: pmRiskLevel === 'high' ? '保养间隔过长，建议尽快安排定期保养' : '保养间隔较长，请关注设备维护状态',
      tab: 'pm',
    });
  } else if (showPmSoon && pmRiskLevel === 'ok') {
    items.push({
      variant: 'active',
      label: '本月保养',
      description: device.pmNextDate ? `计划于 ${formatPmDate(device.pmNextDate)} 执行` : '本月有保养计划待执行',
      tab: 'pm',
    });
  }
  return items;
}

const variantCard = { danger: infoTabStyles.statusCardDanger, warning: infoTabStyles.statusCardWarning, neutral: infoTabStyles.statusCardNeutral, active: infoTabStyles.statusCardActive };
const variantBadge = { danger: infoTabStyles.statusBadgeDanger, warning: infoTabStyles.statusBadgeWarning, neutral: infoTabStyles.statusBadgeNeutral, active: infoTabStyles.statusBadgeActive };

export const DeviceDetailInfoTab = (props: Props) => {
  const { device, onNavigate } = props;
  const statusItems = buildStatusItems(props);

  const { names, setName } = useDeviceCustomNamesStore(useShallow((s) => ({ names: s.names, setName: s.setName })));
  const { locations, setLocation } = useDeviceLocationsStore(useShallow((s) => ({ locations: s.locations, setLocation: s.setLocation })));

  const customName = names[device.id] ?? device.customName ?? '';
  const locationOverride = locations[device.id];
  const displayDept = locationOverride?.department ?? device.department;
  const displayLocation = locationOverride?.location ?? device.location;

  const [editingField, setEditingField] = useState<'location' | 'name' | null>(null);
  const [deptDraft, setDeptDraft] = useState('');
  const [locationDraft, setLocationDraft] = useState('');
  const [nameDraft, setNameDraft] = useState('');

  const saveLocation = () => {
    setLocation(device.id, { department: deptDraft.trim() || device.department, location: locationDraft.trim() || device.location });
    setEditingField(null);
  };
  const saveName = () => { setName(device.id, nameDraft.trim()); setEditingField(null); };

  return (
    <div className={detailStyles.tabContent}>
      {/* ── Status highlights ── */}
      {statusItems.map((item, i) => (
        <div
          key={i}
          className={clsx(infoTabStyles.statusCard, variantCard[item.variant], !item.tab && infoTabStyles.statusCardStatic)}
          onClick={item.tab ? () => onNavigate(item.tab!) : undefined}
        >
          <div className={infoTabStyles.statusContent}>
            <span className={clsx(infoTabStyles.statusBadge, variantBadge[item.variant])}>{item.label}</span>
            <span className={infoTabStyles.statusDesc}>{item.description}</span>
          </div>
          {item.tab && <span className={infoTabStyles.statusArrow}>›</span>}
        </div>
      ))}

      <div className={infoTabStyles.divider} />

      {/* ── Device info + inline annotations ── */}
      <div className={infoTabStyles.sectionHeader}>设备信息</div>

      <div className={infoTabStyles.row}>
        <span className={infoTabStyles.label}>型号</span>
        <span className={infoTabStyles.value}>{device.name}</span>
      </div>

      {editingField === 'name' ? (
        <div className={infoTabStyles.editArea}>
          <input className={infoTabStyles.editInputFull} value={nameDraft} onChange={(e) => setNameDraft(e.target.value)} placeholder={device.name} autoFocus />
          <div className={infoTabStyles.editActions}>
            <button className={infoTabStyles.btnCancel} onClick={() => setEditingField(null)}>取消</button>
            <button className={infoTabStyles.btnSave} onClick={saveName}>保存</button>
          </div>
        </div>
      ) : (
        <div className={infoTabStyles.row}>
          <span className={infoTabStyles.label}>备注</span>
          <span className={customName ? infoTabStyles.value : infoTabStyles.valueMuted}>{customName || '未设置'}</span>
          <button className={infoTabStyles.editBtn} onClick={() => { setNameDraft(customName); setEditingField('name'); }}>编辑</button>
        </div>
      )}

      {device.eqNumber && (
        <div className={infoTabStyles.row}>
          <span className={infoTabStyles.label}>EQ 编号</span>
          <span className={infoTabStyles.value}>{device.eqNumber}</span>
        </div>
      )}
      <div className={infoTabStyles.row}>
        <span className={infoTabStyles.label}>序列号</span>
        <span className={infoTabStyles.value}>{device.serialNumber}</span>
      </div>
      <div className={infoTabStyles.row}>
        <span className={infoTabStyles.label}>类型</span>
        <span className={infoTabStyles.value}>{device.type}</span>
      </div>

      {device.campus && (
        <div className={infoTabStyles.row}>
          <span className={infoTabStyles.label}>院区</span>
          <span className={infoTabStyles.value}>{device.campus}</span>
        </div>
      )}

      {editingField === 'location' ? (
        <div className={infoTabStyles.editArea}>
          <div className={infoTabStyles.editRow}>
            <span className={infoTabStyles.editLabel}>科室</span>
            <input className={infoTabStyles.editInput} value={deptDraft} onChange={(e) => setDeptDraft(e.target.value)} placeholder="例：影像科" />
          </div>
          <div className={infoTabStyles.editRow}>
            <span className={infoTabStyles.editLabel}>位置</span>
            <input className={infoTabStyles.editInput} value={locationDraft} onChange={(e) => setLocationDraft(e.target.value)} placeholder="例：南楼2层" />
          </div>
          <div className={infoTabStyles.editActions}>
            <button className={infoTabStyles.btnCancel} onClick={() => setEditingField(null)}>取消</button>
            <button className={infoTabStyles.btnSave} onClick={saveLocation}>保存</button>
          </div>
        </div>
      ) : (
        <>
          <div className={infoTabStyles.row}>
            <span className={infoTabStyles.label}>科室</span>
            <span className={displayDept ? infoTabStyles.value : infoTabStyles.valueMuted}>{displayDept || '未标注'}</span>
            <button className={infoTabStyles.editBtn} onClick={() => { setDeptDraft(displayDept); setLocationDraft(displayLocation); setEditingField('location'); }}>编辑</button>
          </div>
          <div className={infoTabStyles.row}>
            <span className={infoTabStyles.label}>位置</span>
            <span className={displayLocation ? infoTabStyles.value : infoTabStyles.valueMuted}>{displayLocation || '未标注'}</span>
          </div>
        </>
      )}

      <div className={infoTabStyles.row}>
        <span className={infoTabStyles.label}>装机日期</span>
        {device.canShowInstallDate && device.installDate ? (
          <span className={infoTabStyles.value}>{formatInstallDate(device.installDate)}</span>
        ) : (
          <span className={infoTabStyles.valueMuted}>暂未同步</span>
        )}
      </div>

      <div className={infoTabStyles.sectionNote}>备注、科室、位置为本地标注，仅对您可见，不影响系统数据</div>
    </div>
  );
};

