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
  emptyRow: style({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
    width: '100%',
    padding: '14px 16px 18px',
    background: 'none',
    border: 'none',
    textAlign: 'left',
    fontSize: 13,
    color: '#6a7282',
    cursor: 'pointer',
  }),
  emptyChevron: style({
    width: 14,
    height: 14,
    flexShrink: 0,
    color: '#9aa1ac',
  }),
};
