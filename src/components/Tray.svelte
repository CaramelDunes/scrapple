<script lang="ts">
    export let letters: string[];

    import Tile from "./Tile.svelte";

    import { dropTarget } from "../actions/drop_target";
    import { Play } from "../lib/play";
    import { shuffle } from "../lib/shuffle";

    let tray = [...letters, ""];

    $: updateTray(letters);

    function updateTray(letters: string[]) {
        console.log("Updating tray");
        tray = [...letters];

        for (let i = tray.length; i < 8; i++) {
            tray.push("");
        }
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
            if (!Play.isBlankTile(e.detail.dataset.letter)) {
                tray[i] = e.detail.dataset.letter;
            } else {
                tray[i] = " ";
            }

            // Remove from origin.
            e.detail.notifier(e.detail);
        }
    }

    function handleDragEnter(event, i) {
        draggedIndex = i;

        if (!Play.isBlankTile(event.detail.dataset.letter)) {
            draggedLetter = event.detail.dataset.letter;
        } else {
            draggedLetter = " ";
        }
    }

    function handleDragLeave(event, i) {
        draggedIndex = -1;
    }

    function shuffleTray() {
        tray = shuffle(tray);
    }
</script>

<style>
    .tray {
        display: grid;
        grid-template-columns: repeat(9, 1fr);
        background-color: green;
        width: 100%;
        padding: 0.5em;
        box-sizing: border-box;
        border-radius: 5px;
        align-items: center;
        grid-gap: 5px;
    }

    .stretch {
        align-self: stretch;
    }

    .no-pointer {
        pointer-events: none;
    }

    button {
        background-color: transparent;
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
                    dragData={{ origin: 'tray', trayIndex: i, notifier: handleRemove }} />
            {:else if draggedIndex === i}
                <div class="no-pointer">
                    <Tile letter={draggedLetter} isDraggable={false} />
                </div>
            {/if}
        </div>
    {/each}
    <button on:click={shuffleTray}>🔀</button>
</div>
