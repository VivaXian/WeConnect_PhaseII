import { style } from '@vanilla-extract/css';

export const confirmDialogStyles = {
  overlay: style({
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.45)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '0 40px',
    zIndex: 1500,
  }),
  card: style({
    width: '100%',
    maxWidth: 300,
    backgroundColor: '#ffffff',
    borderRadius: 14,
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column',
  }),
  body: style({
    padding: '24px 20px 20px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 8,
  }),
  title: style({
    fontSize: 16,
    fontWeight: 600,
    color: '#1a1a1a',
    textAlign: 'center',
  }),
  message: style({
    fontSize: 13,
    lineHeight: '20px',
    color: '#6a7180',
    textAlign: 'center',
    whiteSpace: 'pre-line',
  }),
  actions: style({
    display: 'flex',
    flexDirection: 'row',
    borderTop: '1px solid #ececec',
  }),
  btn: style({
    flex: 1,
    padding: '13px 0',
    textAlign: 'center',
    fontSize: 16,
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    fontFamily: 'inherit',
  }),
  btnCancel: style({
    color: '#666',
    borderRight: '1px solid #ececec',
  }),
  btnConfirm: style({
    color: '#0161de',
    fontWeight: 600,
  }),
  btnDanger: style({
    color: '#d92d20',
    fontWeight: 600,
  }),
};
