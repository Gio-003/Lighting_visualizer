import * as THREE from 'three';

export function createTextureManager(uniforms) {
    const loader = new THREE.TextureLoader();
    let currentTexture = null;

    uniforms.uUseTexture.value = 0.0;

    function loadFromFile(file) {
        const url = URL.createObjectURL(file);

        loader.load(
            url,
            (texture) => {
                texture.colorSpace = THREE.SRGBColorSpace;
                texture.wrapS = THREE.RepeatWrapping;
                texture.wrapT = THREE.RepeatWrapping;

                if (currentTexture) {
                    currentTexture.dispose();
                }

                currentTexture = texture;
                uniforms.uTexture.value = texture;
                uniforms.uUseTexture.value = 1.0;

                URL.revokeObjectURL(url);
            },
            undefined,
            () => {
                URL.revokeObjectURL(url);
            }
        );
    }

    function setEnabled(enabled) {
        uniforms.uUseTexture.value = enabled && currentTexture ? 1.0 : 0.0;
    }

    function hasTexture() {
        return currentTexture !== null;
    }

    return { loadFromFile, setEnabled, hasTexture };
}
