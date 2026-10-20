import { useState } from 'react';
import { useShallow } from 'zustand/react/shallow';
import { ChevronLeft } from '@filament/react/icons/chevron-left';
import { Cross } from '@filament/react/icons/cross';
import { deviceList } from '../utils/device-data';
import { getModality } from '../utils/device-modality';
import { activeRepairs } from '../utils/device-summary';
import { useDeviceBindingStore } from '../stores/device-binding-store';
import { useIsNewDemoUser } from '../hooks/use-is-new-demo-user';
import { QuickEntryEmptyState } from './quick-entry-empty-state';
import { EntryRow, deviceNoOf, deviceOfRepair, modalityIconOf } from './quick-entry-rows';
import { quickEntryStyles as s } from './quick-entry-card.css';

export interface QuickEntryPick {
  text: string;
  topic?: string;
  deviceId?: string;
  caseId?: string;
}

export type QuickEntryStep = 'root' | 'repair' | 'device' | 'new-device';

const NEW_DEVICE_TOPICS = ['采购报价', '合同与续保', '产品演示', '培训与验收', '其他'];

const DEFAULT_HINT = '您想咨询什么？选一项可更快为您接入对应人员，也可以直接在下方描述问题';

interface QuickEntryCardProps {
  onPick: (pick: QuickEntryPick) => void;
  initialStep?: QuickEntryStep;
  hint?: string | null;
  onClose?: () => void;
}

export const QuickEntryCard = ({
  onPick,
  initialStep = 'root',
  hint = DEFAULT_HINT,
  onClose,
}: QuickEntryCardProps) => {
  const [step, setStep] = useState<QuickEntryStep>(initialStep);
  const isNewDemoUser = useIsNewDemoUser();
  const { removedIds, purgedIds } = useDeviceBindingStore(
    useShallow((state) => ({
      removedIds: state.removedIds,
      purgedIds: state.purgedIds,
    }))
  );
  const devices = deviceList.filter(
    (device) => !removedIds.includes(device.id) && !purgedIds.includes(device.id)
  );
  const repairs = isNewDemoUser ? [] : activeRepairs().filter(
    (record) => devices.some((device) => device.name === record.deviceName)
  );

  const header = (label?: string) => (
    <div className={s.headerRow}>
      {label ? (
        <button type="button" className={s.back} onClick={() => setStep('root')}>
          <ChevronLeft className={s.backIcon} aria-hidden="true" />
          {label}
        </button>
      ) : (
        <span className={s.headerTitle}>选择咨询内容</span>
      )}
      {onClose && (
        <button type="button" className={s.close} aria-label="关闭" onClick={onClose}>
          <Cross className={s.closeIcon} aria-hidden="true" />
        </button>
      )}
    </div>
  );

  if (step === 'repair') {
    return (
      <div className={s.card}>
        {header(`选择报修单（${repairs.length}）`)}
        {repairs.length === 0 && <QuickEntryEmptyState kind="repair" />}
        <div className={s.scrollList}>
          {repairs.map((record) => (
            <EntryRow
              key={record.id}
              title={`报修号：${record.repairId}`}
              desc={`${record.deviceName} · ${record.progress.label}`}
              iconSrc={modalityIconOf(deviceOfRepair(record))}
              onPress={() =>
                onPick({
                  text: `查询报修 ${record.repairId}`,
                  deviceId: deviceOfRepair(record)?.id,
                  caseId: record.id,
                })
              }
            />
          ))}
        </div>
      </div>
    );
  }

  if (step === 'device') {
    return (
      <div className={s.card}>
        {header(`选择设备（${devices.length}）`)}
        {devices.length === 0 && <QuickEntryEmptyState kind="device" />}
        <div className={s.scrollList}>
          {devices.map((device) => (
            <EntryRow
              key={device.id}
              title={device.customName ?? device.name}
              desc={`${deviceNoOf(device)} · ${device.department} · ${device.location}`}
              iconSrc={getModality(device.type).icon}
              onPress={() =>
                onPick({
                  text: `咨询设备 ${device.name}（${deviceNoOf(device)}）`,
                  deviceId: device.id,
                })
              }
            />
          ))}
        </div>
      </div>
    );
  }

  if (step === 'new-device') {
    return (
      <div className={s.card}>
        {header('选择咨询方向')}
        <div className={s.chips}>
          {NEW_DEVICE_TOPICS.map((topic) => (
            <button
              key={topic}
              type="button"
              className={s.chip}
              onClick={() => onPick({ text: `咨询${topic}`, topic })}
            >
              {topic}
            </button>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className={s.card}>
      {header()}
      {hint && <span className={s.hint}>{hint}</span>}
      <div className={s.list}>
        <EntryRow
          title="查询报修"
          desc={repairs.length > 0
            ? `${repairs.length} 个进行中的报修 · 查进度 · 催单`
            : '查询报修进度 · 报修问题咨询'}
          onPress={() => setStep('repair')}
        />
        <EntryRow
          title="咨询我的设备"
          desc="合同保养 · 使用问题 · 培训"
          onPress={() => setStep('device')}
        />
        <EntryRow
          title="商务咨询及其他"
          desc="采购报价 · 合同与续保 · 演示与培训"
          onPress={() => setStep('new-device')}
        />
      </div>
    </div>
  );
};
