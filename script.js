var GAME = {
    width: 1280,
    height: 703,
    fps: 1000 / 80,
    canvasContext: null,
    background: new Image(),
    screenSaver: true,
    image: new Image(),
    imgWidth: 280,
    imgHeight: 190,
    won: false,
}

var APPLE = {
    x: getRandomInteger(), 
    y: 0,
    width: 45, 
    height: 50,
    background: new Image(),
    yDirection: 7,
}

var PLAYER = {
    x: GAME.width/2,
    y: 600,
    width: 120,
    height: 70,
    color: "green",
    yDirection: 0,
    speed: 40,
    background: new Image(),
}

var score = 0;
var missed = 0;
var record = 0;
var level = 1;

var COPY = {
    score: 0,
    missed: 0,
}

function init() {
    GAME.image.src = "img/appleBasket.png";
    GAME.background.src = "img/background.png";
    APPLE.background.src = "img/apple.png";
    PLAYER.background.src = "img/basket.png";

    var canvas = document.getElementById("canvas");
    _initCanvas(canvas);
    _initEventsListeners(canvas);

    GAME.image.onload = () => {};
    PLAYER.background.onload = () => {};
    APPLE.background.onload = () => {};
    GAME.background.onload = () => {
        setInterval(play, GAME.fps); 
    }    
}

function play() {
    if (GAME.won) 
        drawWon();
    else 
        if (GAME.screenSaver) 
        drawScreenSaver();
        else {
            draw();
            update();
        }
}

function drawScreenSaver() {
    //отрисовываем задний фон
    GAME.canvasContext.clearRect(0, 0, GAME.width, GAME.height);
    GAME.canvasContext.drawImage(GAME.background, 0, 0, GAME.width, GAME.height); 
    GAME.canvasContext.drawImage(GAME.image, 450, 400, GAME.imgWidth, GAME.imgHeight); 
    //отрисовываем текст
    GAME.canvasContext.fillStyle = "#FFE4B5";
    GAME.canvasContext.font = "80px serif";
    GAME.canvasContext.shadowColor = "black";
    GAME.canvasContext.shadowOffsetY = 5;
    GAME.canvasContext.shadowBlur = 6;
    GAME.canvasContext.font = "80px serif";
    GAME.canvasContext.fillText('CATCH FALLING APPLES' , 200, 200);
    GAME.canvasContext.font = "40px serif";
    GAME.canvasContext.fillText('FOR MENTAL HEALTH' , 450, 300);
    GAME.canvasContext.font = "30px serif";
    GAME.canvasContext.fillText('CLICK TO START..', 490, 630);
    addEventListener("mousedown", () => {
        GAME.screenSaver = false;
        GAME.won = false;
    })
}

function drawWon() {
    //отрисовываем задний фон
    GAME.canvasContext.clearRect(0, 0, GAME.width, GAME.height);
    GAME.canvasContext.drawImage(GAME.background, 0, 0, GAME.width, GAME.height); 
    GAME.canvasContext.drawImage(GAME.image, 450, 400, GAME.imgWidth, GAME.imgHeight); 
    //отрисовываем текст
    // GAME.canvasContext.fillStyle = "#FFE4B5";
    GAME.canvasContext.font = "80px serif";
    GAME.canvasContext.fillText('YOU DID IT!', 400, 200);
    GAME.canvasContext.font = "40px serif";
    GAME.canvasContext.fillText('YOU CAUGHT 40 APPLES!', 400, 250);
    GAME.canvasContext.fillText('AND NOW YOU CAN LIVE YOU LIFE PEACEFULLY!', 200, 300);
    GAME.canvasContext.font = "30px serif";
    GAME.canvasContext.fillText('CLICK TO TRY AGAIN..', 450, 630);
    GAME.canvasContext.fillText('Missed: ' + COPY.missed, 1100, 50);
    addEventListener("mousedown", () => {
        GAME.won = false;
    })

}

function draw() {
    //Рисуем фон
    GAME.canvasContext.clearRect(0, 0, GAME.width, GAME.height);
    GAME.canvasContext.drawImage(GAME.background, 0, 0, GAME.width, GAME.height);  
    //отрисовываем счёт
    GAME.canvasContext.font = "38px serif";
    GAME.canvasContext.fillText('Score: ' + score, 100, 50);
    GAME.canvasContext.fillText('Miss: ' + missed, 300, 50);
    GAME.canvasContext.fillText('Level: ' + level, 600, 50);
    GAME.canvasContext.fillText('Record: ' + record, 1000, 50);

    //Рисуем корзинку
    GAME.canvasContext.drawImage(PLAYER.background, PLAYER.x, PLAYER.y, PLAYER.width, PLAYER.height);

    //Отрисуем яблоко
    GAME.canvasContext.drawImage(APPLE.background, APPLE.x, APPLE.y, APPLE.width, APPLE.height);
    GAME.canvasContext.drawImage(APPLE.background, GAME.width - 50, 0, APPLE.width, APPLE.height);
}

function update() {
    //проверяем на столкновение яблока с корзинкой
    var playerCollision = _ballHasCollisionWithPlayer(APPLE, PLAYER);
    if (playerCollision) {
        APPLE.x = getRandomInteger();
        APPLE.y = 0;
        score += 1;
        if (score > record) 
            record = score;
    }
    //проверяем на столькновение яблока с нижней стенкой
    if (APPLE.y + APPLE.height > GAME.height) {
        missed += 1;
        APPLE.x = getRandomInteger();
        APPLE.y = 0;
    }

    //провышаем уровень
    if (score == 5) {
        APPLE.yDirection = 8;
        level = 2;
    } 
    if (score == 10) {
        APPLE.yDirection = 9;
        level = 3;
    }
    if (score == 15) {
        APPLE.yDirection = 10;
        level = 4;
    }
    if (score == 20) {
        APPLE.yDirection = 11;
        level = 5;       
    }
    if (missed == 6) {
        GAME.screenSaver = true;
        if (score > record) 
            record = score;
        APPLE.yDirection = 7;
        missed = 0;
        score = 0;
        level = 1;
    } 

    if (score == 40) {
        GAME.won = true;
        GAME.screenSaver = true;
        COPY.score = score;
        COPY.missed = missed;
        score = 0;
        missed = 0;
        level = 1;
        APPLE.yDirection = 7;
    }
    APPLE.y += APPLE.yDirection;
}

function _ballHasCollisionWithPlayer(apple, player) {
    var xCollision = (apple.x + apple.width > player.x) && (apple.x < player.x + player.width);
    var yCollision = (apple.y + apple.height < player.height + player.y) && (apple.y >= player.y)
    return xCollision && yCollision;
}

function _initCanvas(canvas) {
    canvas.width = GAME.width;
    canvas.height = GAME.height;
    GAME.canvasContext = canvas.getContext("2d");
}

function _initEventsListeners(canvas) {
    canvas.addEventListener("mousemove", _onCanvasMouseMove);
}

function _onCanvasMouseMove(event) {
    PLAYER.x = event.offsetX - PLAYER.width / 2;
}

function getRandomInteger() {
    return Math.floor(Math.random() * (GAME.width - 50));
}