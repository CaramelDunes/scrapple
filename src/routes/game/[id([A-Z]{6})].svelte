<script context="module" lang="ts">
    export async function preload(page, session) {
        let playerId;
        let playerKey;

        if (page.params.id in session.cookies) {
            const tokens = session.cookies[page.params.id].split(":");

            if (tokens.length === 2) {
                playerId = parseInt(tokens[0]);
                playerKey = tokens[1];
            }
        }

        let res;

        if (playerKey) {
            res = await this.fetch(
                `game.json?id=${page.params.id}&playerId=${playerId}&playerKey=${playerKey}`
            );
        } else {
            res = await this.fetch(`game.json?id=${page.params.id}`);
        }

        const game = await res.json();

        return {
            playerId: playerId,
            playerKey: playerKey,
            gameId: page.params.id,
            rawGame: game.game,
            tray: game.tray,
        };
    }
</script>

<script lang="ts">
    import Pusher from "pusher-js";
    import {
        PUSHER_APP_CLUSTER,
        PUSHER_APP_KEY,
    } from "../../lib/client/pusher";

    import { onMount } from "svelte";
    import { PublicGame } from "../../lib/public_game";
    import type { Word } from "../../lib/word";
    import Board from "../../components/Board.svelte";
    import Tray from "../../components/Tray.svelte";

    export let playerId: number;
    export let playerKey: string;
    export let gameId: string;
    export let rawGame;
    export let tray: string[];

    let game = PublicGame.fromPojo(rawGame);

    let channel;

    onMount(() => {
        if (!game.ended) {
            Pusher.logToConsole = true;

            const pusher = new Pusher(PUSHER_APP_KEY, {
                cluster: PUSHER_APP_CLUSTER,
            });

            channel = pusher.subscribe(gameId);

            channel.bind("board", function (data) {
                console.log("From Pusher", data.message);
                game = PublicGame.fromPojo(data.message);
            });
        }
    });

    async function put(payload) {
        const response = await fetch(`/game.json`, {
            method: "PUT",
            cache: "no-cache",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(payload),
        });

        if (response.ok) {
            const pojo = await response.json();

            if (pojo.success) {
                console.log("From Put", pojo);
                game = PublicGame.fromPojo(pojo.game);
                tray = pojo.tray;
            }
        } else {
            console.log("Not ok");
        }
    }

    async function play() {
        await put({
            gameId: gameId,
            playerId: playerId,
            playerKey: playerKey,
            play: currentPlay,
        });
    }

    async function exchangeTiles(tiles: string[]) {
        await put({
            gameId: gameId,
            playerId: playerId,
            playerKey: playerKey,
            exchange: true,
            exchangedTiles: tiles,
        });
    }

    async function pass() {
        await put({
            gameId: gameId,
            playerId: playerId,
            playerKey: playerKey,
            pass: true,
        });
    }

    let playTooltip = "";
    let currentPlay = null;
    let currentWords: Word[] = [];

    $: {
        currentWords = [];

        if (currentPlay && game.board.isValidPlay(currentPlay)) {
            currentWords = game.board.wordsFromPlay(currentPlay, game.language);
        }
    }

    const prefixes = playerKey
        ? ["You", "Your opponent"]
        : ["Player #1", "Player #2"];

    if (playerKey && playerId === 1) prefixes.reverse();
</script>

<style>
    .wrapper {
        display: flex;
        justify-content: center;
        align-items: stretch;
        flex-flow: row wrap;
    }

    .history {
        overflow: auto;
        padding: 0.25em 0;
    }

    .column {
        display: flex;
        flex-direction: column;
        border-radius: 10px;
        border: solid 3px #d0d0d0;
    }

    .game-info {
        text-align: center;
        padding: 1em;
    }

    .header {
        font-weight: bold;
        text-transform: uppercase;
        background-color: #d0d0d0;
        border: solid 3px #d0d0d0;
        padding: 5px;
        font-size: large;
        text-align: center;
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

    .scores {
        display: grid;
        grid-template-columns: 1fr 1fr;
        grid-template-rows: 1fr 1fr;
        grid-auto-flow: column;
        text-align: center;
    }

    .tray-container {
        padding: 0.25rem;
    }

    .board {
        margin: 0 auto;
    }

    .controls {
        display: flex;
        align-items: stretch;
    }

    .controls > button {
        flex: 1 1 0;
    }

    @media (orientation: landscape) {
        .board {
            width: 84vh;
            height: 84vh;
            font-size: 4.2vh;
        }

        .tray-container {
            width: 84vh;
            font-size: 6.7vh;
        }

        .column {
            margin-top: 0.25em;
        }
    }

    @media (orientation: portrait) {
        .board {
            height: 100vw;
            width: 100vw;
            font-size: 5vw;
        }

        .tray-container {
            width: 100vw;
            font-size: 8vw;
        }
    }
</style>

<svelte:head>
    <title>Game - {gameId}</title>
</svelte:head>

<div class="wrapper">
    <div class="table">
        <div class="board">
            <Board
                board={game.board}
                language={game.language}
                bind:play={currentPlay} />
        </div>

        {#if tray}
            <div class="tray-container">
                <Tray language={game.language} letters={tray} />
            </div>
        {/if}
        <div class="controls">
            {#if playerKey}
                <button
                    style="flex-grow:3;"
                    on:click={play}
                    disabled={game.playerTurn !== playerId || currentWords.length === 0}
                    title={playTooltip}>Play
                    {currentWords
                        .map((w) => w.letters.join('') + ` (${w.points})`)
                        .join(', ')}</button>
                <button
                    on:click={pass}
                    disabled={game.playerTurn !== playerId}
                    title="Pass and score 0">Pass</button>
                <button
                    disabled={game.playerTurn !== playerId}
                    title="Exchange one or more tiles and score 0">Exchange
                    tiles</button>
            {/if}
        </div>
    </div>

    <div class="column">
        <div class="header">Turn {game.history.length + 1}</div>
        <div class="game-info">
            <div class="scores">
                <div>{prefixes[0]}</div>
                <div>{game.scores[0]}</div>
                <div>{prefixes[1]}</div>
                <div>{game.scores[1]}</div>
            </div>
            <div>{game.bagSize} tiles left.</div>
            <div>This game's code: {gameId}.</div>
        </div>

        <!-- <div>${"location.href.replace('game', 'join')"}<a href="s">📋</a></div> -->
        <div class="header">History</div>
        <div class="history">
            <ol reversed>
                {#each game.history as item, i}
                    {#if item.passed}
                        <li>
                            {prefixes[game.playerTurn ^ (i & 1) ^ 1]}
                            passed
                        </li>
                    {:else if item.exchangedTiles > 0}
                        <li>
                            {prefixes[game.playerTurn ^ (i & 1) ^ 1]}
                            exchanged
                            {item.exchangedTiles}
                            tiles
                        </li>
                    {:else}
                        <li>
                            {prefixes[game.playerTurn ^ (i & 1) ^ 1]}
                            played
                            <b>{item.words
                                    .map(
                                        (w) =>
                                            w.letters.join('') +
                                            ` (${w.points})`
                                    )
                                    .join(' + ')}
                                =
                                {item.points}</b>
                        </li>
                    {/if}
                {/each}
            </ol>
        </div>
    </div>
</div>
