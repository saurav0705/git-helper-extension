import * as vscode from 'vscode';
import { getNonce } from './getNonce';
import {
    getLocalBranches,
    getRemoteBranches,
    processResponse,
    deleteLocalBranch,
    fetchRemoteBranch,
    fetchAllGitFolders,
    getFoldersArray,
    setFoldersArray
} from './helpers/utils';
import * as actions from './constants/actions';

export class SidebarProvider implements vscode.WebviewViewProvider {
    _view?: vscode.WebviewView;
    _doc?: vscode.TextDocument;

    constructor(private readonly _extensionUri: vscode.Uri) {}

    sendMessageToWebView(data: { command: string; data: any }) {
        this._view?.webview.postMessage(data);
    }

    performActionAndRefresh(fn: () => void, path: string) {
        fn();
        this.sendMessageToWebView({
            command: `${path}refresh`,
            data: {}
        });
    }

    processFolders = (folders: any) => {
        let flattenFolders = folders.reduce((prev: [], item: any) => {
            return [...prev, ...item];
        }, []);
        let filteredFolders =
            flattenFolders.filter((item: any) => item.endsWith('.git')) || [];

        return filteredFolders.reduce((prev: any, item: any) => {
            let path = item.replace('/.git', '');
            let splitArray = path.split('/');
            return [
                ...prev,
                {
                    path,
                    folder: splitArray[splitArray.length - 1]
                }
            ];
        }, []);
    };

    public resolveWebviewView(webviewView: vscode.WebviewView) {
        this._view = webviewView;

        webviewView.webview.options = {
            // Allow scripts in the webview
            enableScripts: true,

            localResourceRoots: [this._extensionUri]
        };

        webviewView.webview.html = this._getHtmlForWebview(webviewView.webview);

        webviewView.webview.onDidReceiveMessage((data) => {
            switch (data.type) {
                case 'folders':
                    if (!getFoldersArray().length) {
                        fetchAllGitFolders().then((res: any) => {
                            let folders = this.processFolders(res || []);
                            setFoldersArray(folders);
                            this.sendMessageToWebView({
                                command: 'folders',
                                data: folders
                            });
                        });
                    } else {
                        this.sendMessageToWebView({
                            command: 'folders',
                            data: getFoldersArray()
                        });
                    }
                    break;
                case actions.fetchLocalBranches:
                    getLocalBranches(data.data).then((resp) => {
                        this.performActionAndRefresh(
                            () =>
                                this.sendMessageToWebView({
                                    command: `${data.data}local_branches`,
                                    data: processResponse(resp)
                                }),
                            data.data
                        );
                    });
                    break;
                case actions.fetchAllRemoteBranches:
                    getRemoteBranches(data.data).then((resp) => {
                        this.sendMessageToWebView({
                            command: `${data.data}remote_branches`,
                            data: processResponse(resp)
                        });
                    });
                    break;
                case actions.deleteLocalBranch:
                    deleteLocalBranch(data.data.branch, data.data.path)
                        .then((resp) => {
                            vscode.window.showInformationMessage(
                                'Branch Deleted Succesfully'
                            );
                        })
                        .catch((err) => vscode.window.showErrorMessage(err));
                    break;
                case actions.fetchRemoteBranchToLocal:
                    fetchRemoteBranch(data.data.branch, data.data.path)
                        .then((resp) => {
                            vscode.window.showInformationMessage(
                                'Branch Fetched Succesfully'
                            );
                        })
                        .catch((err) => vscode.window.showErrorMessage(err));
                    break;
                case 'onInfo': {
                    if (!data.data) {
                        return;
                    }
                    vscode.window.showInformationMessage(data.data);
                    break;
                }
                case 'onError': {
                    if (!data.data) {
                        return;
                    }
                    vscode.window.showErrorMessage(data.data);
                    break;
                }
            }
        });
    }

    public revive(panel: vscode.WebviewView) {
        this._view = panel;
    }

    private _getHtmlForWebview(webview: vscode.Webview) {
        const styleResetUri = webview.asWebviewUri(
            vscode.Uri.joinPath(this._extensionUri, 'media', 'reset.css')
        );
        const scriptUri = webview.asWebviewUri(
            vscode.Uri.joinPath(
                this._extensionUri,
                'out',
                'compiled/sidebar.js'
            )
        );
        const styleMainUri = webview.asWebviewUri(
            vscode.Uri.joinPath(
                this._extensionUri,
                'out',
                'compiled/sidebar.css'
            )
        );
        const styleVSCodeUri = webview.asWebviewUri(
            vscode.Uri.joinPath(this._extensionUri, 'media', 'vscode.css')
        );

        // Use a nonce to only allow a specific script to be run.
        const nonce = getNonce();

        return `<!DOCTYPE html>
			<html lang="en">
			<head>
				<meta charset="UTF-8">
				<!--
					Use a content security policy to only allow loading images from https or from our extension directory,
					and only allow scripts that have a specific nonce.
        -->
        <meta http-equiv="Content-Security-Policy" content="img-src https: data:; style-src 'unsafe-inline' ${webview.cspSource}; script-src 'nonce-${nonce}';">
				<meta name="viewport" content="width=device-width, initial-scale=1.0">
				<link href="${styleResetUri}" rel="stylesheet">
				<link href="${styleVSCodeUri}" rel="stylesheet">
        <link href="${styleMainUri}" rel="stylesheet">
        <script nonce="${nonce}">
           const tsvscode = acquireVsCodeApi();
        </script>
			</head>
      <body>
				<script nonce="${nonce}" src="${scriptUri}"></script>
			</body>
			</html>`;
    }
}
