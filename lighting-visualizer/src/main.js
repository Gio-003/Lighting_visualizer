import './style.css'
import * as THREE from 'three';

// Get the container
const canvasContainer = document.querySelector('.canvas-container');

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(75, canvasContainer.clientWidth / canvasContainer.clientHeight, 0.1, 1000);
camera.position.set(0, 0, 45);

const renderer = new THREE.WebGLRenderer({ 
    canvas: document.getElementById('bg'),
    antialias: true 
});
renderer.setSize(canvasContainer.clientWidth, canvasContainer.clientHeight);
renderer.setPixelRatio(window.devicePixelRatio);

const geometry = new THREE.TorusGeometry(10, 3, 16, 40);
const material = new THREE.MeshStandardMaterial({ color: 0x0077ff });
const cube = new THREE.Mesh(geometry, material);
scene.add(cube);

const ambientLight = new THREE.AmbientLight(0xffffff, 0.3);
scene.add(ambientLight);

const pointLight = new THREE.PointLight(0xffffff, 100, 100);
pointLight.position.set(10, 10, 10);
scene.add(pointLight);

// Handle window resizing
window.addEventListener('resize', () => {
    // Update camera aspect ratio
    camera.aspect = canvasContainer.clientWidth / canvasContainer.clientHeight;
    camera.updateProjectionMatrix();

    // Update renderer size
    renderer.setSize(canvasContainer.clientWidth, canvasContainer.clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
});

function animate() {
    requestAnimationFrame(animate);
    cube.rotation.x += 0.001;
    cube.rotation.y += 0.001;
    renderer.render(scene, camera);
}

animate();