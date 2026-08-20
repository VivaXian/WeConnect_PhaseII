import { style } from '@vanilla-extract/css';

export const serviceEntryStyles = {
  card: style({
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
    minWidth: 0,
  }),
  body: style({
    display: 'flex',
    alignItems: 'flex-start',
    gap: 12,
    padding: '12px 16px 8px',
  }),
  icon: style({
    display: 'flex',
    flexShrink: 0,
    alignItems: 'center',
    justifyContent: 'center',
    width: 24,
    height: 24,
  }),
  text: style({
    display: 'flex',
    flexDirection: 'column',
    gap: 2,
    minWidth: 0,
  }),
  actions: style({
    display: 'flex',
    padding: '0 16px 8px 48px',
  }),
};
