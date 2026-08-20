import { ChevronRight } from '@filament/react/icons/chevron-right';
import type { TransferTarget } from '../types/conversation';
import { modalityForDeviceName } from '../utils/device-modality';
import { transferCardStyles as s } from './transfer-card.css';

interface TransferCardProps {
  target: TransferTarget;
  onPress: (target: TransferTarget) => void;
}

export const TransferCard = ({ target, onPress }: TransferCardProps) => {
  const modality = modalityForDeviceName(target.deviceName);
  return (
    <div className={s.wrap}>
      <span className={s.caption}>本次咨询已转到报修对话</span>
      <button type="button" className={s.card} onClick={() => onPress(target)}>
        <span className={s.icon}>
          <img src={modality.icon} width={30} height={30} alt="" aria-hidden="true" />
        </span>
        <span className={s.body}>
          <span className={s.title}>{target.deviceName}</span>
          <span className={s.meta}>{`${modality.label} · ${target.displayNo}`}</span>
        </span>
        <span className={s.action}>
          查看对话
          <ChevronRight className={s.chevron} aria-hidden="true" />
        </span>
      </button>
    </div>
  );
};
