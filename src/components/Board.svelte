<script lang="ts">
  import { dropTarget } from "../actions/drop_target";

  import { Board } from "../lib/board";
  import { playFromScratchBoard } from "../lib/client/board";
  import { Play } from "../lib/play";

  import Tile from "./Tile.svelte";

  export let board: Board;
  export let play: Play;

  let scratchBoard: Board = Board.empty();

  $: scratchBoard = mergeBoard(board);
  $: play = playFromScratchBoard(board, scratchBoard)[0];

  function mergeBoard(referenceBoard: Board) {
    return Board.empty();

    for (let x = 0; x < 15; x++) {
      for (let y = 0; y < 15; y++) {
        if (
          scratchBoard.tiles[x][y] !== "" &&
          referenceBoard.tiles[x][y] !== ""
        ) {
          return Board.empty();
        }
      }
    }

    return scratchBoard;
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
      let value = event.detail.dataset.letter;

      if (value === " ") {
        const replaced = prompt(
          "What letter should be that blank?"
        ).toLowerCase();

        console.log(Play.isBlankTile(replaced));
        if (!Play.isBlankTile(replaced)) {
          dragValue = "";
          return;
        }

        value = replaced;
      }

      scratchBoard.tiles[x][y] = value;
      event.detail.notifier(event.detail);
    }

    dragValue = "";
  }

  function handleDragEnter(event, x, y) {
    if (board.tiles[x][y] === "" && scratchBoard.tiles[x][y] === "") {
      dragValue = event.detail.dataset.letter;
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
    min-width: 600px;
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
    grid-auto-flow: column;
    width: 100%;
    height: 100%;
    background-color: white;
  }

  .square {
    padding: 2px;
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
                dragData={{ origin: 'board', originX: x, originY: y, notifier: handleRemove }} />
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
