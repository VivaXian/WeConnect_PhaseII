import { useState } from 'react';
import clsx from 'clsx';
import { ChevronLeft } from '@filament/react/icons/chevron-left';
import { Cross } from '@filament/react/icons/cross';
import { deviceList } from '../utils/device-data';
import { getModality } from '../utils/device-modality';
import { activeRepairs } from '../utils/device-summary';
import { EntryRow, deviceNoOf, deviceOfRepair, modalityIconOf } from './quick-entry-rows';
import { quickEntryStyles as s } from './quick-entry-card.css';

export interface QuickEntryPick {
  text: string;
  topic?: string;
  deviceId?: string;
  caseId?: string;
}

type Step = 'root' | 'repair' | 'device' | 'new-device';

const NEW_DEVICE_TOPICS = ['采购报价', '合同与续保', '产品演示', '培训与验收', '其他'];

const DEFAULT_HINT = '您想咨询什么？选一项可更快为您接入对应人员，也可以直接在下方描述问题';

interface QuickEntryCardProps {
  onPick: (pick: QuickEntryPick) => void;
  hint?: string | null;
  onClose?: () => void;
}

export const QuickEntryCard = ({ onPick, hint = DEFAULT_HINT, onClose }: QuickEntryCardProps) => {
  const [step, setStep] = useState<Step>('root');
  const repairs = activeRepairs();

  const cardClass = clsx(s.card, onClose && s.cardWithClose);
  const closeButton = onClose ? (
    <button type="button" className={s.close} aria-label="关闭" onClick={onClose}>
      <Cross className={s.closeIcon} aria-hidden="true" />
    </button>
  ) : null;

  if (step === 'repair') {
    return (
      <div className={cardClass}>
        {closeButton}
        <button type="button" className={s.back} onClick={() => setStep('root')}>
          <ChevronLeft className={s.backIcon} aria-hidden="true" />
          {`选择报修单（${repairs.length}）`}
        </button>
        <div className={s.scrollList}>
          {repairs.map((record) => (
            <EntryRow
              key={record.id}
              title={`报修号：${record.repairId}`}
              desc={`${record.deviceName} · ${record.progress.label}`}
              iconSrc={modalityIconOf(deviceOfRepair(record))}
              onPress={() =>
                onPick({
                  text: `我要咨询报修单 ${record.repairId}`,
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
      <div className={cardClass}>
        {closeButton}
        <button type="button" className={s.back} onClick={() => setStep('root')}>
          <ChevronLeft className={s.backIcon} aria-hidden="true" />
          {`选择设备（${deviceList.length}）`}
        </button>
        <div className={s.scrollList}>
          {deviceList.map((device) => (
            <EntryRow
              key={device.id}
              title={device.customName ?? device.name}
              desc={`${deviceNoOf(device)} · ${device.department} · ${device.location}`}
              iconSrc={getModality(device.type).icon}
              onPress={() =>
                onPick({
                  text: `我要咨询 ${device.name}（${deviceNoOf(device)}）`,
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
      <div className={cardClass}>
        {closeButton}
        <button type="button" className={s.back} onClick={() => setStep('root')}>
          <ChevronLeft className={s.backIcon} aria-hidden="true" />
          选择咨询方向
        </button>
        <div className={s.chips}>
          {NEW_DEVICE_TOPICS.map((topic) => (
            <button
              key={topic}
              type="button"
              className={s.chip}
              onClick={() => onPick({ text: `我想咨询新设备的${topic}`, topic })}
            >
              {topic}
            </button>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className={cardClass}>
      {closeButton}
      {hint && <span className={s.hint}>{hint}</span>}
      <div className={s.list}>
        {repairs.length > 0 && (
          <EntryRow
            title="报修中设备"
            desc={`${repairs.length} 个进行中的报修 · 查进度 · 催单`}
            onPress={() => setStep('repair')}
          />
        )}
        <EntryRow
          title="已有设备"
          desc="合同保养 · 使用问题 · 培训"
          onPress={() => setStep('device')}
        />
        <EntryRow
          title="新设备"
          desc="采购报价 · 合同与续保 · 演示与培训"
          onPress={() => setStep('new-device')}
        />
      </div>
    </div>
  );
};
