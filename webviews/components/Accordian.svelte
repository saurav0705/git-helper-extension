<script>
    import Tile from './Tile.svelte';
    import SideIcon from '../assets/icons/right.svg';
    import DownIcon from '../assets/icons/down.svg';

    export let title;
    export let list;
    export let type;
    let showList = [];
    let show = true;
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
        <div>
            {#if show}
                <DownIcon width="15px" />
            {:else}
                <SideIcon width="15px" />
            {/if}
        </div>
    </div>
    <div class={show ? 'content show' : 'content hide'}>
        <input
            type="search"
            bind:value={searchText}
            placeholder="Search Branch"
        />
        {#if showList.length > 0 || searchText.length}
            {#each showList as item, index}
                <Tile selected={item.selected} title={item.branch} {type} />
            {/each}
        {:else}
            {#each list as item, index}
                <Tile selected={item.selected} title={item.branch} {type} />
            {/each}
        {/if}
    </div>
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
            justify-content: space-between;
        }
        .content {
            overflow-y: scroll;
            max-height: 20vh;
        }
        .show {
            height: auto;
        }

        .hide {
            height: 0;
        }
    }
</style>
