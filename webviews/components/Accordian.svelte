<script lang="ts">
import { onMount } from "svelte";


    export let title: String;
    export let list: Array <[]>;
    let show = true;
</script>

<div>
    <div on:click={() => (show = !show)}>{title} ></div>
    <div class={show ? 'content show' : 'content hide'}>
        {#each list as item, index}
            <div>{index + 1}. {item}</div>
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
