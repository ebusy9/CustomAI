const submitBtn = document.querySelector('#sub-btn')
const token = document.querySelector('#token')
const chatInput = document.querySelector('#content')
const messagesDiv = document.querySelector('#messages')
const form = document.querySelector('#message-form')
const textarea = document.querySelector('.autosize');


submitBtn.addEventListener('click', (event) => {
    event.preventDefault()
    let formData = new FormData(form)
    chatInput.value = ''
    fetch("api/gpt", {
        method: "POST",
        body: formData
    })
        .then((response) => {
            response.json().then((response) => {
                token.value = response.token
                messagesDiv.innerHTML = ''
                response.messages.forEach(message => {
                    messagesDiv.innerHTML +=
                        `<div id="${message['role']}">
                    <div id="date">${message['createdAt']}</div>
                    <div id="message">${message['content']}</div>
                    </div>`
                })
                messagesDiv.innerHTML += `<div id="bottom-padding"></div>`
                messagesDiv.scrollTo({top: messagesDiv.scrollHeight})
            })
        })
})

async function getInitialChatContent(url = "api/gpt") {
    const response = await fetch(url, {
        method: "POST"
    })
    return response.json()
}

getInitialChatContent().then((data) => {
    token.value = data.token
    data.messages.forEach(message => {
        messagesDiv.innerHTML +=
            `<div id="${message['role']}">
        <div id="date">${message['createdAt']}</div>
        <div id="message">${message['content']}</div>
        </div>`
    })
    messagesDiv.innerHTML += `<div id="bottom-padding"></div>`
    messagesDiv.scrollTo({top: messagesDiv.scrollHeight})
})


textarea.setAttribute('rows', 1);

resize(textarea);

textarea.addEventListener('input', function () {
    resize(this);
});

function resize(textarea) {
    textarea.style.height = 'auto';
    textarea.style.height = textarea.scrollHeight + 'px';
}
