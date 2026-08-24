import clsx from 'clsx';
import type { HandoffRole } from '../utils/conversation-handoff';
import { RoleAvatar } from './role-avatar';
import { handoffStyles as s } from './handoff-divider.css';

interface HandoffDividerProps {
  role: HandoffRole;
  name?: string;
  isMuted?: boolean;
}

const caption = (role: HandoffRole, name?: string): string => {
  if (role === 'rse') return name ? `服务工程师 ${name} 加入对话` : '服务工程师加入对话';
  return '本次在线沟通已结束';
};

export const HandoffDivider = ({ role, name, isMuted = false }: HandoffDividerProps) => (
  <div className={clsx(s.wrap, isMuted && s.wrapMuted)} role="separator" aria-label={caption(role, name)}>
    <RoleAvatar role={role === 'rse' ? 'engineer' : 'ccc'} size={32} isMuted={isMuted} />
    <span className={s.caption}>{caption(role, name)}</span>
  </div>
);
