import { style } from '@vanilla-extract/css';

export const roleSwitcherStyles = {
  bar: style({
    width: '100%',
    flexShrink: 0,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 0,
    backgroundColor: '#f0f0f0',
    borderBottom: '1px solid #e0e0e0',
    height: 36,
  }),
  btn: style({
    flex: 1,
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 12,
    cursor: 'pointer',
    border: 'none',
    backgroundColor: 'transparent',
    color: '#666',
    fontFamily: 'inherit',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  }),
  btnActive: style({
    backgroundColor: '#0072db',
    color: '#ffffff',
    fontWeight: 600,
  }),
};
