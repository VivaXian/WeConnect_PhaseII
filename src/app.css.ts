import { style } from '@vanilla-extract/css';

export const appStyles = {
  overlay: style({
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#d4d4d4',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'flex-start',
    overflow: 'hidden',
  }),
  phoneFrame: style({
    width: 375,
    maxWidth: '100vw',
    height: '100%',
    backgroundColor: '#ffffff',
    display: 'flex',
    flexDirection: 'column',
    boxShadow: '0 0 48px rgba(0,0,0,0.22)',
    overflow: 'hidden',
  }),
  shellWrapper: style({
    flex: 1,
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column',
  }),
};
