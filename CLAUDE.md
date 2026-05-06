# CLAUDE.md

## Commands

```bash
yarn dev          # Start dev server (opens browser automatically)
yarn build        # Build for production
yarn type-check   # Run TypeScript type checking
```

## Code Organization Rules

- **File size limit**: Keep files under ~200 lines maximum
- **Separation of concerns**: Split large files into dedicated modules
- **Component composition**: Prefer multiple small components over monolithic ones
- **No inline comments**: Code should be self-documenting through clear naming and structure
- **Modern JavaScript**: Use functional patterns, array methods (map, filter, reduce), avoid for loops and let
- **Import specificity**: Always import from specific files, never use barrel exports
- **File naming**: Use kebab-case for files (`user-profile.tsx`), PascalCase for components (`UserProfile`)

## TSX Component Patterns

### Filament Component Imports
**Critical**: Never use barrel imports from `@filament/react`. Always import from specific sub-paths:

```tsx
// ✅ CORRECT
import { Button } from '@filament/react/button';
import { FlexBox } from '@filament/react/layout';
import { Text } from '@filament/react/text';

// ❌ WRONG - breaks build
import { Button } from '@filament/react';
```

### Styling Philosophy
**NEVER hardcode visual styles**. Follow this hierarchy:

1. **Component props FIRST**: Use Filament component's built-in style props (`variant`, `size`, etc.)
2. **Never inline styles**: No `style={{}}` attributes
3. **Layout in .css.ts**: Only for layout structure (display, flex, grid, positioning)
4. **Use FlexBox**: Prefer `FlexBox` from `@filament/react/layout` over div+CSS

```tsx
// ✅ CORRECT
import { Button } from '@filament/react/button';
import { FlexBox } from '@filament/react/layout';

<FlexBox gap={16} alignItems="center">
  <Button variant="primary" size="large">Action</Button>
</FlexBox>

// ❌ WRONG
<div style={{ display: 'flex', gap: '16px' }}>
  <button style={{ backgroundColor: 'blue' }}>Action</button>
</div>
```

### Filament Specifics
- **Event handlers**: Use `onPress` instead of `onClick` (React Aria pattern)
- **NO emojis**: Use Filament icons from `@filament/react/icons` instead

### Component Structure
```tsx
import { Button } from '@filament/react/button';
import { componentStyles } from './component.css';

export const Component = () => {
  const handleAction = () => {
    // handler logic
  };

  return (
    <div className={componentStyles.container}>
      <Button onPress={handleAction} variant="primary">
        Action
      </Button>
    </div>
  );
};
```

## State Management

**Zustand stores** for application state (`src/stores/`):
```tsx
import { create } from 'zustand';
import { useShallow } from 'zustand/react/shallow';

type StoreState = {
  user: User;
  theme: string;
  isLoading: boolean;
  setUser: (user: User) => void;
};

export const useAppStore = create<StoreState>((set) => ({
  user: null,
  theme: 'light',
  isLoading: false,
  setUser: (user) => set({ user }),
}));

// ✅ CORRECT - Use useShallow for multiple selections
const { user, theme, isLoading } = useAppStore(
  useShallow((state) => ({
    user: state.user,
    theme: state.theme,
    isLoading: state.isLoading,
  }))
);

// ❌ WRONG - Multiple selections without useShallow cause unnecessary re-renders
const user = useAppStore((state) => state.user);
const theme = useAppStore((state) => state.theme);
const isLoading = useAppStore((state) => state.isLoading);
```

**React Context** for cross-cutting concerns like theming (`src/contexts/`):
```tsx
import { createContext, useContext } from 'react';

const Context = createContext<ContextType | undefined>(undefined);

export const useContextHook = () => {
  const context = useContext(Context);
  if (context === undefined) {
    throw new Error('Hook must be used within Provider');
  }
  return context;
};
```

## CSS.ts Styling

**CSS files are for LAYOUT ONLY.** All visual styling comes from component props.

### Allowed (Layout)
- Layout: `display`, `flex*`, `gap`, `grid*`
- Positioning: `position`, `top/left/right/bottom`, `transform`
- Sizing: `width`, `height`, `max*`, `min*`
- Spacing: `margin` only

### Prohibited (Visual)
❌ Use component props instead:
- **NO hardcoded colors**: `#hex`, `rgb()`, `hsl()`, named colors
- **NO typography**: `fontSize`, `fontWeight`, `fontFamily`
- **NO visual effects**: `boxShadow`, `borderRadius`, `opacity`
- **NO padding**: Use component props

### Example

```typescript
import { style } from '@vanilla-extract/css';

// ✅ CORRECT - Layout only
export const cardContainer = style({
  display: 'grid',
  gridTemplateColumns: 'repeat(3, 1fr)',
  gap: '1rem',
});

// ❌ WRONG - Visual styling
export const wrongButton = style({
  backgroundColor: '#blue',  // Use component variant prop
  padding: '12px',           // Use component size prop
});
```

**Import convention**: Import `.css.ts` files without the `.ts` extension:
```tsx
import { cardContainer } from './card.css';
```

### Theme Tokens (Rare)
Only for custom components not in Filament:

```typescript
import { colorTheme } from '@filament/themes/contracts/color.css';

export const customBackdrop = style({
  backgroundColor: colorTheme.container.background.dimLayer,
});
```

### Atomic Styles
```tsx
import { backgroundPrimary, padding } from '@filament/react/atomic-styles';
import clsx from 'clsx';

<div className={clsx(backgroundPrimary, padding[16])} />
```

## Architecture

### Folder Structure
```
src/
├── components/  # Reusable UI (co-located .css.ts files)
├── contexts/    # React contexts (theme, auth, etc.)
├── hooks/       # Custom React hooks
├── pages/       # Page-level components
├── stores/      # Zustand stores
├── types/       # TypeScript type definitions
└── utils/       # Utility functions
```

### Animation
Use `@react-spring/web` for transitions:

```tsx
import { animated, useTransition } from '@react-spring/web';

const transitions = useTransition(items, {
  from: { opacity: 0 },
  enter: { opacity: 1 },
  leave: { opacity: 0 },
});

return transitions((style, item) => (
  <animated.div style={style}>{item}</animated.div>
));
```

## TypeScript

- **No `any` types**: Use `unknown` if type is truly unknown
- **Explicit types**: All function parameters and return values
- **Type-only imports**: Use `import type` syntax
- **Component props**: Must have proper interfaces

```tsx
import type { User } from '../types/user';
import { Button } from '@filament/react/button';

interface UserCardProps {
  user: User;
  onEdit: (id: string) => void;
}

export const UserCard = ({ user, onEdit }: UserCardProps) => (
  <Button onPress={() => onEdit(user.id)}>{user.name}</Button>
);
```

## MCP Integration

MCP server configured in `.vscode/mcp.json` for Filament React documentation. Ask MCP for component APIs, props, and usage examples.
