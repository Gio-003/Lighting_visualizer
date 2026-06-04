import './style.css'
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { DragControls } from 'three/examples/jsm/controls/DragControls.js';
//import { TeapotGeometry } from 'three/examples/jsm/geometries/TeapotGeometry.js';
import  phongVertexShader  from './shaders/phongVertexShader.vert?raw';
import  phongFragmentShader from './shaders/phongFragmentShader.frag?raw';
import gouraudVertexShader from './shaders/gouraudVertexShader.vert?raw';
import gouraudFragmentShader from './shaders/gouraudFragmentShader.frag?raw';
import flatVertexShader from './shaders/flatVertexShader.vert?raw';
import flatFragmentShader from './shaders/flatFragmentShader.frag?raw';
import { VertexNormalsHelper } from 'three/examples/jsm/helpers/VertexNormalsHelper.js';
//import bg from './assets/bg.jpg';
const DEFAULT_LIGHT_POSITION = new THREE.Vector3(30, 25, 30);
// Set up the scene, camera, and renderer and controls


const canvasContainer = document.querySelector('.canvas-container');
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, canvasContainer.clientWidth / canvasContainer.clientHeight, 0.1, 1000);
camera.position.set(0, 0, 65);
const controls = new OrbitControls(camera, canvasContainer);
controls.enableDamping = true; // Enable damping for smoother controls

let vertexNormalsHelper;

const renderer = new THREE.WebGLRenderer({ 
    canvas: document.getElementById('bg'),
    antialias: true ,
    alpha: true
});

renderer.setSize(canvasContainer.clientWidth, canvasContainer.clientHeight);
renderer.setPixelRatio(window.devicePixelRatio);
//Lighting setup
function applyLightPosition(position) {
    lightGizmo.position.copy(position);
    pointLight.position.copy(lightGizmo.position);
}
const pointLight = new THREE.PointLight(0xffffff, 200, 300);
scene.add(pointLight);
const pointLightHelper = new THREE.PointLightHelper(pointLight, 5);
scene.add(pointLightHelper);

const lightGizmo = new THREE.Mesh(
    new THREE.SphereGeometry(2.2, 20, 20),
    new THREE.MeshBasicMaterial({ color: 0xfff4a8 })
);
scene.add(lightGizmo);
applyLightPosition(DEFAULT_LIGHT_POSITION);


// Set up drag controls for the light gizmo
const dragControls = new DragControls([lightGizmo], camera, canvasContainer);
dragControls.addEventListener('drag', (event) => {
    pointLight.position.copy(event.object.position);
});
dragControls.addEventListener('dragstart', () => {
    controls.enabled = false;
    lightGizmo.material.color.set(0xffffff);
});
dragControls.addEventListener('dragend', () => {
    controls.enabled = true;
    lightGizmo.material.color.set(0xfff4a8);
});

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

document.getElementById('resetLight').addEventListener('click', () => {
    applyLightPosition(DEFAULT_LIGHT_POSITION);
});
// Set up shader uniforms
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
// Create a sphere geometry and material, then add it to the scene with a wireframe overlay
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

const cube = new THREE.Mesh(geometry, phongMaterial);
scene.add(cube);
createVertexNormalsHelper();
vertexNormalsHelper.visible = false;

const wireMat=new THREE.MeshBasicMaterial({color:0xffffff, wireframe:true});
const wireMesh= new THREE.Mesh(geometry, wireMat);
wireMesh.scale.set(1.01, 1.01, 1.01); // Slightly larger to prevent z-fighting
cube.add(wireMesh);
wireMesh.visible = false;


//Event listeners for UI controls
const shadingSelect =
    document.getElementById('shading');

shadingSelect.addEventListener(
    'change',
    (event) => {

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
    }
);


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
    const isChecked = event.target.checked;
    wireMesh.visible = isChecked;
});
// Event listener for shape selection
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
     cube.geometry.dispose();
        wireMesh.geometry.dispose();

        cube.geometry = newGeometry;
        wireMesh.geometry = newGeometry;

        if (vertexNormalsHelper) {
            scene.remove(vertexNormalsHelper);
            vertexNormalsHelper.dispose();
        }

        createVertexNormalsHelper();
       
} );
dragControls.addEventListener('dragstart', (event) => {
    console.log(event.object);
});

scene.add(vertexNormalsHelper);
function createVertexNormalsHelper() {

    if (vertexNormalsHelper) {
        scene.remove(vertexNormalsHelper);
        vertexNormalsHelper.dispose();
    }

    vertexNormalsHelper = new VertexNormalsHelper(
        cube,
        2,
        0x00ff00
    );
    scene.add(vertexNormalsHelper);
}
const normalsSelect = document.getElementById('normalsDisplay');

normalsSelect.addEventListener('change', (event) => {

    if (!vertexNormalsHelper) return;

    switch (event.target.value) {

        case 'none':
            vertexNormalsHelper.visible = false;
            break;

        case 'vertex':
            vertexNormalsHelper.visible = true;
            break;

        case 'face':
            vertexNormalsHelper.visible = false; // još nije implementirano
            break;
    }
});

// Handle window resizing
window.addEventListener('resize', () => {
    // Update camera aspect ratio
    camera.aspect = canvasContainer.clientWidth / canvasContainer.clientHeight;
    camera.updateProjectionMatrix();

    // Update renderer size
    renderer.setSize(canvasContainer.clientWidth, canvasContainer.clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
});
let isAnimationPaused=false;

window.addEventListener('keydown', (event) => {

    const tag = document.activeElement.tagName;

    if (tag === 'INPUT' || tag === 'SELECT') return;

    if (event.key.toLowerCase() === 'p') {
        isAnimationPaused = !isAnimationPaused;
    }
});
// Animation loop to rotate the cube and render the scene
function animate() {
    
    if(!isAnimationPaused) {
        cube.rotation.y -= 0.001;
    }
    if (vertexNormalsHelper) {
    vertexNormalsHelper.update();
}
    requestAnimationFrame(animate);
    uniforms.uViewPos.value.copy(camera.position);
    pointLightHelper.update();
    renderer.render(scene, camera);
    controls.update();
}

animate();