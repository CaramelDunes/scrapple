<style>
    .backdrop {
        position: fixed;
        top: 0px;
        width: 100%;
        height: 100%;
        background-color: black;
        opacity: 0.5;
        z-index: 98;
    }

    .dialog {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        z-index: 99;
    }
</style>

<div>
    <div class="backdrop" />
    <div class="dialog">
        <slot />
    </div>
</div>
