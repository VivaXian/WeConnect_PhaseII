import clsx from 'clsx';
import { Card } from '@filament/react/card';
import { ChevronRight } from '@filament/react/icons/chevron-right';
import { Text } from '@filament/react/text';
import type { Device } from '../types/device';
import type { ModalityKey } from '../utils/device-modality';
import { getModality } from '../utils/device-modality';
import { useDeviceLocationsStore } from '../stores/device-locations-store';
import { deviceCardStyles } from './device-card.css';

type TagItem = { label: string; signal?: 'error' | 'warning' | 'caution' | 'success' | 'information' };

interface DeviceCardProps {
  device: Device;
  onPress?: () => void;
  tags: TagItem[];
  customName?: string;
  showHospital?: boolean;
  selectable?: boolean;
  isSelected?: boolean;
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

export const DeviceCard = ({
  device,
  onPress,
  tags,
  customName,
  showHospital,
  selectable,
  isSelected,
}: DeviceCardProps) => {
  const locationOverride = useDeviceLocationsStore((state) => state.locations[device.id]);
  const displayDept = locationOverride?.department ?? device.department;
  const displayLocation = locationOverride?.location ?? device.location;
  const modality = getModality(device.type);

  return (
    <Card
      className={clsx(deviceCardStyles.card, selectable && isSelected && deviceCardStyles.cardSelected)}
      onPress={onPress}
    >
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

        {selectable ? (
          <span
            className={clsx(deviceCardStyles.selectMark, isSelected && deviceCardStyles.selectMarkOn)}
            aria-hidden="true"
          >
            {isSelected && (
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                <path d="M2.5 6.2 5 8.7l4.5-5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            )}
          </span>
        ) : (
          <ChevronRight
            aria-hidden="true"
            className={deviceCardStyles.chevron}
            width={16}
            height={16}
          />
        )}
      </div>
    </Card>
  );
};
