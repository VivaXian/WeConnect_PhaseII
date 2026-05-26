import clsx from 'clsx';
import type { UserRole } from '../stores/role-store';
import { useRoleStore } from '../stores/role-store';
import { roleSwitcherStyles } from './role-switcher.css';

const ROLES: { key: UserRole; label: string }[] = [
  { key: 'user', label: '认证用户' },
  { key: 'admin', label: '授权用户' },
];

export const RoleSwitcher = () => {
  const { role, setRole } = useRoleStore();

  return (
    <div className={roleSwitcherStyles.bar} role="group" aria-label="切换角色（演示）">
      {ROLES.map(({ key, label }) => (
        <button
          key={key}
          className={clsx(
            roleSwitcherStyles.btn,
            role === key && roleSwitcherStyles.btnActive
          )}
          onClick={() => setRole(key)}
        >
          {label}
        </button>
      ))}
    </div>
  );
};
