import { createGeometry } from './geometryFactory.js';

export function updateMeshGeometry({ cube, wireMesh, shape, normals }) {
    const newGeometry = createGeometry(shape);

    cube.geometry.dispose();
    wireMesh.geometry.dispose();

    cube.geometry = newGeometry;
    wireMesh.geometry = newGeometry;

    normals.rebuildAll();

    const currentNormalsMode = document.getElementById('normalsDisplay').value;
    normals.applyVisibility(currentNormalsMode);
}
