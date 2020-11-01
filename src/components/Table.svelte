<script lang="ts">
    import Board from "./Board.svelte";
    import Tray from "./Tray.svelte";

    import type { Game } from "../lib/game";

    export let game: Game;

    let tray = ["A", "B", "C", "D", "E", "F", "G"];
</script>

<style>
    .board {
        width: 100%;
        height: 100%;
    }

    :global(.dragged) {
        cursor: grabbing;
        z-index: 99;
        pointer-events: none;
        opacity: 50%;
    }

    :global(.draggable) {
        cursor: grab;
        z-index: 98;
    }

    :global(.drop-target) {
    }

    .tray-container {
        display: grid;
        grid-template-columns: 12fr 3fr;
        margin-top: 1rem;
    }

    .buttons {
        display: flex;
        flex-direction: column;
    }
</style>

<div class="board">
    <Board board={game.board.b} />

    <div class="tray-container">
        <Tray letters={tray} />
        <div class="buttons">
            <button>Pass</button>
            <button>Exchange tiles</button>
        </div>
    </div>
</div>
