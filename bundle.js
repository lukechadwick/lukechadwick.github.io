(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
const getNeighbours = require('./getNeighbours')

let aliveNeighbours = [];

countAliveNeighbours = (cellRow, cellColumn, board) => { 
    aliveNeighbours = (getNeighbours(cellRow, cellColumn, board));

    return aliveNeighbours.filter(Boolean).length;
}

module.exports = countAliveNeighbours

},{"./getNeighbours":4}],2:[function(require,module,exports){
function createBoard (size) {

var matrix = [];

for(var i=0; i<size; i++) {
    matrix[i] = new Array(size);
    matrix[i].fill();
}
    return matrix;
}

module.exports = createBoard
},{}],3:[function(require,module,exports){
function displayBoard (board) {
    for (let x = 0; x < board.length; x++) {
        for (let y = 0; y < board.length; y++) {
            if (board[x][y])
            document.getElementById("r" + x + "c" + y).style.background = "red";
            else
            document.getElementById("r" + x + "c" + y).style.background = "green";

        }  
    }
}

module.exports = displayBoard

},{}],4:[function(require,module,exports){
const indicesAreOutOfBounds = require('./indicesAreOutOfBounds')

getNeighbours = (cellRow, cellColumn, board) => {
    let surroundingNeighbours = [];
    
    for (let x = -1; x <= 1; x++) {
        for (let y = -1; y <= 1; y++) {
            if (y === 0 && x === 0){
            }             
            else if (!indicesAreOutOfBounds(cellRow + x, cellColumn + y, board)) {
            surroundingNeighbours.push(board[cellRow + x][cellColumn + y]);
            } 
        }
    }
    return surroundingNeighbours;
}

module.exports = getNeighbours

},{"./indicesAreOutOfBounds":6}],5:[function(require,module,exports){
const createBoard = require('./createBoard')
const nextBoard = require('./nextBoard')
const displayBoard = require('./displayBoard')

let size = 0;
let board = []
const framesPerSecond = document.getElementById("FPS").value

randomize();
clearGrid();

function restart() {
    clearGrid()
    randomize()
}

document.addEventListener('DOMContentLoaded', drawGrid())
var beginClick = document.getElementById("begin");
    if (beginClick) {
        beginClick.onclick = restart;
}

function randomize() {
    size = document.getElementById("boardSize").value
    board = createBoard(document.getElementById("boardSize").value)
    
    drawGrid()
	for (let y = 0; y < board.length; y++) {
		for (let j = 0; j < board.length; j++) {
			board[y][j] = (Math.random() >= document.getElementById("populationStart").value / 100)
		}
	}
}

function clearGrid(){
    for (let y = 0; y < board.length; y++) {
		for (let j = 0; j < board.length; j++) {
            var element = document.getElementById("r" + y + "c" + j);
            element.parentNode.removeChild(element);
		}
	}
}

function drawGrid() {
	for (var i = 0; i < size; i++) {
		for (var j = 0; j < size; j++) {
			var div = document.createElement("div");
			let boxSize = document.getElementById('pixelSize').value;
			div.id = "r" + i + "c" + j;

			div.style.width = boxSize + "px";
			div.style.height = boxSize + "px";
			div.style.background = "black";
			div.style.border = "solid";
			div.style.borderWidth = "1px"
			div.style.borderColor = "black"

			let width = ((boxSize * size) + (size * 2)) + "px";

			document.getElementById("container").style.width = width;
			document.getElementById("container").appendChild(div);
		}
	}

}

setInterval(() => {
	displayBoard(board)
	board = nextBoard(board)
}, 1000 / framesPerSecond)
},{"./createBoard":2,"./displayBoard":3,"./nextBoard":11}],6:[function(require,module,exports){
const isOutOfBounds = require('./isOutOfBounds')

function indicesAreOutOfBounds (rowIndex, columnIndex, array) {   
    
    if (isOutOfBounds(rowIndex, array))
        return true;

    if (isOutOfBounds(columnIndex, array))
        return true

    return false;
}
module.exports = indicesAreOutOfBounds

},{"./isOutOfBounds":7}],7:[function(require,module,exports){
function isOutOfBounds (index, array) {    
    if (index < 0) return true;
    else if (index > array.length -1) return true;
        else return false
}

module.exports = isOutOfBounds

},{}],8:[function(require,module,exports){
// Any live cell with more than three live neighbors dies, as if by overpopulation.

isOverPopulated = (neighbourCount) => neighbourCount > 3 ? true : false;

module.exports = isOverPopulated

},{}],9:[function(require,module,exports){
// Any dead cell with exactly three live neighbors becomes a live cell, as if by reproduction.

isRessurectable = (neighbourCount) => neighbourCount == 3 ? true : false;

module.exports = isRessurectable

},{}],10:[function(require,module,exports){
// Any live cell with fewer than two live neighbors dies, as if by under population.

isUnderPopulated = (neighbourCount) => neighbourCount < 2 ? true : false;

module.exports = isUnderPopulated

},{}],11:[function(require,module,exports){
var nextCellState = require('./nextCellState');
var countAliveNeighbours = require('./countAliveNeighbours');
var createBoard = require('./createBoard')

function nextBoard(currentBoard) {
  var newBoard = createBoard(currentBoard.length)
  
  for (let i = 0; i < currentBoard.length; i++) {
    for (let j = 0; j < currentBoard.length; j++) {
      newBoard[i][j] = nextCellState(currentBoard[i][j], countAliveNeighbours(i, j, currentBoard))
    }
  }
  return newBoard;
}

module.exports = nextBoard;
},{"./countAliveNeighbours":1,"./createBoard":2,"./nextCellState":12}],12:[function(require,module,exports){
const isOverPopulated = require('./isOverPopulated')
const isUnderPopulated = require('./isUnderPopulated')
const isRessurectable = require('./isRessurectable')

function nextCellState(cellState, neighbourCount) {
  
	if (isOverPopulated(neighbourCount) && cellState) {
		return false
	}
	if (isUnderPopulated(neighbourCount) && cellState) {
		return false
	}
	if (isRessurectable(neighbourCount) && !cellState) {
		return true
	}
	if (!isUnderPopulated(neighbourCount) && !isOverPopulated(neighbourCount) && cellState) {
		return true
	} else return false;
}
module.exports = nextCellState
},{"./isOverPopulated":8,"./isRessurectable":9,"./isUnderPopulated":10}]},{},[5]);
