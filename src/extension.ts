import * as vscode from 'vscode';
import { HelloWorldPanel } from './HelloWorldPanel';
import { SidebarProvider } from './SideBarProvider';

export function activate(context: vscode.ExtensionContext) {
    console.log('Congratulations, your extension "git-helper" is now active!');

    const sidebarProvider = new SidebarProvider(context.extensionUri);
    context.subscriptions.push(
        vscode.window.registerWebviewViewProvider(
            'git-helper-sidebar',
            sidebarProvider
        )
    );

    context.subscriptions.push(
        vscode.commands.registerCommand('git-helper.helloWorld', () => {
            // vscode.window.showInformationMessage('Hello World from Git Helper!');
            HelloWorldPanel.createOrShow(context.extensionUri);
        })
    );
    context.subscriptions.push(
        vscode.commands.registerCommand('git-helper.refresh', async () => {
            // vscode.window.showInformationMessage('Hello World from Git Helper!');
            // HelloWorldPanel.createOrShow(context.extensionUri);
            // HelloWorldPanel.kill();
            // HelloWorldPanel.createOrShow(context.extensionUri);
            await vscode.commands.executeCommand(
                'workbench.action.closeSidebar'
            );
            await vscode.commands.executeCommand(
                'workbench.view.extension.git-helper-sidebar-view'
            );

            setTimeout(
                () =>
                    vscode.commands.executeCommand(
                        'workbench.action.webview.openDeveloperTools'
                    ),
                500
            );
        })
    );
}

// this method is called when your extension is deactivated
export function deactivate() {}
