import { ChevronRight } from '@filament/react/icons/chevron-right';
import type { Device } from '../types/device';
import type { RepairRecord } from '../types/repair';
import { deviceList } from '../utils/device-data';
import { getModality } from '../utils/device-modality';
import { quickEntryStyles as s } from './quick-entry-card.css';

interface EntryRowProps {
  title: string;
  desc: string;
  iconSrc?: string;
  onPress: () => void;
}

export const EntryRow = ({ title, desc, iconSrc, onPress }: EntryRowProps) => (
  <button type="button" className={s.optionRow} onClick={onPress}>
    {iconSrc && (
      <span className={s.glyph}>
        <img src={iconSrc} width={24} height={24} alt="" aria-hidden="true" />
      </span>
    )}
    <span className={s.optionText}>
      <span className={s.optionTitle}>{title}</span>
      <span className={s.optionDesc}>{desc}</span>
    </span>
    <ChevronRight className={s.chevron} aria-hidden="true" />
  </button>
);

export const deviceOfRepair = (record: RepairRecord): Device | undefined =>
  deviceList.find((device) => device.name === record.deviceName);

export const modalityIconOf = (device: Device | undefined): string | undefined =>
  device ? getModality(device.type).icon : undefined;

export const deviceNoOf = (device: Device): string =>
  device.eqNumber ? `EQ ${device.eqNumber}` : `SN ${device.serialNumber}`;
