import clsx from 'clsx';
import { Card } from '@filament/react/card';
import { ChevronRight } from '@filament/react/icons/chevron-right';
import { Text } from '@filament/react/text';
import type { Device } from '../types/device';
import { useDeviceLocationsStore } from '../stores/device-locations-store';
import { deviceCardStyles } from './device-card.css';
import mrIcon from '../assets/icons/MR_core.svg?url';
import ctIcon from '../assets/icons/CT_core.svg?url';
import igtIcon from '../assets/icons/igt_core.svg?url';
import usIcon from '../assets/icons/US_core.svg?url';
import compassIcon from '../assets/icons/Compass_core.svg?url';

type TagItem = { label: string; signal?: 'error' | 'warning' | 'caution' | 'success' | 'information' };

interface DeviceCardProps {
  device: Device;
  onPress?: () => void;
  tags: TagItem[];
  customName?: string;
  showHospital?: boolean;
}

type ModalityKey = 'mr' | 'ct' | 'igt' | 'us' | 'other';

interface Modality {
  key: ModalityKey;
  label: string;
  icon: string;
}

function getModality(type: string): Modality {
  if (type.includes('磁共振')) return { key: 'mr', label: '磁共振', icon: mrIcon };
  if (type.includes('CT') || type.includes('PET')) return { key: 'ct', label: 'CT', icon: ctIcon };
  if (type.includes('血管')) return { key: 'igt', label: '血管机', icon: igtIcon };
  if (type.includes('超声')) return { key: 'us', label: '超声', icon: usIcon };
  return { key: 'other', label: '其他', icon: compassIcon };
}

const BLOCK_CLASS: Record<ModalityKey, string> = {
  mr: deviceCardStyles.iconBlockMr,
  ct: deviceCardStyles.iconBlockCt,
  igt: deviceCardStyles.iconBlockIgt,
  us: deviceCardStyles.iconBlockUs,
  other: deviceCardStyles.iconBlockOther,
};

const LABEL_CLASS: Record<ModalityKey, string> = {
  mr: deviceCardStyles.iconBlockLabelMr,
  ct: deviceCardStyles.iconBlockLabelCt,
  igt: deviceCardStyles.iconBlockLabelIgt,
  us: deviceCardStyles.iconBlockLabelUs,
  other: deviceCardStyles.iconBlockLabelOther,
};

export const DeviceCard = ({ device, onPress, tags, customName, showHospital }: DeviceCardProps) => {
  const locationOverride = useDeviceLocationsStore((state) => state.locations[device.id]);
  const displayDept = locationOverride?.department ?? device.department;
  const displayLocation = locationOverride?.location ?? device.location;
  const modality = getModality(device.type);

  return (
    <Card className={deviceCardStyles.card} onPress={onPress}>
      <div className={deviceCardStyles.inner}>
        <div className={clsx(deviceCardStyles.iconBlock, BLOCK_CLASS[modality.key])}>
          <img src={modality.icon} width={44} height={44} alt="" aria-hidden="true" />
          <span className={clsx(deviceCardStyles.iconBlockLabel, LABEL_CLASS[modality.key])}>
            {modality.label}
          </span>
        </div>

        <div className={deviceCardStyles.content}>
          <Text variant="body-m" weight="bold" className={deviceCardStyles.deviceName}>
            {customName ?? device.name}
          </Text>

          {customName && (
            <Text variant="body-s" className={deviceCardStyles.customNameNote}>
              {device.name}
            </Text>
          )}

          <div className={deviceCardStyles.metaRow}>
            {showHospital && device.campus && (
              <Text variant="body-s" color="secondary" className={deviceCardStyles.metaText}>
                {device.campus}
              </Text>
            )}
            {(displayDept || displayLocation) && (
              <Text variant="body-s" color="secondary" className={deviceCardStyles.metaText}>
                {[displayDept, displayLocation].filter(Boolean).join(' · ')}
              </Text>
            )}
          </div>

          {tags.length > 0 && (
            <div className={deviceCardStyles.tagsRow}>
              {tags.map((tag) => (
                <span
                  key={tag.label}
                  className={clsx(
                    deviceCardStyles.tagChip,
                    tag.signal === 'error' && deviceCardStyles.tagChipError,
                    tag.signal === 'warning' && deviceCardStyles.tagChipWarn,
                    tag.signal === 'caution' && deviceCardStyles.tagChipCaution,
                    tag.signal === 'information' && deviceCardStyles.tagChipInfo,
                    !tag.signal && deviceCardStyles.tagChipNeutral,
                  )}
                >
                  {tag.label}
                </span>
              ))}
            </div>
          )}
        </div>

        <ChevronRight
          aria-hidden="true"
          className={deviceCardStyles.chevron}
          width={16}
          height={16}
        />
      </div>
    </Card>
  );
};
