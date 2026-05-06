import { style } from '@vanilla-extract/css';

export const repairListStyles = {
  container: style({
    display: 'flex',
    flexDirection: 'column',
    gap: 16,
    width: '100%',
    paddingBottom: 32,
  }),
  monthGroup: style({
    display: 'flex',
    flexDirection: 'column',
    gap: 4,
    width: '100%',
  }),
  monthTitle: style({
    width: '100%',
    paddingLeft: 16,
    paddingRight: 16,
  }),
  cardList: style({
    display: 'flex',
    flexDirection: 'column',
    gap: 16,
    paddingLeft: 16,
    paddingRight: 16,
  }),
};
