import { style } from '@vanilla-extract/css';

export const dateDividerStyles = {
  wrap: style({
    display: 'flex',
    justifyContent: 'center',
    width: '100%',
    padding: 0,
  }),
  label: style({
    fontSize: 12,
    lineHeight: '18px',
    color: '#9aa1ac',
  }),
};
