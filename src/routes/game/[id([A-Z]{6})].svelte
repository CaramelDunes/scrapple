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
    import Table from "../../components/Table.svelte";
    import Pusher from "pusher-js";
    import {
        PUSHER_APP_CLUSTER,
        PUSHER_APP_KEY,
    } from "../../lib/client/pusher";

    import { onMount } from "svelte";
    import { PublicGame } from "../../lib/public_game";
    import type { Word } from "../../lib/word";

    export let playerId: number;
    export let playerKey: string;
    export let gameId: string;
    export let rawGame;
    export let tray: string[];

    let game = PublicGame.fromPojo(rawGame);

    let channel;

    onMount(() => {
        Pusher.logToConsole = true;

        const pusher = new Pusher(PUSHER_APP_KEY, {
            cluster: PUSHER_APP_CLUSTER,
        });

        channel = pusher.subscribe(gameId);

        channel.bind("board", function (data) {
            console.log("From Pusher", data.message);
            game = PublicGame.fromPojo(data.message);
        });
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
            currentWords = game.board.wordsFromPlay(currentPlay);
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
        max-height: 100vh;
    }

    .history {
        overflow: auto;
        display: flex;
        flex-direction: column;
        border-radius: 10px;
        border: solid 3px #d0d0d0;
        min-width: 200px;
        margin: 0 16px;
    }

    .game-info {
        display: flex;
        flex-direction: column;
        border-radius: 10px;
        border: solid 3px #d0d0d0;
        min-width: 200px;
        text-align: center;
        margin: 0 16px;
    }

    .header {
        font-weight: bold;
        text-align: center;
        text-transform: uppercase;
        background-color: #d0d0d0;
        border: solid 3px #d0d0d0;
        padding: 5px;
        font-size: large;
        color: white;
    }

    ol {
        margin: 0;
        padding: 0;
        list-style-position: inside;
    }

    ol li {
        padding: 5px 3px;
        color: black;
        font-weight: bold;
    }

    ol li:nth-child(even) {
        background-color: #d0d0d0;
        color: white;
    }
</style>

<svelte:head>
    <title>Game - {gameId}</title>
</svelte:head>

<div class="wrapper">
    <div class="game-info">
        <div class="header">Turn {game.history.length + 1}</div>
        <div>{prefixes[0]}</div>
        <div>{game.scores[0]}</div>
        <div>{prefixes[1]}</div>
        <div>{game.scores[1]}</div>
        <div>{game.bagSize} tiles left.</div>
        <div>This game's code: {gameId}.</div>
        <!-- <div>${"location.href.replace('game', 'join')"}<a href="s">📋</a></div> -->
        <div style="flex:1;" />
        {#if playerKey}
            <button
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
                title="Exchange one or more tiles and score 0">Exchange tiles</button>
        {/if}
    </div>
    <Table {game} {tray} bind:play={currentPlay} />
    <div class="history">
        <div class="header">History</div>
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
                        {prefixes[game.playerTurn ^ (i & 1) ^ 1]}
                        played
                        {item.words
                            .map((w) => w.letters.join('') + ` (${w.points})`)
                            .join(' + ')}
                        =
                        {item.points}
                    </li>
                {/if}
            {/each}
        </ol>
    </div>
</div>
