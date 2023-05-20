let gpIdx
let questionCounter = 1
let roundCounter = 0
const QUESTIONS_IN_ROUND = 5
const ROUNDS_IN_LEVEL = 3
let level = 0
let score = 0
const registeredButtonPresses = new Set()
let currentQuestion
let started = false

window.addEventListener('gamepadconnected', (e) => {
    if (!started) {
        console.log(
            'Gamepad connected at index %d: %s. %d buttons, %d axes.',
            e.gamepad.index,
            e.gamepad.id,
            e.gamepad.buttons.length,
            e.gamepad.axes.length
        );
        document.getElementById('start').style.display = 'none'
        gpIdx = e.gamepad.index
        start()
    }
})

class Question {
    constructor(question, answer) {
        this.question = question
        this.answer = answer
    }
}

function randInt(max = 9) {
    return Number((Math.random() * max).toFixed(0))
}
Array.prototype.random = function() { return this.at(randInt(this.length)) }

function level0() {
    const question = randInt()
    return new Question(question, question)
}

function level1() {
    const question = randInt(99)
    return new Question(question, question)
}

class Operator {
    constructor(symbol, invoke) {
        this.symbol = symbol
        this.invoke = invoke
    }
}

const OPERATORS = [
    new Operator('+', (a, b) => a + b),
    new Operator('-', (a, b) => a - b),
    new Operator('÷', (a, b) => a * b),
    new Operator('×', (a, b) => a / b)
]

function level2() {
    const int1 = randInt()
    const int2 = randInt()
    const operator = OPERATORS.slice(0, 2).random()
    const question = `${int1} ${operator.operator} ${int2}`
    const answer = operator.invoke(int1, int2)
    return new Question(question, answer)
}

function level3() {
    const int1 = randInt()
    const int2 = randInt()
    const operator = OPERATORS.random()
    const question = `${int1} ${operator.operator} ${int2}`
    const answer = operator.invoke(int1, int2)
    return new Question(question, answer)
}

function level4() {
    const int1 = randInt(99)
    const int2 = randInt(99)
    const operator = OPERATORS.slice(0, 2).random()
    const question = `${int1} ${operator.operator} ${int2}`
    const answer = operator.invoke(int1, int2)
    return new Question(question, answer)
}

function level5() {
    const int1 = randInt(99)
    const int2 = randInt(99)
    const operator = OPERATORS.random()
    const question = `${int1} ${operator.operator} ${int2}`
    const answer = operator.invoke(int1, int2)
    return new Question(question, answer)
}

function generateQuestion() {
    switch (level) {
        case 0:
            return level0()
        case 1:
            return level1()
        case 2:
            return level2()
        case 3:
            return level3()
        case 4:
            return level4()
        case 5:
            return level5()
    }
}

function setQuestion() {
    currentQuestion = generateQuestion()
    const elt = document.getElementById('scroll')
    elt.style.left = `${(10 + (Math.random() * 80)).toFixed(0)}%`
    elt.style.top = 'inherit'
    elt.textContent = currentQuestion.question
    document.getElementById('input').textContent = ''
    document.getElementById('score').textContent = score
}

function questionCorrect() {
    score += (level + 1)
    nextQuestion()
}

function questionWrong() {
    nextQuestion()
}

function nextQuestion() {
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
    setQuestion()
}

function intersectsWithBottom() {
    const scrollElt = document.getElementById('scroll')
    const bottomElt = document.getElementById('bottom')
    return scrollElt.getBoundingClientRect().bottom >= bottomElt.getBoundingClientRect().top
}

function start() {
    started = true
    setQuestion()
    const elt = document.getElementById('scroll')

    window.setInterval(() => {
        if (intersectsWithBottom()) {
            questionWrong()
        } else {
            elt.style.top = `${elt.offsetTop + 1}px`
            handleButtonPresses()
            let validateResult = validateAnswer()
            if (validateResult !== null) {
                if (validateResult) {
                    console.log(`answer correct`)
                    questionCorrect()
                } else {
                    console.log(`answer wrong, got ${document.getElementById('input').textContent}, expected ${currentQuestion.answer}`)
                    questionWrong()
                }
            }
        }
    }, 10)
}

function validateAnswer() {
    const expectedAnswer = currentQuestion.answer.toString()
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
            const buttonId = `${gpIdx}_${i}`
            if (pad.buttons[i].pressed) {
                if (!registeredButtonPresses.has(buttonId)) {
                    registeredButtonPresses.add(buttonId)
                    const buttonValue = PAD_0_BUTTON_MAPPINGS[i]
                    console.log(`button ${buttonValue} pressed`)
                    const inp = document.getElementById('input')
                    inp.textContent = inp.textContent + buttonValue
                }
            } else if (registeredButtonPresses.has(buttonId)) {
                registeredButtonPresses.delete(buttonId)
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
    TIMES: '×',
    DIVIDE: '÷',
    EQUALS: '='
}
const PAD_0_BUTTON_MAPPINGS = {
    8: BUTTONS.CLOSE_BRACKET,
    9: BUTTONS.DISCO,
    6: BUTTONS.FOUR,
    0: BUTTONS.FIVE,
    7: BUTTONS.SIX,
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
