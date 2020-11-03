<script lang="ts">
    import { Language } from "../lib/language";

    import { pointsForLetter } from "../lib/points";
    import { draggable } from "../actions/draggable";

    export let letter: string;
    export let isDraggable: boolean = false;
    export let dragData;

    let draggedIntoThis = false;
</script>

<style>
    .tile {
        box-sizing: border-box;
        position: relative;
        width: 100%;
        /* height: 100%; */
        background-color: burlywood;
        border: 1px solid black;
        border-radius: 5px;
        text-align: center;
        user-select: none;
    }

    .tile:after {
        content: "";
        display: block;
        padding-bottom: 100%;
    }

    .tile > .corner {
        position: absolute;
        top: 0px;
        right: 0px;
        font-size: small;
        pointer-events: none;
        user-select: none;
    }

    .tile > .center {
        position: absolute;
        font-weight: bold;
        pointer-events: none;
        user-select: none;
    }

    .dragged {
        pointer-events: none;
        opacity: 75%;
    }
</style>

<div
    class="tile"
    class:dragged={draggedIntoThis}
    use:draggable={{ isDraggable, data: dragData }}
    on:mydragstart={(e) => {
        draggedIntoThis = true;
    }}
    on:mydragend={(e) => {
        draggedIntoThis = false;
    }}
    data-letter={letter}>
    <div class="center">{letter}</div>
    <div class="corner">{pointsForLetter(Language.French, letter)}</div>
</div>
