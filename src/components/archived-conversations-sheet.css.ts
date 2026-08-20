import { style } from '@vanilla-extract/css';

export const archivedConversationsStyles = {
  hint: style({
    margin: '4px 20px 8px',
    fontSize: 13,
    lineHeight: '18px',
    color: '#8a94a6',
  }),
  empty: style({
    margin: 0,
    padding: '32px 20px 40px',
    textAlign: 'center',
    fontSize: 13,
    color: '#8a94a6',
  }),
  list: style({
    display: 'flex',
    flexDirection: 'column',
    padding: '0 4px 24px',
    maxHeight: '52vh',
    overflowY: 'auto',
  }),
};
