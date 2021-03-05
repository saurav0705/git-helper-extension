import * as vscode from 'vscode';
const terminal = vscode.window.createTerminal(`Ext Terminal `);

import * as cp from 'child_process';

const execShell = (cmd: string) =>
    new Promise<string>((resolve, reject) => {
        cp.exec(cmd, (err, out) => {
            if (err) {
                return reject(err);
            }
            return resolve(out.trim());
        });
    });

export const getLocalBranches = async () => {
    let data  = await execShell(`cd ${vscode.workspace.rootPath} && git branch`);
    return data;
}