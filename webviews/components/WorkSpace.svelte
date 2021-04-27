<script>
    import GitFolder from './GitFolder.svelte';
    import SortableList from 'svelte-sortable-list';
    import { slide } from 'svelte/transition';
    export let workspaceFolders;
    let hidden = {};
    let selected;
    const updateSelected = (name) => {
        if (selected === name) {
            selected = '';
            return;
        }
        selected = name;
    };
    const sortList = (ev) => {
        workspaceFolders = ev.detail;
    };

    const toggleHiddenStatus = ({ name, path }) => {
        let updated = { ...hidden };
        if (updated[name]?.status) {
            updated[name].status = false;
            hidden = { ...updated };
            workspaceFolders = [...workspaceFolders, updated[name]];
            return;
        }
        updated[name] = {
            status: true,
            name,
            path
        };
        hidden = { ...updated };
        workspaceFolders = workspaceFolders.filter(
            (item) => item.name !== name
        );
    };
</script>

{#if Object.keys(hidden).some((item) => hidden[item]?.status)}
    <div class="hidden-folders">
        <div class="title">Hidden Folders</div>
        <div class="content">
            {#each Object.keys(hidden) as key}
                {#if hidden[key].status}
                    <div
                        on:click={() => toggleHiddenStatus(hidden[key])}
                        class="hidden-icon-pill"
                    >
                        {hidden[key].name}
                    </div>
                {/if}
            {/each}
        </div>
    </div>
{/if}
<div transition:slide>
    <SortableList
        list={workspaceFolders}
        key="path"
        on:sort={sortList}
        let:item
    >
        <GitFolder
            name={item.name}
            path={item.path}
            {selected}
            {updateSelected}
            {toggleHiddenStatus}
        />
    </SortableList>
</div>

<style type="text/scss">
    .hidden-folders {
        .title {
            font-weight: 600;
        }
        .content {
            display: flex;
            overflow-x: scroll;
            .hidden-icon-pill {
                background-color: var(--vscode-input-background);
                opacity: 0.5;
                cursor: pointer;
                border-radius: 8%;
                margin: 1px;
                padding: 3px 6px;
                white-space: nowrap;
                &:hover {
                    opacity: 1;
                }
            }
        }
    }
</style>
