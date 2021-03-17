<script>
    import Tile from './Tile.svelte';
    import { slide } from 'svelte/transition';
    import OpenClose from './OpenClose.svelte';
    export let path;
    export let title;
    export let list;
    export let type;
    let showList = [];
    let show = false;
    let searchText = '';

    const filterList = () => {
        showList = list.filter((item) => item.branch.includes(searchText));
    };
    $: {
        if (searchText || true) {
            filterList();
        }
    }
</script>

<div class="accordian">
    <div on:click={() => (show = !show)} class="title">
        <div>{title}</div>
        <div class="search-result-count">
            {searchText.length ? showList.length : list.length}
        </div>
        <OpenClose open={show} />
    </div>
    {#if show}
        <div class="content" transition:slide>
            <input
                type="search"
                bind:value={searchText}
                placeholder="Search Branch"
            />
            <div class="results">
                {#if showList.length > 0 || searchText.length}
                    {#each showList as item, index}
                        <Tile
                            selected={item.selected}
                            title={item.branch}
                            {type}
                            {path}
                        />
                    {/each}
                {:else}
                    {#each list as item, index}
                        <Tile
                            selected={item.selected}
                            title={item.branch}
                            {type}
                            {path}
                        />
                    {/each}
                {/if}
            </div>
        </div>
    {/if}
</div>

<style type="text/scss">
    .accordian {
        padding: 5px 10px;
        margin-top: 4px;

        &:hover {
            box-shadow: -5px 5px 10px var(--vscode-input-background),
                5px -5px 10px var(--vscode-input-background);
        }
        .title {
            cursor: pointer;
            color: rgb(121, 212, 118);
            font-weight: 700;
            padding: 3px 0px;
            display: flex;
            .search-result-count {
                font-size: 7px;
                font-weight: 200;
                margin-left: auto;
            }
        }
        .content {
            overflow: hidden;
            .results {
                overflow-y: scroll;
                max-height: 20vh;
            }
        }
    }
</style>
