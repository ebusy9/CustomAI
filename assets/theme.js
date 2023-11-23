const themeOneBtn = document.querySelector('#theme-one')
const themeTwoBtn = document.querySelector('#theme-two')
const themeThreeBtn = document.querySelector('#theme-three')
const themeFourBtn = document.querySelector('#theme-four')
const rootElement = document.querySelector(':root')
const themeOne = {
    backgroundColor: 'rgb(4, 13, 18)',
    mainColor: 'rgb(24, 61, 61)',
    secondaryColor: 'rgb(92, 131, 116)',
    fontColor: 'rgb(225, 225, 250)',
    fontColorTransparent: 'rgb(225, 225, 250, .5)'
}
const themeTwo = {
    backgroundColor: 'rgb(27, 38, 44)',
    mainColor: 'rgb(15, 76, 117)',
    secondaryColor: 'rgb(50, 130, 184)',
    fontColor: 'rgb(225, 225, 250)',
    fontColorTransparent: 'rgb(225, 225, 250, .5)'
}
const themeThree = {
    backgroundColor: 'rgb(253, 232, 233)',
    mainColor: 'rgb(84, 101, 255)',
    secondaryColor: 'rgb(120, 139, 255)',
    fontColor: 'rgb(39, 39, 39)',
    fontColorTransparent: 'rgb(39, 39, 39, .5)'
}
const themeFour = {
    backgroundColor: 'rgb(233, 232, 253)',
    mainColor: 'rgb(133, 189, 191)',
    secondaryColor: 'rgb(194, 252, 247)',
    fontColor: 'rgb(4, 15, 15)',
    fontColorTransparent: 'rgb(4, 15, 15, .5)'
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
    localStorage.setItem('theme', JSON.stringify(theme))
}

document.addEventListener("DOMContentLoaded", () => {
    let theme = localStorage.getItem('theme')

    if (theme !== '') {
        setTheme(JSON.parse(theme))
    }
})