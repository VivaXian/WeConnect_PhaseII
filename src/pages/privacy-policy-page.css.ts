import { style } from '@vanilla-extract/css';

export const privacyPolicyStyles = {
  page: style({
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    background: '#f5f6fa',
  }),
  header: style({
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    padding: '0 16px',
    height: 56,
    background: '#ffffff',
    borderBottom: '1px solid #e5e7eb',
    flexShrink: 0,
  }),
  backBtn: style({
    background: 'none',
    border: 'none',
    fontSize: 24,
    color: '#1a2234',
    cursor: 'pointer',
    padding: '0 4px',
    fontFamily: 'inherit',
    lineHeight: 1,
  }),
  title: style({
    fontSize: 17,
    fontWeight: 600,
    color: '#1a2234',
  }),
  list: style({
    display: 'flex',
    flexDirection: 'column',
    margin: '12px 0',
    background: '#ffffff',
    borderTop: '1px solid #e5e7eb',
    borderBottom: '1px solid #e5e7eb',
  }),
  listItem: style({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '16px',
    background: 'none',
    border: 'none',
    borderBottom: '1px solid #f0f2f5',
    fontSize: 15,
    color: '#1a2234',
    fontFamily: 'inherit',
    cursor: 'pointer',
    selectors: {
      '&:last-child': { borderBottom: 'none' },
    },
  }),
};
