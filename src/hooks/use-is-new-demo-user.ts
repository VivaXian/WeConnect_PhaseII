import { useMigrationStore } from '../stores/migration-store';
import { useRoleStore } from '../stores/role-store';

export const useIsNewDemoUser = (): boolean => {
  const role = useRoleStore((state) => state.role);
  const migrationStatus = useMigrationStore((state) => state.status);
  return role === 'user' && migrationStatus === 'pending';
};
