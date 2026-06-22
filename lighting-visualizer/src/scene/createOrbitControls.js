import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

export function createOrbitControls(camera, domElement) {
    const controls = new OrbitControls(camera, domElement);
    controls.enableDamping = true;
    return controls;
}
