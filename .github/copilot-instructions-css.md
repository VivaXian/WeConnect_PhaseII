---
applyTo: '**/*.css.ts'
---

# Vanilla Extract CSS Rules

**CRITICAL**: CSS files are for **layout only**. Use Filament component props for all visual styling.

## Priority
1. Filament component props FIRST
2. `.css.ts` classes for recurring layouts ONLY
3. Theme tokens LAST (when no Filament component exists)

## Allowed (Layout)
- Layout: `display`, `flex*`, `gap`, `grid*`
- Positioning: `position`, `top/left/right/bottom`, `transform`
- Sizing: `width`, `height`, `max*`, `min*`
- Spacing: `margin` only

## Prohibited (Visual)
❌ Use component props instead:
- Colors: `color`, `backgroundColor`, `border*` 
- **NO hardcoded colors**: `#hex`, `rgb()`, `hsl()`, named colors
- Typography: `fontSize`, `fontWeight`, `fontFamily`
- Effects: `boxShadow`, `borderRadius`, `opacity`
- Padding: Use component props

## Patterns

```typescript
import { style } from '@vanilla-extract/css';

// ✅ Layout only
export const cardContainer = style({
  display: 'grid',
  gridTemplateColumns: 'repeat(3, 1fr)',
  gap: '1rem',
});

// ❌ Visual styling
export const wrongButton = style({
  backgroundColor: '#blue', // ❌
  padding: '12px', // ❌
});

// ✅ Theme tokens (only if no Filament component)
import { colorTheme } from '@filament/themes/contracts/color.css';
export const customBackdrop = style({
  backgroundColor: colorTheme.container.background.dimLayer,
});
```

## File Naming
- Match component: `user-card.css.ts` for `UserCard`
- Import without `.ts`: `import { styles } from './user-card.css'`
- Export descriptive names: `cardStyles`, not `styles`
