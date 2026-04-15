import './style.css'
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
//import { TeapotGeometry } from 'three/examples/jsm/geometries/TeapotGeometry.js';
import  phongVertexShader  from './shaders/phongVertexShader.vert?raw';
import  phongFragmentShader from './shaders/phongFragmentShader.frag?raw';
//import bg from './assets/bg.jpg';

// Set up the scene, camera, and renderer and controls
const canvasContainer = document.querySelector('.canvas-container');
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, canvasContainer.clientWidth / canvasContainer.clientHeight, 0.1, 1000);
camera.position.set(0, 0, 45);
const controls = new OrbitControls(camera, canvasContainer);
controls.enableDamping = true; // Enable damping for smoother controls

const renderer = new THREE.WebGLRenderer({ 
    canvas: document.getElementById('bg'),
    antialias: true ,
    alpha: true
});
renderer.setSize(canvasContainer.clientWidth, canvasContainer.clientHeight);
renderer.setPixelRatio(window.devicePixelRatio);
const pointLight = new THREE.PointLight(0xffffff, 200, 300);
pointLight.position.set(200, 70, 100);
scene.add(pointLight);
const pointLightHelper = new THREE.PointLightHelper(pointLight, 5);
scene.add(pointLightHelper);
// Create a sphere geometry and material, then add it to the scene with a wireframe overlay
let geometry = new THREE.SphereGeometry(16, 32, 32);
const material = new THREE.ShaderMaterial({ 
    vertexShader: phongVertexShader,
    fragmentShader: phongFragmentShader ,
     uniforms: {
        uColor: { value: new THREE.Color(0xa0a0a0) },
        uAmbientStrength : { value: 0.1 },
        uLightColor : { value: new THREE.Color(0xffffff) },
        uLightPos : { value: pointLight.position },
        uDiffuse : { value: 0.7 },
        uLightStrength : { value: 1.0 },
        uSpecularStrength : { value: 0.5 },
        uViewPos : { value: camera.position },
        uShininess : { value: 32.0 }
    }
});
const cube = new THREE.Mesh(geometry, material);
scene.add(cube);

const wireMat=new THREE.MeshBasicMaterial({color:0xffffff, wireframe:true});
const wireMesh= new THREE.Mesh(geometry, wireMat);
wireMesh.scale.set(1.01, 1.01, 1.01); // Slightly larger to prevent z-fighting
cube.add(wireMesh);
wireMesh.visible = false;


//Event listeners for UI controls
const lightSlider = document.getElementById('lightSlider');
const lightSSliderValue = document.getElementById('lightSSliderValue');
lightSlider.addEventListener('input', (event) => {
    const intensity = event.target.value;
    material.uniforms.uLightStrength.value = intensity;
    lightSSliderValue.textContent = intensity;
});
const ambientLightSlider = document.getElementById('ambient');
const ambientValue = document.getElementById('ambientValue');
ambientLightSlider.addEventListener('input', (event) => {
    const intensity = event.target.value;
    material.uniforms.uAmbientStrength.value = intensity;
    ambientValue.textContent = intensity;
});
const diffuseSlider = document.getElementById('diffuse');
const diffuseValue = document.getElementById('diffuseValue');
diffuseSlider.addEventListener('input', (event) => {
    const intensity = event.target.value;
    material.uniforms.uDiffuse.value = intensity;
    diffuseValue.textContent = intensity;
});
const specularSlider = document.getElementById('specular');
const specularValue = document.getElementById('specularValue');
specularSlider.addEventListener('input', (event) => {
    const intensity = event.target.value;
    material.uniforms.uSpecularStrength.value = intensity;
    specularValue.textContent = intensity;
});
const shininessSlider = document.getElementById('shininess');
const shininessValue = document.getElementById('shininessValue');
shininessSlider.addEventListener('input', (event) => {
    const shininess = event.target.value;
    material.uniforms.uShininess.value = shininess;
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
    // Postavljanje nove geometrije
    cube.geometry = newGeometry;
    wireMesh.geometry = newGeometry;
} );

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
    if(event.key=='p'||event.key=='P'){
        isAnimationPaused=!isAnimationPaused;
    }
}); 
// Animation loop to rotate the cube and render the scene
function animate() {
    requestAnimationFrame(animate);
    if(!isAnimationPaused) {
        cube.rotation.y -= 0.001;
    }
    material.uniforms.uViewPos.value.copy(camera.position);
    renderer.render(scene, camera);
    controls.update();
}

animate();