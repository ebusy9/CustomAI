const submitBtn = document.querySelector('#sub-btn')
const token = document.querySelector('#token')
const chatInput = document.querySelector('#content')
const messagesDiv = document.querySelector('#messages')
const form = document.querySelector('#message-form')
const textarea = document.querySelector('#content')

getAllMessagesOnPageLoad()

textarea.setAttribute('rows', 1)

resize(textarea)


textarea.addEventListener('keypress', function (e) {

    if (e.key === 'Enter' && !e.shiftKey) {
        submitFormUpdateMessages(e)
    }
})

submitBtn.addEventListener('click', (e) => {
    submitFormUpdateMessages(e)
})

textarea.addEventListener('input', () => {
    resize(textarea)
})

async function submitFormUpdateMessages(event) {
    event.preventDefault()
    const formData = new FormData(form)
    const sentMessageContent = formData.get('message[content]')
    if (sentMessageContent.replace(/[\r\n]/gm, '').length === 0) {
        return
    }
    messagesLoading(sentMessageContent)
    fetch('api/gpt', {
        method: 'POST',
        body: formData
    })
        .then((response) => {
            response.json()
                .then((response) => {
                    messagesLoaded(response)
                })
        })
}

async function getAllMessagesOnPageLoad() {
    const response = await fetch('api/gpt', {
        method: 'POST'
    })
    .then((response) => {
        response.json()
        .then((response) => {
            insertMessagesAndConfigureForm(response)
        })
    })
}

function insertMessagesAndConfigureForm(response) {
    token.value = response.token
    response.messages.forEach(message => {
        messagesDiv.innerHTML +=
            `<div id="${message['role']}-container">
                <div id="${message['role']}">
                    <div id="message">${message['content']}</div>
                </div>
                <div id="date">${message['createdAt']}</div>
            </div>`
    })
    messagesDiv.innerHTML += `<div id="bottom-padding"></div>`
    messagesDiv.scrollTo({ top: messagesDiv.scrollHeight })
}

function resize(textarea) {
    textarea.style.height = 'auto'
    textarea.style.height = textarea.scrollHeight + 'px'
}

function messagesLoading(messageSentContent) {
    messagesDiv.removeChild(messagesDiv.lastChild)
    chatInput.value = ''
    resize(textarea)
    messagesDiv.innerHTML +=
        `<div id="user-container">
            <div id="user">
                <div id="message">${messageSentContent}</div>
            </div>
            <div id="date"><img src="assets/images/loading.gif"></div>
        </div>
        <div id="assistant-container">
            <div id="assistant">
                <div id="message"><img src="assets/images/loading.gif"></div>
            </div>
            <div id="date"><img src="assets/images/loading.gif"></div>
        </div>
        <div id="bottom-padding"></div>`
    messagesDiv.scrollTo({ top: messagesDiv.scrollHeight, behavior: 'smooth' })
}

function messagesLoaded(response) {
    token.value = response.token
    messagesDiv.innerHTML = ''
    response.messages.forEach(message => {
        messagesDiv.innerHTML +=
            `<div id="${message['role']}-container">
                <div id="${message['role']}">
                    <div id="message">${message['content']}</div>
                </div>
                <div id="date">${message['createdAt']}</div>
            </div>`
    })
    messagesDiv.innerHTML += `<div id="bottom-padding"></div>`
    messagesDiv.scrollTo({ top: messagesDiv.scrollHeight, behavior: 'smooth' })
    typeMessage()
}

function typeMessage() {
    const assistants = document.querySelectorAll('#assistant')
    const lastAssistantDiv = assistants[assistants.length - 1]
    const messageDiv =  lastAssistantDiv.querySelector('#message')
    const text = messageDiv.innerHTML
    console.log(text)
    let index = 0;
    type(text, index)

  }

  function type(text, index) {
    if (index < text.length) {
        messageDiv.innerHTML = text.slice(0, index) + '<span class="blinking-cursor">|</span>';
        index++;
        setTimeout(type, Math.random() * 150 + 50);
        } else {
          messageDiv.innerHTML = text.slice(0, index) + '<span class="blinking-cursor">|</span>';
        }
        return index
  }
