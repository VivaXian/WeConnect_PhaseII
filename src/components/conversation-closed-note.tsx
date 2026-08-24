import type { RepairStatus } from '../types/repair';
import { isRepairStatusClosed } from '../utils/conversation-status';
import { closedNoteStyles as s } from './conversation-closed-note.css';

const noteText = (repairStatus?: RepairStatus): string => {
  if (repairStatus === 'cancelled') return '本次报修已取消，如仍需服务请重新报修。';
  if (isRepairStatusClosed(repairStatus)) return '报修服务已完成，沟通结束。';
  return '在线沟通已结束，本次报修仍在处理中。';
};

export const ConversationClosedNote = ({ repairStatus }: { repairStatus?: RepairStatus }) => (
  <div className={s.note}>
    <span className={s.text}>{noteText(repairStatus)}</span>
  </div>
);
