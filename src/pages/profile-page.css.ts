import { globalStyle, style } from '@vanilla-extract/css';
import { listItemInner } from '@filament/react/list-styles';

export const profileStyles = {
  // ── Page shell ────────────────────────────────────────────────────────────
  page: style({
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
    minHeight: '100%',
    overflowX: 'hidden',
    paddingBottom: 32,
    backgroundColor: '#f2f4f7',
  }),

  // ── Hero ──────────────────────────────────────────────────────────────────
  hero: style({
    backgroundColor: '#0161de',
    padding: '36px 16px 28px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 10,
    color: '#ffffff',
  }),
  heroName: style({
    display: 'block',
    textAlign: 'center',
    marginTop: 2,
    color: '#ffffff',
  }),
  roleRow: style({
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flexWrap: 'wrap',
    justifyContent: 'center',
  }),
  roleTagAdmin: style({
    backgroundColor: 'rgba(255,255,255,0.2)',
    color: '#ffffff',
    fontSize: 12,
    fontWeight: 600,
    borderRadius: 100,
    paddingLeft: 10,
    paddingRight: 10,
    paddingTop: 3,
    paddingBottom: 3,
    border: '1px solid rgba(255,255,255,0.4)',
  }),
  roleTagUser: style({
    backgroundColor: 'rgba(255,255,255,0.15)',
    color: 'rgba(255,255,255,0.9)',
    fontSize: 12,
    fontWeight: 500,
    borderRadius: 100,
    paddingLeft: 10,
    paddingRight: 10,
    paddingTop: 3,
    paddingBottom: 3,
    border: '1px solid rgba(255,255,255,0.3)',
  }),
  permissionTag: style({
    display: 'inline-flex',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(255,255,255,0.15)',
    color: 'rgba(255,255,255,0.85)',
    fontSize: 11,
    paddingLeft: 8,
    paddingRight: 8,
    paddingTop: 3,
    paddingBottom: 3,
    borderRadius: 100,
    border: '1px solid rgba(255,255,255,0.25)',
  }),
  permissionDotSmall: style({
    width: 5,
    height: 5,
    borderRadius: '50%',
    backgroundColor: '#4ade80',
    flexShrink: 0,
  }),

  // ── Section Card wrapper ───────────────────────────────────────────────────
  sectionCard: style({
    margin: '16px 16px 0',
    width: 'calc(100% - 32px)',
  }),

  // ── Messages preview ──────────────────────────────────────────────────────
  sectionHeaderRow: style({
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    padding: '14px 16px 8px',
    gap: 8,
  }),
  sectionLink: style({
    fontSize: 13,
    color: '#0161de',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    padding: 0,
    marginLeft: 'auto',
    fontFamily: 'inherit',
  }),
  msgRow: style({
    display: 'flex',
    flexDirection: 'column',
    padding: '10px 16px',
    cursor: 'pointer',
    background: 'none',
    border: 'none',
    textAlign: 'left',
    width: '100%',
    fontFamily: 'inherit',
    boxSizing: 'border-box',
  }),
  msgRowBordered: style({
    borderTop: '1px solid #f0f0f0',
  }),
  msgRowTop: style({
    display: 'flex',
    alignItems: 'center',
    gap: 6,
    marginBottom: 3,
  }),
  msgUnreadDot: style({
    width: 7,
    height: 7,
    borderRadius: '50%',
    backgroundColor: '#0161de',
    flexShrink: 0,
  }),
  msgTitle: style({
    flex: 1,
    fontSize: 13,
    fontWeight: 500,
    color: '#111',
    overflow: 'hidden',
    whiteSpace: 'nowrap',
    textOverflow: 'ellipsis',
  }),
  msgTime: style({
    fontSize: 12,
    color: '#aaa',
    flexShrink: 0,
    marginLeft: 4,
  }),
  msgBody: style({
    fontSize: 12,
    color: '#888',
    overflow: 'hidden',
    whiteSpace: 'nowrap',
    textOverflow: 'ellipsis',
    paddingLeft: 13,
  }),
  msgEmpty: style({
    padding: '12px 16px 16px',
    textAlign: 'center',
    borderTop: '1px solid #f0f0f0',
  }),

  // ── Quick tools grid ──────────────────────────────────────────────────────
  toolSectionTitle: style({
    padding: '12px 16px 2px',
    display: 'block',
  }),
  toolGrid: style({
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: 10,
    padding: '8px 16px 14px',
  }),
  toolItem: style({
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    padding: '14px 8px',
    backgroundColor: '#f0f4ff',
    borderRadius: 12,
    cursor: 'pointer',
    border: 'none',
    fontFamily: 'inherit',
  }),
  toolIconWrap: style({
    width: 44,
    height: 44,
    borderRadius: '50%',
    backgroundColor: '#e0eaff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  }),
  toolLabel: style({
    fontSize: 12,
    fontWeight: 600,
    color: '#333',
    textAlign: 'center',
    lineHeight: '16px',
  }),
  toolSub: style({
    fontSize: 11,
    color: '#888',
    textAlign: 'center',
    lineHeight: '14px',
  }),

  // ── Account & permission list (label left, value right) ───────────────────
  infoList: style({}),
  infoValueBold: style({
    fontWeight: 600,
    color: '#0072db',
  }),

  // ── Upgrade section ───────────────────────────────────────────────────────
  upgradeContent: style({
    display: 'flex',
    flexDirection: 'column',
    gap: 12,
  }),
  upgradeStatusPending: style({
    display: 'flex',
    flexDirection: 'column',
    gap: 4,
  }),
  upgradeSubmitDate: style({
    fontSize: 12,
    color: '#aaa',
  }),
  upgradeNote: style({
    fontSize: 12,
    color: '#0072db',
    borderLeft: '3px solid #b3d4ff',
    paddingLeft: 8,
    marginTop: 2,
  }),

  // ── Logout button ─────────────────────────────────────────────────────────
  logoutBtn: style({
    width: '100%',
    padding: '14px 16px',
    textAlign: 'left',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    fontFamily: 'inherit',
    display: 'block',
  }),
};

// Make info list items flex with label on left, value on right
globalStyle(`${profileStyles.infoList} ${listItemInner}`, {
  display: 'flex',
  width: '100%',
  justifyContent: 'space-between',
  alignItems: 'center',
});
