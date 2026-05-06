---
applyTo: '**/*.ts,**/*.tsx'
---

# Filament React Rules

## Styling

- **Use component props for ALL visual styling** - never hardcode styles or use `style={{}}`
- **Layout**: Use `FlexBox` from `@filament/react/layout` instead of div+CSS
- **Recurring layouts**: Create `.css.ts` files, import as `./Component.css` not `./Component.css.ts`

## Imports

**NEVER barrel imports** - import from specific paths only:

```tsx
// ✅ import { Button } from '@filament/react/button';
// ❌ import { Button } from '@filament/react';
```

## TypeScript

- **NO `any` type** - always use specific types
- Use `import type` for type-only imports
- Component props need interfaces

## Naming

- Files: `kebab-case.tsx`
- Components: `PascalCase`

## Filament Specifics

- Use `onPress` not `onClick`
- Theme in `main.tsx`: `clsx(blue, dark, medium, base, backgroundPrimary)` + `Portal`
- **NO emojis** - use Filament icons from `@filament/react/icons` instead

## Zustand State

- Location: `src/stores/use-[name]-store.ts`
- **Use `useShallow`** for multiple selections:

```tsx
import { useShallow } from 'zustand/react/shallow';

// ✅ Multiple selections
const { user, theme } = useAppStore(
  useShallow((state) => ({ user: state.user, theme: state.theme }))
);

// ❌ Causes re-renders
const user = useAppStore((state) => state.user);
const theme = useAppStore((state) => state.theme);
```
