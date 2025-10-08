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
        const terminal = vscode.window.createTerminal({
            name: `UltraThink ${this.terminalCounter}`,
            hideFromUser: false
        });

        this.terminals.push(terminal);
        this.terminalCounter++;

        // Send the 'yolo' command to the terminal
        terminal.sendText('yolo');

        // Show the terminal in split view on the right
        terminal.show(true); // true = preserveFocus

        this._onTerminalsChanged.fire();

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
