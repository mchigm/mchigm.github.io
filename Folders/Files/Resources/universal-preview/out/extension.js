"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.activate = activate;
exports.deactivate = deactivate;
const vscode = require("vscode");
const PreviewPanel_1 = require("./PreviewPanel");
function activate(context) {
    console.log('Universal Preview is now active!');
    const openPreviewCommand = vscode.commands.registerCommand('universalPreview.open', (uri) => {
        let resource = uri;
        if (!(resource instanceof vscode.Uri) && vscode.window.activeTextEditor) {
            resource = vscode.window.activeTextEditor.document.uri;
        }
        if (resource) {
            PreviewPanel_1.PreviewPanel.createOrShow(context.extensionUri, resource);
        }
        else {
            vscode.window.showErrorMessage("No file selected for preview.");
        }
    });
    context.subscriptions.push(openPreviewCommand);
    if (vscode.window.registerWebviewPanelSerializer) {
        // Make sure we register a serializer in activation event
        vscode.window.registerWebviewPanelSerializer(PreviewPanel_1.PreviewPanel.viewType, {
            async deserializeWebviewPanel(webviewPanel, state) {
                // Reset the webview options so we use latest uri for `localResourceRoots`.
                webviewPanel.webview.options = getWebviewOptions(context.extensionUri);
                PreviewPanel_1.PreviewPanel.revive(webviewPanel, context.extensionUri, state.resource ? vscode.Uri.parse(state.resource) : undefined);
            }
        });
    }
}
function getWebviewOptions(extensionUri) {
    return {
        // Enable javascript in the webview
        enableScripts: true,
        // And restrict the webview to only loading content from our extension's `media` directory.
        localResourceRoots: [vscode.Uri.joinPath(extensionUri, 'media')]
    };
}
function deactivate() { }
//# sourceMappingURL=extension.js.map