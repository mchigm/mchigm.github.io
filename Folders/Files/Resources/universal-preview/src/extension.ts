import * as vscode from 'vscode';
import { PreviewPanel } from './PreviewPanel';

export function activate(context: vscode.ExtensionContext) {
	console.log('Universal Preview is now active!');

	const openPreviewCommand = vscode.commands.registerCommand('universalPreview.open', (uri: vscode.Uri) => {
		let resource = uri;
		if (!(resource instanceof vscode.Uri) && vscode.window.activeTextEditor) {
			resource = vscode.window.activeTextEditor.document.uri;
		}

		if (resource) {
			PreviewPanel.createOrShow(context.extensionUri, resource);
		} else {
			vscode.window.showErrorMessage("No file selected for preview.");
		}
	});

	context.subscriptions.push(openPreviewCommand);

	if (vscode.window.registerWebviewPanelSerializer) {
		// Make sure we register a serializer in activation event
		vscode.window.registerWebviewPanelSerializer(PreviewPanel.viewType, {
			async deserializeWebviewPanel(webviewPanel: vscode.WebviewPanel, state: any) {
				// Reset the webview options so we use latest uri for `localResourceRoots`.
				webviewPanel.webview.options = getWebviewOptions(context.extensionUri);
				PreviewPanel.revive(webviewPanel, context.extensionUri, state.resource ? vscode.Uri.parse(state.resource) : undefined);
			}
		});
	}
}

function getWebviewOptions(extensionUri: vscode.Uri): vscode.WebviewOptions {
	return {
		// Enable javascript in the webview
		enableScripts: true,
		// And restrict the webview to only loading content from our extension's `media` directory.
		localResourceRoots: [vscode.Uri.joinPath(extensionUri, 'media')]
	};
}

export function deactivate() {}
