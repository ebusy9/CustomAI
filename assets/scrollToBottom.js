const scrollToBottomBtn = document.querySelector('#scroll-to-bottom')
const messagesElement = document.querySelector('#messages')

messagesElement.addEventListener('scroll', displayScrollToBottomBtn)

function displayScrollToBottomBtn(){
    if(messagesElement.scrollTop < messagesElement.scrollHeight - Math.floor(messagesElement.clientHeight * 1.5)) {
        scrollToBottomBtn.style.display = 'flex'
    } else {
        scrollToBottomBtn.style.display = null
    }
}

scrollToBottomBtn.addEventListener('click', () => {
    messagesElement.scrollTo({ top: messagesElement.scrollHeight, behavior: 'smooth' })
})