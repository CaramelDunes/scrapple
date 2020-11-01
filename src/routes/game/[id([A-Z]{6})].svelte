<script context="module" lang="ts">
    export async function preload(page, session) {
        const res = await this.fetch(`game.json?id=${page.params.id}`);
        const game = await res.json();

        console.log(page, session);

        return {
            game: game,
        };
    }
</script>

<script lang="ts">
    import Table from "../../components/Table.svelte";
    import type { Game } from "../../lib/game";

    export let game: Game;
</script>

<style>
    .wrapper {
        background-color: #f4f4f4;
        height: 100%;
        width: 75%;
        min-width: 500px;
        margin: 0 auto;
    }
</style>

<div class="wrapper">
    <Table {game} />
</div>
