---
applyTo: '**'
---

# Copilot Instructions for Filament React MCP Starter

## Project Overview

Philips Filament Design System React project. **Requires Philips VPN** for `@filament` packages from Artifactory.

## Specialized Instructions

For detailed rules, see these specialized instruction files:
- **React/TypeScript**: See `copilot-instructions-react.md` for component patterns, imports, state management
- **CSS Styling**: See `copilot-instructions-css.md` for Vanilla Extract `.css.ts` rules

## Folder Structure

**Code Organization**:

- Split large files (~200 lines max)
- Separate concerns into dedicated files
- Use component composition over monolithic components
- Import directly from specific files, avoid barrel exports
- Write self-documenting code without inline comments

```
src/
├── components/     # Reusable UI components
├── contexts/       # React contexts for shared state
├── hooks/         # Custom React hooks
├── pages/         # Page-level components
├── stores/        # Zustand stores
├── types/         # TypeScript type definitions
├── utils/         # Utility functions
└── main.tsx       # App entry point with Filament setup
```

## Package Management (Yarn 4)

- **VPN required**: Must be connected to Philips VPN for installs
- **Registry**: `.yarnrc.yml` configures `@filament` scopes to Artifactory
- **Node linker**: Uses `node-modules` (not PnP)

## Build System

- **Commands**: `yarn dev`, `yarn build`, `yarn type-check`

## Troubleshooting

- **VPN issues**: Verify `https://artifactory-ehv.ta.philips.com/` accessibility
- **Import errors**: Check exact sub-path imports, never barrel imports
- **Type errors**: Ensure `.css.ts` files export properly
- **Build errors**: Verify `@filament/vite-plugin` in vite config
