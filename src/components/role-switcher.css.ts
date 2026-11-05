import { style } from '@vanilla-extract/css';
import { colorTheme } from '@filament/themes/contracts/color.css';

export const roleSwitcherStyles = {
  bar: style({
    flexShrink: 0,
    alignSelf: 'center',
    height: 40,
    display: 'flex',
    alignItems: 'center',
  }),
  controls: style({
    display: 'flex',
    alignItems: 'center',
    height: '100%',
    gap: 12,
  }),
  segmentedControl: style({
    display: 'flex',
    height: '100%',
    boxSizing: 'border-box',
    backgroundColor: colorTheme.container.background.primary,
    border: `1px solid ${colorTheme.container.border.color.default}`,
    borderRadius: 12,
    overflow: 'hidden',
  }),
  btn: style({
    minWidth: 84,
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 12,
    cursor: 'pointer',
    border: 'none',
    backgroundColor: 'transparent',
    color: colorTheme.foreground.color.secondary,
    fontFamily: 'inherit',
    whiteSpace: 'nowrap',
    selectors: {
      '&[aria-pressed="true"]': {
        backgroundColor: colorTheme.element.background.primary.default,
        color: colorTheme.foreground.color.onPrimary,
      },
      '&:focus-visible': {
        outline: `2px solid ${colorTheme.element.focusOutline.color}`,
        outlineOffset: -3,
      },
    },
  }),
  reset: style({
    flexShrink: 0,
    height: '100%',
    padding: '0 16px',
    boxSizing: 'border-box',
    display: 'flex',
    alignItems: 'center',
    fontSize: 12,
    cursor: 'pointer',
    backgroundColor: colorTheme.container.background.primary,
    border: `1px solid ${colorTheme.container.border.color.default}`,
    borderRadius: 12,
    color: colorTheme.foreground.color.secondary,
    fontFamily: 'inherit',
    whiteSpace: 'nowrap',
    selectors: {
      '&:hover': { backgroundColor: colorTheme.element.background.hover },
      '&:focus-visible': {
        outline: `2px solid ${colorTheme.element.focusOutline.color}`,
        outlineOffset: 2,
      },
    },
  }),
};
