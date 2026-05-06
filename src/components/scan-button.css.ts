import { style } from '@vanilla-extract/css';

export const scanButtonStyles = {
  section: style({
    padding: 16,
    width: '100%',
  }),
  buttonRow: style({
    display: 'flex',
    flexDirection: 'row',
    gap: 16,
    alignItems: 'center',
    width: '100%',
  }),
  scanCard: style({
    display: 'flex',
    flexDirection: 'row',
    gap: 16,
    alignItems: 'center',
    backgroundColor: '#0072db',
    borderRadius: 16,
    padding: '0 16px',
    height: 88,
    flex: 1,
  }),
  iconContainer: style({
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 14,
    width: 56,
    height: 56,
    flexShrink: 0,
  }),
  textContainer: style({
    display: 'flex',
    flexDirection: 'column',
    gap: 2,
    flex: 1,
  }),
  titleText: style({
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 600,
    lineHeight: '28px',
  }),
  subtitleText: style({
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 14,
    lineHeight: '20px',
  }),
  chevron: style({
    color: '#ffffff',
    flexShrink: 0,
  }),
  manualSection: style({
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    gap: 2,
  }),
  manualPrompt: style({
    color: 'rgba(0, 0, 0, 0.45)',
    fontSize: 12,
    textAlign: 'right',
  }),
  manualLink: style({
    fontSize: 14,
    textAlign: 'center',
    cursor: 'pointer',
  }),
};
