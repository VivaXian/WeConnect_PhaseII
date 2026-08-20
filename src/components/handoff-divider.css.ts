import { style } from '@vanilla-extract/css';

export const handoffStyles = {
  wrap: style({
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 6,
    margin: '18px 0 10px',
  }),
  caption: style({
    fontSize: 12,
    color: '#6a7282',
  }),
};
