import { style } from '@vanilla-extract/css';

export const contactOptionsStyles = {
  list: style({
    display: 'flex',
    flexDirection: 'column',
    padding: '4px 20px 28px',
  }),
  row: style({
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    width: '100%',
    padding: '14px 0',
    border: 'none',
    background: 'none',
    cursor: 'pointer',
    textAlign: 'left',
    textDecoration: 'none',
    selectors: {
      '& + &': {
        borderTop: '1px solid #eef2f7',
      },
    },
  }),
  icon: style({
    display: 'flex',
    flexShrink: 0,
    alignItems: 'center',
    justifyContent: 'center',
    width: 24,
    height: 24,
    color: '#0072db',
  }),
  text: style({
    flex: 1,
    minWidth: 0,
    display: 'flex',
    flexDirection: 'column',
    gap: 2,
  }),
  title: style({
    fontSize: 14,
    lineHeight: '20px',
    fontWeight: 600,
    color: '#1f2a3d',
  }),
  desc: style({
    fontSize: 12,
    lineHeight: '17px',
    color: '#8a94a6',
  }),
  chevron: style({
    flexShrink: 0,
    color: '#c2c9d4',
  }),
};
