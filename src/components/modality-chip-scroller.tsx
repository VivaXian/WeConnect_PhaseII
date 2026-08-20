import clsx from 'clsx';
import { useCallback, useEffect, useRef, useState } from 'react';
import { chipScrollerStyles } from './modality-chip-scroller.css';

interface ModalityOption {
  key: string;
  label: string;
}

interface ModalityChipScrollerProps {
  options: ModalityOption[];
  activeKey: string;
  onSelect: (key: string) => void;
}

export const ModalityChipScroller = ({ options, activeKey, onSelect }: ModalityChipScrollerProps) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(true);

  const syncEdges = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    const maxScroll = el.scrollWidth - el.clientWidth;
    setAtStart(el.scrollLeft <= 1);
    setAtEnd(maxScroll <= 1 || el.scrollLeft >= maxScroll - 1);
  }, []);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const activeChip = el.querySelector('[data-active="true"]') as HTMLElement | null;
    if (activeChip) {
      el.scrollLeft = activeChip.offsetLeft - (el.clientWidth - activeChip.offsetWidth) / 2;
    }
    syncEdges();
    const observer = new ResizeObserver(syncEdges);
    observer.observe(el);
    return () => observer.disconnect();
  }, [syncEdges]);

  return (
    <div className={chipScrollerStyles.wrap}>
      <div ref={scrollRef} className={chipScrollerStyles.scroll} onScroll={syncEdges}>
        <div className={chipScrollerStyles.group}>
          {options.map((opt) => (
            <button
              key={opt.key}
              type="button"
              data-active={activeKey === opt.key ? 'true' : undefined}
              className={clsx(chipScrollerStyles.chip, activeKey === opt.key && chipScrollerStyles.chipActive)}
              onClick={() => onSelect(activeKey === opt.key ? 'all' : opt.key)}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>
      {!atStart && <div className={chipScrollerStyles.fadeLeft} aria-hidden="true" />}
      {!atEnd && <div className={chipScrollerStyles.fadeRight} aria-hidden="true" />}
    </div>
  );
};
