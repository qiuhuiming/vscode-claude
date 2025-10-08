import * as vscode from 'vscode';
import { UltraThinkProvider } from './provider';
import { TerminalManager } from './terminalManager';

let terminalManager: TerminalManager;

export function activate(context: vscode.ExtensionContext) {
    console.log('UltraThink extension is now active');

    // Initialize terminal manager
    terminalManager = new TerminalManager();

    // Register the tree data provider with terminal manager
    const provider = new UltraThinkProvider(terminalManager);
    const treeView = vscode.window.createTreeView('ultrathinkView', {
        treeDataProvider: provider,
        showCollapseAll: false
    });

    // Register command to create new terminal
    const newTerminalCommand = vscode.commands.registerCommand('ultrathink.newTerminal', () => {
        terminalManager.createTerminal();
    });

    // Register command to show a specific terminal
    const showTerminalCommand = vscode.commands.registerCommand('ultrathink.showTerminal', (terminal: vscode.Terminal) => {
        terminalManager.showTerminal(terminal);
    });

    // Create initial terminal when view is first visible
    treeView.onDidChangeVisibility((e) => {
        if (e.visible && terminalManager.getTerminals().length === 0) {
            terminalManager.createTerminal();
        }
    });

    context.subscriptions.push(treeView, newTerminalCommand, showTerminalCommand);
}

export function deactivate() {
    if (terminalManager) {
        terminalManager.dispose();
    }
}
