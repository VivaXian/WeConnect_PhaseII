import { Text } from '@filament/react/text';
import type { MonthGroup } from '../types/repair';
import { RepairCard } from './repair-card';
import { repairListStyles } from './repair-list.css';

interface RepairListProps {
  groups: MonthGroup[];
  onDevicePress?: (deviceName: string) => void;
  onRepairDetailPress?: (repairId: string) => void;
  onServiceEvalPress?: (repairId: string) => void;
}

export const RepairList = ({ groups, onDevicePress, onRepairDetailPress, onServiceEvalPress }: RepairListProps) => (
  <div className={repairListStyles.container}>
    {groups.map((group) => (
      <div key={group.month} className={repairListStyles.monthGroup}>
        <div className={repairListStyles.monthTitle}>
          <Text variant="body-s" color="secondary">{group.month}</Text>
        </div>
        <div className={repairListStyles.cardList}>
          {group.records.map((record) => (
            <RepairCard key={record.id} record={record} onDevicePress={onDevicePress} onRepairDetailPress={onRepairDetailPress} onServiceEvalPress={onServiceEvalPress} />
          ))}
        </div>
      </div>
    ))}
  </div>
);
