const invalidIndicatorEl = document.querySelector('#key-status-invalid')
const validIndicatorEl = document.querySelector('#key-status-valid')
const loadingIndicatorEl = document.querySelector('#key-status-loading')
const errorIndicatorEl = document.querySelector('#key-status-error')
const keyInputEl = document.querySelector('#key-input')
const keyInputContainer = document.querySelector('.key-input-container')

let verificationTimeout = null

keyInputEl.addEventListener('input', () => {
    const inputValue = keyInputEl.value

    if (inputValue.trim() !== '') {
        hideAllIndicators()
        showIndicator(loadingIndicatorEl)

        if (verificationTimeout !== null) {
            clearTimeout(verificationTimeout)
        }

        verificationTimeout = setTimeout(() => {
            verifyKey(inputValue)
        }, 500)
    } else {
        hideAllIndicators()
    }

    localStorage.setItem('key', keyInputEl.value)
})

let controller = null

async function verifyKey(key) {
    if (controller !== null) {
        controller.abort()
    }

    controller = new AbortController

    try {
        const response = await fetch('/key_verification', {
            signal: controller.signal,
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                key: key
            })
        })

        const responseData = await response.json()

        if (responseData.keyStatus === 'valid') {
            hideAllIndicators()
            showIndicator(validIndicatorEl)
            localStorage.setItem('isKeyValid', 1)
        } else {
            hideAllIndicators()
            showIndicator(invalidIndicatorEl)
            localStorage.setItem('isKeyValid', 0)
        }

    } catch (error) {
        if (error.name !== 'AbortError') {
            hideAllIndicators()
            showIndicator(errorIndicatorEl)
            console.log('Error during key verification:', error)
        }
    }
}

function showIndicator(indicatorEl) {
    switch (indicatorEl) {
        case invalidIndicatorEl:
            keyInputContainer.classList = ('key-input-container invalid-key')
            break;
        case errorIndicatorEl:
            keyInputContainer.classList = ('key-input-container invalid-key')
            break;
        case validIndicatorEl:
            keyInputContainer.classList = ('key-input-container valid-key')
            break;
        default:
            keyInputContainer.classList = ('key-input-container')
            break;
    }
    indicatorEl.style.display = 'block'
}

function hideAllIndicators() {
    keyInputContainer.classList = ('key-input-container')
    invalidIndicatorEl.style.display = null
    validIndicatorEl.style.display = null
    loadingIndicatorEl.style.display = null
    errorIndicatorEl.style.display = null
}

document.addEventListener("DOMContentLoaded", () => {
    keyInputEl.value = localStorage.getItem('key')

    if(keyInputEl.value !== ''){
      verifyKey(localStorage.getItem('key'))
    }
})