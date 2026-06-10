import clsx from 'clsx';
import { useState } from 'react';
import type { Device } from '../types/device';
import { MiniProgramNav } from '../components/mini-program-nav';
import { formStyles } from './repair-form-page.css';

interface RepairFormPageProps {
  device: Device;
  onBack: () => void;
  onSubmitSuccess: () => void;
}

type UrgencyLevel = 'high' | 'medium' | 'low';

const URGENCY_OPTIONS: { value: UrgencyLevel; label: string }[] = [
  { value: 'high', label: '停机急修' },
  { value: 'medium', label: '影响使用' },
  { value: 'low', label: '轻微异常' },
];

export const RepairFormPage = ({ device, onBack, onSubmitSuccess }: RepairFormPageProps) => {
  const [description, setDescription] = useState('');
  const [urgency, setUrgency] = useState<UrgencyLevel | null>(null);
  const [contact, setContact] = useState('');
  const [phone, setPhone] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const canSubmit = description.trim().length > 0 && urgency !== null && contact.trim().length > 0 && phone.trim().length > 0;

  const handleSubmit = () => {
    if (!canSubmit || isSubmitting) return;
    setIsSubmitting(true);
    setTimeout(() => {
      onSubmitSuccess();
    }, 800);
  };

  return (
    <div className={formStyles.page}>
      <MiniProgramNav variant="back" title="极速报修" onBack={onBack} />

      <div className={formStyles.deviceBanner}>
        <div className={formStyles.deviceBannerName}>{device.name}</div>
        <div className={formStyles.deviceBannerMeta}>
          {device.department} · {device.location}{device.eqNumber ? ` · EQ ${device.eqNumber}` : ''}
        </div>
      </div>

      <span className={formStyles.sectionLabel}>故障紧急程度</span>
      <div className={formStyles.section}>
        <div className={formStyles.urgencyRow}>
          {URGENCY_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              className={clsx(formStyles.urgencyChip, urgency === opt.value && formStyles.urgencyChipActive)}
              onClick={() => setUrgency(opt.value)}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      <span className={formStyles.sectionLabel}>故障描述</span>
      <div className={formStyles.section}>
        <div className={formStyles.fieldRowLast}>
          <textarea
            className={formStyles.fieldTextarea}
            placeholder="请描述故障现象，如：设备无法开机、图像出现伪影、异响等..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={4}
          />
        </div>
      </div>

      <span className={formStyles.sectionLabel}>联系信息</span>
      <div className={formStyles.section}>
        <div className={formStyles.fieldRow}>
          <span className={formStyles.fieldLabel}>
            联系人<span className={formStyles.fieldRequired}>*</span>
          </span>
          <input
            className={formStyles.fieldInput}
            placeholder="请输入联系人姓名"
            value={contact}
            onChange={(e) => setContact(e.target.value)}
          />
        </div>
        <div className={formStyles.fieldRowLast}>
          <span className={formStyles.fieldLabel}>
            联系电话<span className={formStyles.fieldRequired}>*</span>
          </span>
          <input
            className={formStyles.fieldInput}
            placeholder="请输入手机号"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            inputMode="tel"
          />
        </div>
      </div>

      <div className={formStyles.footer}>
        <button
          className={clsx(formStyles.submitBtn, (!canSubmit || isSubmitting) && formStyles.submitBtnDisabled)}
          onClick={handleSubmit}
          disabled={!canSubmit || isSubmitting}
        >
          {isSubmitting ? '提交中...' : '提交报修'}
        </button>
        <div className={formStyles.disclaimer}>
          提交后，飞利浦服务团队将在 2 小时内响应
        </div>
      </div>
    </div>
  );
};
