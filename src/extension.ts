import * as vscode from 'vscode';
import { UltraThinkProvider } from './provider';

export function activate(context: vscode.ExtensionContext) {
    console.log('UltraThink extension is now active');

    // Register the tree data provider
    const provider = new UltraThinkProvider();
    const treeView = vscode.window.createTreeView('ultrathinkView', {
        treeDataProvider: provider,
        showCollapseAll: false
    });

    context.subscriptions.push(treeView);
}

export function deactivate() {}
