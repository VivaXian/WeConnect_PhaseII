import { style } from '@vanilla-extract/css';

export const caseConversationsStyles = {
  page: style({
    display: 'flex',
    flexDirection: 'column',
    minHeight: '100%',
    backgroundColor: '#f5f7fa',
  }),
  subHeader: style({
    display: 'flex',
    flexDirection: 'column',
    gap: 4,
    padding: '14px 16px',
  }),
  subHeaderTitle: style({
    fontSize: 13,
    color: '#3b4653',
  }),
  subHeaderMeta: style({
    fontSize: 12,
    color: '#6a7282',
  }),
  card: style({
    backgroundColor: '#ffffff',
    padding: '4px 16px',
  }),
  empty: style({
    margin: 0,
    padding: '40px 16px',
    textAlign: 'center',
    fontSize: 13,
    color: '#9aa1ac',
  }),
};
