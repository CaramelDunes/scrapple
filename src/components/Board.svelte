<script lang="ts">
  import { Board, emptyBoard } from "../lib/board";

  import Tile from "./Tile.svelte";

  export let board: string[][];

  let phantomBoard: string[][] = emptyBoard;

  let dragValue: string = "";
  let dragX: number;
  let dragY: number;

  function onMovedOut(detail) {
    console.log(detail);

    if (detail.origin === "board") {
      phantomBoard[detail.originX][detail.originY] = "";
    } else {
      console.log("Wrong origin!");
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
</style>

<div class="container">
  <div class="grid">
    {#each board as row, x}
      {#each row as square, y}
        <div
          class="square"
          class:triple-word={Board.isTripleWord(x, y)}
          class:double-word={Board.isDoubleWord(x, y)}
          class:double-letter={Board.isDoubleLetter(x, y)}
          class:triple-letter={Board.isTripleLetter(x, y)}
          class:drop-target={square === ''}
          on:mydrop={(e) => {
            if (square === '') {
              phantomBoard[x][y] = e.detail.letter;
              e.detail.notifier(e.detail);
            }
            dragValue = '';
          }}
          on:mydragenter={(e) => {
            console.log(e);
            if (square === '' && phantomBoard[x][y] === '') {
              dragValue = e.detail.letter;
              dragX = x;
              dragY = y;
            }
          }}
          on:mydragleave={(e) => {
            console.log(e);
            if (square === '' && phantomBoard[x][y] === '') {
              dragValue = '';
            }
          }}>
          {#if square !== ''}
            <Tile letter={square} />
          {:else if phantomBoard[x][y] !== ''}
            <div class="phantom">
              <Tile
                letter={phantomBoard[x][y]}
                isDraggable={true}
                dragData={{ letter: phantomBoard[x][y], origin: 'board', originX: x, originY: y, notifier: onMovedOut }} />
            </div>
          {:else if dragX == x && dragY == y && dragValue !== ''}
            <div class="phantom">
              <Tile letter={dragValue} />
            </div>
          {/if}
        </div>
      {/each}
    {/each}
  </div>
</div>
