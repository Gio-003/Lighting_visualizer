import * as THREE from 'three';

export const CANVAS_BACKGROUND = 0x121824;
export const OBJECT_COLOR = 0x00adb5;
export const NORMAL_VECTOR_COLOR = 0x39ff14;
export const FACE_NORMAL_COLOR = 0xff0000;

export const DEFAULT_LIGHT_POSITION = new THREE.Vector3(30, 25, 30);

export const DEFAULT_UNIFORM_VALUES = {
    uAmbientStrength: 0.1,
    uDiffuse: 0.7,
    uLightStrength: 2.05,
    uSpecularStrength: 0.6,
    uShininess: 32.0,
};

export const DEFAULT_SCENE_STATE = {
    ka: DEFAULT_UNIFORM_VALUES.uAmbientStrength,
    kd: DEFAULT_UNIFORM_VALUES.uDiffuse,
    ks: DEFAULT_UNIFORM_VALUES.uSpecularStrength,
    shiny: DEFAULT_UNIFORM_VALUES.uShininess,
    lightStrength: DEFAULT_UNIFORM_VALUES.uLightStrength,
    shading: 'phong',
    shape: 'sphere',
    lightPos: { x: 30, y: 25, z: 30 },
    wireframe: false,
    normalsDisplay: 'none',
    useTexture: false,
};
