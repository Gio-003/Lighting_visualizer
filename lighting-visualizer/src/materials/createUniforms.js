import * as THREE from 'three';
import { DEFAULT_UNIFORM_VALUES } from '../config/constants.js';

function createDefaultTexture() {
    const data = new Uint8Array([255, 255, 255, 255]);
    const texture = new THREE.DataTexture(data, 1, 1, THREE.RGBAFormat);
    texture.needsUpdate = true;
    return texture;
}

export function createUniforms({ lightPosition, cameraPosition }) {
    return {
        uColor: { value: new THREE.Color(0xa0a0a0) },
        uAmbientStrength: { value: DEFAULT_UNIFORM_VALUES.uAmbientStrength },
        uLightColor: { value: new THREE.Color(0xffffff) },
        uLightPos: { value: lightPosition },
        uDiffuse: { value: DEFAULT_UNIFORM_VALUES.uDiffuse },
        uLightStrength: { value: DEFAULT_UNIFORM_VALUES.uLightStrength },
        uSpecularStrength: { value: DEFAULT_UNIFORM_VALUES.uSpecularStrength },
        uViewPos: { value: cameraPosition },
        uShininess: { value: DEFAULT_UNIFORM_VALUES.uShininess },
        uTexture: { value: createDefaultTexture() },
        uUseTexture: { value: 0.0 },
    };
}
