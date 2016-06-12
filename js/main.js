var newBoard = new Board();
var gameLogic = new Rules();

function Rules(){

  this.jumped = false;
  this.whoseTurn = "red";
  this.score = {
    red: 0,
    black: 0
  }

   this.resetGame = function(){
  $("#end_turn").addClass("hidden");
    $("#checkerboard").children().remove();
    newBoard.initializeBoard();
    // this.resetCounter();
    gameLogic.whoseTurn = "red";
    gameLogic.jumped = false;
  };

  this.scoreCount = function(){
    $("#redScore > .score").html(gameLogic.score.red);
    $("#blackScore > .score").html(gameLogic.score.black);
  };

  this.redWin = function(){
    this.score.red++;
  };

  this.blackWin = function(){
    this.score.black++;
  };


  this.switchTurn = function() {
    if (this.whoseTurn === "black") {
      this.whoseTurn = "red";
    } else {
      this.whoseTurn = "black";
    }
    this.jumped = false;
    $(".selected").removeClass("selected");
  };

  this.isKing = function(piece){
    return (piece.hasClass("king"));
  };
  this.isRed = function(piece){
    return (piece.hasClass("red"));
  };

  this.isBlack = function(piece){
    return (piece.hasClass("black"));
  };

  this.isValidMove = function(firstRow, firstCol, endingRow, endingCol, piece){
    if (!(this.isValidSquare(firstRow, firstCol) && this.isValidSquare(endingRow, endingCol))){
        return false;
    } else if (this.isNextRow(firstRow, endingRow, piece) && this.isAdjacentSpace(firstRow, firstCol, endingRow, endingCol)){
        return true;
    } else {
        return false;
    }
  };

  this.removeJumpedPiece = function(piece){
    $(piece).remove();
  }

  this.isJumpToSquareOpen = function(endingRow, endingCol){
    var jumpToSquare = $("#"+endingRow+"_"+endingCol).children();
    return jumpToSquare.length < 1;
  };

  this.isOpponentOnJumpOverSquare = function(piece, firstRow, firstCol, endingRow, endingCol){
    var middleRow = this.findMiddleRow(firstRow, endingRow);
    var middleCol = this.findMiddleCol(firstCol, endingCol);
    return this.isNextRow(firstRow, middleRow, piece) && this.isOpponent(piece, middleRow, middleCol)
  };

   this.isOpponent = function(piece, row, col){
    var jumpedPiece = $("#"+row+"_"+col).children();
    if (jumpedPiece.length < 1){
      return false;
    } else if ($(piece.hasClass("red")) && jumpedPiece.hasClass("black")) {
        return true;
    } else if ($(piece.hasClass("black")) && jumpedPiece.hasClass("red")){
        return true;
    } else {
        return false;
        }
    };

  this.isValidJump = function(firstRow, firstCol, endingRow, endingCol, piece){
    return (this.isJumpToSquareOpen(endingRow, endingCol) && this.isOpponentOnJumpOverSquare(piece, firstRow, firstCol, endingRow, endingCol) && this.isValidSquare(endingRow, endingCol) && this.isTwoRows(firstRow, endingRow, piece));
  };

  this.isJump = function(endingRow, firstRow){
    return (Math.abs(endingRow - firstRow) === 2);
  };

  this.findMiddleRow = function(firstRow, endingRow){
    var middleRow;
    if (firstRow + 1 === endingRow - 1) {
        middleRow = firstRow + 1;
    } else if (firstRow - 1 === endingRow + 1){
        middleRow = firstRow - 1;
    }
    return middleRow;
  };

  this.findMiddleCol = function(firstCol, endingCol){
    var middleCol;
    if (firstCol + 1 === endingCol - 1){
        middleCol = firstCol + 1;
    } else if (firstCol - 1 === endingCol + 1){
        middleCol = firstCol - 1;
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
    if (!this.isKing(piece)){
        if (this.isRed(piece)){
            return endingRow === firstRow + 1;
        } else {
            return endingRow === firstRow - 1;
        }
    } else if(this.isKing(piece)){
        return Math.abs(endingRow - firstRow) === 1;
    } else {
        return false;
    }
  };

  this.isTwoRows = function(firstRow, endingRow, piece){
    if (!this.isKing(piece)){
        if(this.isRed(piece)){
            return endingRow === firstRow + 2;
        } else {
            return endingRow === firstRow - 2;
        }
    } else if(this.isKing(piece)){
        return Math.abs(endingRow - firstRow) === 2;
    }
  };

    this.isValidSquare = function(row, col){
    return this.isEven(row) && this.isEven(col) || !this.isEven(row) && !this.isEven(col);
  };

   this.isEven = function(x){
    return x % 2 === 0;
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
    for (var row = 0; row < 8; row++){
      for (var col = 0; col < 8; col++){
        var squareColor;
        if (gameLogic.isValidSquare(row, col)){
          squareColor = "black";
        } else {
          squareColor = "red";
        }
        new Square(squareColor, row, col);
      }
    }
  };
}





function CheckerPiece(color, startSquare){
  var square = new Square();

  this.color = color;
  this.rank = "Checker";
  this.startSquare = $(startSquare);
  var self = this;
  this.colorEl = (function(piece){
    var newPiece = $('<img src="images/'+self.color+ 'Checker.jpg" class="'+self.color+ ' checker new_piece"/>');
    $(self.startSquare).append(newPiece);
    return newPiece;
  })(self);

  this.colorEl.on("click", function(event){
    event.stopPropagation();
    if ($(this).hasClass(gameLogic.whoseTurn)){
        $(".selected").removeClass("selected");
        $(this).addClass("selected");
    }
  });
}



function Square(color, row, col){
  this.color = color;
  this.el = (function(square){
    var newSquare = $('<div class="square ' + square.color + '" data-col="' + col + '" data-row="' + row + '" id="' + row + '_' + col + '"></div>');
    $("#checkerboard").append(newSquare);
    return newSquare
  })(this);

  this.el.on("click", $.proxy( function(){
    var pieceRow = $(".selected").parent().data("row");
    var pieceCol = $(".selected").parent().data("col");
    var currentPiece = $(".selected");
    var endingPieceRow = $(this.el).data("row");
    var endingPieceCol = $(this.el).data("col");
    this.move(pieceRow, pieceCol, endingPieceRow, endingPieceCol, currentPiece);
  }, this));

  this.move = function(firstRow, firstCol, endingRow, endingCol, piece){
    if (gameLogic.isValidMove(firstRow, firstCol, endingRow, endingCol, piece) || gameLogic.isValidJump(firstRow, firstCol, endingRow, endingCol, piece)){
        if (gameLogic.isJump(endingRow, firstRow)){
          var middleRow = gameLogic.findMiddleRow(firstRow, endingRow);
          var middleCol = gameLogic.findMiddleCol(firstCol, endingCol);
          var pieceToJumpOver = $("#"+middleRow+"_"+middleCol).children();
            this.relocatePiece(firstRow, firstCol, endingRow, endingCol, piece);
            gameLogic.removeJumpedPiece(pieceToJumpOver[0]);
            $("#end_turn").removeClass("hidden");
            if ($(pieceToJumpOver).hasClass("red")){
              $("#end_turn").addClass("black-button");
            } else if ($(pieceToJumpOver).hasClass("black")){
              $("#end_turn").addClass("red-button");
            }
            gameLogic.jumped = true;
        } else if (!gameLogic.jumped) {
            this.relocatePiece(firstRow, firstCol, endingRow, endingCol, piece);
            $(".selected").removeClass("selected");
            gameLogic.switchTurn();
        }

        if ($(".red.checker").length === 0){
            gameLogic.blackWin();
            gameLogic.resetGame();
            gameLogic.scoreCount();
        } else if ($(".black.checker").length === 0){
            gameLogic.redWin();
            gameLogic.resetGame();
            gameLogic.scoreCount();
        }

    }
    return true;
  };


  this.relocatePiece = function(firstRow, firstCol, endingRow, endingCol, piece) {
    this.checkForPromotion(endingRow, endingCol, piece);
    this.setSquare(endingRow, endingCol, piece);
  return piece;
  };

  this.checkForPromotion = function(endingRow, endingCol, piece){
    if (endingRow === 7 && gameLogic.isRed(piece)){
        $(piece).addClass("king");
   } else if (endingRow === 0 && gameLogic.isBlack(piece)){
        $(piece).addClass("king");
   } return piece;
  };

  this.isPieceTurn = function(){
    return ((gameLogic.isRed(piece) && whoseTurn === 0) || (gameLogic.isBlack(piece) && whoseTurn === 1));
  };


  this.setSquare = function(row, col, piece) {
    var targetSquare = $("#" + row + '_' + col);
      if (gameLogic.isValidSquare && piece !== null){
          targetSquare.append(piece);
      } else {
          targetSquare.html(null);
      }
  };


  this.setColor = function(piece){
    if (gameLogic.isRed(piece)){
        return "red";
    } else if (gameLogic.isBlack(piece)){
        return "black";
    } else {
        return null;
    }
  };

  this.setRank = function(piece){
    if (this.rank === "King"){
        return "King";
    } else if (this.rank === "Checker"){
        return "Checker";
    } else {
        return null;
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

$(document).ready(function() {
    newBoard.initializeBoard();
     $("#end_turn").on("click", function(){
        ($(this).addClass("hidden").removeClass("red-button").removeClass("black-button"));
        gameLogic.switchTurn();
    });

     $("#restart").on("click", function(){
        $("#checkerboard").children().remove();
        newBoard.initializeBoard();
        gameLogic.jumped = false;
        gameLogic.whoseTurn = "red";
        gameLogic.resetCounter();
        $("#end_turn").addClass("hidden");
     });
});

//Clean up code (comment out code not being used until absolutely sure they aren't being used)
//Add comments to methods explaining what they do

//Giphy cat fail
//Login

//var giphyAPI = whatever the number is
//use API key locally only, or on heroku; do not commit it to github
