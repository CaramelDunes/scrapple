<script lang="ts">
    import Tile from "./Tile.svelte";

    import { dropTarget } from "../actions/drop_target";
    import { Play } from "../lib/play";
    import { shuffle } from "../lib/shuffle";
    import type { Language } from "../lib/language";

    export let tray: string[];
    export let language: Language;

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
        width: 100%;
        height: 100%;
        display: grid;
        grid-template-columns: repeat(9, 1fr);
        align-items: center;
        grid-gap: 0.1em;
        padding: 0.2em;
        border-radius: 5px;
        background-color: green;
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
                    {language}
                    isDraggable={true}
                    dragData={{ origin: 'tray', trayIndex: i, notifier: handleRemove }} />
            {:else if draggedIndex === i}
                <div class="no-pointer">
                    <Tile
                        letter={draggedLetter}
                        {language}
                        isDraggable={false} />
                </div>
            {/if}
        </div>
    {/each}
    <button on:click={shuffleTray}>🔀</button>
</div>
