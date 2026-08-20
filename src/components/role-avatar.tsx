import clsx from 'clsx';
import { Avatar } from '@filament/react/avatar';
import { PersonHeadset } from '@filament/react/icons/person-headset';
import philipsAvatar from '../assets/icons/PHILIPS.svg?url';
import { AVATAR_PALETTE } from '../utils/avatar-palette';
import { roleAvatarStyles as s } from './role-avatar.css';

export type AvatarRole = 'engineer' | 'ccc';
export type RoleAvatarSize = 24 | 32 | 40 | 48;

interface RoleAvatarProps {
  role: AvatarRole;
  size: RoleAvatarSize;
  isMuted?: boolean;
}

export const RoleAvatar = ({ role, size, isMuted = false }: RoleAvatarProps) => {
  const key = `${size}` as const;

  if (role === 'ccc') {
    return (
      <img
        className={clsx(s.brand[key], isMuted && s.brandMuted)}
        src={philipsAvatar}
        width={size}
        height={size}
        alt=""
        aria-hidden="true"
      />
    );
  }

  const palette = isMuted ? AVATAR_PALETTE.muted : AVATAR_PALETTE.engineer;

  return (
    <Avatar size={size} backgroundColor={palette.background} color={palette.color}>
      <PersonHeadset className={s.person[key]} aria-hidden="true" />
    </Avatar>
  );
};
