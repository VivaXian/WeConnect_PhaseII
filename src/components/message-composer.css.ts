import { style } from '@vanilla-extract/css';

export const composerStyles = {
  composer: style({
    display: 'flex',
    flexDirection: 'column',
    gap: 8,
    padding: '8px 12px 12px',
    borderTop: '1px solid #ececec',
    backgroundColor: '#ffffff',
  }),
  previewRow: style({
    display: 'flex',
    flexDirection: 'row',
    gap: 8,
    overflowX: 'auto',
  }),
  previewItem: style({
    position: 'relative',
    width: 56,
    height: 56,
    flexShrink: 0,
  }),
  previewImage: style({
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    borderRadius: 6,
    display: 'block',
  }),
  previewRemove: style({
    position: 'absolute',
    top: -6,
    right: -6,
    width: 18,
    height: 18,
    borderRadius: '50%',
    border: 'none',
    backgroundColor: '#00000099',
    color: '#ffffff',
    fontSize: 13,
    lineHeight: 1,
    cursor: 'pointer',
    padding: 0,
  }),
  inputRow: style({
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  }),
  fieldWrapper: style({
    flex: 1,
    minWidth: 0,
  }),
  hiddenInput: style({
    display: 'none',
  }),
};
