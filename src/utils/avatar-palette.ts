export interface AvatarPalette {
  background: string;
  color: string;
}

export const AVATAR_PALETTE: Record<'engineer' | 'muted', AvatarPalette> = {
  engineer: { background: '#0072db', color: '#ffffff' },
  muted: { background: '#eef0f3', color: '#a6acb5' },
};
