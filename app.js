// создание массива с информацией для страницы с игрой
arr=[{
    tag: "div",
    class: "screen",
    id: "",
    text: "", 
    child:
        [{
            tag: "h3",
            class: "",
            id: "",
            text: "Осталось ", child: 
                [{
                    tag: "span",
                    class: "",
                    id: "time",
                    text: "00:00"
                }]
        }, 
        {
                tag: "div",
                class: "board",
                id: "board",
                text: ""
        }]
}]

// создание поля для игры
function createBoard(arr) 
{
    let ret = ""
    arr.map((element) => 
    {
        let child = ""
        if (Array.isArray(element.child)) child = createBoard(element.child)
        ret += "<" + element.tag + " class=\"" + element.class + "\" id=\"" + element.id + "\">" + element.text + child + "</" + element.tag + ">"
    })
    return ret
}

document.write(createBoard(arr)) //добавление HTML блока в документ

// объявление объектов для работы с ними
const startBtn = document.querySelector('#start') // кнопка начала игры
const screens = document.querySelectorAll('.screen') // экраны (их 3: название игры + кнопка старта, выбор времени, сама игра)
const timeList = document.querySelector('#time-list') // список, содержащий варианты времени (в документе html они еще не содержатся, добавляются далее)
const timer = document.querySelector('#time') // счетчик времени
const board = document.querySelector('#board') // поле игры, создано выше
const colors = ['white', 'burlywood', 'pink', 'lightcoral', 'coral', 'chocolate'] // массив цветов для кругов
let time = 0 // переменная для счетчика времени
let score = 0 // переменная для счетчика счета(??)

// добавление вариантов времени
function addTimeButtons()
{
    const numberOfButtons = 3
    const time = ["10", "20", "30"]
    const text = ["10 сек", "20 сек", "30 сек"]

    for (i = 0; i < numberOfButtons; i++)
    {
        let li = document.createElement('li')
        let btn = document.createElement('button')
        btn.className = "time-btn"
        btn.innerHTML = text[i]
        btn.setAttribute("data-time", time[i])

        li.appendChild(btn)
        timeList.appendChild(li)
    }
}

startBtn.addEventListener('click', (event) => 
{
    addTimeButtons() // добавление кнопок с указанными временами
    event.preventDefault() 
    screens[0].classList.add('up') // переход со стартового экрана с названием и стартом к следующему экрану с выбором времени
})

// выбор времени
timeList.addEventListener('click', (event) => 
{
    // если нажатие произошло по кнопке с временем
    if (event.target.classList.contains('time-btn')) 
    {
        time = parseInt(event.target.getAttribute('data-time')) // задаем выбранное время
        screens[1].classList.add('up') // переход к следующему экрану с игрой
        startGame() // начало игры
    }
})

// при клике по полю игры
board.addEventListener('click', (event) => 
{
    // если клик был по кругу (если попал)
    if (event.target.classList.contains('circle'))
    {
        score++ // увеличение счета
        event.target.remove() // убираем круг, по которому попали
        createCircle() // создаем новый
    }
    else // если по кругу не попали
    {
        // если игра еще не окончена
        if (time > 0)
        {
            board.style.border = `2px solid red` // мимо - красная рамка вокруг поля
            setTimeout(() => board.style.border = '', 300) // появляется на 0,3 сек и исчезает
            if (score > 0) score-- // уменьшение счета за ошибку, если еще есть, что уменьшать
            else score = 0 // если уменьшать уже некуда, в минус не уходим
        }
    }
})

function startGame() // начало игры
{
    setInterval(decreaseTime, 1000) // уменьшение времени каждую секунду
    createCircle() // создание кружочка
    setTime(time) // отображение таймера
}

function decreaseTime() // уменьшение времени
{
    if (time === 0)
    {
        finishGame() // время вышло - закончить игру
    } else 
    {
        let currentTime = --time // уменьшение счетчика времени на 1
        if (currentTime < 10) 
        {
            currentTime = `0${currentTime}` // чтобы отображалось не 00:9, а 00:09 и так далее
        }
        setTime(currentTime) // отображение таймера
    }
}

function setTime(value) 
{
    timer.innerHTML = `00:${value}`
}

function finishGame()
{
    timer.parentNode.classList.add('hide') // убрать счетчик времени
    board.innerHTML = `<h1>Счёт: <span class="primary">${score}</span></h1>` // показать счет
}

function createCircle()
{
    const circle = document.createElement('div') // создание круга
    const size = getNumber(5, 50) // задание размера круга
    const boardSize = board.getBoundingClientRect() // размер поля
    const x = getNumber(0, boardSize.width - size) // координаты по горизонтали
    const y = getNumber(0, boardSize.height - size) // координаты по вертикали

    circle.classList.add('circle')
    circle.style.width = `${size}px` // задание ширины круга
    circle.style.height = `${size}px` // задание высоты круга
    circle.style.top = `${y}px` // задание положения круга по вертикали
    circle.style.left = `${x}px` // задание положения круга по горизонтали 
    circle.style.background = setColor() // задание цвета круга

    board.append(circle) // добавление круга на поле
}

function getNumber(min, max)
{
    // генерация случайного числа из заданного диапазона (для размера, координат)
    return Math.round(Math.random() * (max-min) + min)
}

function setColor()
{
    // выбор случайного цвета из заданного массива
    return colors[Math.floor(Math.random() * colors.length)]
}