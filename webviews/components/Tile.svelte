<script>
    import Trash from '../assets/icons/trash.svg';
    import Fetch from '../assets/icons/pull.svg';
    import {
        infoMessage,
        errorMessage,
        deleteLocalBranch,
        fetchRemoteBranch
    } from '../utils';

    const actions = {
        local: [
            { title: 'delete', component: Trash, action: deleteLocalBranch },
            { title: 'fetch', component: Fetch, action: infoMessage }
        ],
        remote: [
            { title: 'fetch', component: Fetch, action: fetchRemoteBranch }
        ]
    };

    export let title;
    export let selected;
    export let type;

    const width = {
        width: '15px'
    };
</script>

<div class="tile-container">
    <div class={selected ? 'selected' : ''}>{title}</div>
    <div class="actions">
        {#each actions[type] as item}
            <span
                class={selected && item.title === 'delete'
                    ? `option ${item.title}`
                    : `option ${item.title}`}
                on:click={selected && item.title === 'delete'
                    ? () =>
                          errorMessage(
                              'cannot perform deletion on current branch'
                          )
                    : () => item.action(title)}
            >
                <svelte:component this={item.component} {...width} />
            </span>
        {/each}
    </div>
</div>

<style type="text/scss">
    .tile-container {
        display: flex;
        align-items: center;
        padding: 1px 2px;
        &:hover {
            background-color: var(--vscode-editor-selectionBackground);
        }
        .title {
        }
        .selected {
            color: var(--vscode-textLink-activeForeground);
        }
        .actions {
            margin-left: auto;
        }

        .option {
            cursor: pointer;
            opacity: 0.6;
            &:hover {
                opacity: 1;
            }
        }
        .disabled {
            cursor: not-allowed;
            opacity: 0.3;
        }

        .delete:hover {
            opacity: 1;
        }
    }
</style>
