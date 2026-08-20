import { style } from '@vanilla-extract/css';

export const selfServiceStyles = {
  page: style({
    display: 'flex',
    flexDirection: 'column',
    minHeight: '100%',
    backgroundColor: '#f3f5f7',
  }),
  scroll: style({
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    gap: 12,
    paddingBottom: 8,
  }),
  hotline: style({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '18px 16px 20px',
    fontSize: 12,
    color: '#9aa1ac',
    textDecoration: 'none',
  }),
};
