
var checkerboard = [[null, null, null, null, null, null, null, null],
                    [null, null, null, null, null, null, null, null],
                    [null, null, null, null, null, null, null, null],
                    [null, null, null, null, null, null, null, null],
                    [null, null, null, null, null, null, null, null],
                    [null, null, null, null, null, null, null, null],
                    [null, null, null, null, null, null, null, null],
                    [null, null, null, null, null, null, null, null]];

function Game(){
 this.resetGame = function(){
  $("#end_turn").addClass("hidden");
    setTimeout(function(){
        initializeBoard();
        resetCounter();
    }, 2000);
    whoseTurn = 0;
    jumped = false;
  };

  this.resetCounter = function(){
    countR = 12;
    countB = 12;
  };

  this.scoreCount = function() {
    if (redWin(countR)){
        $("#redScore").html(redScoreCount);
    } else if (blackWin(countB)){
        $("#blackScore").html(blackScoreCount);
    }
  };

  this.redWin = function(){
    redScoreCount++;
    return redScoreCount;
  };

  this.blackWin = function(){
    blackScoreCount++;
    return blackScoreCount;
  };

  this.resetGame = function(){
    $("#end_turn").addClass("hidden");
    setTimeout(function(){
        initializeBoard();
        resetCounter();
    }, 2000);
    whoseTurn = 0;
    jumped = false;
  };

  this.switchTurn = function() {
  if (whoseTurn === 1) {
    whoseTurn = 0;
  } else {
    whoseTurn = 1;
  }
  jumped = false;
  };
}




function Board(){

  this.initializeBoard = function (){
    this.drawBoard();
    this.addPieces();
  };

  this.addPieces = function(){
    var playableSquare = $(".black");
    for (var i = 0; i < playableSquare.length; i++){
      if ($(playableSquare[i]).data("row") < 3){
          new CheckerPiece("red", $(playableSquare[i]));
      } else if ($(playableSquare[i]).data("row") > 4){
          new CheckerPiece("black", $(playableSquare[i]));
      }
    }
  };

  this.drawBoard = function(){
    for (var row = 0; row < checkerboard.length; row++){
      for (var col = 0; col < checkerboard[row].length; col++){
        var newSquare = new Square();
        if (newSquare.isValidSquare(row, col)){
          newSquare.squareColor = "black";
        } else {
          newSquare.squareColor = "red";
        }
        $("#checkerboard").append('<div class="piece ' + newSquare.squareColor + '" data-col="' + col + '" data-row="' + row + '" id="' + row + '_' + col + '"></div>');
      }
    }
  };

  this.findMiddleRow = function(firstRow, endingRow){
    if (firstRow + 1 === endingRow - 1) {
        middleRow = firstRow + 1;
    } else if (firstRow - 1 === endingRow + 1){
        middleRow = firstRow - 1;
    } else {
        return false;
    }
    return middleRow;
  };

  this.findMiddleCol = function(firstCol, endingCol){
    if (firstCol + 1 === endingCol - 1){
        middleCol = firstCol + 1;
    } else if (firstCol - 1 === endingCol + 1){
        middleCol = firstCol - 1;
    } else {
        return false;
    }
    return middleCol;
  };

  this.isAdjacentSpace = function(firstRow, firstCol, endingRow, endingCol){
    return Math.abs(endingCol - firstCol) === 1;
  };

  this.isTwoColumns = function(firstCol, endingCol){
    return Math.abs(endingCol - firstCol) === 2;
  };

  this.isNextRow = function(firstRow, endingRow, piece){
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
  };

  this.isTwoRows = function(firstRow, endingRow, piece){
    if (!isKing(piece)){
        if(isRed(piece)){
            return endingRow === firstRow + 2;
        } else {
            return endingRow === firstRow - 2;
        }
    } else if(isKing(piece)){
        return Math.abs(endingRow - firstRow) === 2;
    }
  };
}





function CheckerPiece(color, startSquare){
  var square = new Square();

  this.color = color;
  this.rank = "Checker"; //Rank adjustment will require refactoring; change rK bK etc.
  this.startSquare = $(startSquare);
  var self = this;
  this.colorEl = (function(piece){
    var newPiece = $('<img src="images/'+self.color+self.rank+'.jpg" class="'+self.color+self.rank+' new_piece"/>');
    $(self.startSquare).append(newPiece);
    return newPiece;
  })(self);

  this.relocatePiece = function(firstRow, firstCol, endingRow, endingCol, piece) {
  piece = checkForPromotion(endingRow, endingCol, piece);
  setSquare(endingRow, endingCol, piece);
  setSquare(firstRow, firstCol, null);
  activePieceCoords = { row: firstRow,
                        col: firstCol };

  return piece;
  };

  this.setActivePieceCoords = function(row, col) {
  activePieceCoords["row"] = row;
  activePieceCoords["col"] = col;
  };

  this.move = function(firstRow, firstCol, endingRow, endingCol, piece){
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
  };

  this.checkForPromotion = function(endingRow, endingCol, piece){
    if (endingRow === 7 && isRed(piece)){
        piece = "rK";
   } else if (endingRow === 0 && isBlack(piece)){
        piece = "bK";
   } return piece;
  };

  this.isPieceTurn = function(){
    return ((isRed(piece) && whoseTurn === 0) || (isBlack(piece) && whoseTurn === 1));
  };

  this.isRed = function(piece){
    return (piece === "R" || piece === "rK");
  };

  this.isBlack = function(piece){
    return (piece === "B" || piece === "bK");
  };

  this.isKing = function(piece){
    return (piece ==="rK" || piece === "bK");
  };

  this.isValidJump = function(firstRow, firstCol, endingRow, endingCol, piece){
    return (isJumpToSquareOpen(firstRow, firstCol, endingRow, endingCol) && isOpponentOnJumpOverSquare(piece, firstRow, firstCol, endingRow, endingCol) && isValidSquare(endingRow, endingCol) && isTwoRows(firstRow, endingRow, piece));
  };

  this.isJump = function(endingRow, firstRow){
    return (Math.abs(endingRow - firstRow) === 2);
  };

  this.isOpponent = function(piece, row, col){
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
    };

  this.setSquare = function(row, col, piece) {

      // if (playableSquare){
      //     var color = this.setColor(piece);
      //     var rank = this.setRank(piece);
      //     if (piece !== null){
      //     $("#" + row + '_' + col).html('<img src="images/'+color+rank+'.jpg" style="width: 60px" class="'+color+rank+'"/>').children().css("margin", "5px");
      //     checkerboard[row][col] = piece;
      //     } else {
      //         checkerboard[row][col] = null;
      //         $("#" + row + '_' + col).html(null);
      //     }
      //     return piece;
      // }
    };


  this.setColor = function(piece){
    if (this.isRed(piece)){
        return "red";
    } else if (this.isBlack(piece)){
        return "black";
    } else {
        return null;
    }
  };

  this.setRank = function(piece){
    if (piece === "rK" || piece === "bK"){
        return "King";
    } else if (piece === "R" || piece === "B"){
        return "Checker";
    } else {
        return null;
    }
  };

  this.getPieceAt = function(row, col){
   return checkerboard[row][col];
  };

  this.isValidMove = function(firstRow, firstCol, endingRow, endingCol){
    piece = checkerboard[firstRow][firstCol];
    if (!(isValidSquare(firstRow, firstCol) && isValidSquare(endingRow, endingCol))){
        return false;
    } else if (isNextRow(firstRow, endingRow, piece) && isAdjacentSpace(firstRow, firstCol, endingRow, endingCol)){
        return true;
    } else {
        return false;
    }
  };

  this.selectPiece = function(elt, piece) {
    $(elt).addClass("selected");
    $(elt).siblings().removeClass("selected");

    return piece;
  };

  this.isActivePiece = function(pieceRow, pieceCol) {
    if (jumped) {
      return pieceRow === activePieceCoords["row"] && pieceCol === activePieceCoords["col"];
    } else {
      return true;
    }
  };
}



function Square(){
  this.isJumpToSquareOpen = function(firstRow, firstCol, endingRow, endingCol){
    return (checkerboard[endingRow][endingCol] === null);
  };

  this.isOpponentOnJumpOverSquare = function(piece, firstRow, firstCol, endingRow, endingCol){
    findMiddleRow(firstRow, endingRow);
    findMiddleCol(firstCol, endingCol);
    return isNextRow(firstRow, middleRow, piece) && isOpponent(piece, middleRow, middleCol)
  };

  this.isValidSquare = function(row, col){
    return this.isEven(row) && this.isEven(col) || !this.isEven(row) && !this.isEven(col);
  };

  this.isEven = function(x){
    return x % 2 === 0;
  };
}

$(document).ready(function() {
    var newGame = new Game();
    var newBoard = new Board();
    newBoard.initializeBoard();
});
