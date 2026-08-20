import clsx from 'clsx';
import { segmentDividerStyles as s } from './segment-divider.css';

export type SegmentDividerTone = 'default' | 'end';

interface SegmentDividerProps {
  text: string;
  tone?: SegmentDividerTone;
}

export const SegmentDivider = ({ text, tone = 'default' }: SegmentDividerProps) => (
  <div className={s.wrap} role="separator" aria-label={text}>
    <span className={clsx(s.line, tone === 'end' && s.lineEnd)} />
    <span className={clsx(s.text, tone === 'end' && s.textEnd)}>{text}</span>
    <span className={clsx(s.line, tone === 'end' && s.lineEnd)} />
  </div>
);
