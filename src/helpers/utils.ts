import * as vscode from 'vscode';
import * as cp from 'child_process';
import * as fs from 'fs';
import * as path from 'path';

const execShell = (cmd: string) =>
    new Promise<string>((resolve, reject) => {
        cp.exec(cmd, (err, out) => {
            if (err) {
                return reject(err);
            }
            return resolve(out.trim());
        });
    });

export const getLocalBranches = async (path: string) => {
    let data: string = await execShell(`cd ${path} && git branch`);
    return data;
};
export const getRemoteBranches = async (path: string) => {
    let data = await execShell(`cd ${path} && git branch -r`);
    return data.replace(/origin\//g, '');
};

export const deleteLocalBranch = async (branch: string, path: string) => {
    try {
        let res = await execShell(
            `cd ${path} && git branch -D ${branch.trim()}`
        );
        return { data: res };
    } catch (err) {
        // eslint-disable-next-line no-throw-literal
        throw `Oops something happened not able to delete the branch: ${branch}`;
    }
};

export const fetchRemoteBranch = async (branch: string, path: string) => {
    try {
        let res = await execShell(
            `cd ${path} && git fetch origin ${branch.trim()}:${branch.trim()}`
        );
        return { data: res };
    } catch (err) {
        // eslint-disable-next-line no-throw-literal
        throw `Oops something happened not able to fetch the branch: ${branch}`;
    }
};

export const processResponse = (data: string) => {
    return data.split('\n').reduce((prev: any[], item: any) => {
        let obj = {
            selected: item.includes('*'),
            branch: item.replace('*', '')
        };
        if (item.includes('*')) {
            return [obj, ...prev];
        }
        return [...prev, obj];
    }, []);
};

const checkIfGitRepo = async (path: string) => {
    try {
        await execShell(`cd ${path}`);
        fs.existsSync(path.endsWith('/') ? `${path}.git` : `${path}.git`);
        return true;
    } catch (err) {
        return false;
    }
};

let FOLDERS: any = [];

export const setFoldersArray = (folders: any) => {
    FOLDERS = [...folders];
};

export const getFoldersArray = () => {
    return FOLDERS;
};
// recursive synchronous "walk" through a folder structure, with the given base path
const getAllSubFolders = (baseFolder: string, folderList: any = []) => {
    let folders: string[] = fs
        .readdirSync(baseFolder)
        .filter((file) =>
            fs.statSync(path.join(baseFolder, file)).isDirectory()
        );
    folders.forEach((folder) => {
        folderList.push(path.join(baseFolder, folder));
        if (folder === 'node_modules') {
            return;
        }
        getAllSubFolders(path.join(baseFolder, folder), folderList);
    });

    return folderList;
};

export const fetchAllGitFolders = () => {
    let result: any = vscode.workspace.workspaceFolders?.map(
        async ({ name, uri }) => {
            return { name, folders: getAllSubFolders(uri.path) };
        }
    );

    result = Promise.all(result);
    return result;
};
