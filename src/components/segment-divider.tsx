import clsx from 'clsx';
import { segmentDividerStyles as s } from './segment-divider.css';

export type SegmentDividerTone = 'default' | 'end';

interface SegmentDividerProps {
  text: string;
  tone?: SegmentDividerTone;
}

export const SegmentDivider = ({ text, tone = 'default' }: SegmentDividerProps) => {
  if (tone === 'end') {
    return (
      <div className={s.endWrap} role="separator" aria-label={text}>
        <span className={s.endChip}>{text}</span>
      </div>
    );
  }

  return (
    <div className={s.wrap} role="separator" aria-label={text}>
      <span className={clsx(s.line)} />
      <span className={clsx(s.text)}>{text}</span>
      <span className={clsx(s.line)} />
    </div>
  );
};
