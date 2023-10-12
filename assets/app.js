/*
 * Welcome to your app's main JavaScript file!
 *
 * This file will be included onto the page via the importmap() Twig function,
 * which should already be in your base.html.twig.
 */


const submitBtn = document.querySelector('#sub-btn')
const token = document.querySelector('#token')
const chatInput = document.querySelector('#content')
const messagesDiv = document.querySelector('#messages')
const form = document.querySelector('#message-form')


submitBtn.addEventListener('click', (event) => {
    event.preventDefault()
    let formData = new FormData(form)
    fetch("api/gpt", {
        method: "POST",
        body: formData
    })
        .then((response) => {
            console.log(response.json())
        })
        .then((data) => {
            console.log(data)
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
    });
})

