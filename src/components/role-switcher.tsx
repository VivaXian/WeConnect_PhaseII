import type { UserRole } from '../stores/role-store';
import { useRoleStore } from '../stores/role-store';
import { useDeviceBindingStore } from '../stores/device-binding-store';
import { useMigrationStore } from '../stores/migration-store';
import { resetDemoData } from '../utils/demo-reset';
import { roleSwitcherStyles } from './role-switcher.css';

const DEMO_MODES: { key: UserRole; label: string }[] = [
  { key: 'user', label: '认证用户' },
  { key: 'admin', label: '授权用户' },
];

export const RoleSwitcher = () => {
  const { role, setRole } = useRoleStore();
  const resetBindings = useDeviceBindingStore((state) => state.resetBindings);
  const clearMigration = useMigrationStore((state) => state.clear);

  const selectMode = (key: UserRole) => {
    setRole(key);
    clearMigration();
    resetBindings();
  };

  return (
    <div className={roleSwitcherStyles.bar}>
      <div className={roleSwitcherStyles.controls} role="group" aria-label="切换角色（演示）">
        <div className={roleSwitcherStyles.segmentedControl}>
          {DEMO_MODES.map(({ key, label }) => (
            <button
              key={key}
              type="button"
              className={roleSwitcherStyles.btn}
              aria-pressed={role === key}
              onClick={() => selectMode(key)}
            >
              {label}
            </button>
          ))}
        </div>
        <button
          type="button"
          className={roleSwitcherStyles.reset}
          onClick={resetDemoData}
          title="清空本地演示数据并重新加载"
        >
          重置演示数据
        </button>
      </div>
    </div>
  );
};
