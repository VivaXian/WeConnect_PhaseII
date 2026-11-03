import { style } from '@vanilla-extract/css';
import { colorTheme } from '@filament/themes/contracts/color.css';

const presentationMedia = 'screen and (min-width: 600px)';

export const roleSwitcherStyles = {
  bar: style({
    width: '100%',
    flexShrink: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f0f0f0',
    borderBottom: '1px solid #e0e0e0',
    height: 36,
    '@media': {
      [presentationMedia]: {
        width: 'auto',
        alignSelf: 'center',
        height: 40,
        backgroundColor: 'transparent',
        border: 'none',
      },
    },
  }),
  controls: style({
    display: 'contents',
    '@media': {
      [presentationMedia]: {
        display: 'flex',
        alignItems: 'center',
        height: '100%',
        gap: 12,
      },
    },
  }),
  segmentedControl: style({
    display: 'contents',
    '@media': {
      [presentationMedia]: {
        display: 'flex',
        height: '100%',
        boxSizing: 'border-box',
        backgroundColor: colorTheme.container.background.primary,
        border: `1px solid ${colorTheme.container.border.color.default}`,
        borderRadius: 12,
        overflow: 'hidden',
      },
    },
  }),
  btn: style({
    flex: 1,
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 12,
    cursor: 'pointer',
    border: 'none',
    backgroundColor: 'transparent',
    color: '#666',
    fontFamily: 'inherit',
    whiteSpace: 'nowrap',
    '@media': {
      [presentationMedia]: {
        flex: 'none',
        minWidth: 100,
        color: colorTheme.foreground.color.secondary,
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
      },
    },
  }),
  btnActive: style({
    backgroundColor: '#0072db',
    color: '#ffffff',
    fontWeight: 600,
  }),
  reset: style({
    flexShrink: 0,
    height: '100%',
    padding: '0 10px',
    display: 'flex',
    alignItems: 'center',
    fontSize: 12,
    cursor: 'pointer',
    border: 'none',
    borderLeft: '1px solid #e0e0e0',
    backgroundColor: 'transparent',
    color: '#8a8a8a',
    fontFamily: 'inherit',
    whiteSpace: 'nowrap',
    '@media': {
      [presentationMedia]: {
        padding: '0 16px',
        boxSizing: 'border-box',
        backgroundColor: colorTheme.container.background.primary,
        border: `1px solid ${colorTheme.container.border.color.default}`,
        borderRadius: 12,
        color: colorTheme.foreground.color.secondary,
        selectors: {
          '&:hover': {
            backgroundColor: colorTheme.element.background.hover,
          },
          '&:focus-visible': {
            outline: `2px solid ${colorTheme.element.focusOutline.color}`,
            outlineOffset: 2,
          },
        },
      },
    },
  }),
};
