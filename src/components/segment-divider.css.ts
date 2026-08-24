import { style } from '@vanilla-extract/css';

export const segmentDividerStyles = {
  wrap: style({
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    width: '100%',
    padding: '16px 0 10px',
  }),
  line: style({
    flex: 1,
    height: 1,
    backgroundColor: '#e1e5ea',
  }),
  text: style({
    fontSize: 12,
    color: '#9aa1ac',
    textAlign: 'center',
  }),
  endWrap: style({
    display: 'flex',
    justifyContent: 'center',
    width: '100%',
    padding: '14px 0 6px',
  }),
  endChip: style({
    padding: '4px 12px',
    borderRadius: 12,
    backgroundColor: '#e2e6eb',
    fontSize: 12,
    lineHeight: '18px',
    color: '#4a5058',
  }),
};
