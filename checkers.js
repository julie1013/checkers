
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
            } else if (row > 4){
                setSquare(row, col, "B");
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
    if (redWin(redScoreCount)){
        $("#redScore").html(redScoreCount);
    } else if (blackWin(blackScoreCount)){
        $("#blackScore").html(blackScoreCount);
    }
}


function redWin(){
    if (isGameOver() && countR !== 0){
        redScoreCount++;
    }
    return redScoreCount;
}

function blackWin(){
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

function isOnePlayerGone(countR, countB) {
    for (var row = 0; row < checkerboard.length; row++){
        for (var col = 0; col < checkerboard[row].length; col++){
            if (isRed(piece) > 0 ){
                countR++;
            } else if (isBlack(piece)){
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


function move(firstRow, firstCol, endingRow, endingCol, piece){
    if (isValidJump(firstRow, firstCol, endingRow, endingCol, piece) || (isValidMove(firstRow, firstCol, endingRow, endingCol))){
            piece = checkForPromotion(endingRow, endingCol, piece);
            setSquare(endingRow, endingCol, piece);
            setSquare(firstRow, firstCol, null);
        if (Math.abs(endingRow - firstRow) === 2){
            setSquare(middleRow, middleCol, null);
        }
        if (isGameOver()){
            if (redWin()){
                redScoreCount++;
            } else if (blackWin()){
                blackScoreCount++;
            }
        }
        return true;
        } else {
            return false;
        }
    }



function checkForPromotion(endingRow, endingCol, piece){
    if (endingRow === 7 && isRed(piece)){
        piece = "rK";
   } else if (endingRow === 0 && isBlack(piece)){
        piece = "bK";
   } return piece;
}


function isRed(piece){
    return (piece === "R" || piece === "rK");
}

function isBlack(piece){
    return (piece === "B" || piece === "bK");
}

function isKing(piece){
    return (piece ==="rK" || piece === "bK");
}

function findMiddleRow(firstRow, endingRow){
    if (firstRow + 1 === endingRow - 1) {
        middleRow = firstRow + 1;
    } else if (firstRow - 1 === endingRow + 1){
        middleRow = firstRow - 1;
    } else {
        return false;
    }
    return middleRow;
}

function findMiddleCol(firstCol, endingCol){
    if (firstCol + 1 === endingCol - 1){
        middleCol = firstCol + 1;
    } else if (firstCol - 1 === endingCol + 1){
        middleCol = firstCol - 1;
    } else {
        return false;
    }
    return middleCol;
}


function isValidJump(firstRow, firstCol, endingRow, endingCol, piece){
    return (isJumpToSquareOpen(firstRow, firstCol, endingRow, endingCol) && isOpponentOnJumpOverSquare(piece, firstRow, firstCol, endingRow, endingCol) && isValidSquare(endingRow, endingCol) && isTwoRows(firstRow, endingRow, piece));
}


function isJumpToSquareOpen(firstRow, firstCol, endingRow, endingCol){
    return (checkerboard[endingRow][endingCol] === null);
}

function isOpponentOnJumpOverSquare(piece, firstRow, firstCol, endingRow, endingCol){
    findMiddleRow(firstRow, endingRow);
    findMiddleCol(firstCol, endingCol);
    return isNextRow(firstRow, middleRow, piece) && isOpponent(piece, middleRow, middleCol)
}


function isOpponent(piece, row, col){
    if (checkerboard[row][col] === null) {
        return false;
    } else if ((piece === "R" || piece === "rK") && (checkerboard[row][col] === "B" || checkerboard[row][col]===
        "bK")) {
        return true;
    } else if ((piece === "B" || piece === "bK") && (checkerboard[row][col] === "R" || checkerboard[row][col] === "rK")){
        return true;
    } else {
        return false;
        }
    }


function isValidSquare(row, col){
    return isEven(row) && isEven(col) || !isEven(row) && !isEven(col);
}

function setSquare(row, col, piece) {
    if (isValidSquare(row, col)){
        setColor(piece);
        setRank(piece);
        if (piece !== null){
        $("#" + row + '_' + col).html('<img src="images/'+color+'.jpg" style="width: 60px" class="'+color+rank+'"/>');
        checkerboard[row][col] = piece;
        } else {
            checkerboard[row][col] = null;
            $("#" + row + '_' + col).html(null);
        }
        return piece;
    }
}

function setColor(piece){
    if (isRed(piece)){
        color = "red";
    } else if (isBlack(piece)){
        color = "black";
    }
    return color;
}

function setRank(piece){
    if (piece === "rK" || piece === "bK"){
        rank = "King";
    } else if (piece === "R" || piece === "B"){
        rank = "Checker";
    }
    return rank;
}


function isEven(x){
    return x % 2 === 0;
}


function getPieceAt(row, col){
   return checkerboard[row][col];
}

function isValidMove(firstRow, firstCol, endingRow, endingCol){
    piece = checkerboard[firstRow][firstCol];
    if (!(isValidSquare(firstRow, firstCol) && isValidSquare(endingRow, endingCol))){
        return false;
    } else if (isNextRow(firstRow, endingRow, piece) && isAdjacentSpace(firstRow, firstCol, endingRow, endingCol)){
        return true;
    } else {
        return false;
    }
}

function isAdjacentSpace(firstRow, firstCol, endingRow, endingCol){
    return Math.abs(endingCol - firstCol) === 1;
}

function isTwoColumns(firstCol, endingCol){
    return Math.abs(endingCol - firstCol) === 2;
}

function isNextRow(firstRow, endingRow, piece){
    if (!isKing(piece)){
        if (isRed(piece)){
            return endingRow === firstRow + 1;
        } else {
            return endingRow === firstRow - 1;
        }
    } else if(isKing(piece)){
        return Math.abs(endingRow - firstRow) === 1;
    } else {
        return false;
    }
}


function isTwoRows(firstRow, endingRow, piece){
    if (!isKing(piece)){
        if(isRed(piece)){
            return endingRow === firstRow + 2;
        } else {
            return endingRow === firstRow - 2;
        }
    } else if(isKing(piece)){
        return Math.abs(endingRow - firstRow) === 2;
    }
}


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
        if (checkerboard[secondPieceRow][secondPieceCol] === null){
          move(pieceRow, pieceCol, secondPieceRow, secondPieceCol, piece);
        }
        console.log(pieceRow, pieceCol, secondPieceRow, secondPieceCol, piece);
    });
});
