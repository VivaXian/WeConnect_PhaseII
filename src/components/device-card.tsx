import { Card, CardBody } from '@filament/react/card';
import { ChevronRight } from '@filament/react/icons/chevron-right';
import { Tag } from '@filament/react/tag';
import { Text } from '@filament/react/text';
import type { Device } from '../types/device';
import { deviceCardStyles } from './device-card.css';

type TagItem = { label: string; signal?: 'error' | 'warning' | 'caution' | 'success' };

interface DeviceCardProps {
  device: Device;
  onPress?: () => void;
  tags: TagItem[];
}

const DeviceTypeIcon = () => (
  <svg width={22} height={22} viewBox="0 0 22 22" fill="none" aria-hidden="true">
    <rect x="1" y="3" width="20" height="15" rx="2" stroke="#0072db" strokeWidth="1.5" fill="none" />
    <line x1="7" y1="18" x2="15" y2="18" stroke="#0072db" strokeWidth="1.5" strokeLinecap="round" />
    <line x1="11" y1="18" x2="11" y2="21" stroke="#0072db" strokeWidth="1.5" strokeLinecap="round" />
    <circle cx="11" cy="10" r="3" stroke="#0072db" strokeWidth="1.5" fill="none" />
  </svg>
);

export const DeviceCard = ({ device, onPress, tags }: DeviceCardProps) => (
  <Card className={deviceCardStyles.card} onPress={onPress}>
    <CardBody>
      <div className={deviceCardStyles.row}>
        <div className={deviceCardStyles.iconCircle}>
          <DeviceTypeIcon />
        </div>

        <div className={deviceCardStyles.info}>
          <Text variant="body-m" weight="bold" className={deviceCardStyles.deviceName}>
            {device.name}
          </Text>

          <Text variant="body-s" color="secondary">{device.type}</Text>

          <div className={deviceCardStyles.metaRow}>
            <Text variant="body-s" color="secondary">{device.department}</Text>
            <div className={deviceCardStyles.dot} />
            <Text variant="body-s" color="secondary">{device.location}</Text>
          </div>

          <div className={deviceCardStyles.tagsRow}>
            {tags.map((tag) => (
              <Tag key={tag.label} signal={tag.signal}>{tag.label}</Tag>
            ))}
          </div>
        </div>

        <ChevronRight
          aria-hidden="true"
          className={deviceCardStyles.chevron}
          width={16}
          height={16}
        />
      </div>
    </CardBody>
  </Card>
);
