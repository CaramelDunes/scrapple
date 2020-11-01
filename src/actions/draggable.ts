import { crossfade } from 'svelte/transition'
import { quintOut, elasticOut } from 'svelte/easing'

const [send, receive] = crossfade({
    duration: d => 600,
    easing: quintOut,
    fallback(node, params) {
        const style = getComputedStyle(node);
        const transform = style.transform === 'none' ? '' : style.transform;

        return {
            duration: 600,
            easing: quintOut,
            css: t => `
        transform: ${transform} scale(${t});
        opacity: ${t}
      `
        };
    }
});

let dropTarget = null;
function draggable(node, params) {
    if (!params.isDraggable) return {};

    node.addEventListener('touchstart', handleMousedown);
    node.addEventListener('mousedown', handleMousedown);

    let dragging = false;
    let initialX = null;
    let initialY = null;

    function handleMousedown(event) {
        event.preventDefault();

        dragging = true;

        initialX = event.clientX;
        initialY = event.clientY;

        if (event.changedTouches) {
            initialX = event.changedTouches[0].pageX;
            initialY = event.changedTouches[0].pageY;
        }

        node.dispatchEvent(new CustomEvent('mydragstart', {
            detail: { initialX, initialY }
        }));

        window.addEventListener('mousemove', handleMousemove);
        window.addEventListener('mouseup', handleMouseup);
        window.addEventListener('touchmove', handleMousemove);
        window.addEventListener('touchend', handleMouseup);
    }

    function handleMousemove(event) {
        if (dragging) {
            event.preventDefault();

            var touches = event.changedTouches;

            let dx = event.clientX - initialX;
            let dy = event.clientY - initialY;

            if (touches) {
                dx = event.changedTouches[0].pageX - initialX;
                dy = event.changedTouches[0].pageY - initialY;
            }

            const rect = node.getBoundingClientRect();
            const midX = rect.x + rect.width / 2;
            const midY = rect.y + rect.height / 2;

            const candidate = document.elementFromPoint(midX, midY);
            const oldDropTarget = dropTarget;

            if (candidate
                && candidate instanceof HTMLElement
                && candidate.dataset.droptarget === "true") {
                dropTarget = candidate;
            } else {
                dropTarget = null;
            }

            if (oldDropTarget !== dropTarget) {
                if (oldDropTarget)
                    oldDropTarget.dispatchEvent(new CustomEvent('mydragleave', {
                        detail: params.data
                    }));

                if (dropTarget)
                    dropTarget.dispatchEvent(new CustomEvent('mydragenter', {
                        detail: params.data
                    }));
            }

            setTranslate(dx, dy, node);

            node.dispatchEvent(new CustomEvent('mydrag', {
                detail: { initialX, initialY, dx, dy }
            }));
        }
    }

    function handleMouseup(event) {
        if (dragging) {
            event.preventDefault();

            if (dropTarget) {
                dropTarget.dispatchEvent(new CustomEvent('mydragleave', {
                    detail: params.data
                }));

                dropTarget.dispatchEvent(new CustomEvent('mydrop', {
                    detail: params.data
                }));
            }

            node.dispatchEvent(new CustomEvent('mydragend', {
                detail: { initialX, initialY }
            }));

            setTranslate(0, 0, node);

            dropTarget = null;
            dragging = false;

            window.removeEventListener('mousemove', handleMousemove);
            window.removeEventListener('mouseup', handleMouseup);
            window.removeEventListener('touchmove', handleMousemove);
            window.removeEventListener('touchend', handleMouseup);
        }
    }

    function setTranslate(xPos, yPos, el) {
        el.style.transform = `translate(${xPos}px, ${yPos}px)`;
    }

    return {
        destroy() {
            node.removeEventListener('mousedown', handleMousedown);
            node.removeEventListener('touchstart', handleMousedown);
        }
    }
}

export { draggable };