import { style } from '@vanilla-extract/css';
import { colorTheme } from '@filament/themes/contracts/color.css';

export const appStyles = {
  overlay: style({
    position: 'fixed',
    inset: 0,
    height: '100dvh',
    display: 'flex',
    justifyContent: 'center',
    overflow: 'hidden',
    overscrollBehavior: 'none',
    background: `linear-gradient(145deg, ${colorTheme.container.background.secondaryColor}, ${colorTheme.container.background.primary} 65%)`,
  }),
  presentation: style({
    width: '100%',
    height: '100%',
    boxSizing: 'border-box',
    display: 'flex',
    flexDirection: 'column',
    padding: 'max(16px, env(safe-area-inset-top)) 16px max(16px, env(safe-area-inset-bottom))',
    gap: 12,
  }),
  stage: style({
    flex: 1,
    minHeight: 0,
    position: 'relative',
  }),
  phoneFrame: style({
    position: 'absolute',
    top: '50%',
    left: '50%',
    width: 391,
    height: 828,
    padding: 8,
    boxSizing: 'border-box',
    borderRadius: 40,
    overflow: 'hidden',
    backgroundColor: colorTheme.foreground.color.primary,
    transform: 'translate(-50%, -50%) scale(var(--demo-phone-scale, 1))',
    boxShadow: `0 16px 48px ${colorTheme.container.background.dimLayer}`,
  }),
  shellWrapper: style({
    width: 375,
    height: 812,
    position: 'relative',
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column',
    transform: 'translateZ(0)',
    borderRadius: 32,
    backgroundColor: colorTheme.container.background.primary,
  }),
};
