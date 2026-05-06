import { style } from '@vanilla-extract/css';

export const repairCardStyles = {
  card: style({
    width: '100%',
  }),
  deviceHeader: style({
    display: 'flex',
    flexDirection: 'row',
    gap: 8,
    alignItems: 'flex-start',
    width: '100%',
  }),
  contractBadge: style({
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    width: 24,
    height: 24,
    paddingTop: 4,
    flexShrink: 0,
  }),
  deviceInfo: style({
    display: 'flex',
    flexDirection: 'column',
    gap: 2,
    flex: 1,
  }),
  deviceNameRow: style({
    display: 'flex',
    flexDirection: 'row',
    gap: 2,
    alignItems: 'center',
    flex: 1,
  }),
  deviceName: style({
    color: '#00126e',
    fontWeight: 700,
    flex: 1,
  }),
  hospitalRow: style({
    overflow: 'hidden',
    whiteSpace: 'nowrap',
    textOverflow: 'ellipsis',
  }),
  progressSection: style({
    display: 'flex',
    flexDirection: 'column',
    gap: 12,
    width: '100%',
  }),
  progressRow: style({
    display: 'flex',
    flexDirection: 'row',
    gap: 8,
    alignItems: 'flex-start',
    width: '100%',
  }),
  progressDetails: style({
    display: 'flex',
    flexDirection: 'column',
    gap: 2,
    flex: 1,
    minWidth: 0,
  }),
  engineerRow: style({
    display: 'flex',
    flexDirection: 'row',
    gap: 4,
    alignItems: 'center',
    paddingLeft: 32,
    flex: 1,
    height: 32,
  }),
  buttonRow: style({
    display: 'flex',
    flexDirection: 'row',
    gap: 16,
    width: '100%',
  }),
};
