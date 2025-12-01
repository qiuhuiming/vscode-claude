import * as vscode from 'vscode';
import { TerminalManager } from './terminalManager';
import { SessionManager, Session } from './sessionManager';

type TreeItemType = 'new-terminal' | 'session' | 'terminal' | 'separator';

export class UltraThinkProvider implements vscode.TreeDataProvider<UltraThinkTreeItem> {
    private _onDidChangeTreeData: vscode.EventEmitter<UltraThinkTreeItem | undefined | null | void> = new vscode.EventEmitter<UltraThinkTreeItem | undefined | null | void>();
    readonly onDidChangeTreeData: vscode.Event<UltraThinkTreeItem | undefined | null | void> = this._onDidChangeTreeData.event;

    constructor(
        private terminalManager: TerminalManager,
        private sessionManager: SessionManager
    ) {
        // Listen for terminal changes and refresh the tree
        terminalManager.onTerminalsChanged(() => {
            this.refresh();
        });

        // Listen for session changes and refresh the tree
        sessionManager.onSessionsChanged(() => {
            this.refresh();
        });
    }

    refresh(): void {
        this._onDidChangeTreeData.fire();
    }

    getTreeItem(element: UltraThinkTreeItem): vscode.TreeItem {
        return element;
    }

    getChildren(element?: UltraThinkTreeItem): Thenable<UltraThinkTreeItem[]> {
        if (!element) {
            const items: UltraThinkTreeItem[] = [];

            // Add "New Terminal" button at the top
            const newTerminalItem = new UltraThinkTreeItem(
                'New Terminal',
                vscode.TreeItemCollapsibleState.None,
                'new-terminal'
            );
            newTerminalItem.command = {
                command: 'ultrathink.newTerminal',
                title: 'Create New Terminal'
            };
            newTerminalItem.iconPath = new vscode.ThemeIcon('zap');
            items.push(newTerminalItem);

            // Add sessions section
            const sessions = this.sessionManager.getSessions();
            if (sessions.length > 0) {
                // Sessions separator with refresh button
                const sessionsSeparator = new UltraThinkTreeItem(
                    '── Sessions ──',
                    vscode.TreeItemCollapsibleState.None,
                    'separator'
                );
                sessionsSeparator.iconPath = new vscode.ThemeIcon('history');
                sessionsSeparator.contextValue = 'sessionsHeader';
                items.push(sessionsSeparator);

                // Add sessions
                sessions.forEach((session) => {
                    const relativeTime = SessionManager.formatRelativeTime(session.timestamp);
                    const label = `${session.summary}`;
                    const sessionItem = new UltraThinkTreeItem(
                        label,
                        vscode.TreeItemCollapsibleState.None,
                        'session',
                        undefined,
                        session
                    );
                    sessionItem.description = relativeTime;
                    sessionItem.command = {
                        command: 'ultrathink.resumeSession',
                        title: 'Resume Session',
                        arguments: [session.id]
                    };
                    sessionItem.iconPath = new vscode.ThemeIcon('debug-restart');
                    sessionItem.tooltip = `Session: ${session.id}\nSummary: ${session.summary}\nTime: ${session.timestamp.toLocaleString()}`;
                    items.push(sessionItem);
                });
            }

            // Add terminals section
            const terminals = this.terminalManager.getTerminals();
            if (terminals.length > 0) {
                // Terminals separator
                const terminalsSeparator = new UltraThinkTreeItem(
                    '── Terminals ──',
                    vscode.TreeItemCollapsibleState.None,
                    'separator'
                );
                terminalsSeparator.iconPath = new vscode.ThemeIcon('terminal');
                items.push(terminalsSeparator);

                // Add terminals
                terminals.forEach((terminal) => {
                    const terminalItem = new UltraThinkTreeItem(
                        terminal.name,
                        vscode.TreeItemCollapsibleState.None,
                        'terminal',
                        terminal
                    );
                    terminalItem.command = {
                        command: 'ultrathink.showTerminal',
                        title: 'Show Terminal',
                        arguments: [terminal]
                    };
                    terminalItem.iconPath = new vscode.ThemeIcon('terminal-view-icon');
                    items.push(terminalItem);
                });
            }

            return Promise.resolve(items);
        }
        return Promise.resolve([]);
    }
}

class UltraThinkTreeItem extends vscode.TreeItem {
    constructor(
        public readonly label: string,
        public readonly collapsibleState: vscode.TreeItemCollapsibleState,
        public readonly itemType: TreeItemType,
        public readonly terminal?: vscode.Terminal,
        public readonly session?: Session
    ) {
        super(label, collapsibleState);
    }
}
