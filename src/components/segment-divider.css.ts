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
  lineEnd: style({
    backgroundColor: '#c9ced6',
  }),
  text: style({
    fontSize: 12,
    color: '#9aa1ac',
    textAlign: 'center',
  }),
  textEnd: style({
    color: '#6a7282',
  }),
};
