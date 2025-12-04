"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PreviewPanel = void 0;
const vscode = require("vscode");
const path = require("path");
// Use require for libraries that might lack types or to simplify setup
const mammoth = require('mammoth');
const XLSX = require('xlsx');
const JSZip = require('jszip');
class PreviewPanel {
    static createOrShow(extensionUri, resource) {
        const column = vscode.window.activeTextEditor
            ? vscode.ViewColumn.Beside
            : vscode.ViewColumn.One;
        if (PreviewPanel.currentPanel) {
            PreviewPanel.currentPanel._panel.reveal(column);
            PreviewPanel.currentPanel.updateResource(resource);
            return;
        }
        const panel = vscode.window.createWebviewPanel(PreviewPanel.viewType, `Preview: ${path.basename(resource.fsPath)}`, column, {
            enableScripts: true,
            localResourceRoots: [vscode.Uri.file(path.dirname(resource.fsPath)), extensionUri]
        });
        PreviewPanel.currentPanel = new PreviewPanel(panel, extensionUri, resource);
    }
    static revive(panel, extensionUri, resource) {
        if (resource) {
            PreviewPanel.currentPanel = new PreviewPanel(panel, extensionUri, resource);
        }
    }
    constructor(panel, extensionUri, resource) {
        this._disposables = [];
        this._panel = panel;
        this._extensionUri = extensionUri;
        this._resource = resource;
        this._update();
        this._panel.onDidDispose(() => this.dispose(), null, this._disposables);
        this._panel.onDidChangeViewState(e => {
            if (this._panel.visible) {
                this._update();
            }
        }, null, this._disposables);
        this._panel.webview.onDidReceiveMessage(message => {
            switch (message.command) {
                case 'alert':
                    vscode.window.showErrorMessage(message.text);
                    return;
            }
        }, null, this._disposables);
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
    updateResource(resource) {
        this._resource = resource;
        this._panel.title = `Preview: ${path.basename(resource.fsPath)}`;
        this._update();
    }
    triggerUpdate() {
        const config = vscode.workspace.getConfiguration('universalPreview');
        const autoRefresh = config.get('autoRefresh', true);
        const delay = config.get('refreshDelay', 300);
        if (!autoRefresh) {
            return;
        }
        if (this._changeTimer) {
            clearTimeout(this._changeTimer);
        }
        this._changeTimer = setTimeout(() => this._update(), delay);
    }
    dispose() {
        PreviewPanel.currentPanel = undefined;
        this._panel.dispose();
        while (this._disposables.length) {
            const x = this._disposables.pop();
            if (x) {
                x.dispose();
            }
        }
    }
    async _update() {
        const webview = this._panel.webview;
        this._panel.webview.html = await this._getHtmlForWebview(webview);
    }
    async _getHtmlForWebview(webview) {
        const resourcePath = this._resource.fsPath;
        const ext = path.extname(resourcePath).toLowerCase();
        const filename = path.basename(resourcePath);
        let content = '';
        try {
            // Read file content
            // For text formats, we might want text. For binary, we want buffer.
            // We'll read as buffer first for most things.
            const fileBuffer = await vscode.workspace.fs.readFile(this._resource);
            const buffer = Buffer.from(fileBuffer);
            // Check for PDF signature or extension
            const isPdf = ext === '.pdf' || (buffer.length > 4 && buffer.toString('utf8', 0, 5) === '%PDF-');
            if (ext === '.md') {
                const text = buffer.toString('utf8');
                content = this.renderMarkdown(text);
            }
            else if (ext === '.html' || ext === '.htm' || ext === '.php') {
                const text = buffer.toString('utf8');
                const baseUri = webview.asWebviewUri(vscode.Uri.file(path.dirname(resourcePath)));
                content = `
                    <base href="${baseUri}/">
                    ${text}
                `;
                return content;
            }
            else if (isPdf) {
                // Render PDF using embed with data URI to support raw content
                const base64 = buffer.toString('base64');
                const dataUri = `data:application/pdf;base64,${base64}`;
                content = `
                    <embed src="${dataUri}" width="100%" height="100%" type="application/pdf">
                    <p>If PDF does not appear, <a href="${dataUri}" download="${filename}">click here to download</a>.</p>
                `;
                return this.wrapHtml(content, filename);
            }
            else if (['.png', '.jpg', '.jpeg', '.gif', '.svg'].includes(ext)) {
                const imgUri = webview.asWebviewUri(this._resource);
                content = `<div style="display:flex;justify-content:center;align-items:center;height:100%"><img src="${imgUri}" style="max-width:100%;max-height:100%"></div>`;
            }
            else if (ext === '.csv') {
                const text = buffer.toString('utf8');
                content = this.renderCsv(text);
            }
            else if (ext === '.docx') {
                // Use mammoth for docx
                try {
                    const result = await mammoth.convertToHtml({ buffer: buffer });
                    content = `<div class="document-content">${result.value}</div>`;
                    if (result.messages && result.messages.length > 0) {
                        content += `<div class="warnings"><h3>Warnings:</h3><ul>${result.messages.map((m) => `<li>${m.message}</li>`).join('')}</ul></div>`;
                    }
                }
                catch (e) {
                    content = `<p>Error rendering DOCX: ${e}</p>`;
                }
            }
            else if (['.xlsx', '.xls', '.ods'].includes(ext)) {
                // Use XLSX (SheetJS)
                try {
                    const workbook = XLSX.read(buffer, { type: 'buffer' });
                    const sheetName = workbook.SheetNames[0];
                    const sheet = workbook.Sheets[sheetName];
                    const html = XLSX.utils.sheet_to_html(sheet);
                    content = `<div class="spreadsheet-content">${html}</div>`;
                }
                catch (e) {
                    content = `<p>Error rendering Spreadsheet: ${e}</p>`;
                }
            }
            else if (['.pages', '.key', '.numbers'].includes(ext)) {
                // Apple formats (Zip based) - Try to extract QuickLook/Preview.jpg
                try {
                    const zip = await JSZip.loadAsync(buffer);
                    const previewFile = zip.file('QuickLook/Preview.jpg');
                    if (previewFile) {
                        const base64 = await previewFile.async('base64');
                        content = `
                            <div style="text-align:center">
                                <h2>Apple ${ext.substring(1).toUpperCase()} Preview</h2>
                                <img src="data:image/jpeg;base64,${base64}" style="max-width:100%; box-shadow: 0 0 10px rgba(0,0,0,0.5);" />
                            </div>`;
                    }
                    else {
                        content = `<p>No preview image found in this Apple document.</p>`;
                    }
                }
                catch (e) {
                    content = `<p>Error reading Apple document: ${e}</p>`;
                }
            }
            else if (['.odt', '.odp', '.ods'].includes(ext)) {
                // OpenOffice (Zip based) - Try thumbnail
                try {
                    const zip = await JSZip.loadAsync(buffer);
                    const thumb = zip.file('Thumbnails/thumbnail.png');
                    if (thumb) {
                        const base64 = await thumb.async('base64');
                        content = `
                            <div style="text-align:center">
                                <h2>OpenOffice Preview</h2>
                                <img src="data:image/png;base64,${base64}" style="max-width:100%;" />
                            </div>`;
                    }
                    else {
                        // Fallback: try to read content.xml (very basic)
                        const contentXml = zip.file('content.xml');
                        if (contentXml) {
                            const xmlText = await contentXml.async('string');
                            // Strip tags for a rough text preview
                            const text = xmlText.replace(/<[^>]+>/g, ' ');
                            content = `<div style="padding:20px"><h3>Text Content Preview</h3><p>${text.substring(0, 2000)}...</p></div>`;
                        }
                        else {
                            content = `<p>No preview available for this OpenOffice document.</p>`;
                        }
                    }
                }
                catch (e) {
                    content = `<p>Error reading OpenOffice document: ${e}</p>`;
                }
            }
            else if (['.doc', '.ppt'].includes(ext)) {
                content = `
                    <div style="padding: 20px; text-align: center;">
                        <h2>Legacy Office File</h2>
                        <p>Previewing <b>${filename}</b></p>
                        <p>Legacy binary formats (.doc, .ppt) are not fully supported. Please save as .docx/.pptx for better preview.</p>
                    </div>
                `;
            }
            else if (['.tex', '.bib'].includes(ext)) {
                const text = buffer.toString('utf8');
                content = `
                    <div style="padding: 20px;">
                        <h2>TeX/Bib Preview</h2>
                        <pre>${this.escapeHtml(text)}</pre>
                    </div>
                 `;
            }
            else {
                // Try to detect if it's a text file
                try {
                    const text = buffer.toString('utf8');
                    // Heuristic: if it has too many null bytes, it's binary
                    if (text.includes('\0') && text.split('\0').length > 10) {
                        content = `<p>Preview not supported for this binary file type.</p>`;
                    }
                    else {
                        content = `<pre>${this.escapeHtml(text)}</pre>`;
                    }
                }
                catch {
                    content = `<p>Preview not supported for <b>${ext}</b> files.</p>`;
                }
            }
        }
        catch (error) {
            content = `<p>Error loading preview: ${error}</p>`;
        }
        return this.wrapHtml(content, filename);
    }
    wrapHtml(content, title) {
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
                    pre { white-space: pre-wrap; padding: 10px; }
                    .document-content { padding: 20px; max-width: 800px; margin: 0 auto; background: white; color: black; min-height: 100%; }
                    .spreadsheet-content { padding: 10px; overflow: auto; }
                    img { max-width: 100%; }
                </style>
            </head>
            <body>
                <div class="container">
                    ${content}
                </div>
            </body>
            </html>`;
    }
    renderMarkdown(text) {
        let html = this.escapeHtml(text)
            .replace(/^# (.*$)/gm, '<h1>$1</h1>')
            .replace(/^## (.*$)/gm, '<h2>$1</h2>')
            .replace(/^### (.*$)/gm, '<h3>$1</h3>')
            .replace(/\*\*(.*)\*\*/gim, '<b>$1</b>')
            .replace(/\*(.*)\*/gim, '<i>$1</i>')
            .replace(/\n/gim, '<br>');
        return html;
    }
    renderCsv(text) {
        const rows = text.split(/\r?\n/);
        let html = '<table>';
        rows.forEach((row, index) => {
            if (!row.trim())
                return;
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
    escapeHtml(text) {
        return text
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }
}
exports.PreviewPanel = PreviewPanel;
PreviewPanel.viewType = 'universalPreview';
//# sourceMappingURL=PreviewPanel.js.map