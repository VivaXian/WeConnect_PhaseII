import philipsAvatar from '../assets/icons/PHILIPS.svg?url';
import { segmentHeaderStyles as s } from './segment-header.css';

const formatDate = (iso: string): string => {
  const date = new Date(iso.replace(' ', 'T'));
  if (Number.isNaN(date.getTime())) return '';
  return `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日`;
};

interface SegmentHeaderProps {
  label: string;
  startedAt: string;
}

export const SegmentHeader = ({ label, startedAt }: SegmentHeaderProps) => (
  <div className={s.header}>
    <img className={s.brand} src={philipsAvatar} width={60} height={60} alt="" aria-hidden="true" />
    <span className={s.label}>{label}</span>
    <span className={s.date}>{formatDate(startedAt)}</span>
  </div>
);
