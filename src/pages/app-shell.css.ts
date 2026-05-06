import { style } from '@vanilla-extract/css';

export const shellStyles = {
  shell: style({
    width: '100%',
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
  }),
  content: style({
    flex: 1,
    overflowY: 'auto',
    overflowX: 'hidden',
    scrollbarWidth: 'none',
    '::-webkit-scrollbar': {
      display: 'none',
    },
  }),
  bottomBar: style({
    flexShrink: 0,
  }),
};
