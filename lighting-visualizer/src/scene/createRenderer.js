import * as THREE from 'three';
import { CANVAS_BACKGROUND } from '../config/constants.js';

export function createRenderer() {
    const canvasContainer = document.querySelector('.canvas-container');
    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(
        75,
        canvasContainer.clientWidth / canvasContainer.clientHeight,
        0.1,
        1000
    );
    camera.position.set(0, 0, 65);

    const renderer = new THREE.WebGLRenderer({
        canvas: document.getElementById('bg'),
        antialias: true,
        alpha: false,
    });
    renderer.setClearColor(CANVAS_BACKGROUND);
    renderer.setSize(canvasContainer.clientWidth, canvasContainer.clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio);

    window.addEventListener('resize', () => {
        camera.aspect = canvasContainer.clientWidth / canvasContainer.clientHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(canvasContainer.clientWidth, canvasContainer.clientHeight);
        renderer.setPixelRatio(window.devicePixelRatio);
    });

    return { scene, camera, renderer, canvasContainer };
}
