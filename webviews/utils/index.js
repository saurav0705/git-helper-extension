let tsvscode = undefined;
import * as actions from '../../src/constants/actions.ts';

const setTsVscode = (vs) => {
    tsvscode = vs;
};

export const sendMessage = (data) => {
    tsvscode?.postMessage({ ...data });
};

export const fetchValues = (path) => {
    tsvscode?.postMessage({ type: actions.fetchLocalBranches, data: path });
    tsvscode?.postMessage({ type: actions.fetchAllRemoteBranches, data: path });
};

export const infoMessage = (data) => {
    tsvscode?.postMessage({ type: 'onInfo', data });
};
export const errorMessage = (data) => {
    tsvscode?.postMessage({ type: 'onError', data });
};

export const deleteLocalBranch = (branch, path) => {
    tsvscode?.postMessage({
        type: actions.deleteLocalBranch,
        data: { branch, path }
    });
};

export const fetchRemoteBranch = (branch, path) => {
    tsvscode?.postMessage({
        type: actions.fetchRemoteBranchToLocal,
        data: { branch, path }
    });
};

export const fetchFolders = () => {
    tsvscode?.postMessage({ type: actions.getAllGitFolders });
};
export default setTsVscode;
