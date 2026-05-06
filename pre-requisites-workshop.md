# 🚀 MCP Workshop Setup Guide

Follow these steps to get ready for the MCP workshop.

---

### 1. Join the Philips GitHub Organization

- Go to: [https://portal.internal.philips/create/templates/default/new-github-member](https://portal.internal.philips/create/templates/default/new-github-member)
- 👉 Don’t have a GitHub account yet? [Create one here](https://github.com/join)

---

### 2. Install Node.js

- Open a terminal and run:

  ```bash
  node -v
  ```

- You should see something like: `v22.19.0`
- If you don’t see this, or your version is lower than 18, install the latest **LTS (Long-Term Support)** version here: [Node.js — Download Node.js®](https://nodejs.org/en/download)
- ✅ You can use the installer directly, or install via **nvm** (Node Version Manager) if you want to manage multiple versions.

---

### 3. Set Up Your Editor

- 💻 Install [Visual Studio Code](https://code.visualstudio.com/)
- 🤖 Install the [GitHub Copilot extension](https://marketplace.visualstudio.com/items?itemName=GitHub.copilot)
- 🎫 Request a [GitHub Copilot license](https://portal.internal.philips/create/templates/default/copilot-license-assignment) (choose your business unit, e.g. XD).

  > Without this license, you won’t have access to premium LLM models (like Claude 4), which are required for the MCP server.

---

### 4. Log In to GitHub in VS Code

- In VS Code, click your **profile icon** (bottom-left sidebar).
- Follow the login flow to connect your GitHub account.
- Once logged in, you should see the premium Copilot models in the copilot panel.
- 🔄 You may need to restart VS Code for changes to take effect.

---

### 5. Clone the Starter Project

- Go to: [https://github.com/philips-internal/filament-react-mcp-starter](https://github.com/philips-internal/filament-react-mcp-starter)
- Use the **green button** to clone or download the repo.
- Open the project in VS Code.
- or clone the repo using [VS Code's built-in Git support](https://code.visualstudio.com/docs/sourcecontrol/intro-to-git).

---

### 6. Install Dependencies

- Open the **[integrated terminal](https://code.visualstudio.com/docs/terminal/basics)** in VS Code.

- Run:

  ```bash
  corepack enable
  ```

  > This adds `yarn` (which comes with Node.js).

- Make sure you are connected to the **Philips network** (e.g. via VPN).

- Set up [Filament package access](https://react.filament.philips.com/?path=/docs/packages-access--docs) if you haven't already.

- Then install packages:

  ```bash
  yarn install
  ```

- Finally, start the development server:

  ```bash
  yarn dev
  ```

---

### 7. Preview the App

- The console will show a local URL.
- Click it to open a live preview of the app in your browser. 🎉

---

### ✅ You’re Ready!

You are now set up for the MCP workshop.
If you run into issues, check the workshop **README** for troubleshooting tips.
