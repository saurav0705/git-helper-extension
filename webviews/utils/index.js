let tsvscode = undefined;

const setTsVscode = (vs) => {
    tsvscode = vs;
};

export const sendMessage = (data) => {
    tsvscode?.postMessage({ ...data });
};

export const fetchValues = () => {
    tsvscode?.postMessage({ type: 'fetch-branhes' });
    tsvscode?.postMessage({ type: 'fetch-remote-branhes' });
};

export const infoMessage = (data) => {
    tsvscode?.postMessage({ type: 'onInfo', data });
};
export const errorMessage = (data) => {
    tsvscode?.postMessage({ type: 'onError', data });
};

export const deleteBranch = (branch) => {
    tsvscode?.postMessage({ type: 'deleteBranch', data: branch });
};
export default setTsVscode;
