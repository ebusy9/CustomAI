const modalElements = document.querySelectorAll('.modal')
const settingsModalElement = document.querySelector('#settings-modal')
const deleteModalElement = document.querySelector('#delete-modal')
const infoModalElement = document.querySelector('#info-modal')
const confirmDeleteBtn = document.querySelector('#confirm-delete')
const cancelDeleteBtn = document.querySelector('#cancel-delete')
const deleteAllBtn = document.querySelector('#delete-chat-btn')
const settingsBtn = document.querySelector('#settings-btn')
const infoOkBtn = document.querySelector('#info-ok-btn')


modalElements.forEach((modal) => {
    window.addEventListener('mousedown', (e) => {
        if (e.target === modal.parentElement) {
            closeModal(modal)
        }
    })

    modal.querySelector('.close-modal-btn').addEventListener('click', () => {
        closeModal(modal)
    })
})


window.addEventListener('keyup', (e) => {
    if(e.code === 'Escape') {
        modalElements.forEach((modal) => {
        closeModal(modal)
        })
    }
})


settingsBtn.addEventListener('click', openSettingsModal)


deleteAllBtn.addEventListener('click', openDeleteModal)


cancelDeleteBtn.addEventListener('click', () => {
    closeModal(deleteModalElement)
})


confirmDeleteBtn.addEventListener('click', () => {
    closeModal(deleteModalElement)
})


infoOkBtn.addEventListener('click', () => {
    closeModal(infoModalElement)
})


function openDeleteModal() {
    deleteModalElement.parentElement.style.display = 'flex'
}


function openSettingsModal() {
    settingsModalElement.parentElement.style.display = 'flex'
}


function closeModal(modal) {
    modal.parentElement.style.display = null
}


const contextLimitInput = document.querySelector('#context-limit-input')
const contextLimitInputPlus = document.querySelector('#context-limit-input-plus')
const contextLimitInputMinus = document.querySelector('#context-limit-input-minus')
const temperatureInput = document.querySelector('#temperature-input')
const temperatureInputPlus = document.querySelector('#temperature-input-plus')
const temperatureInputMinus = document.querySelector('#temperature-input-minus')


temperatureInputPlus.addEventListener('click', (e) => {
    temperatureInput.stepUp()
})


temperatureInputMinus.addEventListener('click', (e) => {
    temperatureInput.stepDown()
})


contextLimitInputPlus.addEventListener('click', (e) => {
    contextLimitInput.stepUp()
})


contextLimitInputMinus.addEventListener('click', (e) => {
    contextLimitInput.stepDown()
})
