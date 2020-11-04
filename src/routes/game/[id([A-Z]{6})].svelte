<script context="module" lang="ts">
    export async function preload(page, session) {
        const [playerId, playerKey] = session.cookies[page.params.id].split(
            ":"
        );

        const res = await this.fetch(
            `game.json?id=${page.params.id}&playerId=${playerId}&playerKey=${playerKey}`
        );
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

    export let playerId: string;
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

    async function play() {
        const response = await fetch(`/game.json`, {
            method: "PUT",
            cache: "no-cache",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                gameId: gameId,
                playerId: playerId,
                playerKey: playerKey,
                play: currentPlay,
            }),
        });

        console.log(currentPlay);

        if (response.ok) {
            const pojo = await response.json();

            if (pojo.success) {
                console.log("From Play", pojo);
                game = PublicGame.fromPojo(pojo.game);
                tray = pojo.tray;
            }
        } else {
            console.log("Not ok");
        }
    }

    async function exchangeTiles(tiles: string[]) {
        const response = await fetch(`/game.json`, {
            method: "PUT",
            cache: "no-cache",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                gameId: gameId,
                playerId: playerId,
                playerKey: playerKey,
                exchange: true,
                exchangedTiles: tiles,
            }),
        });

        const pojo = await response.json();
        console.log("From Play", pojo);
        game = PublicGame.fromPojo(pojo.game);
        tray = pojo.tray;
    }

    async function pass() {
        const response = await fetch(`/game.json`, {
            method: "PUT",
            cache: "no-cache",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                gameId: gameId,
                playerId: playerId,
                playerKey: playerKey,
                pass: true,
            }),
        });

        const pojo = await response.json();
        console.log("From Pass", pojo);
        game = PublicGame.fromPojo(pojo.game);
        tray = pojo.tray;
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
</script>

<style>
    .wrapper {
        display: grid;
        grid-template-columns: 250px 1fr 250px;
        background-color: #f4f4f4;
        height: 100%;
        width: 100%;
        min-width: 800px;
        margin: 0 auto;
        border: 1px solid black;
        padding: 5px;
    }

    .controls {
        display: flex;
        flex-direction: column;
    }

    .history {
        background-color: white;
        overflow: auto;
        /* width: 250px; */
        display: flex;
        flex-direction: column;
    }
</style>

<svelte:head>
    <title>Game</title>
</svelte:head>

<div class="wrapper">
    <div class="history">
        <div>Turn of {game.playerTurn + 1}</div>
        <div>Score of Player 1: {game.scores[0]}</div>
        <div>Score of Player 2: {game.scores[1]}</div>
        <div>There are {game.bagSize} tiles in the bag.</div>
        <div style="flex:1;" />
        <div class="controls">
            <button
                on:click={play}
                disabled={game.playerTurn !== parseInt(playerId) || currentWords.length === 0}
                title={playTooltip}>Play
                {currentWords
                    .map((w) => w.letters.join('') + ` (${w.points})`)
                    .join(', ')}</button>
            <button
                on:click={pass}
                disabled={game.playerTurn !== parseInt(playerId)}
                title="Pass and score 0">Pass</button>
            <button
                disabled={game.playerTurn !== parseInt(playerId)}
                title="Exchange one or more tiles and score 0">Exchange tiles</button>
        </div>
    </div>
    <Table {game} {tray} bind:play={currentPlay} />
    <div class="history">
        <ol>
            {#each game.history as item}
                {#if item.passed}
                    <li>Passed.</li>
                {:else if item.exchangedTiles > 0}
                    <li>Exchanged {item.exchangedTiles} tiles.</li>
                {:else}
                    <li>
                        Played
                        {item.words
                            .map((w) => w.letters.join('') + ` (${w.points})`)
                            .join(', ')}
                    </li>
                {/if}
            {/each}
        </ol>
    </div>
</div>
