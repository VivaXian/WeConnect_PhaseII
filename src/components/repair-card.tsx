import { Button } from '@filament/react/button';
import { Card, CardBody, CardFooter } from '@filament/react/card';
import { CheckmarkCircle } from '@filament/react/icons/checkmark-circle';
import { CrossCircle } from '@filament/react/icons/cross-circle';
import { PersonHeadset } from '@filament/react/icons/person-headset';
import { FlexBox } from '@filament/react/layout';
import { Tag } from '@filament/react/tag';
import { Text } from '@filament/react/text';
import type { RepairRecord } from '../types/repair';
import { repairCardStyles } from './repair-card.css';

const ContractBadge = () => (
  <div className={repairCardStyles.contractBadge} aria-label="白金保服务合同">
    <svg width={24} height={24} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M12 3L14.5 8.5L21 9.5L16.5 14L17.5 21L12 18L6.5 21L7.5 14L3 9.5L9.5 8.5L12 3Z"
        fill="#eb9c00" stroke="#de7510" strokeWidth={1} />
      <rect x="7" y="17" width="10" height="2" rx="1" fill="#de7510" />
      <rect x="7" y="19.5" width="10" height="2" rx="1" fill="#de7510" />
    </svg>
  </div>
);

const ProgressIcon = ({ type }: { type: RepairRecord['progress']['icon'] }) => {
  if (type === 'person-headset') return <PersonHeadset aria-hidden="true" />;
  if (type === 'checkmark-circle') return <CheckmarkCircle aria-hidden="true" />;
  return <CrossCircle aria-hidden="true" />;
};

interface RepairCardProps {
  record: RepairRecord;
  onDevicePress?: (deviceName: string) => void;
  onRepairDetailPress?: (repairId: string) => void;
  onServiceEvalPress?: (repairId: string) => void;
}

export const RepairCard = ({ record, onDevicePress, onRepairDetailPress, onServiceEvalPress }: RepairCardProps) => (
  <Card className={repairCardStyles.card}>
    <CardBody>
      <div className={repairCardStyles.deviceHeader}>
        <ContractBadge />
        <div className={repairCardStyles.deviceInfo}>
          <div className={repairCardStyles.deviceNameRow}>
            <Text variant="body-m" weight="bold" className={repairCardStyles.deviceName} truncationBehavior="ellipsis">
              {record.deviceName}
            </Text>
            {record.serviceTag && (
              <Tag selectionMode="single" isSelected onChange={() => undefined}>
                {record.serviceTag}
              </Tag>
            )}
          </div>
          <div className={repairCardStyles.hospitalRow}>
            <Text variant="body-s" color="secondary" truncationBehavior="ellipsis">
              {record.hospital}{record.department ? ` · ${record.department}` : ''}
            </Text>
          </div>
        </div>
      </div>

      <div className={repairCardStyles.progressSection}>
        <div className={repairCardStyles.progressRow}>
          <ProgressIcon type={record.progress.icon} />
          <div className={repairCardStyles.progressDetails}>
            <Text variant="body-s" color="primary">{record.progress.label}</Text>
            <Text variant="body-s" color="secondary">{record.progress.date}</Text>
          </div>
        </div>
        <div className={repairCardStyles.engineerRow}>
          {record.progress.engineer ? (
            <FlexBox gap={4} alignItems="center">
              <Text variant="body-s" color="primary">{record.progress.engineer.name}</Text>
              <Text variant="body-s" color="secondary">{record.progress.engineer.role}</Text>
            </FlexBox>
          ) : (
            <Text variant="body-s" color="secondary">{record.progress.detail}</Text>
          )}
        </div>
      </div>
    </CardBody>

    <CardFooter>
      <div className={repairCardStyles.buttonRow}>
        {record.buttons.map((label, i) => (
          <Button
            key={label}
            variant={i === record.buttons.length - 1 ? 'primary' : 'secondary'}
            shape="square"
            isFullWidth
            onPress={() => {
              if (label === '设备详情' && onDevicePress) onDevicePress(record.deviceName);
              if (label === '报修详情') onRepairDetailPress?.(record.id);
              if (label === '评价服务') onServiceEvalPress?.(record.id);
            }}
          >
            {label}
          </Button>
        ))}
      </div>
    </CardFooter>
  </Card>
);
