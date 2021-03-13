let tsvscode = undefined;
import * as actions from '../../src/constants/actions.ts';

const setTsVscode = (vs) => {
    tsvscode = vs;
};

export const sendMessage = (data) => {
    tsvscode?.postMessage({ ...data });
};

export const fetchValues = () => {
    tsvscode?.postMessage({ type: actions.fetchLocalBranches });
    tsvscode?.postMessage({ type: actions.fetchAllRemoteBranches });
};

export const infoMessage = (data) => {
    tsvscode?.postMessage({ type: 'onInfo', data });
};
export const errorMessage = (data) => {
    tsvscode?.postMessage({ type: 'onError', data });
};

export const deleteLocalBranch = (branch) => {
    tsvscode?.postMessage({ type: actions.deleteLocalBranch, data: branch });
};

export const fetchRemoteBranch = (branch) => {
    console.log('hellllldsjcnksdjnc');
    tsvscode?.postMessage({
        type: actions.fetchRemoteBranchToLocal,
        data: branch
    });
};
export default setTsVscode;
