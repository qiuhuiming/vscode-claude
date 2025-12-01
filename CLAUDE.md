# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

UltraThink is a VSCode/Cursor extension that provides an activity bar icon to create and manage terminals that automatically:
- Split to the right side of the editor (ViewColumn.Two)
- Execute the `yolo` command on creation
- Open as tabs in the same right panel when multiple terminals are created

## Architecture

### Core Components

1. **extension.ts** - Extension lifecycle and command registration
   - Activates on startup (`onStartupFinished`)
   - Registers three commands: `ultrathink.newTerminal`, `ultrathink.showTerminal`, `ultrathink.checkStatus`
   - Creates initial terminal when view becomes visible for the first time
   - Manages TerminalManager and UltraThinkProvider instances

2. **terminalManager.ts** - Terminal lifecycle management
   - Maintains array of active terminals and counter for naming
   - Creates terminals with `location: { viewColumn: vscode.ViewColumn.Two }` to force right-side split
   - Automatically sends `yolo` command to each new terminal
   - Listens for terminal close events and updates state
   - Emits `onTerminalsChanged` event when terminals are added/removed

3. **provider.ts** - TreeView data provider for sidebar
   - Implements `vscode.TreeDataProvider<TreeItem>` interface
   - Displays "New Terminal" button with add icon
   - Lists all active terminals below the button
   - Refreshes tree when terminals change via `onTerminalsChanged` event

### Key Technical Details

- **Split view behavior**: All terminals use `vscode.ViewColumn.Two` as a fixed location. The first terminal creates a new split on the right; subsequent terminals become tabs in the same right panel.
- **TreeView registration**: The view is registered as `ultrathinkView` which corresponds to the `contributes.views.ultrathink` array in package.json
- **Activity bar icon**: Defined in package.json as `viewsContainers.activitybar` with ID `ultrathink`, using official Claude logo at `resources/spark-icon.svg`

### Icon System

- **Activity bar icon**: `resources/spark-icon.svg` - Official Claude AI symbol, monochrome (#C5C5C5), 24x24
- **Command icons** (editor title bar):
  - `resources/spark-icon-light.svg` - For light themes (#424242)
  - `resources/spark-icon-dark.svg` - For dark themes (#C5C5C5)
- **TreeView item**: Uses built-in `ThemeIcon('zap')`
- **Icon source**: [Bootstrap Icons - Claude](https://icons.getbootstrap.com/icons/claude/)

**Important**: VSCode/Cursor activity bar and command icons must be:
- Monochrome (single color)
- No background
- 16x16 or 24x24 size

## Development Commands

### Build and compile
```bash
npm install          # Install dependencies
npm run compile      # Compile TypeScript to out/
npm run watch        # Watch mode for development
```

### Linting and testing
```bash
npm run lint         # Run ESLint on src/
npm run pretest      # Compile + lint before tests
```

### Package and install
```bash
./publish.sh         # One-click script that runs vsce package and installs the .vsix file
```

The publish.sh script creates `ultrathink-0.0.1.vsix` and installs it with `code --install-extension` (or `cursor --install-extension`).

### Debug in VSCode
Press F5 to launch Extension Development Host with the extension loaded.

## Extension Configuration

- **Name**: `ultrathink`
- **Display Name**: `UltraThink - Claude Code`
- **Publisher**: `ultrathink`
- **Activation**: `onStartupFinished` (activates automatically when VSCode starts)
- **Entry Point**: `./out/extension.js` (compiled from src/extension.ts)

## Terminal Behavior

When creating a new terminal via `terminalManager.createTerminal()`:
1. Terminal is named `UltraThink ${counter}` with auto-incrementing counter
2. Created with `location: { viewColumn: vscode.ViewColumn.Two, preserveFocus: true }`
3. Command `yolo` is sent via `terminal.sendText('yolo')`
4. Terminal is shown with `terminal.show(true)` to preserve focus
5. Event fired to refresh TreeView

## Notes

- The extension uses Chinese comments in some places (particularly terminalManager.ts) to explain the split view logic
- The project was developed in 4 milestones: basic structure → activity bar + sidebar → terminal integration + yolo command → multi-tab + right split
