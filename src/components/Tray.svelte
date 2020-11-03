<script lang="ts">
    export let letters: string[];

    import Tile from "./Tile.svelte";

    import { dropTarget } from "../actions/drop_target";

    let tray = [...letters, ""];

    $: {
        letters;
        tray = [...letters];

        for (let i = tray.length; i < 8; i++) {
            tray.push("");
        }

        // tray = tray;
    }

    let draggedIndex: number;
    let draggedLetter: string;

    function handleRemove(detail) {
        console.log("Remove", detail);

        if (detail.origin === "tray") {
            tray[detail.trayIndex] = "";
        } else {
            console.log("Wrong origin!", detail);
        }
        console.log(tray);
    }

    function handleDrop(e, i) {
        console.log("Drop", e.detail, i);

        if (tray[i] === "") {
            tray[i] = e.detail.dataset.letter;

            // Remove from origin.
            e.detail.notifier(e.detail);
        }

        console.log(tray);
    }

    function handleDragEnter(event, i) {
        console.log(event, i);

        draggedIndex = i;
        draggedLetter =  event.detail.dataset.letter;
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
    {#each tray as letter, i}
        <div
            data-droptarget={letter === ''}
            class:stretch={letter === ''}
            use:dropTarget={{ ondrop: (e) => {
                    handleDrop(e, i);
                }, ondragenter: (e) => {
                    handleDragEnter(e, i);
                }, ondragleave: (e) => {
                    handleDragLeave(e, i);
                } }}>
            {#if letter !== ''}
                <Tile
                    {letter}
                    isDraggable={true}
                    dragData={{ letter: letter, origin: 'tray', trayIndex: i, notifier: handleRemove }} />
            {:else if draggedIndex === i}
                <div class="no-pointer">
                    <Tile letter={draggedLetter} isDraggable={false} />
                </div>
            {/if}
        </div>
    {/each}
</div>
