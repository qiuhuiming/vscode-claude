import * as vscode from 'vscode';
import { UltraThinkProvider } from './provider';
import { TerminalManager } from './terminalManager';
import { SessionManager } from './sessionManager';

let terminalManager: TerminalManager;
let sessionManager: SessionManager;

export function activate(context: vscode.ExtensionContext) {
    console.log('🚀 UltraThink extension is now active!');

    try {
        // Initialize terminal manager
        terminalManager = new TerminalManager();
        console.log('✅ Terminal manager initialized');

        // Initialize session manager
        sessionManager = new SessionManager();
        console.log('✅ Session manager initialized');

        // Register the tree data provider with terminal manager and session manager
        const provider = new UltraThinkProvider(terminalManager, sessionManager);
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

        // Register command to resume a session
        const resumeSessionCommand = vscode.commands.registerCommand('ultrathink.resumeSession', (sessionId: string) => {
            console.log('📝 Command: ultrathink.resumeSession executed for', sessionId);
            sessionManager.resumeSession(sessionId);
        });

        // Register command to refresh sessions
        const refreshSessionsCommand = vscode.commands.registerCommand('ultrathink.refreshSessions', () => {
            console.log('📝 Command: ultrathink.refreshSessions executed');
            sessionManager.refreshSessions();
        });

        // Register diagnostic command
        const checkStatusCommand = vscode.commands.registerCommand('ultrathink.checkStatus', () => {
            const terminals = terminalManager.getTerminals();
            const sessions = sessionManager.getSessions();
            const statusMessage = `
UltraThink Extension Status:
✅ Extension is active
📊 Active terminals: ${terminals.length}
${terminals.map((t, i) => `  ${i + 1}. ${t.name}`).join('\n')}
📋 Sessions: ${sessions.length}
${sessions.map((s, i) => `  ${i + 1}. ${s.summary}`).join('\n')}

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

        // Refresh sessions when view becomes visible
        treeView.onDidChangeVisibility((e) => {
            console.log(`👁️  View visibility changed: ${e.visible}`);
            if (e.visible) {
                // Refresh sessions when view becomes visible
                sessionManager.refreshSessions();
            }
        });

        // Initial session load
        sessionManager.refreshSessions();

        context.subscriptions.push(
            treeView,
            newTerminalCommand,
            showTerminalCommand,
            resumeSessionCommand,
            refreshSessionsCommand,
            checkStatusCommand
        );

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
    if (sessionManager) {
        sessionManager.dispose();
    }
}
