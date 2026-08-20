import { style } from '@vanilla-extract/css';

export const caseConversationListStyles = {
  list: style({
    display: 'flex',
    flexDirection: 'column',
  }),
  row: style({
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    width: '100%',
    padding: '10px 0',
    border: 'none',
    background: 'none',
    textAlign: 'left',
    cursor: 'pointer',
    selectors: {
      '&:not(:last-child)': {
        borderBottom: '1px solid #f0f0f0',
      },
    },
  }),
  content: style({
    flex: 1,
    minWidth: 0,
    display: 'flex',
    flexDirection: 'column',
    gap: 2,
  }),
  top: style({
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  }),
  title: style({
    fontSize: 13,
    color: '#4a5561',
  }),
  readOnlyTag: style({
    padding: '1px 6px',
    borderRadius: 3,
    backgroundColor: '#f0f1f3',
    fontSize: 11,
    color: '#6a7282',
  }),
  summary: style({
    fontSize: 12,
    color: '#6a7282',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  }),
  chevron: style({
    width: 16,
    height: 16,
    flexShrink: 0,
    color: '#9aa1ac',
  }),
};
