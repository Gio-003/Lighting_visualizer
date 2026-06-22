import * as THREE from 'three';
import { createGeometry } from './geometryFactory.js';

export function createMainMesh({ scene, material }) {
    const geometry = createGeometry('sphere');

    const cube = new THREE.Mesh(geometry, material);
    scene.add(cube);

    const wireMat = new THREE.MeshBasicMaterial({ color: 0xffffff, wireframe: true });
    const wireMesh = new THREE.Mesh(geometry, wireMat);
    wireMesh.scale.set(1.01, 1.01, 1.01);
    wireMesh.visible = false;
    cube.add(wireMesh);

    return { cube, wireMesh };
}
