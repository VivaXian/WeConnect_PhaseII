import { style } from '@vanilla-extract/css';
import { BOTTOM_BAR_HEIGHT } from './shared-bottom-bar.css';

const BAR_HEIGHT = 48;

export const unreadToastStyles = {
  /** 浮在 tab bar 上方，不进文档流，底下的页面结构不受影响 */
  layer: style({
    position: 'absolute',
    left: 12,
    right: 12,
    bottom: BOTTOM_BAR_HEIGHT + 8,
    zIndex: 40,
    pointerEvents: 'none',
  }),
  toast: style({
    pointerEvents: 'auto',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    minHeight: BAR_HEIGHT,
    borderRadius: 12,
    backgroundColor: '#fff2d9',
    border: '1px solid #f0b649',
    boxShadow: '0 6px 18px rgba(180, 108, 0, 0.22)',
    overflow: 'hidden',
  }),
  main: style({
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
    minWidth: 0,
    minHeight: BAR_HEIGHT,
    padding: '0 4px 0 10px',
    border: 'none',
    background: 'none',
    textAlign: 'left',
    fontFamily: 'inherit',
    cursor: 'pointer',
  }),
  // 浅底上靠这个饱和的橙圆点做视觉锚点，不靠大面积色块
  iconChip: style({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
    width: 30,
    height: 30,
    borderRadius: '50%',
    backgroundColor: '#f59e0b',
  }),
  icon: style({
    width: 17,
    height: 17,
    color: '#ffffff',
  }),
  text: style({
    flex: 1,
    minWidth: 0,
    fontSize: 14,
    fontWeight: 500,
    color: '#6b4106',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  }),
  divider: style({
    flexShrink: 0,
    width: 1,
    height: 20,
    backgroundColor: 'rgba(107, 65, 6, 0.18)',
  }),
  close: style({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
    width: 44,
    minHeight: BAR_HEIGHT,
    padding: 0,
    border: 'none',
    background: 'none',
    cursor: 'pointer',
  }),
  closeIcon: style({
    width: 16,
    height: 16,
    color: '#9a6a1a',
  }),
};
