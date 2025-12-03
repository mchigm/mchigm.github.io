import * as vscode from 'vscode';
import * as path from 'path';

export class PreviewPanel {
    public static currentPanel: PreviewPanel | undefined;
    public static readonly viewType = 'universalPreview';

    private readonly _panel: vscode.WebviewPanel;
    private readonly _extensionUri: vscode.Uri;
    private _resource: vscode.Uri;
    private _disposables: vscode.Disposable[] = [];
    private _changeTimer: NodeJS.Timeout | undefined;

    public static createOrShow(extensionUri: vscode.Uri, resource: vscode.Uri) {
        const column = vscode.window.activeTextEditor
            ? vscode.ViewColumn.Beside
            : vscode.ViewColumn.One;

        // If we already have a panel, show it.
        if (PreviewPanel.currentPanel) {
            PreviewPanel.currentPanel._panel.reveal(column);
            PreviewPanel.currentPanel.updateResource(resource);
            return;
        }

        // Otherwise, create a new panel.
        const panel = vscode.window.createWebviewPanel(
            PreviewPanel.viewType,
            `Preview: ${path.basename(resource.fsPath)}`,
            column,
            {
                enableScripts: true,
                localResourceRoots: [vscode.Uri.file(path.dirname(resource.fsPath)), extensionUri]
            }
        );

        PreviewPanel.currentPanel = new PreviewPanel(panel, extensionUri, resource);
    }

    public static revive(panel: vscode.WebviewPanel, extensionUri: vscode.Uri, resource: vscode.Uri | undefined) {
        if (resource) {
            PreviewPanel.currentPanel = new PreviewPanel(panel, extensionUri, resource);
        }
    }

    private constructor(panel: vscode.WebviewPanel, extensionUri: vscode.Uri, resource: vscode.Uri) {
        this._panel = panel;
        this._extensionUri = extensionUri;
        this._resource = resource;

        // Set the webview's initial html content
        this._update();

        // Listen for when the panel is disposed
        // This happens when the user closes the panel or when the panel is closed programmatically
        this._panel.onDidDispose(() => this.dispose(), null, this._disposables);

        // Update the content based on view changes
        this._panel.onDidChangeViewState(
            e => {
                if (this._panel.visible) {
                    this._update();
                }
            },
            null,
            this._disposables
        );

        // Handle messages from the webview
        this._panel.webview.onDidReceiveMessage(
            message => {
                switch (message.command) {
                    case 'alert':
                        vscode.window.showErrorMessage(message.text);
                        return;
                }
            },
            null,
            this._disposables
        );

        // Listen for file changes
        vscode.workspace.onDidChangeTextDocument(e => {
            if (e.document.uri.toString() === this._resource.toString()) {
                this.triggerUpdate();
            }
        }, null, this._disposables);
        
        vscode.workspace.onDidSaveTextDocument(e => {
             if (e.uri.toString() === this._resource.toString()) {
                this.triggerUpdate();
            }
        }, null, this._disposables);
    }

    public updateResource(resource: vscode.Uri) {
        this._resource = resource;
        this._panel.title = `Preview: ${path.basename(resource.fsPath)}`;
        this._update();
    }

    public triggerUpdate() {
        const config = vscode.workspace.getConfiguration('universalPreview');
        const autoRefresh = config.get<boolean>('autoRefresh', true);
        const delay = config.get<number>('refreshDelay', 300);

        if (!autoRefresh) {
            return;
        }

        if (this._changeTimer) {
            clearTimeout(this._changeTimer);
        }
        this._changeTimer = setTimeout(() => this._update(), delay);
    }

    public dispose() {
        PreviewPanel.currentPanel = undefined;

        // Clean up our resources
        this._panel.dispose();

        while (this._disposables.length) {
            const x = this._disposables.pop();
            if (x) {
                x.dispose();
            }
        }
    }

    private async _update() {
        const webview = this._panel.webview;
        this._panel.webview.html = await this._getHtmlForWebview(webview);
    }

    private async _getHtmlForWebview(webview: vscode.Webview): Promise<string> {
        const resourcePath = this._resource.fsPath;
        const ext = path.extname(resourcePath).toLowerCase();
        const filename = path.basename(resourcePath);

        let content = '';
        
        try {
            // Basic content generation based on file type
            if (ext === '.md') {
                const doc = await vscode.workspace.openTextDocument(this._resource);
                // Simple markdown parsing (in real app, use markdown-it)
                // We'll just wrap in pre for now to avoid dependency issues in this snippet, 
                // but user can npm install markdown-it
                content = this.renderMarkdown(doc.getText());
            } else if (ext === '.html' || ext === '.htm' || ext === '.php') {
                const doc = await vscode.workspace.openTextDocument(this._resource);
                // For HTML, we can inject it directly, but need to handle relative paths
                // Using a base tag
                const baseUri = webview.asWebviewUri(vscode.Uri.file(path.dirname(resourcePath)));
                content = `
                    <base href="${baseUri}/">
                    ${doc.getText()}
                `;
                return content; // Return directly for HTML to preserve structure
            } else if (ext === '.pdf') {
                // PDF Preview using embed
                const pdfUri = webview.asWebviewUri(this._resource);
                content = `
                    <embed src="${pdfUri}" width="100%" height="100%" type="application/pdf">
                    <p>If PDF does not appear, <a href="${pdfUri}">click here to download</a>.</p>
                `;
                return this.wrapHtml(content, filename);
            } else if (['.png', '.jpg', '.jpeg', '.gif', '.svg'].includes(ext)) {
                const imgUri = webview.asWebviewUri(this._resource);
                content = `<div style="display:flex;justify-content:center;align-items:center;height:100%"><img src="${imgUri}" style="max-width:100%;max-height:100%"></div>`;
            } else if (ext === '.csv') {
                const doc = await vscode.workspace.openTextDocument(this._resource);
                content = this.renderCsv(doc.getText());
            } else if (['.doc', '.docx', '.ppt', '.pptx', '.xls', '.xlsx', '.pages'].includes(ext)) {
                content = `
                    <div style="padding: 20px; text-align: center;">
                        <h2>Office File Preview</h2>
                        <p>Previewing <b>${filename}</b></p>
                        <p><i>Note: Full rendering of Office files requires external libraries (e.g. mammoth.js for docx).</i></p>
                        <p>Currently showing raw text extraction stub.</p>
                    </div>
                `;
            } else if (['.tex', '.bib'].includes(ext)) {
                 const doc = await vscode.workspace.openTextDocument(this._resource);
                 content = `
                    <div style="padding: 20px;">
                        <h2>TeX/Bib Preview</h2>
                        <pre>${this.escapeHtml(doc.getText())}</pre>
                    </div>
                 `;
            } else {
                content = `<p>Preview not supported for <b>${ext}</b> files.</p>`;
            }
        } catch (error) {
            content = `<p>Error loading preview: ${error}</p>`;
        }

        return this.wrapHtml(content, filename);
    }

    private wrapHtml(content: string, title: string): string {
        return `<!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>${title}</title>
                <style>
                    body { font-family: var(--vscode-font-family); padding: 0; margin: 0; background-color: var(--vscode-editor-background); color: var(--vscode-editor-foreground); height: 100vh; overflow: hidden; }
                    .container { height: 100%; display: flex; flex-direction: column; overflow: auto; }
                    table { border-collapse: collapse; width: 100%; }
                    th, td { border: 1px solid var(--vscode-panel-border); padding: 8px; text-align: left; }
                    th { background-color: var(--vscode-editor-selectionBackground); }
                    pre { white-space: pre-wrap; }
                </style>
            </head>
            <body>
                <div class="container">
                    ${content}
                </div>
            </body>
            </html>`;
    }

    private renderMarkdown(text: string): string {
        // Basic markdown replacement for demo purposes
        // In production, use 'markdown-it'
        let html = this.escapeHtml(text)
            .replace(/^# (.*$)/gm, '<h1>$1</h1>')
            .replace(/^## (.*$)/gm, '<h2>$1</h2>')
            .replace(/^### (.*$)/gm, '<h3>$1</h3>')
            .replace(/\*\*(.*)\*\*/gim, '<b>$1</b>')
            .replace(/\*(.*)\*/gim, '<i>$1</i>')
            .replace(/\n/gim, '<br>');
        return html;
    }

    private renderCsv(text: string): string {
        const rows = text.split(/\r?\n/);
        let html = '<table>';
        rows.forEach((row, index) => {
            if (!row.trim()) return;
            const cols = row.split(',');
            html += '<tr>';
            cols.forEach(col => {
                html += index === 0 ? `<th>${col}</th>` : `<td>${col}</td>`;
            });
            html += '</tr>';
        });
        html += '</table>';
        return html;
    }

    private escapeHtml(text: string): string {
        return text
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }
}
