import * as vscode from 'vscode';

export class TerminalManager {
    private terminals: vscode.Terminal[] = [];
    private terminalCounter = 1;

    createTerminal(): vscode.Terminal {
        const terminal = vscode.window.createTerminal({
            name: `UltraThink ${this.terminalCounter}`,
            hideFromUser: false
        });

        this.terminals.push(terminal);
        this.terminalCounter++;

        // Send the 'yolo' command to the terminal
        terminal.sendText('yolo');

        // Show the terminal
        terminal.show();

        return terminal;
    }

    getTerminals(): vscode.Terminal[] {
        return this.terminals;
    }

    dispose() {
        this.terminals.forEach(terminal => terminal.dispose());
        this.terminals = [];
    }
}
