import { style } from '@vanilla-extract/css';

export const conversationPageStyles = {
  page: style({
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    minHeight: 0,
    backgroundColor: '#f5f6f7',
  }),
  emptyState: style({
    padding: 32,
    textAlign: 'center',
  }),
  readOnlyBar: style({
    padding: '8px 16px',
    borderBottom: '1px solid #ececec',
    backgroundColor: '#fbf6e8',
    textAlign: 'center',
  }),
};
