<script>
    import { onMount } from 'svelte';
    import SortableList from 'svelte-sortable-list';
    import { slide } from 'svelte/transition';
    import SideIcon from '../assets/icons/right.svg';
    import DownIcon from '../assets/icons/down.svg';
    import setVar, { fetchFolders } from '../utils';
    import GitFolder from './GitFolder.svelte';
    let folders = [];
    let hidden = {};
    let selected;
    let selectedWorkSpace;
    const updateSelected = (name) => {
        if (selected === name) {
            selected = '';
            return;
        }
        selected = name;
    };

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
    const sortList = (ev) => {
        folders = ev.detail;
    };

    const toggleHiddenStatus = ({ name, path }) => {
        let updated = { ...hidden };
        if (updated[name]?.status) {
            updated[name].status = false;
            hidden = { ...updated };
            folders = [...folders, updated[name]];
            return;
        }
        updated[name] = {
            status: true,
            name,
            path
        };
        hidden = { ...updated };
        folders = folders.filter((item) => item.name !== name);
    };
    window.addEventListener('message', (event) => {
        const message = event.data; // The JSON data our extension sent

        switch (message.command) {
            case 'GIT_FOLDERS':
                folders = [...message.data];
                console.log({ folders });
                break;
        }
    });
</script>

<div>
    {#if Object.keys(hidden).some((item) => hidden[item].status)}
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
    <SortableList list={folders} key="name" on:sort={sortList} let:item>
        <div
            on:click={() => updateSelectedWorkspace(item.name)}
            class="workspace"
        >
            <div>{item.name}</div>
            <div>
                {#if selectedWorkSpace === item.name}
                    <DownIcon width="15px" />
                {:else}
                    <SideIcon width="15px" />
                {/if}
            </div>
        </div>
        {#if selectedWorkSpace === item.name}
            <div transition:slide>
                <SortableList
                    list={item.folders}
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
        {/if}
    </SortableList>
</div>

<style type="text/scss">
    .workspace {
        font-weight: 600;
        display: flex;
        justify-content: space-between;
        color: var(--vscode-textLink-foreground);
        cursor: pointer;
    }
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
