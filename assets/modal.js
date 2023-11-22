const modalElements = document.querySelectorAll('.modal')
const settingsModalElement = document.querySelector('#settings-modal')
const deleteModalElement = document.querySelector('#delete-modal')
const infoModalElement = document.querySelector('#info-modal')
const confirmDeleteBtn = document.querySelector('#confirm-delete')
const cancelDeleteBtn = document.querySelector('#cancel-delete')
const deleteAllBtn = document.querySelector('#delete-chat-btn')
const settingsBtn = document.querySelector('#settings-btn')
const sysMsgHintText = document.querySelector('#system-msg-hidden-hint-text')
const showHintBtn = document.querySelector('#show-system-msg-hint-btn')
const infoOkBtn = document.querySelector('#info-ok-btn')


modalElements.forEach((modal) => {
    window.addEventListener('click', (e) => {
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


showHintBtn.addEventListener('click', (e) => {
    e.preventDefault()
    sysMsgHintText.style.display = 'block'
    showHintBtn.style.display = 'none'
    showHintBtn.querySelector('svg').style.display = 'none'
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
    sysMsgHintText.style.display = null
    showHintBtn.style.display = null
    showHintBtn.querySelector('svg').style.display = null
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
