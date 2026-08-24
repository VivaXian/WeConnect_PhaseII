import { style } from '@vanilla-extract/css';

export const faqPageStyles = {
  page: style({
    display: 'flex',
    flexDirection: 'column',
    minHeight: '100%',
    backgroundColor: '#f3f5f7',
  }),
  filterBar: style({
    position: 'sticky',
    top: 0,
    zIndex: 1,
    display: 'flex',
    flexDirection: 'row',
    gap: 8,
    flexShrink: 0,
    padding: '10px 12px',
    overflowX: 'auto',
    backgroundColor: '#ffffff',
    borderBottom: '1px solid #eceef1',
    scrollbarWidth: 'none',
    WebkitOverflowScrolling: 'touch',
    '::-webkit-scrollbar': {
      display: 'none',
    },
  }),
  chip: style({
    flexShrink: 0,
    padding: '5px 14px',
    borderRadius: 16,
    border: '1px solid #dfe3e8',
    background: 'none',
    fontSize: 13,
    lineHeight: '18px',
    color: '#4a5464',
    cursor: 'pointer',
    whiteSpace: 'nowrap',
  }),
  chipActive: style({
    borderColor: '#0072db',
    color: '#0072db',
    fontWeight: 600,
  }),
  list: style({
    display: 'flex',
    flexDirection: 'column',
    marginTop: 10,
    backgroundColor: '#fff',
  }),
  empty: style({
    margin: 0,
    padding: '40px 20px',
    textAlign: 'center',
    fontSize: 13,
    color: '#9aa1ac',
  }),
};
