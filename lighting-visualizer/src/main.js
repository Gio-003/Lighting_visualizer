// ============================================================================
// LIGHTING VISUALIZER - WEBGL APPLICATION (THREE.JS)
// ============================================================================
import './style.css';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { DragControls } from 'three/examples/jsm/controls/DragControls.js';
import { VertexNormalsHelper } from 'three/examples/jsm/helpers/VertexNormalsHelper.js';

// Shader Imports
import phongVertexShader from './shaders/phongVertexShader.vert?raw';
import phongFragmentShader from './shaders/phongFragmentShader.frag?raw';
import gouraudVertexShader from './shaders/gouraudVertexShader.vert?raw';
import gouraudFragmentShader from './shaders/gouraudFragmentShader.frag?raw';
import flatVertexShader from './shaders/flatVertexShader.vert?raw';
import flatFragmentShader from './shaders/flatFragmentShader.frag?raw';

// ============================================================================
// CONSTANTS & GLOBAL STATE
// ============================================================================
const DEFAULT_LIGHT_POSITION = new THREE.Vector3(30, 25, 30);
let isAnimationPaused = false;
let vertexNormalsHelper;
let faceNormalsHelper;

// ============================================================================
// CORE THREE.JS SETUP (Scene, Camera, Renderer, Controls)
// ============================================================================
const canvasContainer = document.querySelector('.canvas-container');
const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(75, canvasContainer.clientWidth / canvasContainer.clientHeight, 0.1, 1000);
camera.position.set(0, 0, 65);

const renderer = new THREE.WebGLRenderer({ 
    canvas: document.getElementById('bg'),
    antialias: true,
    alpha: true
});
renderer.setSize(canvasContainer.clientWidth, canvasContainer.clientHeight);
renderer.setPixelRatio(window.devicePixelRatio);

// Camera Controls
const controls = new OrbitControls(camera, canvasContainer);
controls.enableDamping = true; 

// ============================================================================
// LIGHTING SETUP & INTERACTION (Gizmo, PointLight, DragControls)
// ============================================================================
const pointLight = new THREE.PointLight(0xffffff, 200, 300);
scene.add(pointLight);

const pointLightHelper = new THREE.PointLightHelper(pointLight, 5);
scene.add(pointLightHelper);

const lightGizmo = new THREE.Mesh(
    new THREE.SphereGeometry(2.2, 20, 20),
    new THREE.MeshBasicMaterial({ color: 0xfff4a8 })
);
scene.add(lightGizmo);

// Initialize Light Position
applyLightPosition(DEFAULT_LIGHT_POSITION);

function applyLightPosition(position) {
    lightGizmo.position.copy(position);
    pointLight.position.copy(lightGizmo.position);
}

// Drag Controls for Light Gizmo
const dragControls = new DragControls([lightGizmo], camera, canvasContainer);

dragControls.addEventListener('dragstart', (event) => {
    controls.enabled = false;
    lightGizmo.material.color.set(0xffffff);
    console.log(event.object);
});

dragControls.addEventListener('drag', (event) => {
    pointLight.position.copy(event.object.position);
});

dragControls.addEventListener('dragend', () => {
    controls.enabled = true;
    lightGizmo.material.color.set(0xfff4a8);
});

// Raycasting for Cursor/Pointer Feedback over Gizmo
const pickRaycaster = new THREE.Raycaster();
const pickPointer = new THREE.Vector2();

function updatePickPointer(event) {
    const rect = canvasContainer.getBoundingClientRect();
    pickPointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    pickPointer.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
}

// ============================================================================
// SHADER UNIFORMS
// ============================================================================
const uniforms = {
    uColor: { value: new THREE.Color(0xa0a0a0) },
    uAmbientStrength: { value: 0.1 },
    uLightColor: { value: new THREE.Color(0xffffff) },
    uLightPos: { value: pointLight.position },
    uDiffuse: { value: 0.7 },
    uLightStrength: { value: 1.0 },
    uSpecularStrength: { value: 0.5 },
    uViewPos: { value: camera.position },
    uShininess: { value: 32.0 }
};

// ============================================================================
// MATERIALS & MESH INITIALIZATION (Main Object, Wireframe)
// ============================================================================
let geometry = new THREE.SphereGeometry(16, 32, 32);

const phongMaterial = new THREE.ShaderMaterial({
    vertexShader: phongVertexShader,
    fragmentShader: phongFragmentShader,
    uniforms
});

const gouraudMaterial = new THREE.ShaderMaterial({
    vertexShader: gouraudVertexShader,
    fragmentShader: gouraudFragmentShader,
    uniforms
});

const flatMaterial = new THREE.ShaderMaterial({
    vertexShader: flatVertexShader,
    fragmentShader: flatFragmentShader,
    uniforms
});

// Main Mesh
const cube = new THREE.Mesh(geometry, phongMaterial);
scene.add(cube);

// Wireframe Overlay Mesh
const wireMat = new THREE.MeshBasicMaterial({ color: 0xffffff, wireframe: true });
const wireMesh = new THREE.Mesh(geometry, wireMat);
wireMesh.scale.set(1.01, 1.01, 1.01); // Prevent z-fighting
cube.add(wireMesh);

// Visibility Initial states
wireMesh.visible = false;

// ============================================================================
// HELPER FUNCTIONS (Normals Helpers Creation)
// ============================================================================
function createVertexNormalsHelper() {
    if (vertexNormalsHelper) {
        scene.remove(vertexNormalsHelper);
        vertexNormalsHelper.dispose();
    }
    vertexNormalsHelper = new VertexNormalsHelper(cube, 2, 0x00ff00);
    scene.add(vertexNormalsHelper);
}

function createFaceNormalsHelper(mesh, size = 4, color = 0xff0000) {
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

// Initialize Helpers
createVertexNormalsHelper();
faceNormalsHelper = createFaceNormalsHelper(cube);
cube.add(faceNormalsHelper);

faceNormalsHelper.visible = false;
vertexNormalsHelper.visible = false;

// ============================================================================
// EVENT LISTENERS: CANVAS & DOM EVENTS
// ============================================================================

// Canvas Mouse Interactions
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

// Window Resize
window.addEventListener('resize', () => {
    camera.aspect = canvasContainer.clientWidth / canvasContainer.clientHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(canvasContainer.clientWidth, canvasContainer.clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
});

// Keyboard Events (Pause/Play)
window.addEventListener('keydown', (event) => {
    const tag = document.activeElement.tagName;
    if (tag === 'INPUT' || tag === 'SELECT') return;

    if (event.key.toLowerCase() === 'p') {
        isAnimationPaused = !isAnimationPaused;
    }
});

// ============================================================================
// EVENT LISTENERS: UI CONTROLS (Sliders, Selects, Checkboxes)
// ============================================================================

// Reset Light Button
document.getElementById('resetLight').addEventListener('click', () => {
    applyLightPosition(DEFAULT_LIGHT_POSITION);
});

// Shading Model Selector
const shadingSelect = document.getElementById('shading');
shadingSelect.addEventListener('change', (event) => {
    switch(event.target.value) {
        case 'flat':
            cube.material = flatMaterial;
            break;
        case 'gouraud':
            cube.material = gouraudMaterial;
            break;
        case 'phong':
            cube.material = phongMaterial;
            break;
    }
});

// Uniform Sliders & Value Counters
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

// Wireframe Checkbox
const wireFrameCheckbox = document.getElementById('wireframe');
wireFrameCheckbox.addEventListener('input', (event) => {
    const isChecked = event.target.checked;
    wireMesh.visible = isChecked;
});

// Normals Display Selector
const normalsSelect = document.getElementById('normalsDisplay');
normalsSelect.addEventListener('change', (event) => {
    if (!vertexNormalsHelper) return;

    switch (event.target.value) {
        case 'none':
            vertexNormalsHelper.visible = false;
            faceNormalsHelper.visible = false;
            break;
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
    }
});

// Geometry Shape Selector
const shapeSelect = document.getElementById('shape');
shapeSelect.addEventListener('change', (event) => {
    const selectedShape = event.target.value;
    let newGeometry;

    if (selectedShape === 'sphere') {
        newGeometry = new THREE.SphereGeometry(16, 32, 32);
    } else if (selectedShape === 'torus') {
        newGeometry = new THREE.TorusGeometry(10, 3, 16, 100);
    } else if (selectedShape === 'capsule') {
        newGeometry = new THREE.CapsuleGeometry(10, 10);
    }

    // Clean old geometry
    cube.geometry.dispose();
    wireMesh.geometry.dispose();

    cube.geometry = newGeometry;
    wireMesh.geometry = newGeometry;

    // Clean and rebuild Vertex Normals Helper
    if (vertexNormalsHelper) {
        scene.remove(vertexNormalsHelper);
        vertexNormalsHelper.dispose();
    }
    createVertexNormalsHelper();

    // Clean and rebuild Face Normals Helper
    if (faceNormalsHelper) {
        cube.remove(faceNormalsHelper);
        faceNormalsHelper.geometry.dispose();
        faceNormalsHelper.material.dispose();
    }
    faceNormalsHelper = createFaceNormalsHelper(cube);
    cube.add(faceNormalsHelper);

    const currentNormalsMode = document.getElementById('normalsDisplay').value;

    switch (currentNormalsMode) {
        case 'none':
            vertexNormalsHelper.visible = false;
            faceNormalsHelper.visible = false;
            break;
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
    }
});

// ============================================================================
// ANIMATION LOOP & RENDERING
// ============================================================================
function animate() {
    requestAnimationFrame(animate);

    // Rotate Main Object
    if (!isAnimationPaused) {
        cube.rotation.y -= 0.001;
    }

    // Update Helpers
    if (vertexNormalsHelper) {
        vertexNormalsHelper.update();
    }
    pointLightHelper.update();

    // Sync Uniforms & Controls
    uniforms.uViewPos.value.copy(camera.position);
    controls.update();

    // Render Scene
    renderer.render(scene, camera);
}

// Start Application
animate();