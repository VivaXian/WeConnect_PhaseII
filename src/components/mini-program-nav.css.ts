import { style } from '@vanilla-extract/css';

export const navStyles = {
  wrap: style({
    backgroundColor: '#0161de',
    flexShrink: 0,
    boxShadow: '0 2px 6px rgba(1,57,130,0.22)',
  }),

  // ── Status bar ───────────────────────────────────────────────────────────
  statusBar: style({
    height: 44,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingLeft: 18,
    paddingRight: 16,
  }),
  time: style({
    color: '#ffffff',
    fontSize: 15,
    fontWeight: 600,
    letterSpacing: 0.3,
    lineHeight: '18px',
  }),
  statusIcons: style({
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  }),

  // ── Navigation bar ────────────────────────────────────────────────────────
  navBar: style({
    height: 48,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 18,
  }),
  navLeft: style({
    width: 100,
    display: 'flex',
    alignItems: 'center',
    paddingLeft: 8,
  }),
  logoWrap: style({
    paddingLeft: 12,
    display: 'flex',
    alignItems: 'center',
  }),
  backBtn: style({
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    padding: '8px 10px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontFamily: 'inherit',
  }),
  navTitle: style({
    flex: 1,
    textAlign: 'center',
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 600,
    opacity: 0.9,
    lineHeight: '24px',
    whiteSpace: 'nowrap',
  }),
  navTitleLeft: style({
    flex: 1,
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 700,
    lineHeight: '24px',
    whiteSpace: 'nowrap',
    paddingLeft: 20,
  }),
  navRight: style({
    width: 100,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingRight: 8,
  }),

  // ── WeChat capsule ────────────────────────────────────────────────────────
  capsule: style({
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.2)',
    borderRadius: 25,
    border: '0.5px solid rgba(255,255,255,0.2)',
    height: 32,
    overflow: 'hidden',
  }),
  capsuleBtn: style({
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: 43,
    height: 32,
    fontFamily: 'inherit',
  }),
  capsuleDivider: style({
    width: 1,
    height: 19,
    backgroundColor: 'rgba(255,255,255,0.2)',
    flexShrink: 0,
  }),
};
