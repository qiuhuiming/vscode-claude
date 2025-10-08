import * as vscode from 'vscode';

export class UltraThinkProvider implements vscode.TreeDataProvider<TreeItem> {
    private _onDidChangeTreeData: vscode.EventEmitter<TreeItem | undefined | null | void> = new vscode.EventEmitter<TreeItem | undefined | null | void>();
    readonly onDidChangeTreeData: vscode.Event<TreeItem | undefined | null | void> = this._onDidChangeTreeData.event;

    refresh(): void {
        this._onDidChangeTreeData.fire();
    }

    getTreeItem(element: TreeItem): vscode.TreeItem {
        return element;
    }

    getChildren(element?: TreeItem): Thenable<TreeItem[]> {
        if (!element) {
            // Root level - show action item to create new terminal
            const newTerminalItem = new TreeItem('New Terminal', vscode.TreeItemCollapsibleState.None);
            newTerminalItem.command = {
                command: 'ultrathink.newTerminal',
                title: 'Create New Terminal'
            };
            newTerminalItem.iconPath = new vscode.ThemeIcon('add');

            return Promise.resolve([newTerminalItem]);
        }
        return Promise.resolve([]);
    }
}

class TreeItem extends vscode.TreeItem {
    constructor(
        public readonly label: string,
        public readonly collapsibleState: vscode.TreeItemCollapsibleState
    ) {
        super(label, collapsibleState);
    }
}
