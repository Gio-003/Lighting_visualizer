import * as THREE from 'three';

export const DEFAULT_LIGHT_POSITION = new THREE.Vector3(30, 25, 30);

export const DEFAULT_UNIFORM_VALUES = {
    uAmbientStrength: 0.1,
    uDiffuse: 0.7,
    uLightStrength: 2.05,
    uSpecularStrength: 0.5,
    uShininess: 32.0,
};
