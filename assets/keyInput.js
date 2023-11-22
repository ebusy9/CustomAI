const invalidIndicatorEl = document.querySelector('#key-status-invalid')
const validIndicatorEl = document.querySelector('#key-status-valid')
const loadingIndicatorEl = document.querySelector('#key-status-loading')
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
    }
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

        console.log(true)
        const responseData = await response.json()

        if (responseData.keyStatus === 'valid')
        {
            hideAllIndicators()
            showIndicator(validIndicatorEl)
        } else {
            hideAllIndicators()
            showIndicator(invalidIndicatorEl)
        }

    } catch (error) {
        hideAllIndicators()
        console.log('Error during key verification:', error)
    }
}

function showIndicator(indicatorEl) {
    switch (indicatorEl) {
        case invalidIndicatorEl:
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
}