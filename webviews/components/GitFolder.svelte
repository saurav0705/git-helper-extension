<script>
    import { onMount } from 'svelte';
    import Accordian from './Accordian.svelte';
    import setVar, { fetchValues } from '../utils';
    export let path;
    export let name;
    let branches = [];
    let remote_branches = [];
    onMount(() => {
        setVar(tsvscode);
        fetchValues(path);
    });
    window.addEventListener('message', (event) => {
        const message = event.data; // The JSON data our extension sent

        switch (message.command) {
            case `${path}local_branches`:
                branches = [...message.data];
                break;
            case `${path}remote_branches`:
                remote_branches = [...message.data];
                break;
            case `${path}refresh`:
                fetchValues(path);
                break;
        }
    });
</script>

<div>
    <div>{name}</div>
    <Accordian title="Local Branches" list={branches} type="local" {path} />
    <Accordian
        title="Global Branches"
        list={remote_branches}
        type="remote"
        {path}
    />
</div>

<style>
    div {
        color: antiquewhite;
    }
</style>
