<script lang="ts">
  import { dropTarget } from "../actions/drop_target";

  import { Board } from "../lib/board";

  import Tile from "./Tile.svelte";

  export let board: Board;
  export let scratchBoard: Board = Board.empty();

  $: {
    board;
    scratchBoard = Board.empty();
  }

  let dragValue: string = "";
  let dragX: number;
  let dragY: number;

  function handleRemove(detail) {
    if (detail.origin === "board") {
      scratchBoard.tiles[detail.originX][detail.originY] = "";
    } else {
      console.log("Wrong origin!", detail);
    }
  }

  function handleDrop(event, x, y) {
    if (scratchBoard.tiles[x][y] === "") {
      scratchBoard.tiles[x][y] = event.detail.letter;
      event.detail.notifier(event.detail);
    }

    dragValue = "";
  }

  function handleDragEnter(event, x, y) {
    if (board.tiles[x][y] === "" && scratchBoard.tiles[x][y] === "") {
      dragValue = event.detail.letter;
      dragX = x;
      dragY = y;
    }
  }

  function handleDragLeave(event, x, y) {
    if (board.tiles[x][y] === "" && scratchBoard.tiles[x][y] === "") {
      dragValue = "";
    }
  }
</script>

<style>
  .container {
    position: relative;
    width: 100%;
  }
  .container:after {
    content: "";
    display: block;
    padding-bottom: 100%;
  }

  .grid {
    position: absolute;
    display: grid;
    grid-template-columns: repeat(15, 1fr);
    grid-template-rows: repeat(15, 1fr);
    width: 100%;
    height: 100%;
    background-color: white;
  }

  .square {
    padding: 3px;
    border-radius: 5px;
    user-select: none;
  }

  .double-word {
    background-color: purple;
  }

  .triple-word {
    background-color: red;
  }

  .triple-letter {
    background-color: blue;
  }

  .double-letter {
    background-color: lightblue;
  }

  .phantom {
    opacity: 75%;
    width: 100%;
    height: 100%;
  }

  .no-pointer {
    pointer-events: none;
  }
</style>

<div class="container">
  <div class="grid">
    {#each board.tiles as _, x}
      {#each scratchBoard.tiles as _, y}
        <div
          class="square"
          class:triple-word={Board.isTripleWord(x, y)}
          class:double-word={Board.isDoubleWord(x, y)}
          class:double-letter={Board.isDoubleLetter(x, y)}
          class:triple-letter={Board.isTripleLetter(x, y)}
          data-droptarget={board.tiles[x][y] === ''}
          use:dropTarget={{ ondrop: (e) => {
              handleDrop(e, x, y);
            }, ondragenter: (e) => {
              handleDragEnter(e, x, y);
            }, ondragleave: (e) => {
              handleDragLeave(e, x, y);
            } }}>
          {#if board.tiles[x][y] !== ''}
            <Tile letter={board.tiles[x][y]} />
          {:else if scratchBoard.tiles[x][y] !== ''}
            <div class="phantom">
              <Tile
                letter={scratchBoard.tiles[x][y]}
                isDraggable={true}
                dragData={{ letter: scratchBoard.tiles[x][y], origin: 'board', originX: x, originY: y, notifier: handleRemove }} />
            </div>
          {:else if dragX == x && dragY == y && dragValue !== ''}
            <div class="phantom no-pointer">
              <Tile letter={dragValue} />
            </div>
          {/if}
        </div>
      {/each}
    {/each}
  </div>
</div>
