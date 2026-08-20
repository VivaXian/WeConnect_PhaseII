import { style } from '@vanilla-extract/css';

export const conversationHistoryStyles = {
  page: style({
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    overflowY: 'auto',
  }),
  hint: style({
    margin: 0,
    padding: '14px 16px 10px',
    fontSize: 12,
    lineHeight: 1.6,
    color: '#6a7282',
  }),
  list: style({
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: '#fff',
  }),
  empty: style({
    margin: 0,
    padding: '40px 16px',
    textAlign: 'center',
    fontSize: 13,
    color: '#9aa1ac',
  }),
};
