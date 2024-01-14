const boardSize = 4;
const MAX = 1000, MIN = -1000;
let difficulty = null;
let player = null, computer = null;
let consoleEmpty = ' ';
let game3d = true;
let board = null;
let engine = 'alpha-beta-rb';
class Board3D {
    empty = '&nbsp;';
    winner = null;
    constructor(side) {
        this.side = side;
        let board = [];
        for(let i = 0; i < this.side; i++) {
            let layer = [];
            for(let j = 0; j < this.side; j++) {
                let row = []
                for(let k = 0; k < this.side; k++) {
                    row.push(this.empty);
                }
                layer.push(row);
            }
            board.push(layer);
        }
        this.board = board;
        this.depthvalues = [];
        for(let i = 0; i < this.side; i++) this.depthvalues.push(i);
        this.rowValues = [...this.depthvalues];
        this.colValues = [...this.depthvalues];
        this.depthvalues = this.depthvalues.sort(() => Math.random() - 0.5);
        this.rowValues = this.rowValues.sort(() => Math.random() - 0.5);
        this.colValues = this.colValues.sort(() => Math.random() - 0.5);
    }

    validateMove(row, col, depth) {
        if(row > this.side || col > this.side || depth > this.side) return false;
        return this.board[depth][row][col] === this.empty;
    }

    makeMove(row, col, depth, player) {
        this.board[depth][row][col] = player;
        if(game3d === true) this.showMove(row, col, depth, player);
        return player + "'s move: " + depth + " " + row + " " + col + "<br>";
    }

    showMove(row, col, depth, player) {
        let cell = document.getElementById('cell_' + depth + '_' + row + '_' + col);
        if(cell != null) {
            cell.innerHTML = player;
        }
    }

    movesRemaining() {
        for(let l = 0; l < this.side; l++) for(let r = 0; r < this.side; r++) for(let c = 0; c < this.side; c++) if(this.board[l][r][c] === this.empty) return true;
        return false;
    }

    isFinished() {
        let equal = null;
        for(let l = 0; l < this.side; l++) {
            let layer = this.board[l];
            for(let i = 0; i < this.side; i++) {
                equal = layer[i][0] != this.empty;
                if(equal) for(let j = 1; j < this.side; j++) equal &&= (layer[i][j - 1] === layer[i][j]);
                if(equal) {
                    this.winner = layer[i][0];
                    return true;
                }
            }
            for(let i = 0; i < this.side; i++) {
                equal = layer[0][i] != this.empty;
                if(equal) for(let j = 1; j < this.side; j++) equal &&= (layer[j - 1][i] === layer[j][i]);
                if(equal) {
                    this.winner = layer[0][i];
                    return true;
                }
            }
            // XY diagonals
            equal = layer[0][0] != this.empty;
            if(equal) for(let j = 1; j < this.side; j++) equal &&= (layer[j - 1][j - 1] === layer[j][j]);
            if(equal) {
                this.winner = layer[0][0];
                return true;
            }
            equal = layer[0][this.side - 1] != this.empty;
            if(equal) for(let j = 1; j < this.side; j++) equal &&= (layer[j - 1][this.side - j] === layer[j][this.side - j - 1]);
            if(equal) {
                this.winner = layer[this.side - 1][0];
                return true;
            }
        };
        for (let i = 0; i < this.side; i++) {
            for(let j = 0; j < this.side; j++) {
                equal = this.board[0][i][j] != this.empty;
                if(equal) for(let k = 1; k < this.side; k++) equal &&= (this.board[k - 1][i][j] === this.board[k][i][j]);
                if(equal) {
                    this.winner = this.board[0][i][j];
                    return true;
                }
            }
            // YZ diagonals
            equal = this.board[0][i][0] != this.empty;
            if(equal) for(let j = 1; j < this.side; j++) equal &&= (this.board[j - 1][i][j - 1] === this.board[j][i][j]);
            if(equal) {
                this.winner = this.board[0][i][0];
                return true;
            }
            equal = this.board[0][i][this.side - 1] != this.empty;
            if(equal) for(let j = 1; j < this.side; j++) equal &&= (this.board[j - 1][i][this.side - j] === this.board[j][i][this.side - j - 1]);
            if(equal) {
                this.winner = this.board[0][i][this.side - 1];
                return true;
            }

            // XZ diagonals
            equal = this.board[0][0][i] != this.empty;
            if(equal) for(let j = 1; j < this.side; j++) equal &&= (this.board[j - 1][j - 1][i] === this.board[j][j][i]);
            if(equal) {
                this.winner = this.board[0][i][0];
                return true;
            }
            equal = this.board[0][this.side - 1][i] != this.empty;
            if(equal) for(let j = 1; j < this.side; j++) equal &&= (this.board[j - 1][this.side - j][i] === this.board[j][this.side - j - 1][i]);
            if(equal) {
                this.winner = this.board[0][i][this.side - 1];
                return true;
            }
        }
        // XYZ diagonals
        equal = this.board[0][0][0] != this.empty;
        if(equal) for(let j = 1; j < this.side; j++) equal &&= (this.board[j - 1][j - 1][j - 1] === this.board[j][j][j]);
        if(equal) {
            this.winner = this.board[0][0][0];
            return true;
        }
        equal = this.board[0][0][this.side - 1] != this.empty;
        if(equal) for(let j = 1; j < this.side; j++) equal &&= (this.board[j - 1][j - 1][this.side - j] === this.board[j][j][this.side - j - 1]);
        if(equal) {
            this.winner = this.board[0][0][this.side - 1];
            return true;
        }
        equal = this.board[0][this.side - 1][0] != this.empty;
        if(equal) for(let j = 1; j < this.side; j++) equal &&= (this.board[j - 1][this.side - j][j - 1] === this.board[j][this.side - j - 1][j]);
        if(equal) {
            this.winner = this.board[0][this.side - 1][0];
            return true;
        }
        equal = this.board[0][this.side - 1][this.side - 1] != this.empty;
        if(equal) for(let j = 1; j < this.side; j++) equal &&= (this.board[j - 1][this.side - j][this.side - j] === this.board[j][this.side - j - 1][this.side - j - 1]);
        if(equal) {
            this.winner = this.board[0][this.side - 1][this.side - 1];
            return true;
        }
        return false;
    }

    evaluate() {
        if(this.isFinished()) return this.winner === computer? 10 : -10;
        return 0;
    }

    showBoard() {
        let displayString = "";
        for(let l = 0; l < this.side; l++) {
            displayString += ("depth = " + l + "<br>");
            for(let i = 0; i < this.side; i++) {
                displayString += "|";
                for(let j = 0; j < this.side; j++) {
                    displayString += this.board[l][i][j] + "|";
                }
                displayString += "<br>";
            }
        }
        return displayString;
    }

    showBoardTable() {
        let displayString = "<div id='boardTable'>";
        for(let i = 0; i < this.side; i++) {
            displayString += "<table class='table3d'>";
            for(let j = 0; j < this.side; j++) {
                displayString += "<tr>";
                for(let k = 0; k < this.side; k++) {
                    displayString += "<td id='cell_" + i + "_" + j + "_" + k + "'>" + this.board[i][j][k] + "</td>";
                }
                displayString += "</tr>";
            }
            displayString += "</table>";
        }
        displayString += "</div>";
        return displayString;
    }

    minimax(treeDepth, isMax) {
        let score = this.evaluate();
        if(score !== 0) return score;
        if(!this.movesRemaining()) return 0;
        if(treeDepth == difficulty) return 0;
        if(isMax) {
            let best = MIN;
            for(let l = 0; l < this.side; l++) for(let r = 0; r < this.side; r++) for(let c = 0; c < this.side; c++) {
                if(this.board[this.depthvalues[l]][this.rowValues[r]][this.colValues[c]] === this.empty) {
                    this.board[this.depthvalues[l]][this.rowValues[r]][this.colValues[c]] = computer;
                    best = Math.max(best, this.minimax(treeDepth + 1, !isMax));
                    this.board[this.depthvalues[l]][this.rowValues[r]][this.colValues[c]] = this.empty;
                }
            }
            return best;
        } else {
            let best = MAX;
            for(let l = 0; l < this.side; l++) for(let r = 0; r < this.side; r++) for(let c = 0; c < this.side; c++) {
                if(this.board[this.depthvalues[l]][this.rowValues[r]][this.colValues[c]] === this.empty) {
                    this.board[this.depthvalues[l]][this.rowValues[r]][this.colValues[c]] = player;
                    best = Math.min(best, this.minimax(treeDepth + 1, !isMax));
                    this.board[this.depthvalues[l]][this.rowValues[r]][this.colValues[c]] = this.empty;
                }
            }
            return best;
        }
    }

    minimaxAB(treeDepth, isMax, alpha, beta) {
        let score = this.evaluate();
        if(score !== 0) return score;
        if(!this.movesRemaining()) return 0;
        if(treeDepth == difficulty) return 0;
        if(isMax) {
            let best = MIN;
            for(let l = 0; l < this.side; l++) for(let r = 0; r < this.side; r++) for(let c = 0; c < this.side; c++) {
                if(this.board[this.depthvalues[l]][this.rowValues[r]][this.colValues[c]] === this.empty) {
                    this.board[this.depthvalues[l]][this.rowValues[r]][this.colValues[c]] = computer;
                    // this.printState(treeDepth + 1, computer, this.depthvalues[l], this.rowValues[r], this.colValues[c], best);
                    best = Math.max(best, this.minimaxAB(treeDepth + 1, !isMax, alpha, beta));
                    alpha = Math.max(alpha, best);
                    this.board[this.depthvalues[l]][this.rowValues[r]][this.colValues[c]] = this.empty;
                    if(beta <= alpha) break;
                }
            }
            return best;
        } else {
            let best = MAX;
            for(let l = 0; l < this.side; l++) for(let r = 0; r < this.side; r++) for(let c = 0; c < this.side; c++) {
                if(this.board[this.depthvalues[l]][this.rowValues[r]][this.colValues[c]] === this.empty) {
                    this.board[this.depthvalues[l]][this.rowValues[r]][this.colValues[c]] = player;
                    // this.printState(treeDepth + 1, player, this.depthvalues[l], this.rowValues[r], this.colValues[c], best);
                    best = Math.min(best, this.minimaxAB(treeDepth + 1, !isMax, alpha, beta));
                    beta = Math.min(beta, best);
                    this.board[this.depthvalues[l]][this.rowValues[r]][this.colValues[c]] = this.empty;
                    if(beta <= alpha) break;
                }
            }
            return best;
        }
    }

    minimaxABRB(treeDepth, isMax, alpha, beta) {
        let score = this.evaluate();
        if(score !== 0) return score;
        if(!this.movesRemaining()) return 0;
        if(treeDepth == difficulty) return 0;
        if(isMax) {
            let best = MIN;
            for(let l = 0; l < this.side; l++) for(let r = 0; r < this.side; r++) for(let c = 0; c < this.side; c++) {
                if(this.board[this.depthvalues[l]][this.rowValues[r]][this.colValues[c]] === this.empty && this.hasNeighbours(this.depthvalues[l],this.rowValues[r],this.colValues[c])) {
                    this.board[this.depthvalues[l]][this.rowValues[r]][this.colValues[c]] = computer;
                    // this.printState(0, computer, this.depthvalues[l], this.rowValues[r], this.colValues[c], best);
                    best = Math.max(best, this.minimaxABRB(treeDepth + 1, !isMax, alpha, beta));
                    alpha = Math.max(alpha, best);
                    this.board[this.depthvalues[l]][this.rowValues[r]][this.colValues[c]] = this.empty;
                    if(beta <= alpha) break;
                }
            }
            return best;
        } else {
            let best = MAX;
            for(let l = 0; l < this.side; l++) for(let r = 0; r < this.side; r++) for(let c = 0; c < this.side; c++) {
                if(this.board[this.depthvalues[l]][this.rowValues[r]][this.colValues[c]] === this.empty && this.hasNeighbours(this.depthvalues[l],this.rowValues[r],this.colValues[c])) {
                    this.board[this.depthvalues[l]][this.rowValues[r]][this.colValues[c]] = player;
                    // this.printState(0, computer, this.depthvalues[l], this.rowValues[r], this.colValues[c], best);
                    best = Math.min(best, this.minimaxABRB(treeDepth + 1, !isMax, alpha, beta));
                    beta = Math.min(beta, best);
                    this.board[this.depthvalues[l]][this.rowValues[r]][this.colValues[c]] = this.empty;
                    if(beta <= alpha) break;
                }
            }
            return best;
        }
    }

    printState(prev, player, l, r, c, score) {
        console.log(consoleEmpty.repeat(prev) + player + " takes " + l + ", " + r + ", " + c + "  with score " + score);
    }

    makeComputerMove(player, method) {
        if(method == null) method = 'alpha-beta';
        switch(method) {
            case 'alpha-beta':
                return this.makeAlphaBetaComputerMove(player);
            case 'alpha-beta-rb':
                return this.makeAlphaBetaComputerMoveWithReducedBranching(player);
            case 'minimax':
                return this.makeMinimaxComputerMove(player);
            case 'random':
                return this.makeRandomComputerMove(player);
        }
    }

    makeRandomComputerMove(player) {
        let d = Math.round(Math.random() * (this.side - 1));
        let r = Math.round(Math.random() * (this.side - 1));
        let c = Math.round(Math.random() * (this.side - 1));
        if(this.validateMove(r, c, d)) return this.makeMove(r, c, d, player);
        this.makeRandomComputerMove(player);
    }

    makeMinimaxComputerMove(player) {
        let best = MIN;
        let depth = -1, row = -1, col = -1;
        for(let l = 0; l < this.side; l++) for(let r = 0; r < this.side; r++) for(let c = 0; c < this.side; c++) {
            if(this.board[this.depthvalues[l]][this.rowValues[r]][this.colValues[c]] === this.empty) {
                this.board[this.depthvalues[l]][this.rowValues[r]][this.colValues[c]] = computer;
                let currScore = this.minimax(0, false);
                this.board[this.depthvalues[l]][this.rowValues[r]][this.colValues[c]] = this.empty;
                if(currScore > best) {
                    depth = this.depthvalues[l];
                    row = this.rowValues[r];
                    col = this.colValues[c];
                    best = currScore;
                }
            }
        }
        return this.makeMove(row, col, depth, player);
    }

    makeAlphaBetaComputerMove(player) {
        let best = MIN;
        let depth = -1, row = -1, col = -1;
        for(let l = 0; l < this.side; l++) for(let r = 0; r < this.side; r++) for(let c = 0; c < this.side; c++) {
            if(this.board[this.depthvalues[l]][this.rowValues[r]][this.colValues[c]] === this.empty) {
                this.board[this.depthvalues[l]][this.rowValues[r]][this.colValues[c]] = computer;
                // this.printState(0, computer, this.depthvalues[l], this.rowValues[r], this.colValues[c], best);
                let currScore = this.minimaxAB(0, false, MIN, MAX);
                this.board[this.depthvalues[l]][this.rowValues[r]][this.colValues[c]] = this.empty;
                if(currScore > best) {
                    depth = this.depthvalues[l];
                    row = this.rowValues[r];
                    col = this.colValues[c];
                    best = currScore;
                }
            }
        }
        return this.makeMove(row, col, depth, player);
    }

    makeAlphaBetaComputerMoveWithReducedBranching(player) {
        let best = MIN;
        let depth = -1, row = -1, col = -1;
        for(let l = 0; l < this.side; l++) for(let r = 0; r < this.side; r++) for(let c = 0; c < this.side; c++) {
            if(this.board[this.depthvalues[l]][this.rowValues[r]][this.colValues[c]] === this.empty && this.hasNeighbours(this.depthvalues[l],this.rowValues[r],this.colValues[c])) {
                this.board[this.depthvalues[l]][this.rowValues[r]][this.colValues[c]] = computer;
                // this.printState(0, computer, this.depthvalues[l], this.rowValues[r], this.colValues[c], best);
                let currScore = this.minimaxABRB(0, false, MIN, MAX);
                this.board[this.depthvalues[l]][this.rowValues[r]][this.colValues[c]] = this.empty;
                if(currScore > best) {
                    depth = this.depthvalues[l];
                    row = this.rowValues[r];
                    col = this.colValues[c];
                    best = currScore;
                }
            }
        }
        return this.makeMove(row, col, depth, player);
    }

    hasNeighbours(depth, row, col) {
        let neighbours = this.isValidCell(depth - 1, row, col) || this.isValidCell(depth + 1, row, col) 
                        || this.isValidCell(depth, row - 1, col) || this.isValidCell(depth, row + 1, col) 
                        || this.isValidCell(depth, row, col - 1) || this.isValidCell(depth, row, col + 1);
        if(depth === row && row === col) neighbours ||= (this.isValidCell(depth - 1, row - 1, col - 1) || this.isValidCell(depth + 1, row + 1, col + 1));
        if(depth === row && row + col === this.side - 1) neighbours ||= (this.isValidCell(depth - 1, row - 1, col + 1) || this.isValidCell(depth + 1, row + 1, col - 1));
        if(depth === col && row + col === this.side - 1) neighbours ||= (this.isValidCell(depth - 1, row + 1, col - 1) || this.isValidCell(depth + 1, row - 1, col + 1));
        if(row === col && depth + row === this.side - 1) neighbours ||= (this.isValidCell(depth + 1, row - 1, col - 1) || this.isValidCell(depth - 1, row + 1, col + 1));

        if(row === col) neighbours ||= (this.isValidCell(depth, row + 1, col + 1) || this.isValidCell(depth, row - 1, col - 1));
        if(row + col === this.side - 1) neighbours ||= (this.isValidCell(depth, row + 1, col - 1) || this.isValidCell(depth, row - 1, col + 1));

        if(depth === col) neighbours ||= (this.isValidCell(depth - 1, row, col - 1) || this.isValidCell(depth + 1, row, col + 1));
        if(depth + col === this.side - 1) neighbours ||= (this.isValidCell(depth + 1, row, col - 1) || this.isValidCell(depth - 1, row, col + 1));

        if(depth === row) neighbours ||= (this.isValidCell(depth - 1, row - 1, col) || this.isValidCell(depth + 1, row + 1, col));
        if(depth + row === this.side - 1) neighbours ||= (this.isValidCell(depth - 1, row + 1, col) || this.isValidCell(depth + 1, row - 1, col));
        return neighbours;
    }

    isValidCell(depth, row, col) {
        if(depth < 0 || depth >= this.side || row < 0 || row >= this.side || col < 0 || col >= this.side) return false;
        return this.board[depth][row][col] != this.empty;
    }
}

function initializeGame() {
    document.getElementsByName('difficulty').forEach(element => {
        if(element.checked === true) difficulty = element.value;
        element.disabled = true;
    });
}

function getDRCFromId(id) {
    return id.split('_').slice(1);
}

function cellClick(event) {
    let move = getDRCFromId(event.target.id);
    let depth = move[0], row = move[1], col = move[2];
    if(board.validateMove(row, col, depth)) {
        board.makeMove(row, col, depth, player);
        if(board.isFinished()) {
            endGame();
            document.getElementById("move").innerHTML = player + " won!";
        } else {
            document.getElementById("move").innerHTML = board.makeComputerMove(computer, engine);
            if(board.isFinished()) {
                endGame();
                document.getElementById("move").innerHTML = player + " lost!";
            }
        }
        if(!board.movesRemaining()) document.getElementById("move").innerHTML = "No moves remaining. Restart the game";
    } else {
        alert("Make a valid move!");
    }
}

function makeMoveClick() {
    let depth = document.getElementById("depth").value;
    let row = document.getElementById("row").value;
    let col = document.getElementById("col").value;
    if(board.validateMove(row, col, depth)) {
        board.makeMove(row, col, depth, player);
        if(board.isFinished()) {
            endGame();
            document.getElementById("move").innerHTML = player + " won!";
        } else {
            document.getElementById("move").innerHTML = board.makeComputerMove(computer, engine);
            if(board.isFinished()) {
                endGame();
                document.getElementById("move").innerHTML = player + " lost!";
            }
        }
        document.getElementById("board").innerHTML = board.showBoard();
        if(!board.movesRemaining()) document.getElementById("move").innerHTML = "No moves remaining. Restart the game";
    } else {
        alert("Make a valid move!");
    }
}

function startGame() {
    board = new Board3D(boardSize);
    if(computer === 'X') {
        document.getElementById("move").innerHTML = board.makeComputerMove(computer, 'random');
    } else {
        document.getElementById("move").innerHTML = "";
    }
    if(game3d === true) {
        document.getElementById("board").innerHTML = board.showBoardTable();
        Array.from(document.getElementsByClassName('table3d')).forEach(table => {
            Array.from(table.getElementsByTagName('td')).forEach(cell => {
                cell.addEventListener('click', cellClick);
            });
        });
    } else {
        document.getElementById("board").innerHTML = board.showBoard();
        document.getElementById("moveContainer").style.visibility = "visible";
        document.getElementById("depth").max = boardSize - 1;
        document.getElementById("row").max = boardSize - 1;
        document.getElementById("col").max = boardSize - 1;
        document.getElementById("makeMove").addEventListener('click', makeMoveClick);
    }
}
function endGame() {
    if(game3d === true) {
        Array.from(document.getElementsByClassName('table3d')).forEach(table => {
            Array.from(table.getElementsByTagName('td')).forEach(cell => {
                cell.removeEventListener('click', cellClick);
            });
        });
    } else {
        document.getElementById("makeMove").removeEventListener('click', makeMoveClick);
    }
}

window.onload = function() {
    document.getElementById("difficultySetNext").addEventListener('click', () => {
        document.getElementById("difficultySet").style.display = "none";
        document.getElementById("playerSet").style.display = "block";
        document.getElementsByName('difficulty').forEach(element => {
            if(element.checked === true) difficulty = element.value;
        });
    });
    document.getElementById("playerSetPrev").addEventListener('click', () => {
        document.getElementById("difficultySet").style.display = "block";
        document.getElementById("playerSet").style.display = "none";
    });
    document.getElementById("playerSetNext").addEventListener('click', () => {
        document.getElementById("playerSet").style.display = "none";
        document.getElementsByName('player').forEach(element => {
            if(element.checked === true) {
                player = element.value;
            } else {
                computer = element.value;
            }
        });
        document.getElementById("moveSet").style.display = "block";
        startGame();
    });
    document.getElementById("moveSetPrev").addEventListener('click', () => {
        document.getElementById("playerSet").style.display = "block";
        document.getElementById("moveSet").style.display = "none";
    });
    document.getElementById("restartGame").addEventListener("click", () => {
        startGame();
    });
}