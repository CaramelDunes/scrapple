function dropTarget(node, params) {
    node.addEventListener('dropped', handleDrop);

    function handleDrop(event) {
        event.preventDefault();

        console.log('Drop');
    }

    return {
        destroy() {
            node.removeEventListener('dropped', handleDrop);
        }
    }
}

export { dropTarget };