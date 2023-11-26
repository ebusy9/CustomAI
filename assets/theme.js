const themeOneBtn = document.querySelector('#theme-one')
const themeTwoBtn = document.querySelector('#theme-two')
const themeThreeBtn = document.querySelector('#theme-three')
const themeFourBtn = document.querySelector('#theme-four')
const rootElement = document.querySelector(':root')


const themeOne = {
    backgroundColor: 'rgb(20, 28, 33)',
    mainColor: 'rgb(15, 76, 117)',
    secondaryColor: 'rgb(40, 110, 158)',
    fontColor: 'rgb(225, 225, 250)',
    fontColorTransparent: 'rgb(225, 225, 250, .5)',
    redColor: 'rgb(221, 74, 72)',
    greenColor: 'rgb(182, 227, 136)',
    blueColor: 'rgb(47, 158, 224)'
}

const themeTwo = {
    backgroundColor: 'rgb(4, 13, 18)',
    mainColor: 'rgb(24, 61, 61)',
    secondaryColor: 'rgb(78, 111, 98)',
    fontColor: 'rgb(225, 225, 250)',
    fontColorTransparent: 'rgb(225, 225, 250, .5)',
    redColor: 'rgb(221, 74, 72)',
    greenColor: 'rgb(182, 227, 136)',
    blueColor: 'rgb(34, 116, 165)'
}

const themeThree = {
    backgroundColor: 'rgb(255, 251, 245)',
    mainColor: 'rgb(195, 172, 208)',
    secondaryColor: 'rgb(236 226 214)',
    fontColor: 'rgb(39, 39, 39)',
    fontColorTransparent: 'rgb(39, 39, 39, .5)',
    redColor: 'rgb(200, 58, 58)',
    greenColor: 'rgb(113, 158, 67)',
    blueColor: 'rgb(19, 125, 189)'
}

const themeFour = {
    backgroundColor: 'rgb(233, 232, 253)',
    mainColor: 'rgb(133, 189, 191)',
    secondaryColor: 'rgb(176 231 226)',
    fontColor: 'rgb(4, 15, 15)',
    fontColorTransparent: 'rgb(4, 15, 15, .5)',
    redColor: 'rgb(200, 58, 58)',
    greenColor: 'rgb(113, 158, 67)',
    blueColor: 'rgb(19, 125, 189)'
}

themeOneBtn.addEventListener('click', () => {
    setTheme(themeOne)
})

themeTwoBtn.addEventListener('click', () => {
    setTheme(themeTwo)
})

themeThreeBtn.addEventListener('click', () => {
    setTheme(themeThree)
})

themeFourBtn.addEventListener('click', () => {
    setTheme(themeFour)
})

function setTheme(theme) {
    rootElement.style.setProperty('--color-one', theme.backgroundColor)
    rootElement.style.setProperty('--color-two', theme.mainColor)
    rootElement.style.setProperty('--color-three', theme.secondaryColor)
    rootElement.style.setProperty('--color-four', theme.fontColor)
    rootElement.style.setProperty('--color-four-transparent', theme.fontColorTransparent)
    rootElement.style.setProperty('--color-red', theme.redColor)
    rootElement.style.setProperty('--color-green', theme.greenColor)
    rootElement.style.setProperty('--color-blue', theme.blueColor)
    localStorage.setItem('theme', JSON.stringify(theme))
}

document.addEventListener("DOMContentLoaded", () => {
    const theme = localStorage.getItem('theme')

    if (theme !== '') {
        setTheme(JSON.parse(theme))
    }
})