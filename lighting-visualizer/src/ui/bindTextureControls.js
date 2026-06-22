export function bindTextureControls(textureManager) {
    const useTextureCheckbox = document.getElementById('useTexture');
    const textureUpload = document.getElementById('textureUpload');

    textureUpload.addEventListener('change', (event) => {
        const file = event.target.files[0];
        if (!file) return;

        textureManager.loadFromFile(file);
        useTextureCheckbox.checked = true;
    });

    useTextureCheckbox.addEventListener('change', (event) => {
        if (event.target.checked && !textureManager.hasTexture()) {
            event.target.checked = false;
            textureUpload.click();
            return;
        }

        textureManager.setEnabled(event.target.checked);
    });
}
