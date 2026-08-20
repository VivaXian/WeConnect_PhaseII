import { style, styleVariants } from '@vanilla-extract/css';

const centered = {
  display: 'block',
  flexShrink: 0,
} as const;

export const roleAvatarStyles = {
  person: styleVariants({
    '24': { ...centered, width: 14, height: 14 },
    '32': { ...centered, width: 18, height: 18 },
    '40': { ...centered, width: 22, height: 22 },
    '48': { ...centered, width: 26, height: 26 },
  }),
  brand: styleVariants({
    '24': { ...centered, width: 24, height: 24, borderRadius: '50%' },
    '32': { ...centered, width: 32, height: 32, borderRadius: '50%' },
    '40': { ...centered, width: 40, height: 40, borderRadius: '50%' },
    '48': { ...centered, width: 48, height: 48, borderRadius: '50%' },
  }),
  brandMuted: style({
    filter: 'grayscale(1)',
    opacity: 0.55,
  }),
};
