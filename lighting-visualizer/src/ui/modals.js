function switchModals(modalToCloseId, modalToOpenId) {
    const closeTarget = document.getElementById(modalToCloseId);
    const openTarget = document.getElementById(modalToOpenId);

    if (closeTarget) {
        closeTarget.classList.remove('active');
    }
    if (openTarget) {
        openTarget.classList.add('active');
    }
}

const SHADER_CODE_MODALS = {
    flat: 'flat-code-modal',
    gouraud: 'gouraud-code-modal',
    phong: 'phong-code-modal',
};

export function bindModals() {
    const btnAbout = document.getElementById('btnAbout');
    const btnShaderInfo = document.getElementById('btnShaderInfo');
    const modalAbout = document.getElementById('modalAbout');
    const modalShaderInfo = document.getElementById('modalShaderInfo');
    const closeAbout = document.getElementById('closeAbout');
    const closeShaderInfo = document.getElementById('closeShaderInfo');

    const codeModals = Object.values(SHADER_CODE_MODALS)
        .map((id) => document.getElementById(id))
        .filter(Boolean);

    btnAbout.addEventListener('click', () => {
        modalAbout.classList.add('active');
    });

    btnShaderInfo.addEventListener('click', () => {
        modalShaderInfo.classList.add('active');
    });

    closeAbout.addEventListener('click', () => {
        modalAbout.classList.remove('active');
    });

    closeShaderInfo.addEventListener('click', () => {
        modalShaderInfo.classList.remove('active');
    });

    window.addEventListener('click', (event) => {
        if (event.target === modalAbout) {
            modalAbout.classList.remove('active');
        }
        if (event.target === modalShaderInfo) {
            modalShaderInfo.classList.remove('active');
        }
        codeModals.forEach((modal) => {
            if (event.target === modal) {
                modal.classList.remove('active');
            }
        });
    });

    document.querySelectorAll('.btn-details[data-shader]').forEach((button) => {
        button.addEventListener('click', () => {
            const shader = button.dataset.shader;
            const modalId = SHADER_CODE_MODALS[shader];
            if (modalId) {
                switchModals('modalShaderInfo', modalId);
            }
        });
    });

    codeModals.forEach((modal) => {
        modal.querySelector('.modal-close')?.addEventListener('click', () => {
            switchModals(modal.id, 'modalShaderInfo');
        });
    });
}
