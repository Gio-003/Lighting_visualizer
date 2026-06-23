export function createAnimationLoop({
  scene,
  camera,
  renderer,
  controls,
  cube,
  uniforms,
  pointLightHelper,
  normals,
  lightAnimation,
  splitScreenRenderer,
}) {
  let isAnimationPaused = false;
  let startTime = Date.now();

  function animate() {
    requestAnimationFrame(animate);

    const elapsedSeconds = (Date.now() - startTime) / 1000;

    if (!isAnimationPaused) {
      cube.rotation.y -= 0.005;
    }

    // Update svetlosne animacije
    if (lightAnimation) {
      lightAnimation.update(elapsedSeconds);
    }

    if (normals.vertexNormalsHelper) {
      normals.vertexNormalsHelper.update();
    }
    pointLightHelper.update();

    uniforms.uViewPos.value.copy(camera.position);
    controls.update();

    renderer.render(scene, camera);

    // Render split-screen ako je vidljiv
    if (splitScreenRenderer && splitScreenRenderer.isVisible()) {
      splitScreenRenderer.updateCamera(camera);
      splitScreenRenderer.render();
    }
  }

  return {
    start: () => animate(),
    togglePause: () => {
      isAnimationPaused = !isAnimationPaused;
    },
  };
}
