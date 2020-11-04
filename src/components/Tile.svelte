<script lang="ts">
    import { Language } from "../lib/language";

    import { pointsForLetter } from "../lib/points";
    import { draggable } from "../actions/draggable";
    import { Play } from "../lib/play";

    export let letter: string;
    export let isDraggable: boolean = false;
    export let dragData = null;

    let draggedIntoThis = false;
</script>

<style>
    .tile {
        box-sizing: border-box;
        position: relative;
        width: 100%;
        background-color: burlywood;
        border-radius: 5px;
        text-align: center;
        user-select: none;
        font-size: 100vw;
    }

    .tile:after {
        content: "";
        display: block;
        padding-bottom: 100%;
    }

    .inner > .corner {
        font-size: small;
        pointer-events: none;
        user-select: none;
        align-self: flex-start;
        line-height: 0.75em;
    }

    .inner > .center {
        font-size: large;
        font-weight: bold;
        pointer-events: none;
        user-select: none;
        align-self: center;
        flex-grow: 1;
    }

    .dragged {
        pointer-events: none;
        opacity: 75%;
    }

    .inner {
        box-sizing: border-box;

        position: absolute;
        width: 100%;
        height: 100%;
        display: flex;
        flex-direction: row;
        padding: 5px;
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
        <div class="center">
            {Play.isBlankTile(letter) ? letter.toUpperCase() + '*' : letter}
        </div>
        <div class="corner">{pointsForLetter(Language.French, letter)}</div>
    </div>
</div>
