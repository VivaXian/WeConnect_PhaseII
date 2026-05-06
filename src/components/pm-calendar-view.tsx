import clsx from 'clsx';
import type { Device } from '../types/device';
import { calendarStyles } from './pm-calendar-view.css';

const WEEKDAY_LABELS = ['一', '二', '三', '四', '五', '六', '日'];

export interface PmCalendarViewProps {
  devices: Device[];
  year: number;
  month: number; // 1-12
  onMonthChange: (year: number, month: number) => void;
  selectedDate: string | null;
  onDateSelect: (date: string | null) => void;
}

interface CalendarCell {
  day: number | null;
  dateStr: string | null;
  pmDevices: Device[];
}

function buildCalendarCells(devices: Device[], year: number, month: number): CalendarCell[] {
  // Monday-first grid: (getDay() + 6) % 7 → Mon=0, …, Sun=6
  const firstDayOfWeek = (new Date(year, month - 1, 1).getDay() + 6) % 7;
  const daysInMonth = new Date(year, month, 0).getDate();

  const byDate = new Map<string, Device[]>();
  devices.forEach((d) => {
    if (!d.pmNextDate) return;
    const [y, m] = d.pmNextDate.split('-').map(Number);
    if (y === year && m === month) {
      const list = byDate.get(d.pmNextDate) ?? [];
      list.push(d);
      byDate.set(d.pmNextDate, list);
    }
  });

  const cells: CalendarCell[] = Array.from({ length: firstDayOfWeek }, () => ({
    day: null,
    dateStr: null,
    pmDevices: [],
  }));

  for (let day = 1; day <= daysInMonth; day++) {
    const dateStr = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    cells.push({ day, dateStr, pmDevices: byDate.get(dateStr) ?? [] });
  }

  while (cells.length % 7 !== 0) {
    cells.push({ day: null, dateStr: null, pmDevices: [] });
  }
  return cells;
}

const runtimeToday = new Date();
const runtimeTodayStr = `${runtimeToday.getFullYear()}-${String(runtimeToday.getMonth() + 1).padStart(2, '0')}-${String(runtimeToday.getDate()).padStart(2, '0')}`;

function formatDateLabel(dateStr: string, count: number): string {
  const [, m, d] = dateStr.split('-');
  return `${parseInt(m, 10)}月${parseInt(d, 10)}日 · ${count} 台设备保养`;
}

export const PmCalendarView = ({
  devices,
  year,
  month,
  onMonthChange,
  selectedDate,
  onDateSelect,
}: PmCalendarViewProps) => {
  const cells = buildCalendarCells(devices, year, month);
  const weeks: CalendarCell[][] = [];
  for (let i = 0; i < cells.length; i += 7) weeks.push(cells.slice(i, i + 7));

  const prevMonth = () =>
    month === 1 ? onMonthChange(year - 1, 12) : onMonthChange(year, month - 1);
  const nextMonth = () =>
    month === 12 ? onMonthChange(year + 1, 1) : onMonthChange(year, month + 1);

  const selectedDevices = selectedDate
    ? devices.filter((d) => d.pmNextDate === selectedDate)
    : [];

  const monthHasPm = cells.some((c) => c.pmDevices.length > 0);

  return (
    <div className={calendarStyles.wrapper}>
      <div className={calendarStyles.header}>
        <button className={calendarStyles.navBtn} onClick={prevMonth}>
          ‹
        </button>
        <span className={calendarStyles.monthTitle}>{year}年{month}月 PM计划</span>
        <button className={calendarStyles.navBtn} onClick={nextMonth}>
          ›
        </button>
      </div>

      <div className={calendarStyles.grid}>
        {WEEKDAY_LABELS.map((label) => (
          <div key={label} className={calendarStyles.weekLabel}>
            {label}
          </div>
        ))}

        {cells.map((cell, idx) => {
          const isToday = cell.dateStr === runtimeTodayStr;
          const isSelected = cell.dateStr !== null && cell.dateStr === selectedDate;
          const hasPm = cell.pmDevices.length > 0;

          return (
            <div
              key={idx}
              className={clsx(
                calendarStyles.dayCell,
                isToday && !isSelected && calendarStyles.dayCellToday,
                hasPm && !isSelected && calendarStyles.dayCellHasPm,
                isSelected && calendarStyles.dayCellSelected,
              )}
              onClick={() => {
                if (!cell.dateStr || !hasPm) return;
                onDateSelect(isSelected ? null : cell.dateStr);
              }}
            >
              {cell.day !== null && (
                <>
                  <span
                    className={clsx(
                      calendarStyles.dayNum,
                      isToday && !isSelected && calendarStyles.dayNumToday,
                      isSelected && calendarStyles.dayNumSelected,
                    )}
                  >
                    {cell.day}
                  </span>
                  {hasPm && (
                    <span
                      className={clsx(
                        calendarStyles.pmDot,
                        isSelected && calendarStyles.pmDotSelected,
                      )}
                    />
                  )}
                </>
              )}
            </div>
          );
        })}
      </div>

      {selectedDate && selectedDevices.length > 0 && (
        <div className={calendarStyles.summary}>
          <div className={calendarStyles.summaryTitle}>
            {formatDateLabel(selectedDate, selectedDevices.length)}
          </div>
          {selectedDevices.map((d) => (
            <div key={d.id} className={calendarStyles.summaryRow}>
              <span className={calendarStyles.summaryDot} />
              <span className={calendarStyles.summaryName}>{d.name}</span>
              <span className={calendarStyles.summaryDept}>{d.department}</span>
            </div>
          ))}
        </div>
      )}

      {!monthHasPm && (
        <div className={calendarStyles.noEvents}>本月暂无保养计划</div>
      )}
    </div>
  );
};
