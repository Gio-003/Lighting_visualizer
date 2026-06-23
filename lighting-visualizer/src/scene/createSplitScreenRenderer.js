import * as THREE from "three";

export function createSplitScreenRenderer({
  scene,
  camera,
  cube,
  materials,
  uniforms,
  canvasContainer,
  pointLightHelper,
}) {
  let splitScreenVisible = false;
  let splitScreenRenderers = [];
  let splitScreenCameras = [];
  let splitScreenContainers = [];

  // HTML struktura za split screen
  const splitScreenDiv = document.createElement("div");
  splitScreenDiv.id = "split-screen-container";
  splitScreenDiv.style.cssText = `
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        display: none;
        grid-template-columns: 1fr 1fr 1fr;
        gap: 2px;
        background: #0a0a0a;
        z-index: 100;
    `;
  canvasContainer.appendChild(splitScreenDiv);

  const shadingModes = ["flat", "gouraud", "phong"];
  const labels = ["Flat Shading", "Gouraud Shading", "Phong Shading"];

  shadingModes.forEach((mode, index) => {
    // Canvas
    const canvas = document.createElement("canvas");
    canvas.style.cssText = `width: 100%; height: 100%;`;

    // Container sa labelom
    const container = document.createElement("div");
    container.style.cssText = `
            position: relative;
            width: 100%;
            height: 100%;
        `;

    // Label
    const label = document.createElement("div");
    label.textContent = labels[index];
    label.style.cssText = `
            position: absolute;
            top: 10px;
            left: 10px;
            color: #00adb5;
            font-size: 12px;
            font-weight: bold;
            z-index: 10;
            background: rgba(0, 0, 0, 0.7);
            padding: 5px 10px;
            border-radius: 3px;
        `;

    container.appendChild(canvas);
    container.appendChild(label);
    splitScreenDiv.appendChild(container);

    // Renderer
    const renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      alpha: false,
    });
    renderer.setClearColor(0x0a0a0a);
    renderer.setPixelRatio(window.devicePixelRatio);

    // Camera
    const splitCamera = camera.clone();

    splitScreenRenderers.push({ renderer, mode });
    splitScreenCameras.push(splitCamera);
    splitScreenContainers.push(container);
  });

  function updateSplitScreenSize() {
    const width = canvasContainer.clientWidth / 3;
    const height = canvasContainer.clientHeight;

    splitScreenRenderers.forEach((rs) => {
      rs.renderer.setSize(width, height);
    });

    splitScreenCameras.forEach((cam) => {
      cam.aspect = width / height;
      cam.updateProjectionMatrix();
    });
  }

  function renderSplitScreen() {
    splitScreenRenderers.forEach(({ renderer, mode }, index) => {
      // Privremeno meni material
      const originalMaterial = cube.material;

      switch (mode) {
        case "flat":
          cube.material = materials.flatMaterial;
          break;
        case "gouraud":
          cube.material = materials.gouraudMaterial;
          break;
        case "phong":
          cube.material = materials.phongMaterial;
          break;
      }

      // Render sa split camera-om
      renderer.render(scene, splitScreenCameras[index]);

      // Vrati originalni material
      cube.material = originalMaterial;
    });
  }

  window.addEventListener("resize", () => {
    if (splitScreenVisible) {
      updateSplitScreenSize();
    }
  });

  return {
    toggle: () => {
      splitScreenVisible = !splitScreenVisible;
      splitScreenDiv.style.display = splitScreenVisible ? "grid" : "none";

      if (splitScreenVisible) {
        updateSplitScreenSize();
      }

      return splitScreenVisible;
    },

    isVisible: () => splitScreenVisible,

    show: () => {
      splitScreenVisible = true;
      splitScreenDiv.style.display = "grid";
      updateSplitScreenSize();
    },

    hide: () => {
      splitScreenVisible = false;
      splitScreenDiv.style.display = "none";
    },

    render: renderSplitScreen,

    updateCamera: (camera) => {
      splitScreenCameras.forEach((cam) => {
        cam.position.copy(camera.position);
        cam.quaternion.copy(camera.quaternion);
        cam.updateMatrix();
      });
    },
  };
}
