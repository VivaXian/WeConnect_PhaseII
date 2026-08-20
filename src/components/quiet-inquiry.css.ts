import { style } from '@vanilla-extract/css';

export const quietInquiryStyles = {
  button: style({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    width: '100%',
    flexShrink: 0,
    padding: '14px 16px 4px',
    border: 'none',
    background: 'none',
    fontFamily: 'inherit',
    fontSize: 12,
    lineHeight: '18px',
    color: '#6a7282',
    cursor: 'pointer',
  }),
  action: style({
    color: '#0072db',
  }),
};
