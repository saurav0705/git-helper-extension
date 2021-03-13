<script>
    import { onMount } from 'svelte';
    import Accordian from './Accordian.svelte';
    import setVar, { fetchValues } from '../utils';
    export let path;
    export let name;
    let branches = [];
    let remote_branches = [];
    onMount(() => {
        setVar(tsvscode);
        fetchValues(path);
    });
    window.addEventListener('message', (event) => {
        const message = event.data; // The JSON data our extension sent

        switch (message.command) {
            case `${path}local_branches`:
                branches = [...message.data];
                break;
            case `${path}remote_branches`:
                remote_branches = [...message.data];
                break;
            case `${path}refresh`:
                fetchValues(path);
                break;
        }
    });
</script>

<div class="git-folder">
    <div class="title">
        <div class="name">{name}</div>
    </div>
    <Accordian title="Local Branches" list={branches} type="local" {path} />
    <Accordian
        title="Remote Branches"
        list={remote_branches}
        type="remote"
        {path}
    />
</div>

<style type="text/scss">
    .git-folder {
        padding: 3px;
        &:hover {
            outline: 1px solid var(--vscode-input-background);
        }
        .title {
            display: flex;
            position: relative;
            .name {
                font-weight: 800;
            }
        }
    }
</style>
