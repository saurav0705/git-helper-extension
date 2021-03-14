<script>
    import { onMount } from 'svelte';
    import setVar, { fetchFolders } from '../utils';
    import GitFolder from './GitFolder.svelte';
    let folders = [];
    let selected;
    const updateSelected = (name) => {
        if (selected === name) {
            selected = '';
            return;
        }
        selected = name;
    };
    onMount(() => {
        setVar(tsvscode);
        fetchFolders();
    });
    window.addEventListener('message', (event) => {
        const message = event.data; // The JSON data our extension sent

        switch (message.command) {
            case 'folders':
                folders = [...message.data];
                selected = message.data.length ? message.data[0].folder : '';
                break;
        }
    });
</script>

<div>
    <div>Git Helper</div>
    {#each folders as folder}
        <GitFolder
            name={folder.folder}
            path={folder.path}
            {selected}
            {updateSelected}
        />
    {/each}
</div>

<style>
</style>
