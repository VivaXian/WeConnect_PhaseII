export interface AvatarPalette {
  background: string;
  color: string;
}

export const AVATAR_PALETTE: Record<'engineer' | 'muted', AvatarPalette> = {
  engineer: { background: '#0072db', color: '#ffffff' },
  muted: { background: '#e6e9ed', color: '#2f343b' },
};
