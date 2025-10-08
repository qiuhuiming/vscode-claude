import * as vscode from 'vscode';
import { TerminalManager } from './terminalManager';

export class UltraThinkProvider implements vscode.TreeDataProvider<TreeItem> {
    private _onDidChangeTreeData: vscode.EventEmitter<TreeItem | undefined | null | void> = new vscode.EventEmitter<TreeItem | undefined | null | void>();
    readonly onDidChangeTreeData: vscode.Event<TreeItem | undefined | null | void> = this._onDidChangeTreeData.event;

    constructor(private terminalManager: TerminalManager) {
        // Listen for terminal changes and refresh the tree
        terminalManager.onTerminalsChanged(() => {
            this.refresh();
        });
    }

    refresh(): void {
        this._onDidChangeTreeData.fire();
    }

    getTreeItem(element: TreeItem): vscode.TreeItem {
        return element;
    }

    getChildren(element?: TreeItem): Thenable<TreeItem[]> {
        if (!element) {
            const items: TreeItem[] = [];

            // Add "New Terminal" button at the top
            const newTerminalItem = new TreeItem('New Terminal', vscode.TreeItemCollapsibleState.None);
            newTerminalItem.command = {
                command: 'ultrathink.newTerminal',
                title: 'Create New Terminal'
            };
            newTerminalItem.iconPath = new vscode.ThemeIcon('add');
            items.push(newTerminalItem);

            // Add list of active terminals
            const terminals = this.terminalManager.getTerminals();
            terminals.forEach((terminal) => {
                const terminalItem = new TreeItem(terminal.name, vscode.TreeItemCollapsibleState.None, terminal);
                terminalItem.command = {
                    command: 'ultrathink.showTerminal',
                    title: 'Show Terminal',
                    arguments: [terminal]
                };
                terminalItem.iconPath = new vscode.ThemeIcon('terminal');
                items.push(terminalItem);
            });

            return Promise.resolve(items);
        }
        return Promise.resolve([]);
    }
}

class TreeItem extends vscode.TreeItem {
    constructor(
        public readonly label: string,
        public readonly collapsibleState: vscode.TreeItemCollapsibleState,
        public readonly terminal?: vscode.Terminal
    ) {
        super(label, collapsibleState);
    }
}
