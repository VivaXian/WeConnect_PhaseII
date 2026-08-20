import clsx from 'clsx';
import type { UserRole } from '../stores/role-store';
import { useRoleStore } from '../stores/role-store';
import { useDeviceBindingStore } from '../stores/device-binding-store';
import { useMigrationStore } from '../stores/migration-store';
import { deviceList } from '../utils/device-data';
import { resetDemoData } from '../utils/demo-reset';
import { roleSwitcherStyles } from './role-switcher.css';

type DemoKey = 'new-user' | 'migrated' | UserRole;

const DEMO_MODES: { key: DemoKey; label: string }[] = [
  { key: 'new-user', label: '新用户' },
  { key: 'migrated', label: '迁移完成' },
  { key: 'user', label: '认证用户' },
  { key: 'admin', label: '授权用户' },
];

export const RoleSwitcher = () => {
  const { role, setRole } = useRoleStore();
  const purgeMany = useDeviceBindingStore((state) => state.purgeMany);
  const resetBindings = useDeviceBindingStore((state) => state.resetBindings);
  const migrationStatus = useMigrationStore((state) => state.status);
  const startPending = useMigrationStore((state) => state.startPending);
  const completeMigration = useMigrationStore((state) => state.complete);
  const clearMigration = useMigrationStore((state) => state.clear);

  const activeKey: DemoKey =
    role === 'admin'
      ? 'admin'
      : migrationStatus === 'pending'
        ? 'new-user'
        : migrationStatus === 'done'
          ? 'migrated'
          : 'user';

  const selectMode = (key: DemoKey) => {
    if (key === 'new-user') {
      setRole('user');
      resetBindings();
      purgeMany(deviceList.map((device) => device.id));
      startPending();
      return;
    }
    if (key === 'migrated') {
      setRole('user');
      resetBindings();
      completeMigration(deviceList.length);
      return;
    }
    setRole(key);
    clearMigration();
    resetBindings();
  };

  return (
    <div className={roleSwitcherStyles.bar} role="group" aria-label="切换角色（演示）">
      {DEMO_MODES.map(({ key, label }) => (
        <button
          key={key}
          className={clsx(
            roleSwitcherStyles.btn,
            activeKey === key && roleSwitcherStyles.btnActive
          )}
          onClick={() => selectMode(key)}
        >
          {label}
        </button>
      ))}
      <button
        className={roleSwitcherStyles.reset}
        onClick={resetDemoData}
        title="清空本地演示数据并重新加载"
      >
        重置数据
      </button>
    </div>
  );
};
