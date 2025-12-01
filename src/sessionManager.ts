import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';

export interface Session {
    id: string;
    summary: string;
    timestamp: Date;
    projectPath: string;
}

export class SessionManager {
    private sessions: Session[] = [];
    private _onSessionsChanged = new vscode.EventEmitter<void>();
    readonly onSessionsChanged = this._onSessionsChanged.event;
    private terminalCounter = 1;
    private terminals: vscode.Terminal[] = [];

    constructor() {
        // Listen for terminal close events
        vscode.window.onDidCloseTerminal((closedTerminal) => {
            const index = this.terminals.indexOf(closedTerminal);
            if (index !== -1) {
                this.terminals.splice(index, 1);
            }
        });
    }

    /**
     * Get the Claude projects directory path for the current workspace
     */
    private getProjectSessionsPath(): string | null {
        const workspaceFolders = vscode.workspace.workspaceFolders;
        if (!workspaceFolders || workspaceFolders.length === 0) {
            return null;
        }

        const workspacePath = workspaceFolders[0].uri.fsPath;
        // Convert path to Claude's directory format: /Users/foo.bar/code -> -Users-foo-bar-code
        // Claude replaces both '/' and '.' with '-'
        const claudeProjectName = workspacePath.replace(/[\/\._]/g, '-');
        const claudeDir = path.join(os.homedir(), '.claude', 'projects', claudeProjectName);

        return claudeDir;
    }

    /**
     * Parse a session file to extract summary
     * Returns null if session has no summary or no actual conversation content
     */
    private parseSessionFile(filePath: string): string | null {
        try {
            const content = fs.readFileSync(filePath, 'utf-8');
            const lines = content.split('\n');

            let summary: string | null = null;
            let hasUserMessage = false;

            for (const line of lines) {
                if (!line.trim()) continue;
                try {
                    const json = JSON.parse(line);
                    if (json.type === 'summary' && json.summary) {
                        summary = json.summary;
                    }
                    // Check if there's at least one user message (actual conversation)
                    if (json.type === 'user') {
                        hasUserMessage = true;
                    }
                } catch {
                    continue;
                }
            }

            // Only return summary if session has actual conversation content
            // Sessions with only summary but no user messages cannot be resumed
            if (summary && hasUserMessage) {
                return summary;
            }
        } catch (err) {
            console.error(`Error reading session file: ${filePath}`, err);
        }
        return null;
    }

    /**
     * Check if a filename is a valid UUID session file (not an agent file)
     */
    private isValidSessionFile(filename: string): boolean {
        // UUID pattern: 8-4-4-4-12 hex characters
        const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}\.jsonl$/i;
        return uuidPattern.test(filename);
    }

    /**
     * Refresh the sessions list from the filesystem
     */
    async refreshSessions(): Promise<void> {
        const sessionsPath = this.getProjectSessionsPath();

        if (!sessionsPath || !fs.existsSync(sessionsPath)) {
            console.log('📂 No Claude sessions directory found');
            this.sessions = [];
            this._onSessionsChanged.fire();
            return;
        }

        try {
            const files = fs.readdirSync(sessionsPath);
            const sessionFiles = files.filter(f => this.isValidSessionFile(f));

            // Get file stats and sort by modification time (newest first)
            // Filter out sessions without a valid summary (empty sessions)
            const sessionsWithStats = sessionFiles.map(filename => {
                const filePath = path.join(sessionsPath, filename);
                const stats = fs.statSync(filePath);
                const id = filename.replace('.jsonl', '');
                const summary = this.parseSessionFile(filePath);

                // Skip sessions without a summary (empty conversations)
                if (!summary) {
                    return null;
                }

                return {
                    id,
                    summary,
                    timestamp: stats.mtime,
                    projectPath: sessionsPath
                };
            }).filter((session): session is Session => session !== null);

            // Sort by timestamp (newest first) and limit to 10
            sessionsWithStats.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
            this.sessions = sessionsWithStats.slice(0, 10);

            console.log(`📋 Found ${this.sessions.length} sessions`);
            this._onSessionsChanged.fire();
        } catch (err) {
            console.error('Error reading sessions directory:', err);
            this.sessions = [];
            this._onSessionsChanged.fire();
        }
    }

    /**
     * Get the list of sessions
     */
    getSessions(): Session[] {
        return this.sessions;
    }

    /**
     * Resume a session by creating a new terminal and running yolo -r
     */
    resumeSession(sessionId: string): vscode.Terminal {
        const terminalName = `Resume ${this.terminalCounter}`;
        console.log(`🔄 Resuming session: ${sessionId}`);

        const terminal = vscode.window.createTerminal({
            name: terminalName,
            hideFromUser: false,
            location: {
                viewColumn: vscode.ViewColumn.Two,
                preserveFocus: true
            }
        });

        this.terminals.push(terminal);
        this.terminalCounter++;

        // Send the resume command
        console.log(`⚡ Sending 'yolo -r ${sessionId}' command`);
        terminal.sendText(`yolo -r ${sessionId}`);

        terminal.show(true);

        return terminal;
    }

    /**
     * Format relative time for display
     */
    static formatRelativeTime(date: Date): string {
        const now = new Date();
        const diffMs = now.getTime() - date.getTime();
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMins / 60);
        const diffDays = Math.floor(diffHours / 24);

        if (diffMins < 1) return 'just now';
        if (diffMins < 60) return `${diffMins}m ago`;
        if (diffHours < 24) return `${diffHours}h ago`;
        if (diffDays < 7) return `${diffDays}d ago`;
        return date.toLocaleDateString();
    }

    dispose() {
        this.terminals.forEach(terminal => terminal.dispose());
        this.terminals = [];
    }
}
