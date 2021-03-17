<script>
    import SideIcon from '../assets/icons/right.svg';
    import DownIcon from '../assets/icons/down.svg';
    export let open;
</script>

<div class="open-close-block">
    {#if open}
        <DownIcon width="15px" />
    {:else}
        <SideIcon width="15px" />
    {/if}
</div>

<style>
    .open-close-block {
        display: inline-block;
    }
</style>
