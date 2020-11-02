<script context="module" lang="ts">
    export async function preload(page, session) {
        const res = await this.fetch(`game.json?id=${page.params.id}`);
        const game = await res.json();

        console.log(page);

        return {
            gameId: page.params.id,
            game: game.game,
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
    import type { Board as libBoard } from "../../lib/board";
    import { PublicGame } from "../../lib/public_game";
    import { playFromScratchBoard } from "../../lib/client/board";

    export let gameId: string;
    export let game: PublicGame;

    let channel;
    let scratchBoard: libBoard;

    let tray = ["A", "B", "C", "D", "E", "F", "G"];

    let fakeStory = [
        "Player 1 played DOLMEN for 45 points.",
        "Player 2 played AGE for 2 points.",
        "Player 1 played DESOXYRIBPNUCL for 45 points.",
    ];

    onMount(() => {
        Pusher.logToConsole = true;

        const pusher = new Pusher(PUSHER_APP_KEY, {
            cluster: PUSHER_APP_CLUSTER,
        });

        channel = pusher.subscribe(gameId);

        channel.bind("board", function (data) {
            console.log("From Pusher", data.message);
            game = data.message;
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
                gameId: "AAAAAA",
                playerId: 0,
                play: currentPlay,
            }),
        });

        const pojo = await response.json();
        console.log("From Play", pojo);
        game = PublicGame.fromPojo(pojo.game);
        tray = pojo.tray;
    }

    async function exchangeTiles() {
        const response = await fetch(`/game.json`, {
            method: "PUT",
            cache: "no-cache",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                gameId: "AAAAAA",
                playerId: 0,
                play: currentPlay,
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
                gameId: "AAAAAA",
                playerId: 0,
                play: currentPlay,
            }),
        });

        const pojo = await response.json();
        console.log("From Play", pojo);
        game = PublicGame.fromPojo(pojo.game);
        tray = pojo.tray;
    }

    let playTooltip = "";
    let currentPlay;

    $: if (scratchBoard) {
        currentPlay = playFromScratchBoard(game.board, scratchBoard)[0];
    }
</script>

<style>
    .wrapper {
        display: grid;
        grid-template-columns: 250px 1fr 250px;
        background-color: #f4f4f4;
        height: 100%;
        width: 100%;
        min-width: 500px;
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
        width: 250px;
    }
</style>

<svelte:head>
    <title>Game</title>
</svelte:head>

<div class="wrapper">
    <div class="history">Bla</div>
    <Table {game} {tray} bind:scratchBoard>
        <div class="controls" slot="controls">
            <button
                on:click={play}
                disabled={!currentPlay}
                title={playTooltip}>Play
                {currentPlay ? currentPlay.letters.join('') : ''}</button>
            <button>Pass</button>
            <button>Exchange tiles</button>
            <div>There are {game.bagSize} tiles in the bag.</div>
        </div>
    </Table>
    <div class="history">
        <ol>
            {#each fakeStory as item}
                <li>{item}</li>
            {/each}
        </ol>
    </div>
</div>
