
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
var jumped = false;
var activePieceCoords = { row: -1,
                          col: -1 };


//Board


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

//Board
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

//Board
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

//Board
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

//Board
function isAdjacentSpace(firstRow, firstCol, endingRow, endingCol){
    return Math.abs(endingCol - firstCol) === 1;
}

//Board
function isTwoColumns(firstCol, endingCol){
    return Math.abs(endingCol - firstCol) === 2;
}

//Board
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

//Board
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


//Game
function resetCounter(){
    countR = 12;
    countB = 12;
}


//Game
function scoreCount() {
    if (redWin(countR)){
        $("#redScore").html(redScoreCount);
    } else if (blackWin(countB)){
        $("#blackScore").html(blackScoreCount);
    }
}

//Game
function redWin(){
    redScoreCount++;
    return redScoreCount;
}

//Game
function blackWin(){
    blackScoreCount++;
    return blackScoreCount;
}

//Game
function resetGame(){
    $("#end_turn").addClass("hidden");
    setTimeout(function(){
        initializeBoard();
        resetCounter();
    }, 2000);
    whoseTurn = 0;
    jumped = false;
}

//Game
function switchTurn() {
  if (whoseTurn === 1) {
    whoseTurn = 0;
  } else {
    whoseTurn = 1;
  }
  jumped = false;
}

//Piece
function relocatePiece(firstRow, firstCol, endingRow, endingCol, piece) {
  piece = checkForPromotion(endingRow, endingCol, piece);
  setSquare(endingRow, endingCol, piece);
  setSquare(firstRow, firstCol, null);
  activePieceCoords = { row: firstRow,
                        col: firstCol };

  return piece;
}

//Piece
function setActivePieceCoords(row, col) {
  activePieceCoords["row"] = row;
  activePieceCoords["col"] = col;
}

//Piece
function move(firstRow, firstCol, endingRow, endingCol, piece){
    if (isValidMove(firstRow, firstCol, endingRow, endingCol) || isValidJump(firstRow, firstCol, endingRow, endingCol, piece)){
        if (isJump(endingRow, firstRow)){
          piece = relocatePiece(firstRow, firstCol, endingRow, endingCol, piece);
            if (checkerboard[middleRow][middleCol] === "R" || checkerboard[middleRow][middleCol] === "rK"){
                countR--;
                $("#end_turn").removeClass("hidden").css("background", "black").css("color", "white").css("margin-right", "400px").css("margin-left", "-540px").css("float", "right");
            } else if (checkerboard[middleRow][middleCol] === "B" || checkerboard[middleRow][middleCol] === "bK"){
                countB--;
                $("#end_turn").removeClass("hidden").css("background", "red").css("color", "black").css("margin-left", "400px").css("margin-right", "-540px").css("float", "left");
            }
            setSquare(middleRow, middleCol, null);
            jumped = true;
            setActivePieceCoords(endingRow, endingCol);
        } else if (!jumped) {
            relocatePiece(firstRow, firstCol, endingRow, endingCol, piece);
            setActivePieceCoords(-1, -1);
            switchTurn();
        }

        if (countR === 0){
            blackWin();
            $("#blackScore > .score").html(blackScoreCount);
            resetGame();
        } else if (countB === 0){
            redWin();
            $("#redScore > .score").html(redScoreCount);
             resetGame();
        }

    }
    return true;
}



//Piece
function checkForPromotion(endingRow, endingCol, piece){
    if (endingRow === 7 && isRed(piece)){
        piece = "rK";
   } else if (endingRow === 0 && isBlack(piece)){
        piece = "bK";
   } return piece;
}

//Piece
function isPieceTurn(){
    return ((isRed(piece) && whoseTurn === 0) || (isBlack(piece) && whoseTurn === 1));
}

//Piece
function isRed(piece){
    return (piece === "R" || piece === "rK");
}

//Piece
function isBlack(piece){
    return (piece === "B" || piece === "bK");
}

//Piece
function isKing(piece){
    return (piece ==="rK" || piece === "bK");
}


//Piece
function isValidJump(firstRow, firstCol, endingRow, endingCol, piece){
    return (isJumpToSquareOpen(firstRow, firstCol, endingRow, endingCol) && isOpponentOnJumpOverSquare(piece, firstRow, firstCol, endingRow, endingCol) && isValidSquare(endingRow, endingCol) && isTwoRows(firstRow, endingRow, piece));
}

//Piece
function isJump(endingRow, firstRow){
    return (Math.abs(endingRow - firstRow) === 2);
}

//Piece
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

//Piece
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

//Piece
function setColor(piece){
    if (isRed(piece)){
        return "red";
    } else if (isBlack(piece)){
        return "black";
    } else {
        return null;
    }
}

//Piece
function setRank(piece){
    if (piece === "rK" || piece === "bK"){
        return "King";
    } else if (piece === "R" || piece === "B"){
        return "Checker";
    } else {
        return null;
    }
}

//Piece
function getPieceAt(row, col){
   return checkerboard[row][col];
}

//Piece
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

//Piece
function selectPiece(elt, piece) {
  $(elt).addClass("selected");
  $(elt).siblings().removeClass("selected");

  return piece;
}

//Piece
function isActivePiece(pieceRow, pieceCol) {
  if (jumped) {
    return pieceRow === activePieceCoords["row"] && pieceCol === activePieceCoords["col"];
  } else {
    return true;
  }
}

//Square
function isJumpToSquareOpen(firstRow, firstCol, endingRow, endingCol){
    return (checkerboard[endingRow][endingCol] === null);
}

//Square
function isOpponentOnJumpOverSquare(piece, firstRow, firstCol, endingRow, endingCol){
    findMiddleRow(firstRow, endingRow);
    findMiddleCol(firstCol, endingCol);
    return isNextRow(firstRow, middleRow, piece) && isOpponent(piece, middleRow, middleCol)
}

//Square
function isValidSquare(row, col){
    return isEven(row) && isEven(col) || !isEven(row) && !isEven(col);
}

//Square
function isEven(x){
    return x % 2 === 0;
}


$(document).ready(function() {
    drawBoard();
    initializeBoard();
    $("#checkerboard div").on("click", function(event){
        var pieceRow = $(".selected").data("row");
        var pieceCol = $(".selected").data("col");

        if ($(this).find(".blackKing").length !==0 && whoseTurn == 1){
            piece = selectPiece(this, "bK");
        } else if ($(this).find(".redKing").length !==0 && whoseTurn == 0){
            piece = selectPiece(this, "rK");
        } else if ($(this).find(".redChecker").length !==0 && whoseTurn == 0){
            piece = selectPiece(this, "R")
        } else if ($(this).find(".blackChecker").length !==0 && whoseTurn == 1){
            piece = selectPiece(this, "B")
        }

        var endingPieceRow = $(this).data("row");
        var endingPieceCol = $(this).data("col");
        if (checkerboard[endingPieceRow][endingPieceCol] === null && isPieceTurn() && isActivePiece(pieceRow, pieceCol)){
          move(pieceRow, pieceCol, endingPieceRow, endingPieceCol, piece);
        }
    });
     $("#end_turn").on("click", function(){
        ($(this).addClass("hidden"))
        switchTurn();
    });

     $("#restart").on("click", function(){
        initializeBoard();
        jumped = false;
        whoseTurn = 0;
        resetCounter();
        $("#end_turn").addClass("hidden");
     });
});


