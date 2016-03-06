
var checkerboard = [[null, null, null, null, null, null, null, null],
                    [null, null, null, null, null, null, null, null],
                    [null, null, null, null, null, null, null, null],
                    [null, null, null, null, null, null, null, null],
                    [null, null, null, null, null, null, null, null],
                    [null, null, null, null, null, null, null, null],
                    [null, null, null, null, null, null, null, null],
                    [null, null, null, null, null, null, null, null]];



var redChecker;
var blackChecker;
var middleRow;
var middleCol;
var countR = 12;
var countB = 12;
var piece = 0;
var redScoreCount = 0;
var blackScoreCount = 0;
var whoseTurn = 0;


function initializeBoard(){
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


function initializeTest(){
  for (var row = 0; row < checkerboard.length; row++){
        for (var col = 0; col < checkerboard[row].length; col++){
            if (row === 2 && col === 2){
                setSquare(row, col, "B");
            } else if (row === 1 && col === 1){
                setSquare(row, col, "R");
            } else {
                setSquare(row, col, null);

            }
        }
    }
    whoseTurn = 1;
}


function drawBoard(){
    for (var row = 0; row < checkerboard.length; row++){
        for (var col = 0; col < checkerboard[row].length; col++){
            var squareColor;
            if (isValidSquare(row, col)){
                squareColor = "black";
            } else {
                squareColor = "red";
            }
            $("#checkerboard").append("<div class = " + squareColor + " data-col='" + col + "' data-row='" + row + "' class='square' id=" + row + '_' + col + "></div>");
        }
    }
}



function resetCounter(){
    countR = 12;
    countB = 12;
}



function scoreCount() {
    if (redWin(countR)){
        $("#redScore").html(redScoreCount);
    } else if (blackWin(countB)){
        $("#blackScore").html(blackScoreCount);
    }
}


function redWin(){
    redScoreCount++;
    $("#red_wins").replaceWith(" wins!");
    return redScoreCount;
}

function blackWin(){
    $("#black_wins").replaceWith(" wins!");
    blackScoreCount++;
    return blackScoreCount;
}


function isGameOver() {
   return (redWin() || blackWin());
}


function move(firstRow, firstCol, endingRow, endingCol, piece){
    if (isValidMove(firstRow, firstCol, endingRow, endingCol) || isValidJump(firstRow, firstCol, endingRow, endingCol, piece)){
            piece = checkForPromotion(endingRow, endingCol, piece);
            setSquare(endingRow, endingCol, piece);
            setSquare(firstRow, firstCol, null);
        if (isJump(endingRow, firstRow)){
             if (checkerboard[middleRow][middleCol] === "R" || checkerboard[middleRow][middleCol] === "rK"){
                countR--;
                $("#end_turn").removeClass("hidden").css("background", "black").css("color", "white").css("margin-right", "400px").css("margin-left", "-540px").css("float", "right");
            } else if (checkerboard[middleRow][middleCol] === "B" || checkerboard[middleRow][middleCol] === "bK"){
                countB--;
                $("#end_turn").removeClass("hidden");
            }
            setSquare(middleRow, middleCol, null);
        } if (countR === 0){
            blackWin();
            $("#blackScore > .score").html(blackScoreCount);
            setTimeout(function(){
                initializeBoard();
                resetCounter();
            }, 2000);

        } else if (countB === 0){
            redWin();
            $("#redScore > .score").html(redScoreCount);
            setTimeout(function(){
                initializeBoard();
                resetCounter();
            }, 2000);
        }
        switchTurn();

    }
    return true;
}


function isJump(endingRow, firstRow){
    return (Math.abs(endingRow - firstRow) === 2);
}

function checkForPromotion(endingRow, endingCol, piece){
    if (endingRow === 7 && isRed(piece)){
        piece = "rK";
   } else if (endingRow === 0 && isBlack(piece)){
        piece = "bK";
   } return piece;
}


function isPieceTurn(){
    return ((isRed(piece) && whoseTurn === 0) || (isBlack(piece) && whoseTurn === 1));
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
        var color = setColor(piece);
        var rank = setRank(piece);
        if (piece !== null){
        $("#" + row + '_' + col).html('<img src="images/'+color+rank+'.jpg" style="width: 60px" class="'+color+rank+'"/>').children().css("margin", "5px");
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
        return "red";
    } else if (isBlack(piece)){
        return "black";
    } else {
        return null;
    }
}

function setRank(piece){
    if (piece === "rK" || piece === "bK"){
        return "King";
    } else if (piece === "R" || piece === "B"){
        return "Checker";
    } else {
        return null;
    }
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

function switchTurn() {
  if (whoseTurn === 1) {
    whoseTurn = 0;
  } else {
    whoseTurn = 1;
  }
}

$(document).ready(function() {
    drawBoard();
    // initializeBoard();
    initializeTest();
    $("#checkerboard div").on("click", function(event){
        var pieceRow = $(".selected").data("row");
        var pieceCol = $(".selected").data("col");
        if ($(this).find(".blackKing").length !==0 && whoseTurn == 1){
            piece = "bK";
            $(this).addClass("selected");
            $(this).siblings().removeClass("selected");
       } else if ($(this).find(".redKing").length !==0 && whoseTurn == 0){
            piece = "rK";
            $(this).addClass("selected");
            $(this).siblings().removeClass("selected");
       } else if ($(this).find(".redChecker").length !==0 && whoseTurn == 0){
            piece = "R";
            $(this).addClass("selected");
            $(this).siblings().removeClass("selected");
       } else if ($(this).find(".blackChecker").length !==0 && whoseTurn == 1){
            piece = "B";
            $(this).addClass("selected");
            $(this).siblings().removeClass("selected");
       }
        var endingPieceRow = $(this).data("row");
        var endingPieceCol = $(this).data("col");
        if (checkerboard[endingPieceRow][endingPieceCol] === null && isPieceTurn()){
          move(pieceRow, pieceCol, endingPieceRow, endingPieceCol, piece);
        }
    });
     $("#end_turn").on("click", function(){
        ($(this).addClass("hidden"))
        if ($(this).attr("background", "black")){
            // whoseTurn--;
        } else {
            // whoseTurn++;
        }
    });
});


