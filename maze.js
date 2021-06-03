const delay = timeout => new Promise(resolve => setTimeout(resolve, timeout));

async function oldosBrogerAlgorithm (eaters) {
    startDiagnostics();

    while (!isMazeDone()) {
        for (const eater of eaters) {
            moveEaterOldosBroger(eater);
        }
        if (withAnimation) {
            drawMaze();
            for (const eater of eaters) {
                drawEater(eater);
            }
            await delay(delayTimeout);

        }
    }
    drawMaze();
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
 
const drawMaze =  () => {
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

const moveEaterOldosBroger = eater => {
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
    return matrixStr;
}

const isMazeDone = () => {
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

const resetWatch = () => {
	watch.classList.remove('paused');
	clearInterval(timer);
	milliseconds = 0;
	watch.innerHTML = '00:00:00:00';
};

async function binaryTreeMove() {
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
                    drawMaze();
                    await delay(delayTimeout);
                }
                
            }            
        }
    }
    if (isMazeDone()) {
        drawMaze();
    }  else {
        console.log("error");
    } 
}

const binaryTreeAlgorithm = () => {
    startDiagnostics();
    binaryTreeMove();
}

async function sideWinderMove() {
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
                    drawMaze();
                    await delay(delayTimeout);
                }    
            }   
        }            
    }
    if (isMazeDone()) {
        drawMaze();
    }  else {
        console.log("error");
    } 
}

const sideWinderAlgorithm = () => {
    startDiagnostics();
    sideWinderMove();
}

const creationChoice = wayToCreate => {
    switch (wayToCreate) {
        case "1": {
            const eatersAmount = prompt("Введите кол-во пожирателей");
            let eaters = [];
            for (let i = 0; i < eatersAmount; i++) {
                eaters.push({
                    x: 0,
                    y: 0,
                })
            }
            oldosBrogerAlgorithm(eaters);
            break;
        }
        case "2": {
            // let wayToMove = prompt("Введите то, каким способом вы хотели бы двигаться \n1 - северо-запад, \n2 - северо-восток, \n3 - юго-запад, \n4 - юго - восток");
            binaryTreeAlgorithm();
            break;
        }
        case "3": {
            sideWinderAlgorithm();
            break;
        
        }
        default:
            alert("Был введён неверный способ генерации");
            break;
    }
}
 
const cellSize = 10;
const canvasPadding = 5;
const wallColor = '#000';
const freeCellsColor = '#fff';
const backgroundColor = '#333';
let wayToCreate = prompt("Каким способом вы хотите сгенерировать лабиринт\n 1 - методом Олдоса-Брогера\n 2 - методом Бинарного дерева\n 3 - методом Сайдвиндер");
const columns = prompt("Введите кол-во колонок");
const rows = prompt("Введите кол-во строк");
const eaterColor = "#FF5733"
const delayTimeout = 0;
let counter = 0;
let withAnimation = prompt("Вы хотите создание алгоритма с анимацией или без?");
withAnimation === "1" ? withAnimation = true : withAnimation = false;
// if (withAnimation) {
//     document.getElementsByClassName('item').classList.remove('invicible'); }

const canvas = document.querySelector('canvas');
const context = canvas.getContext('2d');

const matrix = createMatrix(columns, rows);


matrix[0][0] = 1;

creationChoice(wayToCreate)



