import { style } from '@vanilla-extract/css';

export const partnerBarStyles = {
  bar: style({
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    padding: '8px 16px',
    borderBottom: '1px solid #ececec',
    backgroundColor: '#ffffff',
    width: '100%',
  }),
  label: style({
    fontSize: 12,
    color: '#8f959e',
    flexShrink: 0,
  }),
  name: style({
    minWidth: 0,
    fontSize: 13,
    fontWeight: 600,
    color: '#1f2937',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  }),
};
