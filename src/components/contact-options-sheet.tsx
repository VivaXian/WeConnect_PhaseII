import { Call } from '@filament/react/icons/call';
import { ChevronRight } from '@filament/react/icons/chevron-right';
import { DocumentEdit } from '@filament/react/icons/document-edit';
import { Megaphone } from '@filament/react/icons/megaphone';
import { Text } from '@filament/react/text';
import { sheetStyles } from './upgrade-form-sheet.css';
import { contactOptionsStyles as s } from './contact-options-sheet.css';

export const SERVICE_HOTLINE = '400-810-0038';

interface ContactOptionsSheetProps {
  onCallbackRegister: () => void;
  onComplaint: () => void;
  onClose: () => void;
}

export const ContactOptionsSheet = ({
  onCallbackRegister,
  onComplaint,
  onClose,
}: ContactOptionsSheetProps) => (
  <div className={sheetStyles.overlay} onClick={onClose} role="presentation">
    <div
      className={sheetStyles.panel}
      onClick={(e) => e.stopPropagation()}
      role="dialog"
      aria-modal="true"
      aria-label="其他联系方式"
    >
      <div className={sheetStyles.handle} />
      <div className={sheetStyles.header}>
        <Text variant="heading-s">其他联系方式</Text>
        <button type="button" className={sheetStyles.closeBtn} onClick={onClose} aria-label="关闭">
          ✕
        </button>
      </div>
      <div className={sheetStyles.divider} />

      <div className={s.list}>
        <a className={s.row} href={`tel:${SERVICE_HOTLINE}`}>
          <span className={s.icon}><Call aria-hidden="true" /></span>
          <span className={s.text}>
            <span className={s.title}>拨打服务热线</span>
            <span className={s.desc}>{SERVICE_HOTLINE}</span>
          </span>
          <ChevronRight className={s.chevron} aria-hidden="true" />
        </a>

        <button type="button" className={s.row} onClick={onCallbackRegister}>
          <span className={s.icon}><DocumentEdit aria-hidden="true" /></span>
          <span className={s.text}>
            <span className={s.title}>留下电话，专员回电</span>
            <span className={s.desc}>适合报价、合同、备件等需要专员跟进的事项</span>
          </span>
          <ChevronRight className={s.chevron} aria-hidden="true" />
        </button>

        <button type="button" className={s.row} onClick={onComplaint}>
          <span className={s.icon}><Megaphone aria-hidden="true" /></span>
          <span className={s.text}>
            <span className={s.title}>投诉与建议</span>
            <span className={s.desc}>对服务不满意，或对我们有建议</span>
          </span>
          <ChevronRight className={s.chevron} aria-hidden="true" />
        </button>
      </div>
    </div>
  </div>
);
