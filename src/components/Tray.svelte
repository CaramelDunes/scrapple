<script lang="ts">
    export let letters: string[];

    import Tile from "./Tile.svelte";

    import { createEventDispatcher } from "svelte";
    const dispatch = createEventDispatcher();

    const tray = [...letters, ""];

    function handleDropped(e, i) {
        if (tray[i] === "") {
            tray[i] = e.detail.letter;

            // Remove from origin.
            e.detail.notifier(e.detail);
        }
    }

    function handleRemove(detail) {
        console.log(detail);

        if (detail.origin === "tray") {
            tray[detail.trayIndex] = "";
        } else {
            console.log("Wrong origin!");
        }
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
    }
</style>

<div class="tray">
    {#each Array(8) as _, i}
        <div
            class:drop-target={tray[i] === ''}
            on:mydrop={(e) => {
                console.log(e);
                handleDropped(e, i);
            }}
            on:mydragenter={(e) => {
                console.log(e);
            }}
            on:mydragleave={(e) => {
                console.log(e);
            }}>
            {#if tray[i] !== ''}
                <Tile
                    letter={tray[i]}
                    isDraggable={true}
                    dragData={{ letter: tray[i], origin: 'tray', trayIndex: i, notifier: handleRemove }} />
            {/if}
        </div>
    {/each}
</div>
