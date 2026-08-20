import { style } from '@vanilla-extract/css';
import { tabsTokens } from '@filament/react/themes/components/tabs';

const itemBase = {
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  gap: 8,
  padding: 4,
  borderRadius: 8,
  background: '#fff',
} as const;

export const workOrderInfoStyles = {
  section: style({
    display: 'flex',
    flexDirection: 'column',
    gap: 8,
    background: '#fff',
    padding: '8px 16px 16px',
  }),
  header: style({
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    minHeight: 40,
  }),
  indicator: style({
    width: tabsTokens.indicator.width,
    height: 24,
    flexShrink: 0,
    borderRadius: `0 ${tabsTokens.indicator.border.radius} ${tabsTokens.indicator.border.radius} 0`,
    background: tabsTokens.indicator.color,
  }),
  headerTitle: style({
    fontSize: 16,
    lineHeight: '24px',
    fontWeight: 700,
    color: tabsTokens.text.color.selected,
  }),
  item: style(itemBase),
  itemButton: style({
    ...itemBase,
    width: '100%',
    border: 'none',
    textAlign: 'left',
    cursor: 'pointer',
  }),
  textContainer: style({
    display: 'flex',
    flexDirection: 'column',
    gap: 8,
    flex: 1,
    minWidth: 0,
  }),
  titleRow: style({
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  }),
  typePill: style({
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
    minWidth: 56,
    height: 18,
    padding: '0 6px',
    borderRadius: 4,
    fontSize: 11,
    lineHeight: '18px',
    color: '#0072db',
    background: '#e8f0fe',
  }),
  metaRows: style({
    display: 'flex',
    flexDirection: 'column',
    gap: 2,
  }),
  metaRow: style({
    display: 'flex',
    flexDirection: 'row',
    gap: 8,
  }),
  action: style({
    flexShrink: 0,
  }),
  chevron: style({
    width: 24,
    height: 24,
    flexShrink: 0,
    color: '#0a0a0a',
  }),
};
