<script>
    import { onMount } from 'svelte';
    import setVar, { fetchFolders } from '../utils';
    import GitFolder from './GitFolder.svelte';
    let folders = [];
    onMount(() => {
        setVar(tsvscode);
        fetchFolders();
    });
    window.addEventListener('message', (event) => {
        const message = event.data; // The JSON data our extension sent

        switch (message.command) {
            case 'folders':
                folders = [...message.data];
                break;
        }
    });
</script>

<div>
    <div>Git Helper</div>
    {#each folders as folder}
        <GitFolder name={folder.folder} path={folder.path} />
    {/each}
</div>

<style>
</style>
