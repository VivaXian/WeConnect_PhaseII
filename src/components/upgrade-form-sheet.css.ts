import { style } from '@vanilla-extract/css';

export const sheetStyles = {
  overlay: style({
    position: 'fixed',
    top: 0,
    bottom: 0,
    left: '50%',
    transform: 'translateX(-50%)',
    width: 375,
    maxWidth: '100vw',
    backgroundColor: 'rgba(0,0,0,0.45)',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-end',
    zIndex: 9999,
  }),

  panel: style({
    backgroundColor: '#ffffff',
    borderRadius: '20px 20px 0 0',
    maxHeight: '85%',
    overflowY: 'auto',
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
    flexShrink: 0,
  }),

  handle: style({
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#d4d4d4',
    margin: '12px auto 0',
    flexShrink: 0,
  }),

  header: style({
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '14px 20px 10px',
    flexShrink: 0,
  }),

  closeBtn: style({
    width: 28,
    height: 28,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    border: 'none',
    background: '#efefef',
    borderRadius: '50%',
    cursor: 'pointer',
    fontSize: 14,
    color: '#555',
    fontFamily: 'inherit',
  }),

  divider: style({
    height: 1,
    backgroundColor: '#f0f0f0',
    margin: '0 0 4px',
  }),

  fieldGroup: style({
    padding: '14px 20px 6px',
    display: 'flex',
    flexDirection: 'column',
    gap: 6,
  }),

  fieldLabel: style({
    display: 'block',
    fontSize: 13,
    fontWeight: 600,
    color: '#222',
  }),

  required: style({
    color: '#d0021b',
    marginLeft: 2,
  }),

  optionalTag: style({
    fontSize: 11,
    color: '#888',
    backgroundColor: '#f0f0f0',
    borderRadius: 4,
    padding: '1px 6px',
    marginLeft: 6,
    fontWeight: 400,
  }),

  fieldHint: style({
    fontSize: 12,
    color: '#888',
    display: 'block',
  }),

  checkList: style({
    display: 'flex',
    flexDirection: 'column',
    gap: 6,
    marginTop: 6,
  }),

  checkItem: style({
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    padding: '10px 12px',
    border: '1.5px solid #e0e0e0',
    borderRadius: 10,
    cursor: 'pointer',
    background: '#fff',
    fontFamily: 'inherit',
    fontSize: 14,
    color: '#222',
    textAlign: 'left',
    width: '100%',
    boxSizing: 'border-box',
  }),

  checkItemSelected: style({
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    padding: '10px 12px',
    border: '1.5px solid #0161de',
    borderRadius: 10,
    cursor: 'pointer',
    background: '#eff5ff',
    fontFamily: 'inherit',
    fontSize: 14,
    color: '#0161de',
    textAlign: 'left',
    width: '100%',
    boxSizing: 'border-box',
  }),

  checkbox: style({
    width: 20,
    height: 20,
    border: '2px solid #ccc',
    borderRadius: 4,
    flexShrink: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 12,
    color: 'transparent',
  }),

  checkboxChecked: style({
    width: 20,
    height: 20,
    borderRadius: 4,
    flexShrink: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#0161de',
    border: '2px solid #0161de',
    fontSize: 12,
    color: '#fff',
  }),

  readonlyField: style({
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '10px 12px',
    backgroundColor: '#f6f6f6',
    borderRadius: 10,
    border: '1.5px solid #e8e8e8',
  }),

  readonlyValue: style({
    fontSize: 14,
    color: '#444',
  }),

  readonlyTag: style({
    fontSize: 11,
    color: '#999',
    backgroundColor: '#ebebeb',
    borderRadius: 100,
    padding: '2px 8px',
    flexShrink: 0,
  }),

  textInput: style({
    border: '1.5px solid #e0e0e0',
    borderRadius: 10,
    padding: '10px 12px',
    fontSize: 14,
    fontFamily: 'inherit',
    outline: 'none',
    width: '100%',
    boxSizing: 'border-box',
    color: '#222',
    ':focus': {
      borderColor: '#0161de',
    },
  }),

  footerNote: style({
    margin: '12px 20px 0',
    padding: '10px 12px',
    backgroundColor: '#f0f5ff',
    borderRadius: 8,
    borderLeft: '3px solid #0161de',
  }),

  footerNoteText: style({
    fontSize: 12,
    color: '#4a6fa5',
    lineHeight: '18px',
  }),

  submitArea: style({
    padding: '16px 20px 32px',
    display: 'flex',
    flexDirection: 'column',
  }),
};
