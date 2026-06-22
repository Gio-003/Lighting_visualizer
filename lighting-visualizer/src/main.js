import './style.css';

import { createRenderer } from './scene/createRenderer.js';
import { createOrbitControls } from './scene/createOrbitControls.js';
import { createLightSystem } from './lighting/createLightSystem.js';
import { createGizmoPicker } from './lighting/gizmoPicker.js';
import { createUniforms } from './materials/createUniforms.js';
import { createShadingMaterials } from './materials/createShadingMaterials.js';
import { createTextureManager } from './materials/textureManager.js';
import { createMainMesh } from './mesh/createMainMesh.js';
import { setupNormalsHelpers } from './helpers/normalsHelpers.js';
import { bindCanvasEvents } from './ui/bindCanvasEvents.js';
import { bindSidebarControls } from './ui/bindSidebarControls.js';
import { bindTextureControls } from './ui/bindTextureControls.js';
import { bindModals } from './ui/modals.js';
import { createAnimationLoop } from './animation/createAnimationLoop.js';

const { scene, camera, renderer, canvasContainer } = createRenderer();
const controls = createOrbitControls(camera, canvasContainer);

const lightSystem = createLightSystem({ scene, camera, canvasContainer, controls });
createGizmoPicker({
    camera,
    canvasContainer,
    lightGizmo: lightSystem.lightGizmo,
    controls,
});

const uniforms = createUniforms({
    lightPosition: lightSystem.pointLight.position,
    cameraPosition: camera.position,
});
const materials = createShadingMaterials(uniforms);
const textureManager = createTextureManager(uniforms);

const { cube, wireMesh } = createMainMesh({
    scene,
    material: materials.phongMaterial,
});
const normals = setupNormalsHelpers(scene, cube);

bindSidebarControls({
    cube,
    wireMesh,
    uniforms,
    materials,
    normals,
    resetLight: lightSystem.resetLight,
    textureManager,
});

bindTextureControls(textureManager);

bindModals();

const animationLoop = createAnimationLoop({
    scene,
    camera,
    renderer,
    controls,
    cube,
    uniforms,
    pointLightHelper: lightSystem.pointLightHelper,
    normals,
});

bindCanvasEvents({
    onTogglePause: () => animationLoop.togglePause(),
});

animationLoop.start();
