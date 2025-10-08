# UltraThink - Claude Code Extension

A simple VSCode extension that provides quick access to terminals running the `yolo` command.

## Features

*   **Activity Bar Icon**: Click the Claude Code icon in the activity bar to open the UltraThink sidebar
*   **Auto-run Command**: Each terminal automatically executes the `yolo` command on creation
*   **Multi-tab Support**: Create and manage multiple terminal tabs
*   **Terminal List**: View all active terminals in the sidebar
*   **Quick Access**: Click on any terminal in the list to focus it

## Usage

1.  Click the Claude Code icon in the activity bar (left sidebar)
2.  The UltraThink view will open, showing a "New Terminal" button
3.  When you first open the view, a terminal will be created automatically
4.  Click "New Terminal" to create additional terminal tabs
5.  Click on any terminal name in the list to switch to that terminal

## Development

### Prerequisites

*   Node.js and npm
*   VSCode

### Installation

```
npm install
```

### Compilation

```
npm run compile
```

### Running the Extension

1.  Open this folder in VSCode
2.  Press `F5` to open a new VSCode window with the extension loaded
3.  Click the Claude Code icon in the activity bar

### Watch Mode

```
npm run watch
```

## Git Commits

This extension was developed in 4 milestones, each with its own commit:

1.  Initial VSCode extension structure
2.  Add activity bar and sidebar view
3.  Integrate terminal functionality with auto-run 'yolo' command
4.  Implement multi-tab terminal support