import { style } from '@vanilla-extract/css';

const PAGE_BG = '#F0F9FF';

export const chipScrollerStyles = {
  wrap: style({
    position: 'relative',
    flex: 1,
    minWidth: 0,
  }),
  scroll: style({
    overflowX: 'auto',
    scrollbarWidth: 'none',
    WebkitOverflowScrolling: 'touch',
    '::-webkit-scrollbar': {
      display: 'none',
    },
  }),
  group: style({
    display: 'flex',
    flexDirection: 'row',
    gap: 8,
    width: 'max-content',
    paddingRight: 4,
  }),
  chip: style({
    backgroundColor: '#ffffff',
    border: '1px solid #d8e0ea',
    borderRadius: 100,
    color: '#3a4250',
    fontSize: 14,
    paddingLeft: 16,
    paddingRight: 16,
    paddingTop: 9,
    paddingBottom: 9,
    cursor: 'pointer',
    fontFamily: 'inherit',
    flexShrink: 0,
    whiteSpace: 'nowrap',
  }),
  chipActive: style({
    backgroundColor: '#0161de',
    borderColor: '#0161de',
    color: '#ffffff',
    fontWeight: 600,
  }),
  fadeLeft: style({
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    width: 24,
    pointerEvents: 'none',
    background: `linear-gradient(to right, ${PAGE_BG}, rgba(240,249,255,0))`,
  }),
  fadeRight: style({
    position: 'absolute',
    top: 0,
    bottom: 0,
    right: 0,
    width: 10,
    pointerEvents: 'none',
    background: `linear-gradient(to left, ${PAGE_BG}, rgba(240,249,255,0))`,
  }),
};
