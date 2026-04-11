import './style.css'
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import  vertShader  from './shaders/vertexShader.vert?raw';
import  fragShader  from './shaders/fragmentShader.frag?raw';
//import bg from './assets/bg.jpg';

// Set up the scene, camera, and renderer and controls
const canvasContainer = document.querySelector('.canvas-container');
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, canvasContainer.clientWidth / canvasContainer.clientHeight, 0.1, 1000);
camera.position.set(0, 0, 45);
// Load and set the background texture CHANGE LATER TO GRADIENT
//scene.background = new THREE.TextureLoader().load(bg);
const controls = new OrbitControls(camera, canvasContainer);
controls.enableDamping = true; // Enable damping for smoother controls

const renderer = new THREE.WebGLRenderer({ 
    canvas: document.getElementById('bg'),
    antialias: true 
});
renderer.setSize(canvasContainer.clientWidth, canvasContainer.clientHeight);
renderer.setPixelRatio(window.devicePixelRatio);

const pointLight = new THREE.PointLight(0xffffff, 200, 300);
pointLight.position.set(10, 10, 10);
scene.add(pointLight);
// Create a sphere geometry and material, then add it to the scene with a wireframe overlay
const geometry = new THREE.SphereGeometry(16, 8, 8);
const material = new THREE.ShaderMaterial({ 
    vertexShader: vertShader,
    fragmentShader: fragShader,
     uniforms: {
        uColor: { value: new THREE.Color(0xffff00) },
        uAmbientStrength : { value: 0.1 },
        uLightColor : { value: new THREE.Color(0xffffff) },
        uLightPos : { value: pointLight.position },
        uDiffuse : { value: 0.7 },
        uLightStrength : { value: 10.0 }
    }
});
const cube = new THREE.Mesh(geometry, material);
scene.add(cube);

const wireMat=new THREE.MeshBasicMaterial({color:0xffffff, wireframe:true});
const wireMesh= new THREE.Mesh(geometry, wireMat);
wireMesh.scale.set(1.01, 1.01, 1.01); // Slightly larger to prevent z-fighting
cube.add(wireMesh);
wireMesh.visible = false;

// Add ambient and point lights to the scene
const ambientLight = new THREE.AmbientLight(0xffffff, 5);
scene.add(ambientLight);



//Event listeners for UI controls
const lightSlider = document.getElementById('lightSlider');
lightSlider.addEventListener('input', (event) => {
    const intensity = event.target.value;
    material.uniforms.uLightStrength.value = intensity;
});
const ambientLightSlider = document.getElementById('ambient');
ambientLightSlider.addEventListener('input', (event) => {
    const intensity = event.target.value;
    material.uniforms.uAmbientStrength.value = intensity;
});
const wireFrameCheckbox = document.getElementById('wireframe');
wireFrameCheckbox.addEventListener('input', (event) => {
    const isChecked = event.target.checked;
    wireMesh.visible = isChecked;
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


// Animation loop to rotate the cube and render the scene
function animate() {
    requestAnimationFrame(animate);
    cube.rotation.x += 0.001;
    cube.rotation.y += 0.001;
    renderer.render(scene, camera);
    controls.update();
}

animate();