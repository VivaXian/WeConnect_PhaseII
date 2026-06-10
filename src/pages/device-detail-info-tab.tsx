import clsx from 'clsx';
import { useState } from 'react';
import { useShallow } from 'zustand/react/shallow';
import type { Device } from '../types/device';
import type { RepairRecord } from '../types/repair';
import { useDeviceCustomNamesStore } from '../stores/device-custom-names-store';
import { useDeviceLocationsStore } from '../stores/device-locations-store';
import { detailStyles } from './device-detail-page.css';
import { infoTabStyles } from './device-detail-info-tab.css';

type StatusVariant = 'danger' | 'warning' | 'caution' | 'neutral' | 'active';
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
  pmRiskLevel: 'ok' | 'high';
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

function getDeviceCategory(type: string): string {
  if (type.includes('磁共振')) return '磁共振';
  if (type.includes('CT') || type.includes('PET')) return 'CT';
  if (type.includes('血管')) return '血管机';
  if (type.includes('超声')) return '超声';
  return '其他';
}

const HOSPITAL_NAME = 'WeConnect医院主院区';

function buildStatusItems(props: Props): StatusItem[] {
  const { device, isAdmin, contractStatus, contractDays, pmRiskLevel, showPmSoon, activeRepair } = props;
  const items: StatusItem[] = [];

  if (isAdmin && device.acceptancePending) {
    const installStr = device.installDate ? `设备于${formatInstallDate(device.installDate)}装机完成，` : '';
    items.push({ variant: 'warning', label: '待验收', description: `${installStr}请尽快完成验收以开启保修，设备当前无保`, tab: 'contract' });
  }
  if (activeRepair || device.status === 'under-repair' || device.status === 'pending-repair') {
    items.push({ variant: 'active', label: '报修中', description: '设备当前有进行中的报修，工程师处理中', tab: 'repair' });
  }
  if (isAdmin && !device.acceptancePending) {
    if (contractStatus === 'warning' && contractDays !== null) {
      items.push({ variant: 'warning', label: '即将出保', description: `服务合同将在 ${contractDays} 天后到期，建议提前续保`, tab: 'contract' });
    } else if (contractStatus === 'expired' || (contractStatus === 'none' && device.isDistributedDevice !== true)) {
      items.push({
        variant: 'danger',
        label: '无保',
        description: contractStatus === 'expired' ? '合同已到期，设备当前无厂商服务保障' : '当前无有效合同记录',
        tab: 'contract',
      });
    }
  }
  const showPmRisk = pmRiskLevel !== 'ok';
  if (showPmRisk) {
    items.push({
      variant: 'caution',
      label: '保养风险',
      description: '设备长时间未保养，建议采购保养服务',
      tab: 'pm',
    });
  } else if (showPmSoon && pmRiskLevel === 'ok') {
    items.push({
      variant: 'active',
      label: '本月保养',
      description: device.pmNextDate ? `计划于 ${formatPmDate(device.pmNextDate)} 对设备进行保养，建议提前安排` : '本月有保养计划，建议提前安排',
      tab: 'pm',
    });
  }
  return items;
}

const variantCard = { danger: infoTabStyles.statusCardDanger, warning: infoTabStyles.statusCardWarning, caution: infoTabStyles.statusCardCaution, neutral: infoTabStyles.statusCardNeutral, active: infoTabStyles.statusCardActive };
const variantBadge = { danger: infoTabStyles.statusBadgeDanger, warning: infoTabStyles.statusBadgeWarning, caution: infoTabStyles.statusBadgeCaution, neutral: infoTabStyles.statusBadgeNeutral, active: infoTabStyles.statusBadgeActive };

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
  const [showPhone, setShowPhone] = useState(false);

  const saveLocation = () => {
    setLocation(device.id, { department: deptDraft.trim(), location: locationDraft.trim() });
    setEditingField(null);
  };
  const saveName = () => { setName(device.id, nameDraft.trim()); setEditingField(null); };

  return (
    <div className={clsx(detailStyles.tabContent, statusItems.length > 0 && infoTabStyles.noTopPad)}>
      {/* ── Status highlights (only shown when there are alerts) ── */}
      {statusItems.length > 0 && (
        <div className={infoTabStyles.statusSection}>
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
        </div>
      )}

      {/* ── Device info + inline annotations ── */}
      <div className={infoTabStyles.sectionHeaderRow}>
        <span className={infoTabStyles.sectionHeaderTitle}>设备信息</span>
        <button className={infoTabStyles.phoneLink} onClick={() => setShowPhone(true)} aria-label="电话咨询">
          <svg width="13" height="13" viewBox="0 0 16 16" fill="none" aria-hidden="true">
            <path d="M3 2h3l1.5 3.5-1.75 1.05A9.5 9.5 0 008.45 9.25L9.5 7.5 13 9v3a1 1 0 01-1 1C5.82 13 2 9.18 2 4a1 1 0 011-2z" fill="currentColor"/>
          </svg>
          电话咨询
        </button>
      </div>
      <div className={infoTabStyles.infoCard}>
      <div className={infoTabStyles.row}>
        <span className={infoTabStyles.label}>设备类型</span>
        <span className={infoTabStyles.value}>{getDeviceCategory(device.type)}</span>
      </div>
      {editingField === 'name' ? (
        <div className={infoTabStyles.editArea}>
          <span className={infoTabStyles.editAreaLabel}>设备备注</span>
          <input className={infoTabStyles.editInputFull} value={nameDraft} onChange={(e) => setNameDraft(e.target.value)} placeholder="给设备起一个便于识别的备注名" autoFocus />
          <div className={infoTabStyles.editActions}>
            <button className={infoTabStyles.btnCancel} onClick={() => setEditingField(null)}>取消</button>
            <button className={infoTabStyles.btnSave} onClick={saveName}>保存</button>
          </div>
        </div>
      ) : (
        <div className={infoTabStyles.row}>
          <span className={infoTabStyles.label}>设备名称</span>
          <div className={infoTabStyles.modelValueCol}>
            <span className={infoTabStyles.modelName}>{device.name}</span>
            {customName && <span className={infoTabStyles.modelNote}>备注：{customName}</span>}
          </div>
          <button
            className={infoTabStyles.editBtn}
            onClick={() => { setNameDraft(customName); setEditingField('name'); }}
          >
            {customName ? '编辑' : '添加备注'}
          </button>
        </div>
      )}

      {device.eqNumber && (
        <div className={infoTabStyles.row}>
          <span className={infoTabStyles.label}>EQ</span>
          <span className={infoTabStyles.value}>{device.eqNumber}</span>
        </div>
      )}
      <div className={infoTabStyles.row}>
        <span className={infoTabStyles.label}>序列号</span>
        <span className={infoTabStyles.value}>{device.serialNumber}</span>
      </div>
      <div className={infoTabStyles.row}>
        <span className={infoTabStyles.label}>装机日期</span>
        {device.canShowInstallDate && device.installDate ? (
          <span className={infoTabStyles.value}>{formatInstallDate(device.installDate)}</span>
        ) : (
          <span className={infoTabStyles.valueMuted}>暂未同步</span>
        )}
      </div>

      <div className={infoTabStyles.locationGroupDivider}>所在位置</div>

      <div className={infoTabStyles.row}>
        <span className={infoTabStyles.label}>医院</span>
        <span className={infoTabStyles.value}>{device.campus ?? HOSPITAL_NAME}</span>
      </div>

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
      </div>

      <div className={infoTabStyles.localNote}>
        <svg className={infoTabStyles.localNoteIcon} width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
          <circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="1.3"/>
          <path d="M8 7v4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
          <circle cx="8" cy="4.8" r="0.9" fill="currentColor"/>
        </svg>
        <span className={infoTabStyles.localNoteText}>备注、科室、位置为您的本地标注，仅自己可见。</span>
      </div>

      {showPhone && (
        <div className={infoTabStyles.dialogOverlay} onClick={() => setShowPhone(false)}>
          <div className={infoTabStyles.dialogCard} onClick={(e) => e.stopPropagation()}>
            <div className={infoTabStyles.dialogBody}>
              <span className={infoTabStyles.dialogTitle}>电话咨询</span>
              <span className={infoTabStyles.dialogNumber}>400-810-0038</span>
              <span className={infoTabStyles.dialogSub}>飞利浦客户服务热线</span>
            </div>
            <div className={infoTabStyles.dialogActions}>
              <button className={clsx(infoTabStyles.dialogBtn, infoTabStyles.dialogBtnCancel)} onClick={() => setShowPhone(false)}>取消</button>
              <a className={clsx(infoTabStyles.dialogBtn, infoTabStyles.dialogBtnCall)} href="tel:400-810-0038" onClick={() => setShowPhone(false)}>拨打</a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

