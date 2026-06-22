import { DEFAULT_SCENE_STATE } from '../config/constants.js';
import { updateMeshGeometry } from '../mesh/updateMeshGeometry.js';

function setShadingMode(mode, cube, materials) {
    switch (mode) {
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
}

export function bindSidebarControls({
    cube,
    wireMesh,
    uniforms,
    materials,
    normals,
    resetLight,
    textureManager,
}) {
    document.getElementById('resetLight').addEventListener('click', resetLight);

    const shadingSelect = document.getElementById('shading');
    shadingSelect.addEventListener('change', (event) => {
        setShadingMode(event.target.value, cube, materials);
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

    document.getElementById('resetBtn').addEventListener('click', () => {
        const defaultState = DEFAULT_SCENE_STATE;

        document.getElementById('ambient').value = defaultState.ka;
        document.getElementById('ambientValue').textContent = defaultState.ka;
        document.getElementById('diffuse').value = defaultState.kd;
        document.getElementById('diffuseValue').textContent = defaultState.kd;
        document.getElementById('specular').value = defaultState.ks;
        document.getElementById('specularValue').textContent = defaultState.ks;
        document.getElementById('shininess').value = defaultState.shiny;
        document.getElementById('shininessValue').textContent = defaultState.shiny;
        document.getElementById('lightSlider').value = defaultState.lightStrength;
        document.getElementById('lightSSliderValue').textContent = defaultState.lightStrength;
        document.getElementById('shading').value = defaultState.shading;
        document.getElementById('shape').value = defaultState.shape;
        document.getElementById('wireframe').checked = defaultState.wireframe;
        document.getElementById('normalsDisplay').value = defaultState.normalsDisplay;
        document.getElementById('useTexture').checked = defaultState.useTexture;

        uniforms.uAmbientStrength.value = defaultState.ka;
        uniforms.uDiffuse.value = defaultState.kd;
        uniforms.uSpecularStrength.value = defaultState.ks;
        uniforms.uShininess.value = defaultState.shiny;
        uniforms.uLightStrength.value = defaultState.lightStrength;

        resetLight();

        setShadingMode(defaultState.shading, cube, materials);
        updateMeshGeometry({
            cube,
            wireMesh,
            shape: defaultState.shape,
            normals,
        });
        wireMesh.visible = defaultState.wireframe;
        normals.applyVisibility(defaultState.normalsDisplay);
        textureManager.setEnabled(defaultState.useTexture);
    });
}
