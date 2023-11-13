const scrollToBottomBtn = document.querySelector('#scroll-to-bottom')
const messagesElement = document.querySelector('#messages')

messagesElement.addEventListener('scroll', displayScrollToBottomBtn)

function displayScrollToBottomBtn(){
    if(messagesElement.scrollTop < messagesElement.scrollHeight - messagesElement.clientHeight * 2) {
        scrollToBottomBtn.style.display = 'flex'
    } else {
        scrollToBottomBtn.style.display = null
    }
}

scrollToBottomBtn.addEventListener('click', () => {
    messagesElement.scrollTo({ top: messagesElement.scrollHeight, behavior: 'smooth' })
})