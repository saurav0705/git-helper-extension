import * as vscode from "vscode";
import { getNonce } from "./getNonce";
import { getLocalBranches, getRemoteBranches, processResponse ,deleteLocalBranch} from "./helpers/utils";


export class SidebarProvider implements vscode.WebviewViewProvider {
  _view?: vscode.WebviewView;
  _doc?: vscode.TextDocument;

  constructor(private readonly _extensionUri: vscode.Uri) {}

  
  sendMessageToWebView(data:{command:string,data:any}){
    this._view?.webview.postMessage(data)
  }

  public resolveWebviewView(webviewView: vscode.WebviewView) {
    this._view = webviewView;

    webviewView.webview.options = {
      // Allow scripts in the webview
      enableScripts: true,

      localResourceRoots: [this._extensionUri],
    };

    webviewView.webview.html = this._getHtmlForWebview(webviewView.webview);

    webviewView.webview.onDidReceiveMessage((data) => {
      switch (data.type) { 
        case "fetch-branhes":
          getLocalBranches().then(resp => {
          this.sendMessageToWebView({ command: 'local_branches', data:processResponse(resp) })
        });
          break;
        case "fetch-remote-branhes":
          getRemoteBranches().then(resp => {
          this.sendMessageToWebView({ command: 'remote_branches', data:processResponse(resp) })
        });
          break;
        case "onInfo": {
          if (!data.data) {
            return;
          }
          vscode.window.showInformationMessage(data.data);
          break;
        }
        case 'deleteBranch':
          deleteLocalBranch(data.data).then(resp => 
            {
              vscode.window.showInformationMessage("Branch Deleted Succesfully");
            
          }
            ).catch(err => vscode.window.showErrorMessage("something went wrong"))
            break;
        case "onError": {
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
      vscode.Uri.joinPath(this._extensionUri, "media", "reset.css")
    );
    const scriptUri = webview.asWebviewUri(
      vscode.Uri.joinPath(this._extensionUri, "out", "compiled/sidebar.js")
    );
    const styleMainUri = webview.asWebviewUri(
      vscode.Uri.joinPath(this._extensionUri, "out", "compiled/sidebar.css")
    );
    const styleVSCodeUri = webview.asWebviewUri(
      vscode.Uri.joinPath(this._extensionUri, "media", "vscode.css")
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
        <meta http-equiv="Content-Security-Policy" content="img-src https: data:; style-src 'unsafe-inline' ${
      webview.cspSource
    }; script-src 'nonce-${nonce}';">
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


