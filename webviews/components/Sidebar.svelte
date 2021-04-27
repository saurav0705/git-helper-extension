<script>
    import { onMount } from 'svelte';
    import setVar, { fetchFolders } from '../utils';
    import OpenClose from './OpenClose.svelte';
    import WorkSpace from './WorkSpace.svelte';
    let folders = [];
    let selectedWorkSpace;

    const updateSelectedWorkspace = (name) => {
        if (selectedWorkSpace === name) {
            selectedWorkSpace = '';
            return;
        }
        selectedWorkSpace = name;
    };
    onMount(() => {
        setVar(tsvscode);
        fetchFolders();
    });

    window.addEventListener('message', (event) => {
        const message = event.data; // The JSON data our extension sent

        switch (message.command) {
            case 'GIT_FOLDERS':
                folders = [...message.data];
                break;
        }
    });
</script>

<div>
    {#each folders as workspace}
        <div
            on:click={() => updateSelectedWorkspace(workspace.name)}
            class="workspace"
        >
            <div>{workspace.name}</div>
            <OpenClose open={selectedWorkSpace === workspace.name} />
        </div>
        <!-- {#if selectedWorkSpace === workspace.name} -->
        <WorkSpace workspaceFolders={workspace.folders} />
        <!-- {/if} -->
    {/each}
</div>

<style type="text/scss">
    .workspace {
        font-weight: 600;
        display: flex;
        justify-content: space-between;
        color: var(--vscode-textLink-foreground);
        cursor: pointer;
    }
</style>
