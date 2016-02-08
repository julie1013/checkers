
var checkerboard = [[null, null, null, null, null, null, null, null],
                    [null, null, null, null, null, null, null, null],
                    [null, null, null, null, null, null, null, null],
                    [null, null, null, null, null, null, null, null],
                    [null, null, null, null, null, null, null, null],
                    [null, null, null, null, null, null, null, null],
                    [null, null, null, null, null, null, null, null],
                    [null, null, null, null, null, null, null, null]];

function initializeBoard() {
  for (var row = 0; row < checkerboard.length; row++){
        for (var col = 0; col < checkerboard[row].length; col++){
            if (row < 3){
                setSquare(row, col, "R");
                if (isValidSquare(row, col)){
                    $("#" + row + '_' + col).on("click", function(){
                        $(this).addClass("selected");
                        $(this).siblings().removeClass("selected");
                    });
                }
            } else if (row > 4){
                setSquare(row, col, "B");
                if (isValidSquare(row, col)){
                    $("#" + row + '_' + col).on("click", function(){
                      $(this).addClass("selected");
                      $(this).siblings().removeClass("selected");
                    });
                }
            } else {
                setSquare(row, col, null);

            }
        }
    }
}



function drawBoard() {
    for (var row = 0; row < checkerboard.length; row++){
        for (var col = 0; col < checkerboard[row].length; col++){
            var squareColor;
            if (isValidSquare(row, col)){
                squareColor = 'black';
            } else {
                squareColor = 'red';
            }
            $("#checkerboard").append("<div class = " + squareColor + " data-col='" + col + "' data-row='" + row + "' class='square' id=" + row + '_' + col + "></div>")

        }
    }
}


function isGameOver() {
    if (isOnePlayerGone()){
        console.log("Game over");
        return true;
    } else {
        return false;
    }
}

function isOnePlayerGone() {
    var countR = 0;
    var countB = 0;
    for (var row = 0; row < checkerboard.length; row++){
        for (var col = 0; col < checkerboard[row].length; col++){
            if (checkerboard[row][col] === 'R'){
                countR++;
            } else if (checkerboard[row][col] === 'B'){
                countB++;
            }
        }
    }
    if ((countR === 0 && countB > 0) || (countB === 0 && countR > 0)) {
        return true;
    } else {
        return false;
    }
}


function move(firstRow, firstCol, secondRow, secondCol, piece){
    if (isValidMove(firstRow, firstCol, secondRow, secondCol) || (isValidKingMove(firstRow, firstCol, secondRow, secondCol, piece) && piece === 'rK' || piece === "bK")){
        if (checkerboard[secondRow][secondCol] === null ){
            if ((checkerboard[secondRow] !==7 && piece === 'R') || (checkerboard[secondRow] !==0 && piece === 'B')) {
                    setSquare(secondRow, secondCol, checkerboard[firstRow][firstCol]);
                    setSquare(firstRow, firstCol, null);
                }
            } else if (checkerboard[secondRow] === 7 && piece === 'R') {
                setSquare(secondRow, secondCol, checkerboard[firstRow][firstCol]);
                setSquare(firstRow, firstCol, null);
            } else if (checkerboard[secondRow] === 0 && piece === 'B') {
                setSquare(secondRow, secondCol, checkerboard[firstRow][firstCol]);
                setSquare(firstRow, firstCol, null);
            }
            return true;
        } else {
            return false;
        }
        return false;
    }
//king pieces can't move at all because value doesn't change
//setSquare doesn't seem to change the value


function isValidKingMove(firstRow, firstCol, secondRow, secondCol, piece){
    var piece = checkerboard[firstRow][firstCol];
    if (!(isValidSquare(firstRow, firstCol) && isValidSquare(secondRow, secondCol))){
        return false;
    } else if (isAdjacentSpace(firstRow, firstCol, secondRow, secondCol)){
            return true;
    } else {
        return false;
    }
}


function jump(firstRow, firstCol, secondRow, secondCol, finalRow, finalCol, piece){
    if (isValidJump(firstRow, firstCol, secondRow, secondCol, finalRow, finalCol, piece)){
        setSquare(finalRow, finalCol, checkerboard[firstRow][firstCol]);
        setSquare(firstRow, firstCol, null);
        setSquare(secondRow, secondCol, null);
        return true;
        } else {
            return false;
        }
    }


function isValidJump(firstRow, firstCol, secondRow, secondCol, finalRow, finalCol, piece){
    return isJumpToSquareOpen(firstRow, firstCol, finalRow, finalCol, piece) &&
    isOpponentOnJumpOverSquare(piece, firstRow, firstCol, secondRow, secondCol) &&
    isValidSquare(finalRow, finalCol);
}


function isJumpToSquareOpen(firstRow, firstCol, secondRow, secondCol, piece){
    if (checkerboard[secondRow][secondCol] === null && isTwoSpaces(firstRow, firstCol, secondRow, secondCol) && isTwoRows(firstRow, secondRow, piece)){
        return true;
    } else {
        return false;
    }
}

function isOpponentOnJumpOverSquare(piece, startingRow, startingCol, endingRow, endingCol){
    return isNextRow(startingRow, endingRow, piece) && isAdjacentSpace(startingRow, startingCol, endingRow, endingCol, piece)
        && isOpponent(piece, endingRow, endingCol);
    }


function isOpponent(piece, row, col){
    if (checkerboard[row][col] === null) {
        return false;
    } else if ((piece === 'R' || piece === 'rK' && checkerboard[row][col] === 'B' || checkerboard[row][col]===
        'bK') || (piece === 'B' || piece === 'bK' && checkerboard[row][col] === 'R' || checkerboard[row][col] === 'rK')){
        return true;
    } else {
        return false;
        }
    }


function isValidSquare(row, col){
    return isEven(row) && isEven(col) || !isEven(row) && !isEven(col);
}

function setSquare(row, col, value) {
    var squareValue;
    if (isValidSquare(row, col)){
        checkerboard[row][col] = value;
        if (value === 'R' && row === 7) {
            squareValue = 'Red King';
            value = 'rK';
        } else if (value === 'rK'){
            value = 'rK';
            squareValue = 'Red King';
        } else if (value === 'B' && row === 0) {
            squareValue = 'Black King';
            value = 'bK';
        } else if (value === 'bK') {
            squareValue = 'bK';
            value = 'bK';
        } else if (value === 'R') {
            squareValue = 'Red';
            value = 'rK';
        } else if (value === 'B'){
            value = 'B';
            squareValue = 'Black';
        } else {
            value = null;
            squareValue = null;
        }
        $("#" + row + '_' + col).html(squareValue);
        return value;
    } else {
        return "That's not a valid square, stupid!";
    }
}


function isEven(x){
    return x % 2 === 0;
}


function getPieceAt(row, col){
   return checkerboard[row][col];
}

function isValidMove(firstRow, firstCol, secondRow, secondCol){
    var piece = checkerboard[firstRow][firstCol];
    if (!(isValidSquare(firstRow, firstCol) && isValidSquare(secondRow, secondCol))){
        return false;
    } else if (isNextRow(firstRow, secondRow, piece) && isAdjacentSpace(firstRow, firstCol, secondRow, secondCol)){
            return true;
    } else {
        return false;
    }
}

function isAdjacentSpace(firstRow, firstCol, secondRow, secondCol){
    return Math.abs(secondCol - firstCol) === 1;
}

function isTwoSpaces(firstRow, firstCol, secondRow, secondCol){
    return Math.abs(secondCol - firstCol) === 2;
}

function isNextRow(startingRow, endingRow, piece){
    return piece === "R" && endingRow === startingRow + 1 ||
        piece === "B" && endingRow === startingRow - 1;

}

function isTwoRows(startingRow, endingRow, piece){
    return piece === "R" && endingRow === startingRow + 2 ||
        piece === "B" && endingRow === startingRow - 2;
}

console.log(checkerboard);
console.log("----------");
// console.log(move(0, 0, 0, 1));
// console.log(checkerboard);


$(document).ready(function() {
    drawBoard();
    initializeBoard();
});
