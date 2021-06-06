const delay = timeout => new Promise(resolve => setTimeout(resolve, timeout));

async function aldousBroderAlgorithm (eaters) {
    startDiagnostics();
    let matrix = createMatrix(columns, rows);
    matrix[0][0] = 1;
    while (!isMazeDone(matrix)) {
        for (const eater of eaters) {
            moveEaterAldousBroder(matrix, eater);
        }
        if (withAnimation) {
            drawMaze(matrix);
            for (const eater of eaters) {
                drawEater(eater);
            }
            await delay(delayTimeout);
        }
    }
    drawMaze(matrix);
}

const createMatrix = (columns, rows) => {
    const matrix = [];

    for (let y = 0; y < rows; y++) {
        const row = [];
        for (let x = 0; x < columns; x++) {
            row.push(0);
        }
        matrix.push(row);
    }

    return matrix;
}

const createProccessedMatrixObject = (columns, rows) => {
    let matrix = [];
    for (let y = 0; y < rows; y++) {
        const row = [];
        for (let x = 0; x < columns; x++) {
            row.push({
                m: 0,
                p: 0,
                direction: "",
                passed: 0,
                paint: 0,
            });
        }
        matrix.push(row);
    }
    return matrix;
}

const drawMaze = matrix => {
    canvas.width = canvasPadding * 2 + columns * cellSize;
    canvas.height = canvasPadding * 2 + rows * cellSize;

    context.beginPath();
    context.rect(0, 0, canvas.width, canvas.height);
    context.fillStyle = backgroundColor;
    context.fill(); 
    for (let y = 0; y < rows; y++) {
        for (let x = 0; x  < columns; x++) {
            const color = matrix[y][x] ? freeCellsColor : wallColor;

            context.beginPath();
            context.rect(canvasPadding + x * cellSize, canvasPadding + y * cellSize, cellSize, cellSize);
            context.fillStyle = color;
            context.fill();
        }
    } 
}

const drawEater = eater => {
    context.beginPath();
    context.rect(canvasPadding + eater.x * cellSize, canvasPadding + eater.y * cellSize, cellSize, cellSize);
    context.fillStyle = eaterColor;
    context.fill();
}

const moveEaterAldousBroder = (matrix, eater) => {
    let directions = [];

    if (eater.x > 0) {
        directions.push([-2, 0]);
    }

    if (eater.x < columns - 1) {
        directions.push([2, 0]);
    }

    if (eater.y > 0) {
        directions.push([0, -2]);
    }

    if (eater.y < rows - 1) {
        directions.push([0, 2]);
    }

    const [dx, dy] = getRandomItem(directions);

    eater.x += dx;
    eater.y += dy;

    if (!matrix[eater.y][eater.x]) {
        matrix[eater.y][eater.x] = 1;  
        matrix[eater.y - dy / 2][eater.x - dx / 2] = 1;  
        counter++;
    }
}

const getRandomItem = array => array[Math.floor(Math.random() * array.length)];

const download = (content, fileName, contentType) => {
    let a = document.createElement("a");
    let file = new Blob([content], {type: contentType});
    a.href = URL.createObjectURL(file);
    a.download = fileName;
    a.click();
}

const genMatrixStr = (matrix) => {
    let matrixStr = "";
    for (let y = 0; y < rows; y++) {
        for (let x = 0; x < columns; x++) {
            matrixStr += matrix[y][x];
        }
    }
    matrixStr += `\n${columns}`;
    matrixStr += `\n${rows}`;
    return matrixStr;
}

const isMazeDone = matrix => {
    for (let y = 0; y < rows; y += 2) {
        for (let x = 0; x < columns; x += 2) {
            if (!matrix[y][x]) {
                return false;
            }
        }
    }
    let matrixStr = genMatrixStr(matrix);
    // download(matrixStr, `matrix${columns}x${rows}.txt`, 'text/plain');
    matrixCode.innerHTML = matrixStr;
    pauseDiagnostics();
    return true;
}

const watch = document.querySelector('#watch');
let milliseconds = 0;
let timer;


const startDiagnostics = () => {
	watch.classList.remove('paused');
	clearInterval(timer);
	timer = setInterval(()=>{
		milliseconds += 10;
		let dateTimer = new Date(milliseconds);
		watch.innerHTML =
			('0' + dateTimer.getUTCHours()) + ':' +
			('0' + dateTimer.getUTCMinutes()).slice(-2) + ':' +
			('0' + dateTimer.getUTCSeconds()).slice(-2) + ':' +
			('0' + dateTimer.getUTCMilliseconds()).slice(-3,-1);
        operationCounter.innerHTML = counter;
	},10);
};

const pauseDiagnostics = () => {
  watch.classList.add('paused');
  clearInterval(timer);
  operationCounter.innerHTML = counter;
};

async function binaryTreeMove() {
    const matrix = createMatrix(columns, rows);
    matrix[0][0] = 1;
    for (let y = 0; y < rows; y += 2) {
        for (let x = 0; x < columns; x += 2) {
            let directions = [];

            matrix[y][x] = 1;

            if (x < columns - 1) {
                directions.push([2, 0]);
            }
        
            if (y < rows - 1) {
                directions.push([0, 2]);
            }
        
            if (directions.length !== 0) {
                let [dx, dy] = getRandomItem(directions);
               
                matrix[y + dy][x + dx] = 1; 
                matrix[(y + dy) - dy / 2][(x + dx) - dx / 2] = 1 
                counter++;
                if (withAnimation) {
                    drawMaze(matrix);
                    await delay(delayTimeout);
                }
                
            }            
        }
    }
    if (isMazeDone()) {
        drawMaze(matrix);
    }  else {
        console.log("error");
    } 
}

const binaryTreeAlgorithm = () => {
    startDiagnostics();
    binaryTreeMove();
}

async function sideWinderMove() {
    const matrix = createMatrix(columns, rows);
    matrix[0][0] = 1;
    for (let y = 0; y < rows; y += 2) {
        for (let x = 0; x < columns; x += 2) {
            matrix [y][x] = 1;
            let directions = [];
            if ((y > 0) && ((x + 1 == columns) || (Math.floor(Math.random() * 2) === 0))) {
                directions.push([0, -2]);
            } else if (x + 1 < columns) {
                directions.push([2, 0]);
            }
            if (directions.length !== 0) {
                let [dx, dy] = getRandomItem(directions);
                matrix[y + dy][x + dx] = 1; 
                matrix[(y + dy) - dy / 2][(x + dx) - dx / 2] = 1 
                counter++;
                if (withAnimation) {
                    drawMaze(matrix);
                    await delay(delayTimeout);
                }    
            }   
        }            
    }
    if (isMazeDone()) {
        drawMaze(matrix);
    }  else {
        console.log("error");
    } 
}

const drawProcessedMaze = (matrix) => {
    canvas.width = canvasPadding * 2 + columns * cellSize;
    canvas.height = canvasPadding * 2 + rows * cellSize;

    context.beginPath();
    context.rect(0, 0, canvas.width, canvas.height);
    context.fillStyle = backgroundColor;
    context.fill(); 
    for (let y = 0; y < rows; y++) {
        for (let x = 0; x  < columns; x++) {
            const color = matrix[y][x].m === 1 ? freeCellsColor : wallColor;

            context.beginPath();
            context.rect(canvasPadding + x * cellSize, canvasPadding + y * cellSize, cellSize, cellSize);
            context.fillStyle = color;
            context.fill();
        }
    } 
}

const sideWinderAlgorithm = () => {
    startDiagnostics();
    sideWinderMove();
}

const findUnprocessedByKey = (matrix, key) => {
    let counter = 0;
    let xValue = 0;
    let yValue = 0;
    for (let y = 0; y < rows; y += 2) {
        for (let x = 0; x < columns; x += 2) {
            if ((matrix[y][x].p === 0) && (counter === key)) {
                xValue = x;
                yValue = y;
                break;
            } else if (matrix[y][x].p === 0) {
                counter++;
            }
        }
    }
    return [yValue, xValue];
}

const countUnproccessedEl = matrix => {
    let counter = 0;
    for (let y = 0; y < rows; y += 2) {
        for (let x = 0; x < columns; x += 2) {
            if (matrix[y][x].p === 0) {
                counter++;
            }
        }
    }
    return counter;
} 

async function willsonAlgorithMove() {
    let randX = 0;
    let randY = 0;
    let eater = {
        x: randX,
        y: randY,
    };
    let firstCell = {
        x: 0,
        y: 0
    }
    const matrix = createProccessedMatrixObject(columns, rows);
    let numOfUnprocessedEl = countUnproccessedEl(matrix);
    while (countUnproccessedEl(matrix) > 0) {
        if (countUnproccessedEl(matrix) === numOfUnprocessedEl) {
            randKey = Math.floor(Math.random() * countUnproccessedEl(matrix));
            [randY, randX] = findUnprocessedByKey(matrix, randKey);
            matrix[randY][randX].m = 1;
            matrix[randY][randX].p = 1;
        } else {
            randKey = Math.floor(Math.random() * countUnproccessedEl(matrix));
            [randY, randX] = findUnprocessedByKey(matrix, randKey);
            firstCell.x = randX;
            firstCell.y = randY;
            eater.x = randX;
            eater.y = randY;
            while (matrix[eater.y][eater.x].p !== 1) {
                let directions = [];
                matrix[eater.y][eater.x].passed = 1;
                if (eater.x > 0) {
                    if (eater.x - 2 >= 0) {
                        if (matrix[eater.y][(eater.x - 2)].passed !== 1) {
                            directions.push([-2, 0, "left"]);
                        }
                    } else {
                        directions.push([-2, 0, "left"]);
                    }
                }
            
                if (eater.x < columns - 1) {
                    if (eater.x + 2 < rows) {
                        if (matrix[eater.y][eater.x + 2].passed !== 1) {
                            directions.push([2, 0, "right"]);
                        }
                    } else {
                        directions.push([2, 0, "right"]);
                    }
                }

                if (eater.y > 0)  {
                    if (eater.y - 2 >= 0)  {
                        if (matrix[eater.y - 2][eater.x].passed !== 1) {
                            directions.push([0, -2, "top"]);
                        }
                    } else {
                        directions.push([0, -2, "top"]);
                    }
                }
            
                if (eater.y < rows - 1) {
                    if (eater.y + 2 < rows) {
                        if (matrix[eater.y + 2][eater.x].passed !== 1) {
                            directions.push([0, 2, "bottom"]);
                        }
                    } else {
                        directions.push([0, 2, "bottom"]);
                    }
                }

                [dx, dy, direction] = getRandomItem(directions);
                matrix[eater.y][eater.x].direction = direction; 

                eater.x += dx;
                eater.y += dy;
            }
            eater.x = firstCell.x;
            eater.y = firstCell.y;
            let coords = [];
            while (matrix[eater.y][eater.x].p !== 1) {
                if (matrix[eater.y][eater.x].direction === "top") {               
                    dy = -2;
                    dx = 0;
                } else if (matrix[eater.y][eater.x].direction === "bottom") {
                    dy = 2;
                    dx = 0;
                } else if (matrix[eater.y][eater.x].direction === "left") {
                    dx = -2; 
                    dy = 0;
                } else if (matrix[eater.y][eater.x].direction === "right") {
                    dx = 2;
                    dy = 0;
                }
                if (eater.x === firstCell.x && eater.y === firstCell.y) {
                    matrix[eater.y][eater.x].direction = "";
                    matrix[eater.y][eater.x].passed = 0;
                    matrix[eater.y][eater.x].paint = 1;
                }
                eater.y += dy;
                eater.x += dx;

                matrix[eater.y][eater.x].paint = 1; 
                matrix[eater.y][eater.x].passed = 0;
                matrix[eater.y][eater.x].direction = "";
                matrix[eater.y - dy / 2][eater.x - dx / 2].paint = 1;  
                counter++;
            }
            drawPaint(matrix);
        }
        if (withAnimation) {
            drawProcessedMaze(matrix);
            await delay(delayTimeout);
        }      
    }
    drawProcessedMaze(matrix);
    pauseDiagnostics();
}

const drawPaint = matrix => {
    for (let y = 0; y < rows; y++) {
        for (let x = 0; x < columns; x++) {
            if (matrix[y][x].paint === 1) {
                matrix[y][x].p = 1;
                matrix[y][x].m = 1;
                matrix[y][x].paint = 0;
            }
        }
    }
}

const willsonAlgorithm = () => {
    startDiagnostics();
    willsonAlgorithMove();
}

const creationChoice = (wayToCreate) => {
    switch (wayToCreate) {
        case 1: {
            const eatersAmount = parseInt(prompt("Введите кол-во пожирателей"));
            checkPositiveIntHandler(eatersAmount);
            let eaters = [];
            for (let i = 0; i < eatersAmount; i++) {
                eaters.push({
                    x: 0,
                    y: 0,
                })
            }
            aldousBroderAlgorithm(eaters);
            break;
        }
        case 2: {
            binaryTreeAlgorithm();
            break;
        }
        case 3: {
            sideWinderAlgorithm();
            break;
        }
        case 4: {
            willsonAlgorithm();
            break;
        }
        default:
            alert("Был введён неверный способ генерации");
            break;
    }
}

const checkPositiveIntHandler = arg => {
    try {
        checkPositiveInt(arg);
    } catch(er) {
        arg = parseInt(prompt(er.message + "\nПовторите ввод"));
        checkPositiveIntHandler(arg);
    }
}

let checkPositiveInt = arg => {
    let isPositive = false;
    if ((typeof(arg) === "number") && (arg !== NaN) && (arg > 0)) {
        isPositive = true;
    } 
    return isPositive;
}

let checkNotEvenInt = arg => {
    let isNotEvenInt = false;
    if (arg % 2 === 0) {
        isNotEvenInt = true;
    }
    return isNotEvenInt;
}

let checkAmountOfColsAndRows = arg => {
    let isPositive = checkPositiveInt(arg);
    let isNotEvenInt = checkNotEvenInt(arg);
    while (isPositive !== true && isNotEvenInt !== true) {
        arg = prompt("Ошибка! Повторите ввод");
        isPositive = checkPositiveInt(arg);
        isNotEvenInt = checkNotEvenInt(arg);
    }
    return arg;
}

const cellSize = 10;
const canvasPadding = 5;
const wallColor = '#000';
const freeCellsColor = '#fff';
const backgroundColor = '#333';
let wayToCreate = parseInt(prompt("Каким способом вы хотите сгенерировать лабиринт\n 1 - методом Олдоса-Брогера\n 2 - методом Бинарного дерева\n 3 - методом Сайдвиндер\n 4 - методом Уилсона"));

let columns = parseInt(prompt("Введите кол-во колонок(только нечётное кол-во)"));
columns = checkAmountOfColsAndRows(columns);
let rows = parseInt(prompt(("Введите кол-во строк(только нечётное кол-во)")));
rows = checkAmountOfColsAndRows(rows);
const eaterColor = "#FF5733"
const delayTimeout = 0;
let counter = 0;
let withAnimation = parseInt(prompt("Вы хотите создание алгоритма с анимацией или без?\n1 - с анимацией, 0 - без)"));
withAnimation === 1 ? withAnimation = true : withAnimation = false;

const canvas = document.querySelector('canvas');
const context = canvas.getContext('2d');

creationChoice(wayToCreate);



