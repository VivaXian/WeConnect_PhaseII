import clsx from 'clsx';
import { ChevronRight } from '@filament/react/icons/chevron-right';
import type { CaseRef } from '../types/conversation';
import { findRepairRecord, isRepairStatusClosed } from '../utils/conversation-status';
import { findDeviceByName, getModality } from '../utils/device-modality';
import { caseHeaderStyles as s } from './conversation-case-header.css';
interface ConversationCaseHeaderProps {
  caseRef: CaseRef;
  engineerName?: string;
  onPress: (caseId: string) => void;
  onDevicePress: (deviceName: string) => void;
}

export const ConversationCaseHeader = ({
  caseRef,
  engineerName,
  onPress,
  onDevicePress,
}: ConversationCaseHeaderProps) => {
  const record = findRepairRecord(caseRef.id);
  const device = findDeviceByName(caseRef.deviceName);
  const isClosed = isRepairStatusClosed(record?.status);

  return (
    <div className={s.header}>
      <button
        type="button"
        className={s.row}
        onClick={() => onDevicePress(caseRef.deviceName)}
        aria-label={`${caseRef.deviceName}，查看设备详情`}
      >
        {device && (
          <span className={s.glyph}>
            <img src={getModality(device.type).icon} width={24} height={24} alt="" aria-hidden="true" />
          </span>
        )}
        <span className={s.device}>{caseRef.deviceName}</span>
        <ChevronRight className={s.chevron} aria-hidden="true" />
      </button>

      <button
        type="button"
        className={clsx(s.row, s.caseRow)}
        onClick={() => onPress(caseRef.id)}
        aria-label={`报修 ${caseRef.displayNo}，查看报修详情`}
      >
        <span className={s.meta}>
          {`报修 ${caseRef.displayNo}`}
          {engineerName ? ` · 服务工程师 ${engineerName}` : ''}
        </span>
        {record?.statusTitle && (
          <span className={clsx(s.chip, isClosed && s.chipClosed)}>{record.statusTitle}</span>
        )}
        <ChevronRight className={s.chevron} aria-hidden="true" />
      </button>
    </div>
  );
};
