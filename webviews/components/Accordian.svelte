<script>
    import Tile from './Tile.svelte';
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

<div>
    <div on:click={() => (show = !show)}>{title} ></div>
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

<style>
    .content {
        overflow: hidden;
    }
    .show {
        height: auto;
    }

    .hide {
        height: 0;
    }
</style>
