import * as vscode from 'vscode';
import { UltraThinkProvider } from './provider';
import { TerminalManager } from './terminalManager';

let terminalManager: TerminalManager;

export function activate(context: vscode.ExtensionContext) {
    console.log('🚀 UltraThink extension is now active!');

    try {
        // Initialize terminal manager
        terminalManager = new TerminalManager();
        console.log('✅ Terminal manager initialized');

        // Register the tree data provider with terminal manager
        const provider = new UltraThinkProvider(terminalManager);
        const treeView = vscode.window.createTreeView('ultrathinkView', {
            treeDataProvider: provider,
            showCollapseAll: false
        });
        console.log('✅ Tree view created for ultrathinkView');

        // Register command to create new terminal
        const newTerminalCommand = vscode.commands.registerCommand('ultrathink.newTerminal', () => {
            console.log('📝 Command: ultrathink.newTerminal executed');
            terminalManager.createTerminal();
        });

        // Register command to show a specific terminal
        const showTerminalCommand = vscode.commands.registerCommand('ultrathink.showTerminal', (terminal: vscode.Terminal) => {
            console.log('📝 Command: ultrathink.showTerminal executed for', terminal.name);
            terminalManager.showTerminal(terminal);
        });

        // Register diagnostic command
        const checkStatusCommand = vscode.commands.registerCommand('ultrathink.checkStatus', () => {
            const terminals = terminalManager.getTerminals();
            const statusMessage = `
UltraThink Extension Status:
✅ Extension is active
📊 Active terminals: ${terminals.length}
${terminals.map((t, i) => `  ${i + 1}. ${t.name}`).join('\n')}

Check the Debug Console for detailed logs.
            `.trim();

            vscode.window.showInformationMessage('UltraThink Status - See Output');
            console.log('📊 Status check requested:');
            console.log(statusMessage);

            // Also show in output channel
            const outputChannel = vscode.window.createOutputChannel('UltraThink Status');
            outputChannel.appendLine(statusMessage);
            outputChannel.show();
        });

        console.log('✅ Commands registered');

        // Create initial terminal when view is first visible
        treeView.onDidChangeVisibility((e) => {
            console.log(`👁️  View visibility changed: ${e.visible}`);
            if (e.visible && terminalManager.getTerminals().length === 0) {
                console.log('🔨 Creating initial terminal');
                terminalManager.createTerminal();
            }
        });

        context.subscriptions.push(treeView, newTerminalCommand, showTerminalCommand, checkStatusCommand);

        console.log('✅ UltraThink extension fully activated');
        vscode.window.showInformationMessage('UltraThink extension activated! Click the Claude Code icon in the activity bar.');
    } catch (error) {
        console.error('❌ Error activating UltraThink extension:', error);
        vscode.window.showErrorMessage(`UltraThink activation failed: ${error}`);
    }
}

export function deactivate() {
    console.log('👋 UltraThink extension is deactivating');
    if (terminalManager) {
        terminalManager.dispose();
    }
}
