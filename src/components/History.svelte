<script lang="ts">
    import type { PublicGame } from "../lib/public_game";

    import type { Word } from "../lib/word";

    export let highlightedWords: Word[];
    export let game: PublicGame;
    export let prefixes: string[];
</script>

<style>
    .history {
        overflow: auto;
        padding: 0.25em 0;
    }

    ol {
        margin: 0;
        padding: 0;
    }

    ol li {
        color: black;
        padding: 0.25em 0.5em;
    }

    ol li:nth-child(even) {
        background-color: #f2f2f2;
    }
</style>

<div class="history">
    <ol reversed>
        {#each game.history as item, i}
            {#if item.passed}
                <li>{prefixes[game.playerTurn ^ (i & 1) ^ 1]} passed</li>
            {:else if item.exchangedTiles > 0}
                <li>
                    {prefixes[game.playerTurn ^ (i & 1) ^ 1]}
                    exchanged
                    {item.exchangedTiles}
                    tiles
                </li>
            {:else}
                <li>
                    <div
                        on:mouseover={() => {
                            highlightedWords = item.words;
                        }}
                        on:mouseout={() => {
                            highlightedWords = [];
                        }}>
                        {prefixes[game.playerTurn ^ (i & 1) ^ 1]}
                        played
                        <b>{item.words
                                .map(
                                    (w) => w.letters.join('') + ` (${w.points})`
                                )
                                .join(' + ')}
                            =
                            {item.points}</b>
                    </div>
                </li>
            {/if}
        {/each}
    </ol>
</div>
