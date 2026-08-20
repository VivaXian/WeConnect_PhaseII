import type { HandoffRole } from '../utils/conversation-handoff';
import { RoleAvatar } from './role-avatar';
import { handoffStyles as s } from './handoff-divider.css';

interface HandoffDividerProps {
  role: HandoffRole;
  name?: string;
}

const caption = (role: HandoffRole, name?: string): string => {
  if (role === 'rse') return name ? `远程服务工程师 ${name} 已接入` : '远程服务工程师已接入';
  return '已转回客户响应中心';
};

export const HandoffDivider = ({ role, name }: HandoffDividerProps) => (
  <div className={s.wrap} role="separator" aria-label={caption(role, name)}>
    <RoleAvatar role={role === 'rse' ? 'engineer' : 'ccc'} size={48} />
    <span className={s.caption}>{caption(role, name)}</span>
  </div>
);
