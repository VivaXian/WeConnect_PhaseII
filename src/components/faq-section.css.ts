import { style } from '@vanilla-extract/css';

export const faqSectionStyles = {
  section: style({
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
    minWidth: 0,
    marginTop: 10,
    backgroundColor: '#fff',
  }),
  header: style({
    display: 'flex',
    alignItems: 'baseline',
    padding: '14px 16px 2px',
  }),
  askRow: style({
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 2,
    width: '100%',
    border: 'none',
    borderTop: '1px solid #f0f2f5',
    background: 'none',
    padding: '12px 0 14px',
    fontSize: 13,
    color: '#6a7282',
    cursor: 'pointer',
  }),
  askChevron: style({
    flexShrink: 0,
    width: 14,
    height: 14,
    color: '#b0b6be',
  }),
};
