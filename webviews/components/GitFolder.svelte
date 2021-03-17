<script>
    import { onMount } from 'svelte';
    import Accordian from './Accordian.svelte';
    import { slide } from 'svelte/transition';
    import setVar, { fetchValues, infoMessage } from '../utils';
    import HideIcon from '../assets/icons/hide.svg';
    import OpenClose from './OpenClose.svelte';
    export let path;
    export let name;
    export let selected;
    export let updateSelected;
    export let toggleHiddenStatus;
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

<div class="git-folder">
    <div class="title" on:click={() => updateSelected(name)}>
        <div class="name">{name}</div>
        <div class="icon">
            <span
                on:click|stopPropagation={() => {
                    toggleHiddenStatus({ name, path });
                    infoMessage(`Hidden Git Repo : ${name}`);
                }}
            >
                <HideIcon width="15px" />
            </span>
            <OpenClose open={selected === name} />
        </div>
    </div>
    {#if selected === name}
        <div class="content" transition:slide>
            <Accordian
                title="Local Branches"
                list={branches}
                type="local"
                {path}
            />
            <Accordian
                title="Remote Branches"
                list={remote_branches}
                type="remote"
                {path}
            />
        </div>
    {/if}
</div>

<style type="text/scss">
    .git-folder {
        padding: 3px;
        .content {
            overflow: hidden;
        }
        &:hover {
            outline: 1px solid var(--vscode-input-background);
        }
        .title {
            display: flex;
            position: relative;
            cursor: pointer;
            .name {
                font-weight: 800;
            }
            .icon {
                margin-left: auto;
                opacity: 0.5;
                &:hover {
                    opacity: 1;
                }
            }
        }
    }
</style>
