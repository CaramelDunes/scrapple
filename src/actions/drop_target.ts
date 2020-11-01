function dropTarget(node, params) {
    if (params.ondrop) {
        node.addEventListener('mydrop', params.ondrop);
    }

    if (params.ondragenter) {
        node.addEventListener('mydragenter', params.ondragenter);
    }

    if (params.ondragleave) {
        node.addEventListener('mydragleave', params.ondragleave);
    }

    return {
        destroy() {
            if (params.ondrop) {
                node.removeEventListener('mydrop', params.ondrop);
            }

            if (params.ondragenter) {
                node.removeEventListener('mydragenter', params.ondragenter);
            }

            if (params.ondragleave) {
                node.removeEventListener('mydragleave', params.ondragleave);
            }
        }
    }
}

export { dropTarget };