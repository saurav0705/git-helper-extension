<script>
    import Tile from './Tile.svelte';
    export let title;
    export let list;
    export let type;
    let show = true;
</script>

<div>
    <div on:click={() => (show = !show)}>{title} ></div>
    <div class={show ? 'content show' : 'content hide'}>
        {#each list as item, index}
            <Tile selected={item.selected} title={item.branch} type={type}/>
        {/each}
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
