import { dateDividerStyles as s } from './date-divider.css';

export const DateDivider = ({ label }: { label: string }) => (
  <div className={s.wrap} role="separator" aria-label={label}>
    <span className={s.label}>{label}</span>
  </div>
);
