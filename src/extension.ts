
import * as vscode from 'vscode';
import { HelloWorldPanel } from './HelloWorldPanel';


export function activate(context: vscode.ExtensionContext) {

	console.log('Congratulations, your extension "git-helper" is now active!');



	context.subscriptions.push(vscode.commands.registerCommand('git-helper.helloWorld', () => {
		// vscode.window.showInformationMessage('Hello World from Git Helper!');
		HelloWorldPanel.createOrShow(context.extensionUri);
	}));


}

// this method is called when your extension is deactivated
export function deactivate() { }
