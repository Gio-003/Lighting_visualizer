export function bindCanvasEvents({ onTogglePause }) {
    window.addEventListener('keydown', (event) => {
        const tag = document.activeElement.tagName;
        if (tag === 'INPUT' || tag === 'SELECT') return;

        if (event.key.toLowerCase() === 'p') {
            onTogglePause();
        }
    });
}
