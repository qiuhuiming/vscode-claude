import * as vscode from 'vscode';

export class TerminalManager {
    private terminals: vscode.Terminal[] = [];
    private terminalCounter = 1;
    private _onTerminalsChanged = new vscode.EventEmitter<void>();
    readonly onTerminalsChanged = this._onTerminalsChanged.event;

    constructor() {
        // Listen for terminal close events
        vscode.window.onDidCloseTerminal((closedTerminal) => {
            const index = this.terminals.indexOf(closedTerminal);
            if (index !== -1) {
                this.terminals.splice(index, 1);
                this._onTerminalsChanged.fire();
            }
        });
    }

    createTerminal(): vscode.Terminal {
        const terminalName = `UltraThink ${this.terminalCounter}`;
        console.log(`🔧 Creating terminal: ${terminalName}`);

        // 🎯 使用固定的 ViewColumn.Two (右边第一列)
        // 第1个终端：会在右边创建新的分屏
        // 第2+个终端：会在右边同一个分屏里添加 tab
        const terminal = vscode.window.createTerminal({
            name: terminalName,
            hideFromUser: false,
            location: {
                viewColumn: vscode.ViewColumn.Two,  // 固定在右边第一列
                preserveFocus: true  // 不抢走焦点
            }
        });

        this.terminals.push(terminal);
        this.terminalCounter++;

        // Send the 'yolo' command to the terminal
        console.log(`⚡ Sending 'yolo' command to ${terminalName}`);
        terminal.sendText('yolo');

        // Show the terminal in editor area
        terminal.show(true); // true = preserveFocus

        this._onTerminalsChanged.fire();
        console.log(`✅ Terminal ${terminalName} created. Total terminals: ${this.terminals.length}`);

        return terminal;
    }

    getTerminals(): vscode.Terminal[] {
        return this.terminals.filter(t => {
            // Filter out any disposed terminals
            try {
                return t.exitStatus === undefined;
            } catch {
                return false;
            }
        });
    }

    showTerminal(terminal: vscode.Terminal) {
        terminal.show();
    }

    dispose() {
        this.terminals.forEach(terminal => terminal.dispose());
        this.terminals = [];
        this._onTerminalsChanged.fire();
    }
}
