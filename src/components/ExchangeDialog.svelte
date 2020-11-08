<script lang="ts">
    import type { Language } from "../lib/language";

    import Dialog from "./Dialog.svelte";
    import Tile from "./Tile.svelte";

    export let tray: string[];
    export let language: Language;
    export let exchangeCallback: (tiles: string[]) => void;
    export let closeCallback: () => void;

    let exchangeSelection = [false, false, false, false, false, false, false];
</script>

<style>
    .card {
        flex: 1 1 0px;
        background-color: white;
        border: 3px solid lightgrey;
        border-radius: 10px;
        padding: 10px;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: space-between;
        margin: 8px;
        box-shadow: 2px 2px 8px rgba(0, 0, 0, 0.1);
    }

    .tile-selector {
        display: grid;
        grid-template-columns: repeat(4, 1fr);
        width: 100%;
    }
</style>

<Dialog>
    <div class="card">
        Please select the tiles you want to exchange.
        <div class="tile-selector">
            {#each tray as tile, i}
                <label style="margin:3px;text-align:center;">
                    <Tile letter={tile} {language} />
                    <input
                        type="checkbox"
                        on:change={(e) => {
                            if ('checked' in e.target) {
                                exchangeSelection[i] = e.target['checked'];
                            }
                        }}
                        checked={exchangeSelection[i]} /></label>
            {/each}
        </div>
        <div class="controls">
            <button
                disabled={exchangeSelection.every((x) => !x)}
                on:click={() => {
                    exchangeCallback(tray.filter((_, i) => exchangeSelection[i]));
                    closeCallback();
                    exchangeSelection = [false, false, false, false, false, false, false];
                }}>Exchange</button>
            <button on:click={closeCallback}>Cancel</button>
        </div>
    </div>
</Dialog>
