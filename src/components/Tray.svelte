<script lang="ts">
    export let letters: string[];

    import Tile from "./Tile.svelte";

    import { createEventDispatcher } from "svelte";
    import { dropTarget } from "../actions/drop_target";
    const dispatch = createEventDispatcher();

    let tray = [...letters, ""];

    $: {
        letters;
        tray = [...letters, ""];
    }

    let draggedIndex: number;
    let draggedLetter: string;

    function handleRemove(detail) {
        if (detail.origin === "tray") {
            tray[detail.trayIndex] = "";
        } else {
            console.log("Wrong origin!", detail);
        }
    }

    function handleDrop(e, i) {
        if (tray[i] === "") {
            tray[i] = e.detail.letter;

            // Remove from origin.
            e.detail.notifier(e.detail);
        }
    }

    function handleDragEnter(event, i) {
        draggedIndex = i;
        draggedLetter = event.detail.letter;
    }

    function handleDragLeave(event, i) {
        draggedIndex = -1;
    }
</script>

<style>
    .tray {
        display: grid;
        grid-template-columns: repeat(8, 1fr);
        background-color: green;
        width: 100%;
        padding: 0.5em;
        box-sizing: border-box;
        border-radius: 5px;
        align-items: center;
    }

    .stretch {
        align-self: stretch;
    }

    .no-pointer {
        pointer-events: none;
    }
</style>

<div class="tray">
    {#each Array(8) as _, i}
        <div
            data-droptarget={tray[i] === ''}
            class:stretch={tray[i] === ''}
            use:dropTarget={{ ondrop: (e) => {
                    handleDrop(e, i);
                }, ondragenter: (e) => {
                    handleDragEnter(e, i);
                }, ondragleave: (e) => {
                    handleDragLeave(e, i);
                } }}>
            {#if tray[i] !== ''}
                <Tile
                    letter={tray[i]}
                    isDraggable={true}
                    dragData={{ letter: tray[i], origin: 'tray', trayIndex: i, notifier: handleRemove }} />
            {:else if draggedIndex === i}
                <div class="no-pointer">
                    <Tile letter={draggedLetter} isDraggable={false} />
                </div>
            {/if}
        </div>
    {/each}
</div>
