import { style } from '@vanilla-extract/css';

export const welcomeStyles = {
  card: style({
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 6,
    padding: '18px 16px 20px',
    backgroundColor: '#ffffff',
    border: '1px solid #e3e9f2',
    borderRadius: 12,
  }),
  logo: style({
    width: 44,
    height: 44,
    borderRadius: '50%',
    marginBottom: 2,
  }),
  title: style({
    fontSize: 14,
    fontWeight: 600,
    color: '#15305c',
  }),
  desc: style({
    fontSize: 12,
    lineHeight: 1.6,
    color: '#8f959e',
    textAlign: 'center',
  }),
  pills: style({
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'nowrap',
    justifyContent: 'center',
    gap: 6,
    marginTop: 8,
  }),
  pill: style({
    flexShrink: 0,
    padding: '6px 10px',
    borderRadius: 14,
    border: '1px solid #cfe2fa',
    backgroundColor: '#f2f8ff',
    fontFamily: 'inherit',
    fontSize: 12,
    whiteSpace: 'nowrap',
    color: '#0059b3',
    cursor: 'pointer',
  }),
};
