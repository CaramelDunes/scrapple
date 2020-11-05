<script lang="ts">
    import Board from "./Board.svelte";
    import Tray from "./Tray.svelte";

    import type { PublicGame } from "../lib/public_game";
    import type { Play } from "../lib/play";

    export let game: PublicGame;
    export let tray: string[];
    export let play: Play;
</script>

<style>
    .board {
        min-width: 525px;
        max-height: 100vh;
        max-width: 100vh;
    }

    .tray-container {
        margin-top: 0.5rem;
    }
</style>

<div class="board">
    <Board board={game.board} bind:play />

    {#if tray}
        <div class="tray-container">
            <Tray letters={tray} />
        </div>
    {/if}
</div>
