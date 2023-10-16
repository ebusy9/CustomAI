const submitBtn = document.querySelector('#sub-btn')
const token = document.querySelector('#token')
const messagesDiv = document.querySelector('#messages')
const form = document.querySelector('#message-form')
const chatInput = document.querySelector('#form-inputs')
const messageInput = document.querySelector('#content')
const bottomPaddingDiv = document.querySelector('#bottom-padding')
const settingsModal = document.querySelector('.modal-container')
const modalCloseBtn = document.querySelector('.close-modal-btn')
const modalApplyBtn = document.querySelector('.apply-modal-btn')
const settingsBtn = document.querySelector('#settings-btn')
const chatInputDisabledMsg = document.querySelector('#input-disabled-msg')
const hintText = document.querySelector('.hidden-hint-text')
const showHintBtn = document.querySelector('.show-hint-btn ')
const modelSelect = document.querySelector('#model-select')
const contextLimitInput = document.querySelector('#context-limit-input')
const contextLimitInputPlus = document.querySelector('#context-limit-input-plus')
const contextLimitInputMinus = document.querySelector('#context-limit-input-minus')
const loadingGifPath = '/assets/images/loading.gif'
let displayedMessages = []
let isChatInputDisabled = false
let modelSelectSet = false

updateMessagesAndForm()

let updateMessagesAndFormInterval = setInterval(updateMessagesAndForm, 6000)

resize(messageInput)

window.addEventListener('click', (e) => {
    console.log(e.target.clientHeight)
})

window.addEventListener('click', (e) => {
    if (e.target === settingsModal
        || e.target === modalCloseBtn
        || e.target === modalApplyBtn
        || e.target === modalApplyBtn.querySelector('svg')
        || e.target === modalCloseBtn.querySelector('svg')
        || e.target === modalCloseBtn.querySelector('svg').querySelector('path')
        || e.target === modalApplyBtn.querySelector('svg').querySelector('path')) {
        e.preventDefault()
        settingsModal.style.display = 'none'
        hintText.style.display = null
        showHintBtn.style.display = null
        showHintBtn.querySelector('svg').style.display = null
    }
})

contextLimitInputPlus.addEventListener('click', (e) => {
    e.preventDefault()
    contextLimitInput.stepUp()
})

contextLimitInputMinus.addEventListener('click', (e) => {
    e.preventDefault()
    contextLimitInput.stepDown()
})

settingsBtn.addEventListener('click', (e) => {
    e.preventDefault()
    settingsModal.style.display = 'flex'
})

messageInput.addEventListener('keypress', function (e) {

    if (e.key === 'Enter' && !e.shiftKey) {
        submitFormUpdateMessages(e)
    }
})

submitBtn.addEventListener('click', (e) => {
    submitFormUpdateMessages(e)
})

messageInput.addEventListener('input', () => {
    resize(messageInput)
})

showHintBtn.addEventListener('click', (e) => {
    e.preventDefault()
    hintText.style.display = 'block'
    showHintBtn.style.display = 'none'
    showHintBtn.querySelector('svg').style.display = 'none'
})

async function updateMessagesAndForm() {
    fetch('api/gpt', {
        method: 'POST'
    })
        .then((response) => {
            if (isChatInputDisabled) { return }
            response.json()
                .then((response) => {
                    if (isChatInputDisabled) { return }
                    insertMessagesAndConfigureForm(response)
                })
        })
}

function insertMessagesAndConfigureForm(response) {
    token.value = response.token
    let messagesUpdated = false

    if (!modelSelectSet) {
        modelSelectSet = true
        response.models.forEach(model => {
            modelSelect.innerHTML += `<option value='${model.value}'>${model.label}</option>`
        })
    }

    response.messages.forEach(message => {
        const uuid = uuidv4()
        if (displayedMessages.length === 0) {
            messagesUpdated = true
            displayedMessages = [{
                id: message['id'],
                uuid: uuid,
                role: message['role'],
                timestamp: message['createdAt']['timestamp'],
                content: message['content']
            }]
            bottomPaddingDiv.insertAdjacentHTML("beforebegin",
                `<div class="${message['role']}-container" id="${message['role']}-${uuid}">
                    <div class="${message['role']}">
                        <div class="message-content">${message['content']}</div>
                    </div>
                    <div class="date">${getFormattedDate(message['createdAt']['timestamp'])}</div>
                </div>`)
        } else if (displayedMessages.find(object => { return object.id === message['id'] }) === undefined) {
            messagesUpdated = true
            displayedMessages.push({
                id: message['id'],
                uuid: uuid, role: message['role'],
                timestamp: message['createdAt']['timestamp'],
                content: message['content']
            })

            displayedMessages = displayedMessages.sort((aObject, bObject) => {
                const aTimestamp = aObject.timestamp
                const bTimestamp = bObject.timestamp
                if (aTimestamp > bTimestamp) {
                    return 1
                }
                if (aTimestamp < bTimestamp) {
                    return -1
                }
                return 0
            })

            const indexOfMessage = displayedMessages.findIndex(object => { return object.uuid === uuid })

            if (indexOfMessage === 0) {
                messagesDiv.insertAdjacentHTML('afterbegin',
                    `<div class="${message['role']}-container" id="${message['role']}-${uuid}">
                        <div class="${message['role']}">
                            <div class="message-content">${message['content']}</div>
                        </div>
                        <div class="date">${getFormattedDate(message['createdAt']['timestamp'])}</div>
                    </div>`)

            }

            if (indexOfMessage > 0) {
                const indexOfPreviousMessage = indexOfMessage - 1

                const previousMessageDiv = document.querySelector(`#${displayedMessages[indexOfPreviousMessage].role}-${displayedMessages[indexOfPreviousMessage].uuid}`)

                previousMessageDiv.insertAdjacentHTML('afterend',
                    `<div class="${message['role']}-container" id="${message['role']}-${uuid}">
                    <div class="${message['role']}">
                        <div class="message-content">${message['content']}</div>
                    </div>
                    <div class="date">${getFormattedDate(message['createdAt']['timestamp'])}</div>
                </div>`)
            }
        }
    })
    if (messagesUpdated) {
        messagesDiv.scrollTo({ top: messagesDiv.scrollHeight })
    }
}

async function submitFormUpdateMessages(event) {
    event.preventDefault()
    const formData = new FormData(form)
    const sentMessageContent = formData.get('message[content]')
    if (isChatInputDisabled) {
        chatInputDisabledMsg.style.display = 'block'
        chatInputDisabledMsg.innerHTML = 'Please wait until the message is loaded...'
        chatInput.style.border = '1px solid #DD4A48'
        setTimeout(() => {
            chatInputDisabledMsg.style.display = null
            chatInput.style.border = null
        }, 4500)
        return
    }
    if (sentMessageContent.replace(/[\r\n]/gm, '').length === 0) {
        chatInputDisabledMsg.style.display = 'block'
        chatInputDisabledMsg.innerHTML = 'Message should not be empty.'
        chatInput.style.border = '1px solid #DD4A48'
        setTimeout(() => {
            chatInputDisabledMsg.style.display = null
            chatInput.style.border = null
        }, 4500)
        return
    }
    clearInterval(updateMessagesAndFormInterval)
    isChatInputDisabled = true
    messagesLoading(sentMessageContent)
    fetch('api/gpt', {
        method: 'POST',
        body: formData
    })
        .then((response) => {
            response.json()
                .then((response) => {
                    messagesLoaded(response)
                    isChatInputDisabled = false
                    updateMessagesAndFormInterval = setInterval(updateMessagesAndForm, 6000)
                })
        })
}

function messagesLoading(messageSentContent) {
    messageInput.value = ''
    resize(messageInput)
    bottomPaddingDiv.insertAdjacentHTML("beforebegin",
        `<div class="user-container" id="loading-user-container">
            <div class="user">
                <div class="message-content">${messageSentContent}</div>
            </div>
            <div class="date">${getFormattedDate()}</div>
        </div>`)
    messagesDiv.scrollTo({ top: messagesDiv.scrollHeight, behavior: 'smooth' })
    setTimeout(() => {
        bottomPaddingDiv.insertAdjacentHTML("beforebegin",
            `<div class="assistant-container" id="loading-assistant-container">
                <div class="assistant">
                    <div class="message-content" id="loading-message-content"><img src="${loadingGifPath}"></div>
                </div>
                <div class="date" id="loading-date"><img src="${loadingGifPath}"></div>
            </div>`)
        messagesDiv.scrollTo({ top: messagesDiv.scrollHeight, behavior: 'smooth' })
    }, 400)
}

function messagesLoaded(response) {
    token.value = response.token

    const userUuid = uuidv4()
    const loadingUserDiv = document.querySelector('#loading-user-container')
    loadingUserDiv.id = `${response.userMessage.role}-${userUuid}`
    displayedMessages.push({
        id: response.userMessage.id,
        uuid: userUuid,
        role: response.userMessage.role,
        timestamp: response.userMessage.createdAt.timestamp,
        content: response.userMessage.content
    })

    const assistantUuid = uuidv4()
    const loadingAssistantDiv = document.querySelector('#loading-assistant-container')
    loadingAssistantDiv.id = `${response.assistantMessage.role}-${assistantUuid}`
    const loadingDateDiv = document.querySelector('#loading-date')
    loadingDateDiv.innerHTML = getFormattedDate(response.assistantMessage.createdAt.timestamp)
    loadingDateDiv.removeAttribute('id')
    const loadingMessageContentDiv = document.querySelector('#loading-message-content')
    displayedMessages.push({
        id: response.assistantMessage.id,
        uuid: assistantUuid,
        role: response.assistantMessage.role,
        timestamp: response.assistantMessage.createdAt.timestamp,
        content: response.assistantMessage.content
    })

    typeMessage(loadingMessageContentDiv, response.assistantMessage.content)

    loadingMessageContentDiv.removeAttribute('id')
}

function typeMessage(loadingMessageContentDiv, messageContent) {
    loadingMessageContentDiv.innerHTML = messageContent
    loadingMessageContentDiv.style.width = `${loadingMessageContentDiv.clientWidth}px`
    loadingMessageContentDiv.parentElement.style.overflowX = "hidden";
    bottomPaddingDiv.style.height = bottomPaddingDiv.clientHeight + loadingMessageContentDiv.clientHeight - 22 + 'px'
    messagesDiv.scrollTo({ top: messagesDiv.scrollHeight, behavior: 'smooth' })
    type(loadingMessageContentDiv, messageContent, bottomPaddingDiv.clientHeight)
}

function type(loadingMessageContentDiv, messageContent, bottomPaddingHeight, index = 0) {
    if (index < messageContent.length) {
        loadingMessageContentDiv.innerHTML = messageContent.slice(0, index) + '<span class="blinking-cursor">|</span>'
        index += Math.floor(Math.random() * 5)
        setTimeout(() => { type(loadingMessageContentDiv, messageContent, bottomPaddingHeight, index) }, Math.floor(Math.random() * 90))
        bottomPaddingDiv.style.height = (bottomPaddingHeight + 22) - loadingMessageContentDiv.clientHeight + 'px'
    } else {
        loadingMessageContentDiv.innerHTML = messageContent.slice(0, index) + '<span class="blinking-cursor">|</span>'
        setTimeout(() => { loadingMessageContentDiv.querySelector('.blinking-cursor').remove() }, 9000)
        loadingMessageContentDiv.style.width = null
        loadingMessageContentDiv.parentElement.style.overflowX = null
        bottomPaddingDiv.style.height = null
    }
}

function getFormattedDate(timestamp = Date.now() / 1000) {
    const date = new Date(timestamp * 1000)

    const formattedDate = date.toLocaleString('en-US', {
        weekday: 'short',
        day: 'numeric',
        month: 'short',
        hour: 'numeric',
        minute: '2-digit',
        second: '2-digit',
        hour12: false
    })

    const dateWithoutCommas = formattedDate.split(',').join('')
    let dateArray = dateWithoutCommas.split(' ')
    let mounth = dateArray[1]
    dateArray[1] = dateArray[2]
    dateArray[2] = mounth
    dateArray[3] = '| ' + dateArray[3]

    return dateArray.join(' ')
}

function uuidv4() {
    return "10000000-1000-4000-8000-100000000000".replace(/[018]/g, c =>
        (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
    )
}

function resize(messageInput) {
    messageInput.style.height = 'auto'
    messageInput.style.height = messageInput.scrollHeight + 'px'
}