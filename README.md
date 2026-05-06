<<<<<<< HEAD
# Filament React MCP Starter

> [!NOTE]
> **New to Filament MCP?** Visit [filament.philips.com/mcp](https://filament.philips.com/mcp) for documentation and setup guides.

A pre-configured Filament React starter with Zustand state management, ready for MCP workshops and Model Context Protocol server integration.

## Prerequisites

- **Node.js** (18 or later) - [Node Version Manager (nvm)](https://github.com/nvm-sh/nvm) is highly recommended
- **Corepack** (comes with latest node)
- **Yarn** (latest)
- **VS Code** (recommended - MCP functionality tested in VS Code, no guarantees for other IDEs)
- **GitHub Copilot extension** - [Install from VS Code Marketplace](https://marketplace.visualstudio.com/items?itemName=GitHub.copilot)
- **GitHub Copilot license** - [Request a license](https://portal.internal.philips/create/templates/default/copilot-license-assignment)
- **Philips VPN Connection** (required for installing Filament packages)
- **Filament package access** - [Setup guide](https://react.filament.philips.com/?path=/docs/packages-access--docs)

#### SSL Certificate Setup (only if you see SSL warnings)

If you encounter SSL certificate errors during `yarn install`, use one of these fixes:

**Option 1: Using npm/yarn config (recommended)**

```bash
# For yarn
yarn config set httpsCaFilePath Cisco_Umbrella_Root_CA.cer
```

See the [npm cafile documentation](https://docs.npmjs.com/cli/v8/using-npm/config#cafile) for more details.

**Option 2: Using environment variables**

```bash
# For bash/zsh/fish shells
export NODE_EXTRA_CA_CERTS=ca-root.cer

# For Windows Command Prompt
set NODE_EXTRA_CA_CERTS=ca-root.cer

# For PowerShell
$env:NODE_EXTRA_CA_CERTS = "ca-root.cer"
```

[More info about SSL certificates →](https://philips.service-now.com/itportal?id=kb_article&sysparm_article=KB1506298)

#### Package Manager Setup

1. Make sure you are running corepack: `corepack enable`
2. Install yarn using corepack: `yarn set version stable`
3. Install the dependencies using yarn: `yarn install`

### Getting Started

1. **Clone and Install**

```bash
git clone https://github.com/philips-internal/filament-react-mcp-starter.git
# or use SSH / GH CLI for cloning check https://github.com/philips-internal/filament-react-mcp-starter for details
cd filament-react-mcp-starter
yarn install
```

2. **Start Development Server**

```bash
yarn dev
```

3. **MCP Server Configuration**

The Filament MCP server is **already configured** in this repository (`.vscode/mcp.json`) using the hosted version.

The MCP configuration in `.vscode/mcp.json`:

```json
{
  "servers": {
    "Filament": {
      "type": "http",
      "url": "https://api.filament.rocks/mcp"
    }
  }
}
```

Or use the **MCP: Add Server** command from VS Code Command Palette and select **Workspace Settings**.

## Project Structure

```
src/
├── components/     # Reusable UI components
├── hooks/         # Custom React hooks
├── pages/         # Page-level components
├── stores/        # Zustand stores
├── types/         # TypeScript type definitions
├── utils/         # Utility functions
├── App.tsx        # Main app component
└── main.tsx       # Entry point with Filament theming
```

## Key Technologies

- **Filament React** - Philips Design System components
- **TypeScript** - Type safety and developer experience
- **Vite** - Fast build tool with HMR
- **Zustand** - Lightweight state management
- **Vanilla Extract** - CSS-in-JS styling
- **usehooks-ts** - Collection of useful React hooks
- **React Spring** - Animation library for smooth transitions

## Development Commands

```bash
yarn dev          # Start development server
yarn build        # Build for production
yarn type-check   # Run TypeScript checks
```

## Workshop Ready Features

✅ Pre-configured Filament theming  
✅ Zustand store example  
✅ usehooks-ts integration for advanced hooks  
✅ Organized folder structure  
✅ MCP server integration  
✅ TypeScript strict mode  
✅ Vite hot module replacement  
✅ React Spring animations

## Troubleshooting

- **Package install fails**: Ensure Philips VPN is connected
- **Build errors**: Check that `@filament/vite-plugin` is configured
- **Import errors**: Use specific imports, avoid barrel imports from `@filament/react`