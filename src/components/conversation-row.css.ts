import { style } from '@vanilla-extract/css';

export const conversationRowStyles = {
  row: style({
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    width: '100%',
    minWidth: 0,
    padding: '16px',
    border: 'none',
    background: 'none',
    cursor: 'pointer',
    textAlign: 'left',
    selectors: {
      '&:not(:first-of-type)': {
        borderTop: '1px solid #f2f4f6',
      },
    },
  }),
  content: style({
    flex: 1,
    minWidth: 0,
    display: 'flex',
    flexDirection: 'column',
    gap: 6,
  }),
  top: style({
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  }),
  bottom: style({
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 8,
  }),
  title: style({
    flex: 1,
    minWidth: 0,
    fontSize: 15,
    fontWeight: 600,
    color: '#1f2937',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  }),
  titleClosed: style({
    color: '#6a7282',
    fontWeight: 500,
  }),
  time: style({
    fontSize: 12,
    color: '#a6acb5',
    flexShrink: 0,
  }),
  metaRow: style({
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    minWidth: 0,
  }),
  status: style({
    flexShrink: 0,
    padding: '2px 8px',
    borderRadius: 4,
    fontSize: 12,
    lineHeight: 1.4,
  }),
  statusActive: style({
    backgroundColor: '#e8f2fd',
    color: '#0072db',
  }),
  statusWaiting: style({
    backgroundColor: '#fdf1e2',
    color: '#b26a12',
  }),
  meta: style({
    minWidth: 0,
    fontSize: 12,
    color: '#8f959e',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  }),
  summary: style({
    flex: 1,
    minWidth: 0,
    fontSize: 13,
    color: '#6a7282',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  }),
};
