import { style } from '@vanilla-extract/css';

export const actionBarStyles = {
  bar: style({
    position: 'sticky',
    bottom: 0,
    marginTop: 'auto',
    display: 'flex',
    flexDirection: 'column',
    padding: '10px 16px 12px',
    backgroundColor: '#fff',
    borderTop: '1px solid #eceef1',
    boxShadow: '0 -4px 14px rgba(15, 23, 42, 0.06)',
  }),
};
