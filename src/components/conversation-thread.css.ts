import { style } from '@vanilla-extract/css';

export const threadStyles = {
  thread: style({
    flex: 1,
    overflowY: 'auto',
    display: 'flex',
    flexDirection: 'column',
    gap: 10,
    padding: '16px 16px 8px',
  }),
  receivedBubble: style({
    alignSelf: 'flex-start',
    maxWidth: 'calc(76% + 40px)',
    minWidth: 0,
  }),
  cardRow: style({
    display: 'flex',
    alignSelf: 'stretch',
    minWidth: 0,
  }),
  sentRow: style({
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: 8,
    minWidth: 0,
  }),
  sentBubble: style({
    maxWidth: '76%',
    minWidth: 0,
  }),
  retryButton: style({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
    width: 24,
    height: 24,
    padding: 0,
    border: 'none',
    background: 'none',
    cursor: 'pointer',
  }),
  failIcon: style({
    width: 20,
    height: 20,
    color: '#d5233b',
  }),
  mediaImage: style({
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    display: 'block',
  }),
};
