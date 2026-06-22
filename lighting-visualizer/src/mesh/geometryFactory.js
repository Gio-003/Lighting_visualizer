import * as THREE from 'three';

export function createGeometry(shape) {
    switch (shape) {
        case 'cube':
            return new THREE.BoxGeometry(22, 22, 22, 4, 4, 4);
        case 'cylinder':
            return new THREE.CylinderGeometry(10, 10, 24, 32, 4);
        case 'cone':
            return new THREE.ConeGeometry(12, 26, 32, 4);
        case 'torus':
            return new THREE.TorusGeometry(10, 3, 16, 100);
        case 'torusKnot':
            return new THREE.TorusKnotGeometry(8, 2.5, 128, 16);
        case 'icosahedron':
            return new THREE.IcosahedronGeometry(14, 1);
        case 'dodecahedron':
            return new THREE.DodecahedronGeometry(14, 0);
        case 'capsule':
            return new THREE.CapsuleGeometry(10, 10, 8, 32);
        case 'sphere':
        default:
            return new THREE.SphereGeometry(16, 32, 32);
    }
}
