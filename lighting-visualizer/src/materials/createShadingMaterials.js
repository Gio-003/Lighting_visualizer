import * as THREE from 'three';

import phongVertexShader from '../shaders/phongVertexShader.vert?raw';
import phongFragmentShader from '../shaders/phongFragmentShader.frag?raw';
import gouraudVertexShader from '../shaders/gouraudVertexShader.vert?raw';
import gouraudFragmentShader from '../shaders/gouraudFragmentShader.frag?raw';
import flatVertexShader from '../shaders/flatVertexShader.vert?raw';
import flatFragmentShader from '../shaders/flatFragmentShader.frag?raw';

export function createShadingMaterials(uniforms) {
    const phongMaterial = new THREE.ShaderMaterial({
        vertexShader: phongVertexShader,
        fragmentShader: phongFragmentShader,
        uniforms,
    });

    const gouraudMaterial = new THREE.ShaderMaterial({
        vertexShader: gouraudVertexShader,
        fragmentShader: gouraudFragmentShader,
        uniforms,
    });

    const flatMaterial = new THREE.ShaderMaterial({
        vertexShader: flatVertexShader,
        fragmentShader: flatFragmentShader,
        uniforms,
    });

    return { phongMaterial, gouraudMaterial, flatMaterial };
}
