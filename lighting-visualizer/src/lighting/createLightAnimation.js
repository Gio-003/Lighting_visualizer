export function createLightAnimation({ lightGizmo, pointLight }) {
  let isAnimating = false;
  let animationSpeed = 0.01; // radijani po frame-u
  let animationRadius = 30;
  let startTime = Date.now();

  function updateLightPosition(elapsedSeconds) {
    const angle = elapsedSeconds * animationSpeed * 60; // prilagođeno FPS-u
    const x = Math.cos(angle) * animationRadius;
    const z = Math.sin(angle) * animationRadius;
    const y = 20 + Math.sin(angle * 0.5) * 10; // sinusno osciliranje po Y

    lightGizmo.position.set(x, y, z);
    pointLight.position.copy(lightGizmo.position);
  }

  return {
    update: (elapsedSeconds) => {
      if (isAnimating) {
        updateLightPosition(elapsedSeconds);
      }
    },
    start: () => {
      isAnimating = true;
      startTime = Date.now();
    },
    stop: () => {
      isAnimating = false;
    },
    isAnimating: () => isAnimating,
    setSpeed: (speed) => {
      animationSpeed = speed;
    },
    setRadius: (radius) => {
      animationRadius = radius;
    },
    getSpeed: () => animationSpeed,
    getRadius: () => animationRadius,
  };
}
