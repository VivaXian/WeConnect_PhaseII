import { useState } from 'react';
import { useShallow } from 'zustand/react/shallow';
import clsx from 'clsx';
import { useRoleStore } from '../stores/role-store';
import { bizConsultStyles } from './biz-consult-sheet.css';

const MOCK_PHONE = '138 **** 8888';
const HOTLINE = '400-810-0038';

type PreferTime = 'morning' | 'afternoon' | 'flexible';

const TIME_OPTIONS: { key: PreferTime; label: string }[] = [
  { key: 'flexible', label: '全天均可' },
  { key: 'morning', label: '上午 9–12时' },
  { key: 'afternoon', label: '下午 13–18时' },
];

interface BizConsultSheetProps {
  onClose: () => void;
  onSubmitted?: () => void;
  defaultDescription?: string;
}

export const BizConsultSheet = ({ onClose, onSubmitted, defaultDescription = '咨询保养服务' }: BizConsultSheetProps) => {
  const { username } = useRoleStore(
    useShallow((s) => ({ username: s.username }))
  );

  const [contactName, setContactName] = useState(username);
  const [jobTitle, setJobTitle] = useState('');
  const [preferTime, setPreferTime] = useState<PreferTime | null>(null);
  const [description, setDescription] = useState(defaultDescription);
  const [submitted, setSubmitted] = useState(false);

  const canSubmit = contactName.trim().length > 0;

  if (submitted) {
    return (
      <div className={bizConsultStyles.overlay} onClick={onClose}>
        <div className={bizConsultStyles.panel} onClick={(e) => e.stopPropagation()}>
          <div className={bizConsultStyles.handle} />
          <div className={bizConsultStyles.successState}>
            <div className={bizConsultStyles.successIcon}>✓</div>
            <span className={bizConsultStyles.successTitle}>登记已提交</span>
            <span className={bizConsultStyles.successDesc}>
              专员将在1个工作日内回电联系您，请保持电话畅通。
            </span>
            <button type="button" className={bizConsultStyles.closePrimary} onClick={onClose}>
              关闭
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={bizConsultStyles.overlay} onClick={onClose}>
      <div className={bizConsultStyles.panel} onClick={(e) => e.stopPropagation()}>
        <div className={bizConsultStyles.handle} />

        <div className={bizConsultStyles.header}>
          <div className={bizConsultStyles.headerTextCol}>
            <span className={bizConsultStyles.title}>商务咨询登记</span>
            <span className={bizConsultStyles.subtitle}>
              提交后专员优先跟进，通常1个工作日内回电
            </span>
          </div>
          <button type="button" className={bizConsultStyles.closeBtn} onClick={onClose}>✕</button>
        </div>

        <div className={bizConsultStyles.body}>
          <div className={bizConsultStyles.fieldRow}>
            <div className={bizConsultStyles.fieldGroup}>
              <label className={bizConsultStyles.label} htmlFor="bc-name">
                联系人 <span className={bizConsultStyles.required}>*</span>
              </label>
              <input
                id="bc-name"
                type="text"
                className={bizConsultStyles.input}
                value={contactName}
                onChange={(e) => setContactName(e.target.value)}
                placeholder="姓名"
              />
            </div>
            <div className={bizConsultStyles.fieldGroup}>
              <label className={bizConsultStyles.label} htmlFor="bc-title">
                职务 <span className={bizConsultStyles.optional}>（选填）</span>
              </label>
              <input
                id="bc-title"
                type="text"
                className={bizConsultStyles.input}
                value={jobTitle}
                onChange={(e) => setJobTitle(e.target.value)}
                placeholder="科室主任等"
              />
            </div>
          </div>

          <div className={bizConsultStyles.fieldGroup}>
            <span className={bizConsultStyles.label}>
              联系电话 <span className={bizConsultStyles.required}>*</span>
            </span>
            <div className={bizConsultStyles.phoneLocked}>
              <span className={bizConsultStyles.phoneLockedValue}>{MOCK_PHONE}</span>
            </div>
          </div>

          <div className={bizConsultStyles.fieldGroup}>
            <span className={bizConsultStyles.label}>
              倾向联系时间 <span className={bizConsultStyles.optional}>（选填）</span>
            </span>
            <div className={bizConsultStyles.timeChips}>
              {TIME_OPTIONS.map((opt) => (
                <button
                  key={opt.key}
                  type="button"
                  className={clsx(
                    bizConsultStyles.timeChip,
                    preferTime === opt.key && bizConsultStyles.timeChipActive,
                  )}
                  onClick={() => setPreferTime(preferTime === opt.key ? null : opt.key)}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          <div className={bizConsultStyles.fieldGroup}>
            <label className={bizConsultStyles.label} htmlFor="bc-desc">
              意图描述 <span className={bizConsultStyles.optional}>（选填）</span>
            </label>
            <textarea
              id="bc-desc"
              className={bizConsultStyles.textarea}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              placeholder="请描述您的需求"
            />
          </div>
        </div>

        <div className={bizConsultStyles.footer}>
          <button
            type="button"
            className={clsx(
              bizConsultStyles.submitBtn,
              !canSubmit && bizConsultStyles.submitBtnDisabled,
            )}
            disabled={!canSubmit}
            onClick={() => { setSubmitted(true); onSubmitted?.(); }}
          >
            提交登记
          </button>

          <div className={bizConsultStyles.dividerRow}>
            <span className={bizConsultStyles.dividerLine} />
            <span className={bizConsultStyles.dividerText}>或</span>
            <span className={bizConsultStyles.dividerLine} />
          </div>

          <div className={bizConsultStyles.callRow}>
            <span className={bizConsultStyles.callNote}>如需立即沟通，也可直接拨打服务热线</span>
            <a className={bizConsultStyles.callLink} href={`tel:${HOTLINE}`}>{HOTLINE}</a>
          </div>
        </div>
      </div>
    </div>
  );
};
