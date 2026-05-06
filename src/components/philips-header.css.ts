import { style } from '@vanilla-extract/css';

export const headerStyles = {
  header: style({
    width: '100%',
    height: 92,
    backgroundColor: '#0161de',
    display: 'flex',
    alignItems: 'center',
    flexShrink: 0,
  }),
  logoContainer: style({
    display: 'flex',
    alignItems: 'center',
    paddingLeft: 20,
    paddingRight: 20,
  }),
  logoIcon: style({
    color: '#ffffff',
    fontSize: 32,
  }),
};
