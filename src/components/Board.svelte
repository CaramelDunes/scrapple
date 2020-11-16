<script lang="ts">
  import { dropTarget } from "../actions/drop_target";

  import { Board } from "../lib/board";
  import type { Word } from "../lib/word";
  import { playFromScratchBoard } from "../lib/client/board";
  import type { Language } from "../lib/language";
  import { Direction, Play } from "../lib/play";

  import Tile from "./Tile.svelte";

  export let board: Board;
  export let language: Language;
  export let play: Play;
  export let highlightedWords: Word[];
  export let scratchBoard: Board;

  $: play = playFromScratchBoard(board, scratchBoard)[0];

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

  function isHighlighted(x, y, w) {
    if (w.direction === Direction.Horizontal) {
      return y === w.y && x >= w.x && x < w.x + w.letters.length;
    } else {
      return x === w.x && y >= w.y && y < w.y + w.letters.length;
    }
  }
</script>

<style>
  .grid {
    display: grid;
    grid-template-columns: repeat(15, 1fr);
    grid-template-rows: repeat(15, 1fr);
    grid-auto-flow: column;
    width: 100%;
    height: 100%;
    background-color: white;
    border: 3px solid #f4f4f4;
    border-radius: 5px;
  }

  .square {
    border-radius: 5px;
    user-select: none;
    border: 1px solid #f4f4f4;
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
    opacity: 0.75;
    width: 100%;
    height: 100%;
  }

  .no-pointer {
    pointer-events: none;
  }

  .highlighted {
    border-width: 0;
    box-shadow: 0 0 0 3px palegreen;
    z-index: 99;
  }
</style>

<div class="grid">
  {#each board.tiles as _, x}
    {#each scratchBoard.tiles as _, y}
      <div
        class="square"
        class:double-word={Board.isDoubleWord(x, y)}
        class:triple-word={Board.isTripleWord(x, y)}
        class:double-letter={Board.isDoubleLetter(x, y)}
        class:triple-letter={Board.isTripleLetter(x, y)}
        class:highlighted={highlightedWords.some((w) => isHighlighted(x, y, w))}
        data-droptarget={board.tiles[x][y] === ''}
        use:dropTarget={{ ondrop: (e) => {
            handleDrop(e, x, y);
          }, ondragenter: (e) => {
            handleDragEnter(e, x, y);
          }, ondragleave: (e) => {
            handleDragLeave(e, x, y);
          } }}>
        {#if board.tiles[x][y] !== ''}
          <Tile letter={board.tiles[x][y]} {language} />
        {:else if scratchBoard.tiles[x][y] !== ''}
          <div class="phantom">
            <Tile
              letter={scratchBoard.tiles[x][y]}
              {language}
              isDraggable={true}
              dragData={{ origin: 'board', originX: x, originY: y, notifier: handleRemove }} />
          </div>
        {:else if dragX == x && dragY == y && dragValue !== ''}
          <div class="phantom no-pointer">
            <Tile letter={dragValue} {language} />
          </div>
        {/if}
      </div>
    {/each}
  {/each}
</div>
