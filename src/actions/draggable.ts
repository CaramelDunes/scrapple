export function draggable(node: HTMLElement, params) {
    if (!params.isDraggable) return {};

    node.addEventListener('touchstart', handleMousedown, { passive: false });
    node.addEventListener('mousedown', handleMousedown, { passive: false });

    let dropTarget = null;
    let dragging = false;
    let initialX = null;
    let initialY = null;

    function handleMousedown(event) {
        if (event.cancelable) {
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

            window.addEventListener('mousemove', handleMousemove, { passive: false });
            window.addEventListener('mouseup', handleMouseup, { passive: false });
            window.addEventListener('touchmove', handleMousemove, { passive: false });
            window.addEventListener('touchend', handleMouseup, { passive: false });
        }
    }

    function handleMousemove(event) {
        if (event.cancelable) {
            event.preventDefault();

            if (dragging) {
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
                            detail: Object.assign(params.data, { dataset: node.dataset })
                        }));

                    if (dropTarget)
                        dropTarget.dispatchEvent(new CustomEvent('mydragenter', {
                            detail: Object.assign(params.data, { dataset: node.dataset })
                        }));
                }

                setTranslate(dx, dy, node);

                node.dispatchEvent(new CustomEvent('mydrag', {
                    detail: { initialX, initialY, dx, dy }
                }));
            }
        }
    }

    function handleMouseup(event) {
        if (event.cancelable) {
            event.preventDefault();

            if (dragging) {
                if (dropTarget) {
                    dropTarget.dispatchEvent(new CustomEvent('mydragleave', {
                        detail: Object.assign(params.data, { dataset: node.dataset })
                    }));

                    dropTarget.dispatchEvent(new CustomEvent('mydrop', {
                        detail: Object.assign(params.data, { dataset: node.dataset })
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