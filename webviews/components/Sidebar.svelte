<script>
    import { onMount } from 'svelte';
    import Accordian from './Accordian.svelte';
    import setVar,{sendMessage,fetchValues} from '../utils';
    let branches = [];
    let remote_branches = []
    onMount(()=>{
        setVar(tsvscode);
        fetchValues();
    })
    window.addEventListener('message', event => {

            const message = event.data; // The JSON data our extension sent

            switch (message.command) {
                case 'local_branches':
                    branches = [...message.data];
                    break;
                case 'remote_branches':
                    remote_branches = [...message.data];
                    break;
            }
            });
</script>

<div>
    <div>Git Helper</div>
    <button
        on:click={() => sendMessage({ type: 'fetch-branhes', value: 'info' })}
        >info</button
    >
    <br />
    <button
        on:click={() =>
            sendMessage({ type: 'fetch-remote-branhes', value: 'error' })}
        >Error</button
    >
    <Accordian title="Local Branches" list={branches} type="local" />
    <Accordian title="Global Branches" list={remote_branches} type="remote"/>
</div>

<style>
    div {
        color: antiquewhite;
    }
</style>
