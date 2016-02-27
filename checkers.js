
var checkerboard = [[null, null, null, null, null, null, null, null],
                    [null, null, null, null, null, null, null, null],
                    [null, null, null, null, null, null, null, null],
                    [null, null, null, null, null, null, null, null],
                    [null, null, null, null, null, null, null, null],
                    [null, null, null, null, null, null, null, null],
                    [null, null, null, null, null, null, null, null],
                    [null, null, null, null, null, null, null, null]];

var redScoreCount = 0;
var blackScoreCount = 0;
var redChecker;
var blackChecker;
var piece = 0;
var middleRow;
var middleCol;

function initializeBoard() {
  for (var row = 0; row < checkerboard.length; row++){
        for (var col = 0; col < checkerboard[row].length; col++){
            if (row < 3){
                setSquare(row, col, "R");
                if (isValidSquare(row, col)){
                    redChecker = $("#" + row + '_' + col).html('<img src="images/red.jpg" style="width: 60px;" class="redChecker"/>');
                }
            } else if (row > 4){
                setSquare(row, col, "B");
                if (isValidSquare(row, col)){
                    blackChecker = $("#" + row + '_' + col).html('<img src="' + "images/black.jpg" + '" style="width: 65px;" class="blackChecker"/>');
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

function scoreCount() {
    if (redWin(countR)){
        $("#redScore").html(redScoreCount);
    } else if (blackWin(countB)){
        $("#blackScore").html(blackScoreCount);
    }
}


function redWin(countR){
    if (isGameOver() && countR !== 0){
        redScoreCount++;
    }
    return redScoreCount;
}

function blackWin(countB){
    if (isGameOver() && countB !== 0) {
        blackScoreCount++;
    }
    return blackScoreCount;
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
    if (isValidMove(firstRow, firstCol, secondRow, secondCol)){
        if (checkerboard[secondRow][secondCol] === null ){
            if ((secondRow !==7 && piece === 'R')){
                setSquare(secondRow, secondCol, checkerboard[firstRow][firstCol]);
                setSquare(firstRow, firstCol, null);
                $("#" + secondRow + '_' + secondCol).html('<img src="images/red.jpg" style="width: 60px" class="redChecker"/>');
            } else if ((secondRow !==0 && piece === 'B')) {
                    setSquare(secondRow, secondCol, checkerboard[firstRow][firstCol]);
                    setSquare(firstRow, firstCol, null);
                    $("#" + secondRow + '_' + secondCol).html('<img src="images/black.jpg" style="width: 65px" class="blackChecker"/>');
            } else if (secondRow === 7 && piece === 'R') {
                setSquare(secondRow, secondCol, checkerboard[7][secondCol]);
                setSquare(firstRow, firstCol, null);
                $("#" + secondRow + '_' + secondCol).html('<img src="images/red.jpg" style="width: 60px" class="redKing"/>');
            } else if (secondRow === 0 && piece === 'B') {
                setSquare(secondRow, secondCol, checkerboard[0][secondCol]);
                setSquare(firstRow, firstCol, null);
                $("#" + secondRow + '_' + secondCol).html('<img src="images/black.jpg" style="width: 65px" class="blackKing"/>');
            }
            return true;
        } else {
            return false;
        }
        return false;
    }
}

function kingMove(firstRow, firstCol, secondRow, secondCol, piece){
    if(isValidKingMove(firstRow, firstCol, secondRow, secondCol, piece)){
        if (checkerboard[secondRow][secondCol] === null ){
            setSquare(secondRow, secondCol, checkerboard[firstRow][firstCol]);
            setSquare(firstRow, firstCol, null);
            if (piece === 'rK'){
                $("#" + secondRow + '_' + secondCol).html('<img src="images/red.jpg" style="width: 65px" class="redKing"/>');
                return true;
            } else if (piece === 'bK'){
                $("#" + secondRow + '_' + secondCol).html('<img src="images/black.jpg" style="width: 65px" class="blackKing"/>');
                return true;
            } else if (piece !== 'rK' || piece !== 'bK') {
                return false;
            }
        }
    }
}


function isValidKingMove(firstRow, firstCol, secondRow, secondCol, piece){
    var piece = checkerboard[firstRow][firstCol];
    if (!(isValidSquare(firstRow, firstCol) && isValidSquare(secondRow, secondCol))){
        return false;
    } else if (isValidSquare(firstRow, firstCol) && isAdjacentSpace(firstRow, firstCol, secondRow, secondCol)){
            return true;
    } else {
        return false;
    }
}


function jump(firstRow, firstCol, jumpToRow, jumpToCol, piece){
    middleCol(firstCol, jumpToCol);
    if (isValidJump(firstRow, firstCol, jumpToRow, jumpToCol, piece) && piece === "R"){
        setSquare(jumpToRow, jumpToCol, checkerboard[firstRow][firstCol]);
       if (jumpToRow !==7) {
        $("#" + jumpToRow + '_' + jumpToCol).html('<img src="' + "images/red.jpg" + '" style="width: 60px" class="redChecker"/>');
    } else if (jumpToRow === 7) {
        $("#" + jumpToRow + '_' + jumpToCol).html('<img src="' + "images/red.jpg" + '" style="width: 60px" class="redKing"/>');
    }
        setSquare(firstRow, firstCol, null);
        setSquare(jumpToRow-1, middleCol, null);
            return true;
    } else if (isValidJump(firstRow, firstCol, jumpToRow, jumpToCol, piece) && piece === "B"){
        setSquare(jumpToRow, jumpToCol, checkerboard[firstRow][firstCol]);
        if (jumpToRow !== 0) {
        $("#" + jumpToRow + '_' + jumpToCol).html('<img src="' + "images/black.jpg" + '" style="width: 65px" class="blackChecker"/>');
       } else if (jumpToRow === 0) {
            $("#" + jumpToRow + '_' + jumpToCol).html('<img src="' + "images/black.jpg" + '" style="width: 65px" class="blackKing"/>');
        }
        setSquare(firstRow, firstCol, null);
        setSquare(jumpToRow+1, middleCol, null);
            return true;
        } else {
            return false;
        }
    }


function kingJump(firstRow, firstCol, jumpToRow, jumpToCol, piece){
        middleRow(firstRow, jumpToRow);
        middleCol(firstCol, jumpToCol);
    if (isValidKingJump(firstRow, firstCol, jumpToRow, jumpToCol, piece)){
        setSquare(jumpToRow, jumpToCol, checkerboard[firstRow][firstCol]);
        if (piece === "rK") {
            $("#" + jumpToRow + '_' + jumpToCol).html('<img src="' + "images/red.jpg" + '" style="width: 60px" class="redKing"/>');
        } else if (piece === "bK") {
            $("#" + jumpToRow + '_' + jumpToCol).html('<img src="' + "images/black.jpg" + '" style="width: 65px" class="blackKing"/>')
        }
        setSquare(firstRow, firstCol, null);
        setSquare(middleRow, middleCol, null);
        return true;
        } else {
            return false;
        }
    }

function middleRow(firstRow, jumpToRow){
    if (firstRow + 1 === jumpToRow - 1) {
        middleRow = firstRow + 1;
    } else if (firstRow - 1 === jumpToRow + 1){
        middleRow = firstRow - 1;
    } else {
        return false;
    }
    return middleRow;
}

function middleCol(firstCol, jumpToCol){
    if (firstCol + 1 === jumpToCol - 1){
        middleCol = firstCol + 1;
    } else if (firstCol - 1 === jumpToCol + 1){
        middleCol = firstCol - 1;
    } else {
        return false;
    }
    return middleCol;
}

function isValidKingJump(firstRow, firstCol, jumpToRow, jumpToCol, piece){
     if (isJumpToSquareOpenKing(firstRow, firstCol, jumpToRow, jumpToCol, piece)){
        if((isOpponentOnJumpOverSquareKing(piece, firstRow, firstCol, jumpToRow, jumpToCol) && isValidSquare(jumpToRow, jumpToCol))){
            return true;
        }
     } else {
        return false;
     }
}


function isValidJump(firstRow, firstCol, jumpToRow, jumpToCol, piece){
        if (isJumpToSquareOpen(firstRow, firstCol, jumpToRow, jumpToCol, piece)){
            if (isOpponentOnJumpOverSquare("R", firstRow, firstCol, jumpToRow, jumpToCol) && isValidSquare(jumpToRow, jumpToCol) && jumpToRow === firstRow + 2 && (jumpToCol === firstCol + 2 || jumpToCol === firstCol - 2)){
                return true;
            } else if (isOpponentOnJumpOverSquare("B", firstRow, firstCol, jumpToRow, jumpToCol) && isValidSquare(jumpToRow, jumpToCol) && jumpToRow === firstRow - 2 && (jumpToCol === firstCol + 2 || jumpToCol === firstCol - 2)){
                return true;
            }
        } else {
        return false;
    }
}


function isJumpToSquareOpen(firstRow, firstCol, jumpToRow, jumpToCol, piece){
    if (checkerboard[jumpToRow][jumpToCol] === null && isTwoColumns(firstCol, jumpToCol) && isTwoRows(firstRow, jumpToRow, piece)){
        return true;
    } else {
        return false;
    }
}

function isJumpToSquareOpenKing(firstRow, firstCol, jumpToRow, jumpToCol, piece){
   if (checkerboard[jumpToRow][jumpToCol] === null && isTwoColumns(firstCol, jumpToCol) && isTwoRowsKing(firstRow, jumpToRow, piece)){
        return true;
    } else {
        return false;
    }
}

function isOpponentOnJumpOverSquare(piece, startingRow, startingCol, jumpToRow, jumpToCol){
    if(piece === "R" && isNextRow(startingRow, jumpToRow-1, piece) && isAdjacentSpace(startingRow, startingCol, jumpToRow-1, jumpToCol-1) && isOpponent(piece, jumpToRow-1, jumpToCol-1)){
        return true;
    } else if (piece === "B" && isNextRow(startingRow, jumpToRow+1, piece) && isAdjacentSpace(startingRow, startingCol, jumpToRow+1, jumpToCol+1) && isOpponent(piece, jumpToRow+1, jumpToCol+1)){
        return true;
        } else {
            return false;
        }
    }

function isOpponentOnJumpOverSquareKing(piece, firstRow, firstCol, jumpToRow, jumpToCol){
    if ((piece === "rK" || piece === "bK") && (isNextRowKing(firstRow, jumpToRow-1, piece)) || isNextRowKing(firstRow, jumpToRow+1, piece)){
        if(isAdjacentSpace(firstRow, firstCol, jumpToRow-1, jumpToRow-1) || isAdjacentSpace(firstRow, firstCol, jumpToRow+1, jumpToCol+1)){
            if (isOpponent(piece, jumpToRow-1, jumpToCol-1) || isOpponent(piece, jumpToRow+1, jumpToCol+1)){
                return true;
            } else {
                return false;
            }
        }
    }
}


function isOpponent(piece, row, col){
    console.log(row, col);
    console.log(checkerboard[row][col]);
    if (checkerboard[row][col] === null) {
        return false;
    } else if ((piece === 'R' || piece === 'rK') && (checkerboard[row][col] === 'B' || checkerboard[row][col]===
        'bK')) {
        return true;
    } else if ((piece === 'B' || piece === 'bK') && (checkerboard[row][col] === 'R' || checkerboard[row][col] === 'rK')){
        return true;
    } else {
        return false;
        }
    }


function isValidSquare(row, col){
    return isEven(row) && isEven(col) || !isEven(row) && !isEven(col);
}

function setSquare(row, col, piece) {
    var squareValue;
    if (isValidSquare(row, col)){
        if (piece === 'R' && row === 7) {
            squareValue = 'Red King';
            piece = 'rK';
        } else if (piece === 'rK'){
            squareValue = 'Red King';
            piece = 'rK';
        } else if (piece === 'B' && row === 0) {
            squareValue = 'Black King';
            piece = 'bK';
        } else if (piece === 'bK') {
            squareValue = 'Black King';
            piece = 'bK';
        } else if (piece === 'R') {
            squareValue = 'Red';
            piece = 'R';
        } else if (piece === 'B'){
            squareValue = 'Black';
            piece = 'B';
        } else {
            squareValue = null;
            piece = null;
        }
        $("#" + row + '_' + col).html(squareValue);
        checkerboard[row][col] = piece;
        return piece;
    } else {
        return false;
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

function isTwoColumns(firstCol, secondCol){
    return Math.abs(secondCol - firstCol) === 2;
}

function isNextRow(startingRow, endingRow, piece){
    return piece === "R" && endingRow === startingRow + 1 ||
        piece === "B" && endingRow === startingRow - 1;

}

function isNextRowKing(firstRow, secondRow, piece){
    return (piece === 'rK' || piece === 'bK') && (secondRow === firstRow + 1 || secondRow === firstRow - 1);
}

function isTwoRows(startingRow, endingRow, piece){
    return piece === "R" && endingRow === startingRow + 2 ||
        piece === "B" && endingRow === startingRow - 2;
}

function isTwoRowsKing(firstRow, jumpToRow, piece){
    return (piece === "rK" || piece === "bK") && Math.abs(jumpToRow - firstRow) === 2;
}

console.log(checkerboard);
console.log("----------");
// console.log(move(0, 0, 0, 1));
// console.log(checkerboard);


$(document).ready(function() {
    drawBoard();
    initializeBoard();
    $("#checkerboard div").on("click", function(event){
        var pieceRow = $(".selected").data("row");
        var pieceCol = $(".selected").data("col");
        if ($(this).find(".blackKing").length !==0){
            piece = "bK";
            $(this).addClass("selected");
            $(this).siblings().removeClass("selected");
       } else if ($(this).find(".redKing").length !==0){
            piece = "rK";
            $(this).addClass("selected");
            $(this).siblings().removeClass("selected");
       } else if ($(this).find(".redChecker").length !==0){
            piece = "R";
            $(this).addClass("selected");
            $(this).siblings().removeClass("selected");
       } else if ($(this).find(".blackChecker").length !==0){
            piece = "B";
            $(this).addClass("selected");
            $(this).siblings().removeClass("selected");
       }

        var secondPieceRow = $(this).data("row");
        var secondPieceCol = $(this).data("col");
        if ((piece === "R" || piece === "B") && checkerboard[secondPieceRow][secondPieceCol] === null){
          move(pieceRow, pieceCol, secondPieceRow, secondPieceCol, piece);
        } else if ((piece === "rK" || piece === "bK") && checkerboard[secondPieceRow][secondPieceCol] === null){
            kingMove(pieceRow, pieceCol, secondPieceRow, secondPieceCol, piece);
        }
        console.log(pieceRow, pieceCol, secondPieceRow, secondPieceCol, piece);
    });
});

//returns true if I try to move to an occupied space
//need to refactor some stuff
