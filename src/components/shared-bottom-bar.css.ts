import { globalStyle, style } from '@vanilla-extract/css';

const bar = style({
  flexShrink: 0,
});

const iconSlot = style({
  boxSizing: 'border-box',
  display: 'flex',
  flexShrink: 0,
  alignItems: 'center',
  justifyContent: 'center',
  width: '1.5rem',
  height: '1.5rem',
});

globalStyle(`${bar} [role="tablist"]`, {
  overflow: 'visible',
});

globalStyle(`${bar} [role="tab"] output`, {
  transform: 'translate(75%, 0)',
});

export const BOTTOM_BAR_HEIGHT = 58;

export const bottomBarStyles = {
  bar,
  iconSlot,
};
