import { style } from '@vanilla-extract/css';

export const segmentHeaderStyles = {
  header: style({
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 4,
    padding: '28px 16px 16px',
  }),
  brand: style({
    display: 'block',
    width: 60,
    height: 60,
    borderRadius: '50%',
  }),
  label: style({
    marginTop: 4,
    fontSize: 15,
    fontWeight: 600,
    color: '#3a4250',
  }),
  date: style({
    fontSize: 12,
    color: '#9aa1ac',
  }),
};
