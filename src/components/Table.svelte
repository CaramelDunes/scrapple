<script lang="ts">
    import Board from "./Board.svelte";
    import Tray from "./Tray.svelte";

    import type { PublicGame } from "../lib/public_game";
    import type { Board as libBoard } from "../lib/board";

    export let game: PublicGame;
    export let tray: string[];
    export let scratchBoard: libBoard;
</script>

<style>
    .board {
        width: 100%;
        height: 100%;
    }

    .tray-container {
        display: grid;
        grid-template-columns: 12fr 3fr;
        margin-top: 1rem;
    }
</style>

<div class="board">
    <Board board={game.board} bind:scratchBoard />

    <div class="tray-container">
        <Tray letters={tray} />
        <slot name="controls" />
    </div>
</div>
