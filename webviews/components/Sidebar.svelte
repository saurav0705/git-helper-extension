<script>
    import Accordian from './Accordian.svelte';
    let branches = ['master', 'production', 'main'];
</script>

<div>
    <div>Git Helper</div>
    <button
        on:click={() => tsvscode.postMessage({ type: 'fetch-branhes', value: 'info' })}
        >info</button
    >
    <br />
    <button
        on:click={() =>
            tsvscode.postMessage({ type: 'onError', value: 'error' })}
        >Error</button
    >
    <Accordian title="Local Branches" list={branches} />
    <Accordian title="Global Branches" list={branches} />
</div>

<style>
    div {
        color: antiquewhite;
    }
</style>
