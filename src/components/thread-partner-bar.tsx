import type { Conversation } from '../types/conversation';
import { lastResponderMessage } from '../utils/conversation-display';
import { RoleAvatar } from './role-avatar';
import { partnerBarStyles as s } from './thread-partner-bar.css';

interface ThreadPartnerBarProps {
  conversation: Conversation;
  isClosed: boolean;
}

export const ThreadPartnerBar = ({ conversation, isClosed }: ThreadPartnerBarProps) => {
  const responder = lastResponderMessage(conversation);
  const isEngineer = responder?.senderRole === 'rse';
  const name = isEngineer
    ? `远程服务工程师 ${responder?.senderName ?? ''}`.trim()
    : '客户响应中心';

  return (
    <div className={s.bar}>
      <RoleAvatar role={isEngineer ? 'engineer' : 'ccc'} size={24} isMuted={isClosed} />
      <span className={s.label}>{isClosed ? '本次对接' : '当前对接'}</span>
      <span className={s.name}>{name}</span>
    </div>
  );
};
