import * as THREE from 'three';
import { VertexNormalsHelper } from 'three/examples/jsm/helpers/VertexNormalsHelper.js';
import { NORMAL_VECTOR_COLOR, FACE_NORMAL_COLOR } from '../config/constants.js';

export function createFaceNormalsHelper(mesh, size = 4, color = FACE_NORMAL_COLOR) {
    const geometry = mesh.geometry.clone().toNonIndexed();
    const positions = geometry.attributes.position.array;
    const vertices = [];
    const normal = new THREE.Vector3();

    for (let i = 0; i < positions.length; i += 9) {
        const a = new THREE.Vector3(positions[i], positions[i + 1], positions[i + 2]);
        const b = new THREE.Vector3(positions[i + 3], positions[i + 4], positions[i + 5]);
        const c = new THREE.Vector3(positions[i + 6], positions[i + 7], positions[i + 8]);

        const center = new THREE.Vector3()
            .add(a)
            .add(b)
            .add(c)
            .divideScalar(3);

        const ab = new THREE.Vector3().subVectors(b, a);
        const ac = new THREE.Vector3().subVectors(c, a);

        normal.crossVectors(ab, ac).normalize();

        vertices.push(center.x, center.y, center.z);
        vertices.push(
            center.x + normal.x * size,
            center.y + normal.y * size,
            center.z + normal.z * size
        );
    }

    const helperGeometry = new THREE.BufferGeometry();
    helperGeometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
    const helperMaterial = new THREE.LineBasicMaterial({ color });

    return new THREE.LineSegments(helperGeometry, helperMaterial);
}

export function applyNormalsVisibility(mode, { vertexNormalsHelper, faceNormalsHelper }) {
    if (!vertexNormalsHelper || !faceNormalsHelper) return;

    switch (mode) {
        case 'vertex':
            vertexNormalsHelper.visible = true;
            faceNormalsHelper.visible = false;
            break;
        case 'face':
            vertexNormalsHelper.visible = false;
            faceNormalsHelper.visible = true;
            break;
        case 'both':
            vertexNormalsHelper.visible = true;
            faceNormalsHelper.visible = true;
            break;
        case 'none':
        default:
            vertexNormalsHelper.visible = false;
            faceNormalsHelper.visible = false;
            break;
    }
}

export function setupNormalsHelpers(scene, cube) {
    let vertexNormalsHelper = null;
    let faceNormalsHelper = null;

    function rebuildVertexNormalsHelper() {
        if (vertexNormalsHelper) {
            scene.remove(vertexNormalsHelper);
            vertexNormalsHelper.dispose();
        }
        vertexNormalsHelper = new VertexNormalsHelper(cube, 2, NORMAL_VECTOR_COLOR);
        scene.add(vertexNormalsHelper);
    }

    function rebuildFaceNormalsHelper() {
        if (faceNormalsHelper) {
            cube.remove(faceNormalsHelper);
            faceNormalsHelper.geometry.dispose();
            faceNormalsHelper.material.dispose();
        }
        faceNormalsHelper = createFaceNormalsHelper(cube);
        cube.add(faceNormalsHelper);
    }

    function rebuildAll() {
        rebuildVertexNormalsHelper();
        rebuildFaceNormalsHelper();
    }

    rebuildAll();
    applyNormalsVisibility('none', { vertexNormalsHelper, faceNormalsHelper });

    return {
        get vertexNormalsHelper() {
            return vertexNormalsHelper;
        },
        get faceNormalsHelper() {
            return faceNormalsHelper;
        },
        rebuildAll,
        applyVisibility: (mode) =>
            applyNormalsVisibility(mode, { vertexNormalsHelper, faceNormalsHelper }),
    };
}
