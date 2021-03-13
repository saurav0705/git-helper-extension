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
    return data.split('\n').reduce((prev, item) => {
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
        await execShell(`cd ${path} && git status`);
        return true;
    } catch (err) {
        return false;
    }
};

const findChildRepo = async (path: string) => {
    let dir = await execShell(`cd ${path} && ls -d */`);
    let result: any = await Promise.all(
        dir.split('\n').map(async (item) => {
            let isGitRepo;
            try {
                isGitRepo = await checkIfGitRepo(`${path}/${item}`);
            } catch (err) {
                isGitRepo = false;
            }
            return {
                folder: item.replace('/', ''),
                path: `${path}/${item}`,
                isGitRepo,
                childFolders: isGitRepo ? findChildRepo(`${path}/${item}`) : []
            };
        })
    );
    console.log(result);
    return Promise.all(result.filter((item: any) => item.isGitRepo));
};

export const fetchAllGitFolders = () => {
    let result: any = vscode.workspace.workspaceFolders?.map(
        async ({ name, uri }) => {
            let isGitRepo = await checkIfGitRepo(uri.path);
            return {
                folder: name,
                path: uri.path,
                isGitRepo
            };
        }
    );

    result = Promise.all(result);
    return result;
};
