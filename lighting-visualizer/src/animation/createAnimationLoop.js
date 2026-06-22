export function createAnimationLoop({
    scene,
    camera,
    renderer,
    controls,
    cube,
    uniforms,
    pointLightHelper,
    normals,
}) {
    let isAnimationPaused = false;

    function animate() {
        requestAnimationFrame(animate);

        if (!isAnimationPaused) {
            cube.rotation.y -= 0.005;
        }

        if (normals.vertexNormalsHelper) {
            normals.vertexNormalsHelper.update();
        }
        pointLightHelper.update();

        uniforms.uViewPos.value.copy(camera.position);
        controls.update();

        renderer.render(scene, camera);
    }

    return {
        start: () => animate(),
        togglePause: () => {
            isAnimationPaused = !isAnimationPaused;
        },
    };
}
