let boardSize = 9;
let zoomScale = 0.7;

function createBoard(size) {
    const board = document.getElementById("sudokuBoard");
    board.innerHTML = "";
    for (let i = 0; i < size; i++) {
        const row = document.createElement("div");
        row.className = "row";
        for (let j = 0; j < size; j++) {
            const cell = document.createElement("div");
            cell.className = "cell";
            const input = document.createElement("input");
            input.type = "number";
            input.min = 1;
            input.max = size;
            cell.appendChild(input);
            row.appendChild(cell);
        }
        board.appendChild(row);
    }
}

function generateBoard() {
    boardSize = parseInt(document.getElementById("boardSize").value);
    if (boardSize < 4 || boardSize > 16 || isNaN(boardSize)) {
        alert("Please enter a valid board size between 4 and 16.");
        return;
    }
    createBoard(boardSize);
}

function getBoardValues() {
    const inputs = document.querySelectorAll(".cell input");
    return Array.from(inputs).map(input => (input.value ? parseInt(input.value, 10) : 0));
}

function setBoardValues(values) {
    const inputs = document.querySelectorAll(".cell input");
    inputs.forEach((input, index) => {
        input.value = values[index] === 0 ? "" : values[index];
    });
}

function isValid(board, row, col, num, size) {
    for (let x = 0; x < size; x++) {
        if (board[row * size + x] === num || board[x * size + col] === num) return false;
    }

    const boxSize = Math.sqrt(size);
    const boxRowStart = row - (row % boxSize);
    const boxColStart = col - (col % boxSize);

    for (let i = 0; i < boxSize; i++) {
        for (let j = 0; j < boxSize; j++) {
            if (board[(boxRowStart + i) * size + (boxColStart + j)] === num) return false;
        }
    }
    return true;
}

function solve(board, size) {
    for (let i = 0; i < board.length; i++) {
        if (board[i] === 0) {
            const row = Math.floor(i / size);
            const col = i % size;
            for (let num = 1; num <= size; num++) {
                if (isValid(board, row, col, num, size)) {
                    board[i] = num;
                    if (solve(board, size)) return true;
                    board[i] = 0;
                }
            }
            return false;
        }
    }
    return true;
}

function solveSudoku() {
    const inputs = document.querySelectorAll(".cell input");
    const board = [];
    const size = boardSize;

    // Populate board array with user input
    inputs.forEach(input => {
        const value = parseInt(input.value, 10);
        board.push(isNaN(value) ? 0 : value);
    });

    // Solve the board
    if (solve(board, size)) {
        // Update the UI with the solution
        inputs.forEach((input, index) => {
            input.value = board[index] === 0 ? "" : board[index];
        });
        alert("Sudoku Solved!");
    } else {
        alert("No solution exists for the given board.");

    }
}

function resetBoard() {
    createBoard(boardSize);
}
function provideHint() {
    const board = getBoardValues();
    const size = boardSize;

    for (let i = 0; i < board.length; i++) {
        if (board[i] === 0) {
            const row = Math.floor(i / size);
            const col = i % size;

            for (let num = 1; num <= size; num++) {
                if (isValid(board, row, col, num, size)) {
                    const inputs = document.querySelectorAll(".cell input");
                    inputs[i].value = num;
                    inputs[i].classList.add("highlight-animation");
                    setTimeout(() => inputs[i].classList.remove("highlight-animation"), 1000);
                    return;
                }
            }
        }
    }
}

function validateBoard() {
    const board = getBoardValues();
    const size = boardSize;
    for (let i = 0; i < board.length; i++) {
        const row = Math.floor(i / size);
        const col = i % size;
        const num = board[i];

        if (num !== 0 && !isValid(board, row, col, num, size)) {
            alert("Board is invalid.");
            return;
        }
    }
    alert("Board is valid!");
}

function saveBoard() {
    const board = getBoardValues();
    localStorage.setItem("savedBoard", JSON.stringify(board));
    alert("Board saved!");
}

function loadBoard() {
    const savedBoard = localStorage.getItem("savedBoard");
    if (!savedBoard) {
        alert("No saved board found.");
        return;
    }

    const board = JSON.parse(savedBoard);
    setBoardValues(board);
    alert("Board loaded!");
}

function zoomIn() {
    zoomScale += 0.1;
    document.querySelector('.contentt').style.transform = `scale(${zoomScale})`;
}

function zoomOut() {
    zoomScale = Math.max(zoomScale - 0.1, 0.5);
    document.querySelector('.contentt').style.transform = `scale(${zoomScale})`;
}

generateBoard();
