import * as THREE from 'three';

export function createGizmoPicker({ camera, canvasContainer, lightGizmo, controls }) {
    const pickRaycaster = new THREE.Raycaster();
    const pickPointer = new THREE.Vector2();

    function updatePickPointer(event) {
        const rect = canvasContainer.getBoundingClientRect();
        pickPointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
        pickPointer.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
    }

    function isPointerOverLightGizmo(event) {
        updatePickPointer(event);
        pickRaycaster.setFromCamera(pickPointer, camera);
        const hits = pickRaycaster.intersectObject(lightGizmo, true);
        return hits.length > 0;
    }

    canvasContainer.addEventListener('pointermove', (event) => {
        if (!controls.enabled) return;
        canvasContainer.style.cursor = isPointerOverLightGizmo(event) ? 'grab' : '';
    });

    canvasContainer.addEventListener('pointerdown', (event) => {
        if (isPointerOverLightGizmo(event)) {
            canvasContainer.style.cursor = 'grabbing';
        }
    });

    canvasContainer.addEventListener('pointerup', () => {
        canvasContainer.style.cursor = '';
    });
}
