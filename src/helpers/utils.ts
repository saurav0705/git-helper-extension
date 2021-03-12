import * as vscode from 'vscode';
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
        let data:string  = await execShell(`cd ${vscode.workspace.rootPath} && git branch`);
        return data;
}
export const getRemoteBranches = async () => {
        let data = await execShell(`cd ${vscode.workspace.rootPath} && git branch -r`);
        return data.replaceAll("origin/","");
    
}

export const deleteLocalBranch = async (branch:string) => {
    try{
    let res = await execShell(`cd ${vscode.workspace.rootPath} && git branch -D ${branch}`);
    return {data: res};
    } catch(err){
        return {error : "Oops something happened not able to delte the branch"}
    }
}

export const processResponse = (data:string) => {
    let branchArray:string[] = data.split("\n");
    return branchArray.map(item => ({selected:item.includes("*"),branch:item.replace("*","")}))
}