import clsx from 'clsx';
import { useState } from 'react';
import type { SortBy, SortDir } from '../stores/device-list-filter-store';
import { SORT_OPTIONS } from '../stores/device-list-filter-store';
import { sortControlStyles } from './device-sort-control.css';

interface DeviceSortControlProps {
  sortBy: SortBy;
  sortDir: SortDir;
  onSortByChange: (value: SortBy) => void;
  onToggleDir: () => void;
}

const DIR_LABEL: Record<SortDir, string> = { asc: '升序', desc: '降序' };

export const DeviceSortControl = ({ sortBy, sortDir, onSortByChange, onToggleDir }: DeviceSortControlProps) => {
  const [open, setOpen] = useState(false);
  const activeLabel = SORT_OPTIONS.find((opt) => opt.key === sortBy)?.label ?? '设备名称';

  return (
    <div className={sortControlStyles.wrap}>
      <button
        type="button"
        className={sortControlStyles.dirBtn}
        onClick={onToggleDir}
        aria-label={`当前${DIR_LABEL[sortDir]}，点击切换为${DIR_LABEL[sortDir === 'asc' ? 'desc' : 'asc']}`}
      >
        <svg width="14" height="14" viewBox="0 0 12 12" fill="none" aria-hidden="true">
          <path
            d="M6 1.5v9M6 1.5 3 4.5M6 1.5l3 3"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            transform={sortDir === 'desc' ? 'rotate(180 6 6)' : undefined}
          />
        </svg>
        {DIR_LABEL[sortDir]}
      </button>
      <button
        type="button"
        className={sortControlStyles.labelBtn}
        onClick={() => setOpen((prev) => !prev)}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={`按${activeLabel}排序`}
      >
        <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
          <path d="M2.5 4h11M4.5 8h7M6.5 12h3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
        {activeLabel}
      </button>

      {open && (
        <>
          <div className={sortControlStyles.backdrop} onClick={() => setOpen(false)} />
          <div className={sortControlStyles.dropdown} role="listbox">
            {SORT_OPTIONS.map((opt) => (
              <button
                key={opt.key}
                type="button"
                role="option"
                aria-selected={sortBy === opt.key}
                className={clsx(sortControlStyles.dropdownItem, sortBy === opt.key && sortControlStyles.dropdownItemActive)}
                onClick={() => {
                  onSortByChange(opt.key);
                  setOpen(false);
                }}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
};
