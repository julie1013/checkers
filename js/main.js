
var checkerboard = [[null, null, null, null, null, null, null, null],
                    [null, null, null, null, null, null, null, null],
                    [null, null, null, null, null, null, null, null],
                    [null, null, null, null, null, null, null, null],
                    [null, null, null, null, null, null, null, null],
                    [null, null, null, null, null, null, null, null],
                    [null, null, null, null, null, null, null, null],
                    [null, null, null, null, null, null, null, null]];

// var countR = 12;
// var countB = 12;

var newBoard = new Board();

function Rules(){

  this.jumped = false;
  this.whoseTurn = "red";


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

var gameRules = new Rules();

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
    if (this.redWin(countR)){
        $("#redScore").html(redScoreCount);
    } else if (this.blackWin(countB)){
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
        var squareColor;
        if (gameRules.isValidSquare(row, col)){
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
    if ($(this).hasClass(gameRules.whoseTurn)){
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
    if (gameRules.isValidMove(firstRow, firstCol, endingRow, endingCol, piece) || gameRules.isValidJump(firstRow, firstCol, endingRow, endingCol, piece)){
        if (gameRules.isJump(endingRow, firstRow)){
          var middleRow = gameRules.findMiddleRow(firstRow, endingRow);
          var middleCol = gameRules.findMiddleCol(firstCol, endingCol);
          var pieceToJumpOver = $("#"+middleRow+"_"+middleCol).children();
          this.relocatePiece(firstRow, firstCol, endingRow, endingCol, piece);
          gameRules.removeJumpedPiece(pieceToJumpOver[0]);
            // if ($(pieceToJumpOver).hasClass("red")){

            //     $("#end_turn").removeClass("hidden").css("background", "black").css("color", "white").css("margin-right", "400px").css("margin-left", "-540px").css("float", "right");
            // } else if ($(pieceToJumpOver).hasClass("black")){
            //     $("#end_turn").removeClass("hidden").css("background", "red").css("color", "black").css("margin-left", "400px").css("margin-right", "-540px").css("float", "left");
            // }
            $("#end_turn").removeClass("hidden");
            gameRules.jumped = true;
        } else if (!gameRules.jumped) {
            this.relocatePiece(firstRow, firstCol, endingRow, endingCol, piece);
            $(".selected").removeClass("selected");
            gameRules.switchTurn();
        }

        if ($(".red.checker").length === 0){
            gameRules.blackWin();
            $("#blackScore > .score").html(blackScoreCount);
            resetGame();
        } else if ($(".black.checker").length === 0){
            gameRules.redWin();
            $("#redScore > .score").html(redScoreCount);
             resetGame();
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
    if (endingRow === 7 && gameRules.isRed(piece)){
        piece.addClass("king");
   } else if (endingRow === 0 && gameRules.isBlack(piece)){
        piece.addClass("king");
   } return piece;
  };//new change, not sure about this

  this.isPieceTurn = function(){
    return ((gameRules.isRed(piece) && whoseTurn === 0) || (gameRules.isBlack(piece) && whoseTurn === 1));
  };


  this.setSquare = function(row, col, piece) {
    var targetSquare = $("#" + row + '_' + col);
      if (gameRules.isValidSquare && piece !== null){
          targetSquare.append(piece);
      } else {
          targetSquare.html(null);
      }
  };


  this.setColor = function(piece){
    if (gameRules.isRed(piece)){
        return "red";
    } else if (gameRules.isBlack(piece)){
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

  this.getPieceAt = function(row, col){
   return checkerboard[row][col];
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
    var myGame = new Game();
    newBoard.initializeBoard();
     $("#end_turn").on("click", function(){
        ($(this).addClass("hidden"))
        gameRules.switchTurn();
    });

     $("#restart").on("click", function(){
        $("#checkerboard").children().remove();
        newBoard.initializeBoard();
        gameRules.jumped = false;
        gameRules.whoseTurn = "red";
        myGame.resetCounter();
        $("#end_turn").addClass("hidden");
     });
});
