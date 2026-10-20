import { style } from '@vanilla-extract/css';

export const selfServiceStyles = {
  page: style({
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    minHeight: 0,
    backgroundColor: '#f5f6f7',
  }),
  pickerPanel: style({
    flexShrink: 0,
    padding: '0 12px 8px',
  }),
};
