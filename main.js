let gpIdx
let questionCounter = 1
let roundCounter = 0
const QUESTIONS_IN_ROUND = 5
const ROUNDS_IN_LEVEL = 3
let level = 0

window.addEventListener("gamepadconnected", (e) => {
    console.log(
        "Gamepad connected at index %d: %s. %d buttons, %d axes.",
        e.gamepad.index,
        e.gamepad.id,
        e.gamepad.buttons.length,
        e.gamepad.axes.length
    );
    document.getElementById('start').style.display = 'none'
    gpIdx = e.gamepad.index
    start()
});

function level0() {
    let elt = document.getElementById('scroll')
    elt.style.left = `${(10+(Math.random() * 80)).toFixed(0)}%`
    const numsToGenerate = questionCounter % QUESTIONS_IN_ROUND
    let question = ''

    for (let i = 0; i < numsToGenerate; i++) {
        const randomNum = (Math.random() * 9).toFixed(0)
        question += randomNum
    }
    elt.textContent = question
    return question
}

function generateQuestion(level) {
    switch(level) {
        case 0: return level0()
        default: return ''
    }
}

function start() {
    const expectedAnswer = generateQuestion(level)
    window.setInterval(() => {
        const elt = document.getElementById('scroll')
        elt.style.top = `${elt.offsetTop + 1}px`
        handleButtonPresses()
        let validateResult = validateAnswer(expectedAnswer)
        if (validateResult === null) {

        } else {

        }
        if (validateResult) {
            if (questionCounter === QUESTIONS_IN_ROUND) {
                questionCounter = 0
                if (roundCounter === ROUNDS_IN_LEVEL) {
                    level++
                    roundCounter = 0
                } else {
                    roundCounter++
                }
            } else {
                questionCounter++
            }
        }
    }, 10)
}

function validateAnswer(expectedAnswer) {
    const input = document.getElementById('input').textContent
    if (input.length < expectedAnswer.length) {
        if (expectedAnswer.substring(0, input.length) === input) {
            return null
        } else {
            return false
        }
    } else if (input.length === expectedAnswer.length) {
        return input === expectedAnswer
    } else {
        return false
    }
}

function handleButtonPresses() {
    const pad = navigator.getGamepads()[gpIdx]
    if (pad) {
        for (let i = 0; i < 10; i++) {
            if (pad.buttons[i].pressed) {
                console.log(`button ${i} pressed`)
                const inp = document.getElementById('input')
                inp.textContent=inp.textContent + PAD_0_BUTTON_MAPPINGS[i]
            }
        }
    }
}

const BUTTONS = {
    OPEN_BRACKET: '(',
    CLOSE_BRACKET: ')',
    QUIT: 'QUIT',
    DISCO: 'DISCO',
    ZERO: '0',
    ONE: '1',
    TWO: '2',
    THREE: '3',
    FOUR: '4',
    FIVE: '5',
    SIX: '6',
    SEVEN: '7',
    EIGHT: '8',
    NINE: '9',
    DOT: '.',
    PLUS: '+',
    MINUS: '-',
    TIMES: '*',
    DIVIDE: '/',
    EQUALS: '='
}
const PAD_0_BUTTON_MAPPINGS = {
    8: BUTTONS.CLOSE_BRACKET,
    9: BUTTONS.DISCO,
    0: BUTTONS.FIVE,
    3: BUTTONS.NINE,
    2: BUTTONS.ZERO,
    4: BUTTONS.EQUALS,
    1: BUTTONS.TIMES,
    5: BUTTONS.DIVIDE
}

const PAD_1_BUTTON_MAPPINGS = {
    8: BUTTONS.QUIT,
    9: BUTTONS.OPEN_BRACKET,
    0: BUTTONS.TWO,
    3: BUTTONS.SEVEN,
    2: BUTTONS.EIGHT,
    4: BUTTONS.PLUS,
    1: BUTTONS.MINUS,
    5: BUTTONS.DOT
}
