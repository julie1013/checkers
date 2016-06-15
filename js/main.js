var newBoard = new Board();
var gameLogic = new Logic();
//instantiate new Board and new Logic objects

function Logic(){

  this.jumped = false;
  this.whoseTurn = "red";
  this.score = {
    red: 0,
    black: 0
  };
  //initalize jumped to false
  //initialize whoseturn to red
  //create score object with red and black set at 0

  //Fix so that this function runs on start AND ONLY after previous game ends:
   this.resetGame = function(){
    $("#end_turn").addClass("hidden");
    // $(".video").removeClass("not-hidden").addClass("hidden");
    $("#checkerboard").children().remove();
    newBoard.initializeBoard();
    gameLogic.whoseTurn = "red";
    gameLogic.jumped = false;

  };
  //hide "end turn" button
  //remove checkerboard and pieces
  //set up the checkerboard
  //initialize turn to red
  //initialize jumped to false
  //Resets the game, also resets turn and resets jumped to false

  this.scoreCount = function(){
    $("#redScore > .score").html(gameLogic.score.red);
    $("#blackScore > .score").html(gameLogic.score.black);
  };
  //Updates HTML with scores for red and black players

  this.redWin = function(){
    this.score.red++;
    $("#redScore > .video").removeClass("hidden").addClass("not-hidden");
    Prize.getCatFail();
  };
  //Increases count of red wins

  this.blackWin = function(){
    this.score.black++;
    $("#redScore > .video").removeClass("hidden").addClass("not-hidden");
    Prize.getCatFail();
  };
  //Increases count of black wins


  this.switchTurn = function() {
    if (this.whoseTurn === "black") {
      this.whoseTurn = "red";
    } else {
      this.whoseTurn = "black";
    }
    this.jumped = false;
    $(".selected").removeClass("selected");
  };
  //switches between red and black's turn; jumped is reset to false

  this.isKing = function(piece){
    return (piece.hasClass("king"));
  };
  //Checks if piece in question is king

  this.isRed = function(piece){
    return (piece.hasClass("red"));
  };
  //Checks if piece in question is red

  this.isBlack = function(piece){
    return (piece.hasClass("black"));
  };
  //Checks if piece in question is black

  this.isValidMove = function(firstRow, firstCol, endingRow, endingCol, piece){
    if (!(this.isValidSquare(firstRow, firstCol) && this.isValidSquare(endingRow, endingCol))){
        return false;
    } else if (this.isNextRow(firstRow, endingRow, piece) && this.isAdjacentSpace(firstRow, firstCol, endingRow, endingCol)){
        return true;
    } else {
        return false;
    }
  };
  //If the attempted non-jump move is not to or from a valid square, return false
  //Check if attempted non-jump move is going to the next row and to adjacent space

  this.removeJumpedPiece = function(piece){
    $(piece).remove();
  }
  //Removes the piece player just jumped over

  this.isJumpToSquareOpen = function(endingRow, endingCol){
    var jumpToSquare = $("#"+endingRow+"_"+endingCol).children();
    return jumpToSquare.length < 1;
  };
  //Stores square being jumped to in a variable (square's children- the checker)
  //If there is no checker there, return true

  this.isOpponentOnJumpOverSquare = function(piece, firstRow, firstCol, endingRow, endingCol){
    var middleRow = this.findMiddleRow(firstRow, endingRow);
    var middleCol = this.findMiddleCol(firstCol, endingCol);
    return this.isNextRow(firstRow, middleRow, piece) && this.isOpponent(piece, middleRow, middleCol)
  };
  //Stores coordinates for space being jumped over in a variable
  //Returns true if the space in question is one row away and if there is an opponent on the space one row and one column away

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
    //Store piece to be jumped over into a variable. If there are no pieces to jump over, return false.
    //If player is red and piece to jump over is black (or vice-versa), return true
    //If none of these conditions are met, return false

  this.isValidJump = function(firstRow, firstCol, endingRow, endingCol, piece){
    return (this.isJumpToSquareOpen(endingRow, endingCol) && this.isOpponentOnJumpOverSquare(piece, firstRow, firstCol, endingRow, endingCol) && this.isValidSquare(endingRow, endingCol) && this.isTwoRows(firstRow, endingRow, piece));
  };
  //If the square to jump to is open and if the opponent is on a jump-over square, and if the square in question is one that is playable (black), and if the square to jump to is two rows away, return true

  this.isJump = function(endingRow, firstRow){
    return (Math.abs(endingRow - firstRow) === 2);
  };
  //Checks to see if attempted move in question is a jump

  this.findMiddleRow = function(firstRow, endingRow){
    var middleRow;
    if (firstRow + 1 === endingRow - 1) {
        middleRow = firstRow + 1;
    } else if (firstRow - 1 === endingRow + 1){
        middleRow = firstRow - 1;
    }
    return middleRow;
  };
  //Finds coordinates of middle row

  this.findMiddleCol = function(firstCol, endingCol){
    var middleCol;
    if (firstCol + 1 === endingCol - 1){
        middleCol = firstCol + 1;
    } else if (firstCol - 1 === endingCol + 1){
        middleCol = firstCol - 1;
    }
    return middleCol;
  };
  //Finds coordinates of middle column


  this.isAdjacentSpace = function(firstRow, firstCol, endingRow, endingCol){
    return Math.abs(endingCol - firstCol) === 1;
  };
  //Checks to see if space in question is adjacent to space player is starting on

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
  //Checks to see if a particular space is two rows away from starting space

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
  //Checks to see if a particular space is one row away

    this.isValidSquare = function(row, col){
    return this.isEven(row) && this.isEven(col) || !this.isEven(row) && !this.isEven(col);
  };
  //Returns squares that player can move to

   this.isEven = function(x){
    return x % 2 === 0;
  };
  //Checks to see if argument is even


}



function Board(){
  this.initializeBoard = function (){
    this.drawBoard();
    this.addPieces();
  };
  //Sets up the game by drawing the board and adding the pieces

  this.addPieces = function(){
    var playableSquare = $(".black");
    //creates an array of black squares
    for (var i = 0; i < playableSquare.length; i++){
      if ($(playableSquare[i]).data("row") < 3){
          new CheckerPiece("red", $(playableSquare[i]));
      } else if ($(playableSquare[i]).data("row") > 4){
          new CheckerPiece("black", $(playableSquare[i]));
      }
    }
  };
  //Method adds pieces to the board
  //If the playable square is in a row less than 3, place red pieces there
  //If the playable square is in a row greater than 4, place black pieces there

  this.drawBoard = function(){
    for (var row = 0; row < 8; row++){
      for (var col = 0; col < 8; col++){
        var squareColor;
        if (gameLogic.isValidSquare(row, col)){
          squareColor = "black";
        } else {
          squareColor = "red";
        }
        new Moves(squareColor, row, col);
      }
    }
  };
}
//Method draws the checkerboard via a nested array. If the square is "valid" (playable), the square color is black. Otherwise, the square color is red.





function CheckerPiece(color, startSquare){
  var gameMoves = new Moves();
  //Instantiate new Moves object
  this.color = color;
  this.startSquare = $(startSquare);
  var self = this;
  //makes this continue to reference CheckerPiece object, stored in variable self
  this.colorEl = (function(piece){
    var newPiece = $('<img src="images/'+self.color+ 'Checker.jpg" class="'+self.color+ ' checker new_piece"/>');
    $(self.startSquare).append(newPiece);
    return newPiece;
  })(self);
  //IIFE Creates checker and appends it to the square via colorEl method

  this.colorEl.on("click", function(event){
    event.stopPropagation();
    if ($(this).hasClass(gameLogic.whoseTurn)){
        $(".selected").removeClass("selected");
        $(this).addClass("selected");
    }
  });
  //Click event removes "selected" class from any selected checker and adds it to the checker that has been clicked on
}



function Moves(color, row, col){
  this.color = color;
  this.el = (function(square){
    var newSquare = $('<div class="square ' + square.color + '" data-col="' + col + '" data-row="' + row + '" id="' + row + '_' + col + '"></div>');
    $("#checkerboard").append(newSquare);
    return newSquare
  })(this);
  //IIFE Creates square elements

  this.el.on("click", $.proxy( function(){
    var pieceRow = $(".selected").parent().data("row");
    var pieceCol = $(".selected").parent().data("col");
    var currentPiece = $(".selected");
    var endingPieceRow = $(this.el).data("row");
    var endingPieceCol = $(this.el).data("col");
    this.move(pieceRow, pieceCol, endingPieceRow, endingPieceCol, currentPiece);
  }, this));
  //sets up click handler for checkers

  this.move = function(firstRow, firstCol, endingRow, endingCol, piece){
    if (gameLogic.isValidMove(firstRow, firstCol, endingRow, endingCol, piece) || gameLogic.isValidJump(firstRow, firstCol, endingRow, endingCol, piece)){
      //checks if attempted action is a valid regular move or a valid jump move
        if (gameLogic.isJump(endingRow, firstRow)){
          var middleRow = gameLogic.findMiddleRow(firstRow, endingRow);
          var middleCol = gameLogic.findMiddleCol(firstCol, endingCol);
          //finds middle row and middle column and stores them in a variable
          var pieceToJumpOver = $("#"+middleRow+"_"+middleCol).children();
          //stores piece to jump over in a variable
            this.relocatePiece(firstRow, firstCol, endingRow, endingCol, piece);
            //execute jump
            gameLogic.removeJumpedPiece(pieceToJumpOver[0]);
            //remove piece jumped over
            $("#end_turn").removeClass("hidden");
            //End turn button appears
            if ($(pieceToJumpOver).hasClass("red")){
              $("#end_turn").addClass("black-button");
            } else if ($(pieceToJumpOver).hasClass("black")){
              $("#end_turn").addClass("red-button");
            }
            //End turn button is black or red depending on who has moved
            gameLogic.jumped = true;
            //Jump is marked as having occurred, and thus player's turn isn't over
        } else if (!gameLogic.jumped) {
            this.relocatePiece(firstRow, firstCol, endingRow, endingCol, piece);
            $(".selected").removeClass("selected");
            gameLogic.switchTurn();
            //If a jump hasn't occurred, player's turn is open
        }

        if ($(".red.checker").length === 0){
            gameLogic.blackWin();
            gameLogic.resetGame();
            gameLogic.scoreCount();
            //If there are no more red checkers, black wins
        } else if ($(".black.checker").length === 0){
            gameLogic.redWin();
            gameLogic.resetGame();
            gameLogic.scoreCount();
            //If there are no more black checkers, red wins
        }

    }
    return true;
  };


  this.relocatePiece = function(firstRow, firstCol, endingRow, endingCol, piece) {
    this.checkForPromotion(endingRow, endingCol, piece);
    this.setSquare(endingRow, endingCol, piece);
  return piece;
  };
  //Relocates piece; is called in the "move" function

  this.checkForPromotion = function(endingRow, endingCol, piece){
    if (endingRow === 7 && gameLogic.isRed(piece)){
        $(piece).addClass("king");
   } else if (endingRow === 0 && gameLogic.isBlack(piece)){
        $(piece).addClass("king");
   } return piece;
  };
  //Checks if a checker is kinged

  this.setSquare = function(row, col, piece) {
    var targetSquare = $("#" + row + '_' + col);
      if (gameLogic.isValidSquare && piece !== null){
          targetSquare.append(piece);
      } else {
          targetSquare.html(null);
      }
  };
}
//Places checker on a square

$(document).ready(function() {
    newBoard.initializeBoard();
    //Set up board and pieces
     $("#end_turn").on("click", function(){
        ($(this).addClass("hidden").removeClass("red-button").removeClass("black-button"));
        gameLogic.switchTurn();
        //When end turn button is clicked, it is hidden, and the game switches player turn
    });

     $("#restart").on("click", function(){
        $("#checkerboard").children().remove();
        newBoard.initializeBoard();
        gameLogic.jumped = false;
        gameLogic.whoseTurn = "red";
        $("#end_turn").addClass("hidden");
     });
     //Game restarts: the checkerboard and its children are removed, jumped is reset to false, turn is initialized to red, end turn button hidden
});

var giphyAPI = "dc6zaTOxFJmzC";
//public key
var Prize = {};

Prize.getCatFail = function(){
  var giphyURL = "http://api.giphy.com/v1/gifs/random";
  $.ajax({
    type: "GET",
    url: giphyURL,
    data: {
        api_key: giphyAPI,
        tag: "cat fail"
    },
    success: function(data){
      Prize.handleResponse(data);
    },
    error: function(){
      console.log("Error");
    }
  });
}

Prize.handleResponse = function(data) {
    var image = $("<img src= " + data.data.image_original_url+"/>");
    $(".video").attr("src", image);
  }

