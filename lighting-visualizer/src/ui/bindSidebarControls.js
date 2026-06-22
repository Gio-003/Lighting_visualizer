import { updateMeshGeometry } from '../mesh/updateMeshGeometry.js';

export function bindSidebarControls({
    cube,
    wireMesh,
    uniforms,
    materials,
    normals,
    resetLight,
}) {
    document.getElementById('resetLight').addEventListener('click', resetLight);

    const shadingSelect = document.getElementById('shading');
    shadingSelect.addEventListener('change', (event) => {
        switch (event.target.value) {
            case 'flat':
                cube.material = materials.flatMaterial;
                break;
            case 'gouraud':
                cube.material = materials.gouraudMaterial;
                break;
            case 'phong':
                cube.material = materials.phongMaterial;
                break;
        }
    });

    const lightSlider = document.getElementById('lightSlider');
    const lightSSliderValue = document.getElementById('lightSSliderValue');
    lightSlider.addEventListener('input', (event) => {
        const intensity = event.target.value;
        uniforms.uLightStrength.value = intensity;
        lightSSliderValue.textContent = intensity;
    });

    const ambientLightSlider = document.getElementById('ambient');
    const ambientValue = document.getElementById('ambientValue');
    ambientLightSlider.addEventListener('input', (event) => {
        const intensity = event.target.value;
        uniforms.uAmbientStrength.value = intensity;
        ambientValue.textContent = intensity;
    });

    const diffuseSlider = document.getElementById('diffuse');
    const diffuseValue = document.getElementById('diffuseValue');
    diffuseSlider.addEventListener('input', (event) => {
        const intensity = event.target.value;
        uniforms.uDiffuse.value = intensity;
        diffuseValue.textContent = intensity;
    });

    const specularSlider = document.getElementById('specular');
    const specularValue = document.getElementById('specularValue');
    specularSlider.addEventListener('input', (event) => {
        const intensity = event.target.value;
        uniforms.uSpecularStrength.value = intensity;
        specularValue.textContent = intensity;
    });

    const shininessSlider = document.getElementById('shininess');
    const shininessValue = document.getElementById('shininessValue');
    shininessSlider.addEventListener('input', (event) => {
        const shininess = event.target.value;
        uniforms.uShininess.value = shininess;
        shininessValue.textContent = shininess;
    });

    const wireFrameCheckbox = document.getElementById('wireframe');
    wireFrameCheckbox.addEventListener('input', (event) => {
        wireMesh.visible = event.target.checked;
    });

    const normalsSelect = document.getElementById('normalsDisplay');
    normalsSelect.addEventListener('change', (event) => {
        normals.applyVisibility(event.target.value);
    });

    const shapeSelect = document.getElementById('shape');
    shapeSelect.addEventListener('change', (event) => {
        updateMeshGeometry({
            cube,
            wireMesh,
            shape: event.target.value,
            normals,
        });
    });
}
