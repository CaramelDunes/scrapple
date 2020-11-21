<script context="module" lang="ts">
    function parseCookie(cookie: string): [number, string] {
        const tokens = cookie.split(":");

        if (tokens.length === 2 && tokens[1].length === 32) {
            return [parseInt(tokens[0]), tokens[1]];
        }

        return [null, null];
    }

    export async function preload(page, session) {
        const gameId = page.params.id;
        let playerId;
        let playerKey;

        if (gameId in session.cookies) {
            [playerId, playerKey] = parseCookie(session.cookies[gameId]);
        }

        let res;

        if (playerKey) {
            res = await this.fetch(
                `game.json?id=${gameId}&playerId=${playerId}&playerKey=${playerKey}`
            );
        } else {
            res = await this.fetch(`game.json?id=${gameId}`);
        }

        if (res.ok) {
            const game = await res.json();

            // No need to send the cookies back.
            delete session.cookies;

            const config = await import("../../lib/server/config");

            return {
                gameId: gameId,
                playerId: playerId,
                playerKey: playerKey,
                rawGame: game.game,
                tray: game.tray,
                pusherKey: config.PUSHER_KEY,
                pusherCluster: config.PUSHER_CLUSTER,
            };
        }

        this.error(404, "Not found");
    }
</script>

<script lang="ts">
    import Pusher from "pusher-js";
    import { onMount } from "svelte";
    import { PublicGame } from "../../lib/public_game";
    import type { Word } from "../../lib/word";
    import Board from "../../components/Board.svelte";
    import History from "../../components/History.svelte";
    import Tray from "../../components/Tray.svelte";
    import ExchangeDialog from "../../components/ExchangeDialog.svelte";
    import { updateScratchBoard } from "../../lib/client/board";
    import { trayFromLetters } from "../../lib/client/tray";
    import { Board as libBoard } from "../../lib/board";

    export let playerId: number;
    export let playerKey: string;
    export let gameId: string;
    export let rawGame;
    export let tray: string[];
    export let pusherKey: string;
    export let pusherCluster: string;

    let game = PublicGame.fromPojo(rawGame);
    let trayContents = ["", "", "", "", "", "", "", ""];
    let scratchBoard: libBoard = libBoard.empty();

    if (tray) {
        trayContents = trayFromLetters(tray, trayContents);
    }

    let highlightedWords: Word[] = [];
    let channel;

    onMount(() => {
        if (pusherKey && !game.ended) {
            Pusher.logToConsole = true;

            const pusher = new Pusher(pusherKey, {
                cluster: pusherCluster,
            });

            channel = pusher.subscribe(gameId);

            channel.bind("board", function (data) {
                console.log("From Pusher", data.message);
                game = PublicGame.fromPojo(data.message);
                const kickedOut = updateScratchBoard(game.board, scratchBoard);

                for (
                    let i = 0;
                    i < trayContents.length && kickedOut.length > 0;
                    i++
                ) {
                    if (trayContents[i] === "")
                        trayContents[i] = kickedOut.pop();
                }
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
                scratchBoard = libBoard.empty();
                tray = pojo.tray;
                trayContents = trayFromLetters(tray, trayContents);
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

    function retrieveTiles() {
        scratchBoard = libBoard.empty();
        trayContents = trayFromLetters(tray, trayContents);
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

    const prefixes = playerKey ? ["You", "They"] : ["Player #1", "Player #2"];

    if (playerKey && playerId === 1) prefixes.reverse();

    let exchangingTiles = false;
</script>

<style>
    .wrapper {
        display: flex;
        justify-content: center;
        align-items: stretch;
        flex-flow: row wrap;
    }

    .column {
        display: flex;
        flex-direction: column;
        border-radius: 10px;
        border: solid 3px #d0d0d0;
        max-height: 99vh;
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
            font-size: 3.2vh;
        }

        .no-tray {
            height: 100vh;
            width: 100vh;
            font-size: 3.8vh;
        }

        .tray-container {
            width: 84vh;
            font-size: 5vh;
        }

        .column {
            margin-top: 0.25em;
        }
    }

    @media (orientation: portrait) {
        .board {
            height: 100vw;
            width: 100vw;
            font-size: 3.8vw;
        }

        .tray-container {
            width: 100vw;
            font-size: 6vw;
        }
    }
</style>

<svelte:head>
    <title>Game - {gameId}</title>
</svelte:head>

<svelte:window
    on:keydown={(e) => {
        return e.key === 'Escape' && (exchangingTiles = false);
    }} />

{#if exchangingTiles}
    <ExchangeDialog
        {tray}
        language={game.language}
        exchangeCallback={exchangeTiles}
        closeCallback={() => (exchangingTiles = false)} />
{/if}

<div class="wrapper">
    <div>
        <div class="board" class:no-tray={!tray || game.ended}>
            <Board
                board={game.board}
                {highlightedWords}
                language={game.language}
                bind:play={currentPlay}
                bind:scratchBoard />
        </div>

        {#if tray && !game.ended}
            <div class="tray-container">
                <Tray
                    language={game.language}
                    bind:tray={trayContents}
                    retrieveTilesCallback={retrieveTiles} />
            </div>
        {/if}

        {#if playerKey && !game.ended}
            <div class="controls">
                <button
                    style="flex-grow:3;"
                    on:click={play}
                    disabled={game.playerTurn !== playerId || currentWords.length === 0}
                    title={playTooltip}>Play
                    {currentWords
                        .map((w) => w.letters.join('') + ` (${w.points})`)
                        .join(', ')}</button>
                <button
                    on:click={() => {
                        if (confirm("Are you sure you want to pass? You won't score any points on this turn.")) {
                            pass();
                        }
                    }}
                    disabled={game.playerTurn !== playerId}
                    title="Pass and score 0">Pass</button>
                <button
                    on:click={() => (exchangingTiles = true)}
                    disabled={game.playerTurn !== playerId}
                    title="Exchange one or more tiles and score 0">Exchange
                    tiles</button>
            </div>
        {/if}
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

        <div class="header">History</div>
        <History {game} bind:highlightedWords {prefixes} />
    </div>
</div>
