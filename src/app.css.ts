import { style } from '@vanilla-extract/css';
import { colorTheme } from '@filament/themes/contracts/color.css';

const presentationMedia = 'screen and (min-width: 600px)';

export const appStyles = {
  overlay: style({
    position: 'fixed',
    inset: 0,
    backgroundColor: '#d4d4d4',
    display: 'flex',
    justifyContent: 'center',
    overflow: 'hidden',
    '@media': {
      [presentationMedia]: {
        background: `linear-gradient(145deg, ${colorTheme.container.background.secondaryColor}, ${colorTheme.container.background.primary} 65%)`,
      },
    },
  }),
  presentation: style({
    width: 375,
    maxWidth: '100vw',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    '@media': {
      [presentationMedia]: {
        width: '100%',
        boxSizing: 'border-box',
        padding: 'max(16px, env(safe-area-inset-top)) 16px max(16px, env(safe-area-inset-bottom))',
        gap: 12,
      },
    },
  }),
  stage: style({
    flex: 1,
    minHeight: 0,
    display: 'flex',
    position: 'relative',
  }),
  phoneFrame: style({
    width: 375,
    maxWidth: '100vw',
    flex: 1,
    minHeight: 0,
    backgroundColor: '#ffffff',
    display: 'flex',
    flexDirection: 'column',
    boxShadow: '0 0 48px rgba(0,0,0,0.22)',
    overflow: 'hidden',
    '@media': {
      [presentationMedia]: {
        position: 'absolute',
        top: '50%',
        left: '50%',
        width: 391,
        height: 828,
        maxWidth: 'none',
        flex: 'none',
        padding: 8,
        boxSizing: 'border-box',
        borderRadius: 40,
        backgroundColor: colorTheme.foreground.color.primary,
        transform: 'translate(-50%, -50%) scale(var(--demo-phone-scale, 1))',
        boxShadow: `0 16px 48px ${colorTheme.container.background.dimLayer}`,
      },
    },
  }),
  shellWrapper: style({
    flex: 1,
    minHeight: 0,
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column',
    '@media': {
      [presentationMedia]: {
        width: 375,
        height: 812,
        flex: 'none',
        position: 'relative',
        transform: 'translateZ(0)',
        borderRadius: 32,
        backgroundColor: colorTheme.container.background.primary,
      },
    },
  }),
};
