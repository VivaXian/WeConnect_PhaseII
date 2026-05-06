import { style } from '@vanilla-extract/css';

export const userDeviceStyles = {
  page: style({
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
    minHeight: '100%',
    overflowX: 'hidden',
  }),
  topBar: style({
    backgroundColor: '#0161de',
    padding: '12px 16px 16px',
    flexShrink: 0,
  }),
  topBarTitle: style({
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 600,
    lineHeight: '26px',
  }),
  topBarSub: style({
    color: 'rgba(255,255,255,0.75)',
    fontSize: 13,
    lineHeight: '20px',
    marginTop: 2,
  }),
  searchRow: style({
    padding: '12px 16px 0',
  }),
  section: style({
    padding: '16px 16px 0',
    display: 'flex',
    flexDirection: 'column',
    gap: 10,
  }),
  sectionTitle: style({
    fontSize: 13,
    fontWeight: 600,
    color: '#666',
    letterSpacing: '0.02em',
    textTransform: 'uppercase',
    paddingBottom: 4,
  }),
  list: style({
    display: 'flex',
    flexDirection: 'column',
    gap: 10,
  }),
  emptyState: style({
    padding: '32px 0',
    textAlign: 'center',
  }),
};
