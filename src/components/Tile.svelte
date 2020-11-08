<script lang="ts">
    import type { Language } from "../lib/language";

    import { pointsForLetter } from "../lib/points";
    import { draggable } from "../actions/draggable";
    import { Play } from "../lib/play";

    export let letter: string;
    export let language: Language;
    export let isDraggable: boolean = false;
    export let dragData = null;

    let draggedIntoThis = false;
</script>

<style>
    .tile {
        position: relative;
        width: 100%;
        background-color: burlywood;
        border-radius: 5px;
        user-select: none;
    }

    .tile:after {
        content: "";
        display: block;
        padding-bottom: 100%;
    }

    .corner {
        position: absolute;
        right: 2px;
        top: 2px;
        font-size: 0.4em;
        pointer-events: none;
        user-select: none;
    }

    .dragged {
        pointer-events: none;
        opacity: 0.75;
    }

    .inner {
        position: absolute;
        width: 100%;
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        padding-top: 3px;
        padding-right: 5px;
        font-size: 0.75em;
        font-weight: bold;
        pointer-events: none;
        user-select: none;
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
    <div class="inner">
        {Play.isBlankTile(letter) ? letter.toUpperCase() + '*' : letter}
    </div>
    <div class="corner">{pointsForLetter(language, letter)}</div>
</div>
