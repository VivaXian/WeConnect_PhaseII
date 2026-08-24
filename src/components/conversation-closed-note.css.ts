import { style } from '@vanilla-extract/css';

export const closedNoteStyles = {
  note: style({
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 10,
    flexShrink: 0,
    padding: '12px 16px 16px',
    borderTop: '1px solid #ececec',
    backgroundColor: '#ffffff',
  }),
  text: style({
    fontSize: 13,
    lineHeight: '20px',
    color: '#6a7282',
    textAlign: 'center',
  }),
};
