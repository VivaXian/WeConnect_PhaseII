import { style } from '@vanilla-extract/css';

export const engineerChatStyles = {
  page: style({
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    backgroundColor: '#f2f4f7',
  }),

  // ── Join view ─────────────────────────────────────────────────────────────
  joinBackdrop: style({
    flex: 1,
    background: 'linear-gradient(160deg, #0047c8 0%, #0161de 55%, #2b7aff 100%)',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    padding: '16px 20px 28px',
  }),

  joinCloseBtn: style({
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    padding: 0,
    alignSelf: 'flex-start',
  }),

  joinCloseBtnText: style({
    color: 'rgba(255,255,255,0.9)',
    fontSize: 14,
  }),

  joinBannerArea: style({
    display: 'flex',
    flexDirection: 'column',
    gap: 6,
  }),

  joinBannerIcon: style({
    width: 52,
    height: 52,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.18)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  }),

  joinBannerTitle: style({
    color: '#ffffff',
    fontSize: 22,
    fontWeight: 700,
  }),

  joinBannerSub: style({
    color: 'rgba(255,255,255,0.7)',
    fontSize: 14,
  }),

  joinPanel: style({
    backgroundColor: '#ffffff',
    borderRadius: '20px 20px 0 0',
    padding: '24px 20px 28px',
    display: 'flex',
    flexDirection: 'column',
    gap: 16,
    flexShrink: 0,
  }),

  joinPanelTitle: style({
    fontSize: 18,
    fontWeight: 700,
    color: '#1a2234',
  }),

  joinPanelSub: style({
    fontSize: 13,
    color: '#667788',
    marginTop: -8,
    lineHeight: 1.5,
  }),

  joinField: style({
    display: 'flex',
    flexDirection: 'column',
    gap: 6,
  }),

  joinLabel: style({
    fontSize: 13,
    fontWeight: 600,
    color: '#333',
  }),

  joinInput: style({
    fontSize: 15,
    border: '1px solid #dde2eb',
    borderRadius: 10,
    padding: '11px 14px',
    outline: 'none',
    fontFamily: 'inherit',
    backgroundColor: '#f8fafc',
    color: '#1a2234',
  }),

  joinSubmitBtn: style({
    backgroundColor: '#0161de',
    color: '#ffffff',
    border: 'none',
    borderRadius: 10,
    padding: '13px',
    fontSize: 15,
    fontWeight: 700,
    cursor: 'pointer',
    fontFamily: 'inherit',
    marginTop: 4,
    ':disabled': {
      opacity: 0.4,
      cursor: 'not-allowed',
    },
  }),

  joinCancelLink: style({
    background: 'none',
    border: 'none',
    fontSize: 14,
    color: '#667788',
    cursor: 'pointer',
    fontFamily: 'inherit',
    textAlign: 'center',
    padding: '4px',
  }),

  // ── Chat view ─────────────────────────────────────────────────────────────
  header: style({
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    padding: '14px 16px',
    backgroundColor: '#0161de',
    flexShrink: 0,
  }),

  backBtn: style({
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    flexShrink: 0,
    padding: 0,
  }),

  headerCenter: style({
    display: 'flex',
    flexDirection: 'column',
    gap: 2,
  }),

  headerTitle: style({
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 600,
  }),

  statusRow: style({
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#0161de',
    padding: '6px 16px 10px',
    flexShrink: 0,
  }),

  onlineDot: style({
    width: 6,
    height: 6,
    borderRadius: '50%',
    backgroundColor: '#4ade80',
    flexShrink: 0,
  }),

  statusText: style({
    color: 'rgba(255,255,255,0.75)',
    fontSize: 11,
  }),

  messages: style({
    flex: 1,
    overflowY: 'auto',
    display: 'flex',
    flexDirection: 'column',
    gap: 12,
    padding: '16px',
  }),

  agentBubbleWrap: style({
    display: 'flex',
    justifyContent: 'flex-start',
  }),

  userBubbleWrap: style({
    display: 'flex',
    justifyContent: 'flex-end',
  }),

  agentBubble: style({
    backgroundColor: '#ffffff',
    borderRadius: '2px 16px 16px 16px',
    padding: '10px 14px',
    fontSize: 14,
    lineHeight: 1.5,
    maxWidth: '80%',
    boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
  }),

  userBubble: style({
    backgroundColor: '#0161de',
    borderRadius: '16px 2px 16px 16px',
    padding: '10px 14px',
    fontSize: 14,
    lineHeight: 1.5,
    maxWidth: '80%',
  }),

  inputArea: style({
    display: 'flex',
    flexDirection: 'row',
    gap: 8,
    padding: '10px 16px',
    backgroundColor: '#ffffff',
    borderTop: '1px solid #edf0f4',
    flexShrink: 0,
  }),

  inputField: style({
    flex: 1,
    fontSize: 14,
    border: '1px solid #e0e4ea',
    borderRadius: 20,
    padding: '8px 14px',
    outline: 'none',
    fontFamily: 'inherit',
    backgroundColor: '#f5f7fa',
  }),

  sendBtn: style({
    flexShrink: 0,
    backgroundColor: '#0161de',
    border: 'none',
    borderRadius: 20,
    padding: '8px 16px',
    fontSize: 14,
    fontWeight: 600,
    cursor: 'pointer',
    fontFamily: 'inherit',
  }),
};
