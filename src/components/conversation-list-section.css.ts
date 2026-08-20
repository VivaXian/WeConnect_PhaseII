import { style } from '@vanilla-extract/css';

export const conversationListStyles = {
  section: style({
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: '#fff',
  }),
  header: style({
    display: 'flex',
    alignItems: 'baseline',
    justifyContent: 'space-between',
    padding: '16px 16px 4px',
  }),
  empty: style({
    margin: 0,
    padding: '6px 16px 18px',
    fontSize: 13,
    lineHeight: 1.6,
    color: '#9aa1ac',
  }),
  moreRow: style({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 2,
    padding: '14px 16px 16px',
    background: 'none',
    border: 'none',
    borderTop: '1px solid #f2f4f6',
    fontSize: 13,
    color: '#0072db',
    cursor: 'pointer',
    width: '100%',
  }),
  moreChevron: style({
    width: 14,
    height: 14,
    color: '#0072db',
  }),
};
