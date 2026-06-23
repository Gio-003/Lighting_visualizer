import * as THREE from "three";
import { DragControls } from "three/examples/jsm/controls/DragControls.js";
import { DEFAULT_LIGHT_POSITION } from "../config/constants.js";

export function createLightSystem({
  scene,
  camera,
  canvasContainer,
  controls,
}) {
  const pointLight = new THREE.PointLight(0xffffff, 200, 300);
  scene.add(pointLight);

  const pointLightHelper = new THREE.PointLightHelper(pointLight, 5);
  scene.add(pointLightHelper);

  const lightGizmo = new THREE.Mesh(
    new THREE.SphereGeometry(2.2, 20, 20),
    new THREE.MeshBasicMaterial({ color: 0xfff4a8 }),
  );
  scene.add(lightGizmo);

  function applyLightPosition(position) {
    lightGizmo.position.copy(position);
    pointLight.position.copy(lightGizmo.position);
  }

  applyLightPosition(DEFAULT_LIGHT_POSITION);

  const dragControls = new DragControls([lightGizmo], camera, canvasContainer);
  let isDragEnabled = true;

  dragControls.addEventListener("dragstart", (event) => {
    if (!isDragEnabled) return;
    controls.enabled = false;
    lightGizmo.material.color.set(0xffffff);
    console.log(event.object);
  });

  dragControls.addEventListener("drag", (event) => {
    if (!isDragEnabled) return;
    pointLight.position.copy(event.object.position);
  });

  dragControls.addEventListener("dragend", () => {
    if (!isDragEnabled) return;
    controls.enabled = true;
    lightGizmo.material.color.set(0xfff4a8);
  });

  return {
    pointLight,
    pointLightHelper,
    lightGizmo,
    dragControls,
    applyLightPosition,
    resetLight: () => applyLightPosition(DEFAULT_LIGHT_POSITION),
    setDragEnabled: (enabled) => {
      isDragEnabled = enabled;
      dragControls.enabled = enabled;
    },
    isDragEnabled: () => isDragEnabled,
  };
}
