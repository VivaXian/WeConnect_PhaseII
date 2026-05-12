import { style } from '@vanilla-extract/css';

export const deviceCardStyles = {
  card: style({
    width: '100%',
    cursor: 'pointer',
  }),
  row: style({
    display: 'flex',
    flexDirection: 'row',
    gap: 12,
    alignItems: 'flex-start',
    width: '100%',
  }),
  iconCircle: style({
    width: 40,
    height: 40,
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
    backgroundColor: 'rgba(0, 114, 219, 0.08)',
  }),
  info: style({
    display: 'flex',
    flexDirection: 'column',
    gap: 3,
    flex: 1,
    minWidth: 0,
  }),
  deviceName: style({
    color: '#00126e',
    fontWeight: 700,
    overflow: 'hidden',
    whiteSpace: 'nowrap',
    textOverflow: 'ellipsis',
  }),
  metaRow: style({
    display: 'flex',
    flexDirection: 'row',
    gap: 6,
    alignItems: 'center',
  }),
  dot: style({
    width: 3,
    height: 3,
    borderRadius: '50%',
    backgroundColor: 'rgba(0,0,0,0.25)',
    flexShrink: 0,
  }),
  tagsRow: style({
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 4,
    marginTop: 4,
  }),
  chevron: style({
    flexShrink: 0,
    color: 'rgba(0,0,0,0.35)',
  }),
  customNameNote: style({
    fontSize: 12,
    color: 'rgba(0,0,0,0.4)',
    overflow: 'hidden',
    whiteSpace: 'nowrap',
    textOverflow: 'ellipsis',
  }),
};
