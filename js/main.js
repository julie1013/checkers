
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

function Game(){
 this.resetGame = function(){
  $("#end_turn").addClass("hidden");
    setTimeout(function(){
        initializeBoard();
        resetCounter();
    }, 2000);
    whoseTurn = 0;
    jumped = false;
  };//OK

  this.resetCounter = function(){
    countR = 12;
    countB = 12;
  };//OK

  this.scoreCount = function() {
    if (this.redWin(countR)){
        $("#redScore").html(redScoreCount);
    } else if (this.blackWin(countB)){
        $("#blackScore").html(blackScoreCount);
    }//new change
  };

  this.redWin = function(){
    redScoreCount++;
    return redScoreCount;
  };//OK

  this.blackWin = function(){
    blackScoreCount++;
    return blackScoreCount;
  };//OK

  this.resetGame = function(){
    $("#end_turn").addClass("hidden");
    setTimeout(function(){
        initializeBoard();
        resetCounter();
    }, 2000);
    whoseTurn = 0;
    jumped = false;
  };//OK

  this.switchTurn = function() {
  if (whoseTurn === 1) {
    whoseTurn = 0;
  } else {
    whoseTurn = 1;
  }
  jumped = false;
  };
}//OK




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
        if (this.isValidSquare(row, col)){
          squareColor = "black";
        } else {
          squareColor = "red";
        }
        new Square(squareColor, row, col);
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
  };//OK

  this.findMiddleCol = function(firstCol, endingCol){
    if (firstCol + 1 === endingCol - 1){
        middleCol = firstCol + 1;
    } else if (firstCol - 1 === endingCol + 1){
        middleCol = firstCol - 1;
    } else {
        return false;
    }
    return middleCol;
  };//OK

  this.isAdjacentSpace = function(firstRow, firstCol, endingRow, endingCol){
    return Math.abs(endingCol - firstCol) === 1;
  };//OK

  this.isTwoColumns = function(firstCol, endingCol){
    return Math.abs(endingCol - firstCol) === 2;
  };//OK

  this.isNextRow = function(firstRow, endingRow, piece){
    if (!checker.isKing(piece)){
        if (checker.isRed(piece)){
            return endingRow === firstRow + 1;
        } else {
            return endingRow === firstRow - 1;
        }
    } else if(checker.isKing(piece)){
        return Math.abs(endingRow - firstRow) === 1;
    } else {
        return false;
    }//new change
  };

  this.isTwoRows = function(firstRow, endingRow, piece){
    if (!checker.isKing(piece)){
        if(checker.isRed(piece)){
            return endingRow === firstRow + 2;
        } else {
            return endingRow === firstRow - 2;
        }
    } else if(checker.isKing(piece)){
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





function CheckerPiece(color, startSquare){
  var square = new Square();

  this.color = color;
  this.rank = "Checker";
  this.startSquare = $(startSquare);
  var self = this;
  this.colorEl = (function(piece){
    var newPiece = $('<img src="images/'+self.color+self.rank+'.jpg" class="'+self.color+self.rank+' new_piece"/>');
    $(self.startSquare).append(newPiece);
    return newPiece;
  })(self);

  this.colorEl.on("click", function(event){
    event.stopPropagation();
    console.log("hi");
    // var pieceRow = $(this).parent().data("row");
    // var pieceCol = $(this).parent().data("col");
    // var clickedPiece;
    //   $(".selected").removeClass("selected");
    //   $(this).addClass("selected");
      // if ($(this).find(".blackKing").length !==0 && whoseTurn == 1){
      //       piece = "King";
      //   } else if ($(this).find(".redKing").length !==0 && whoseTurn == 0){
      //       piece = "King";
      //   } else if ($(this).find(".redChecker").length !==0 && whoseTurn == 0){
      //       piece = "Checker";
      //   } else if ($(this).find(".blackChecker").length !==0 && whoseTurn == 1){
      //       piece = "Checker";
      //   };
  });

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
            if (checkerboard[middleRow][middleCol] === "Checker" || checkerboard[middleRow][middleCol] === "King"){
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
    if (endingRow === 7 && this.isRed(piece)){
        this.rank = "King";
   } else if (endingRow === 0 && isBlack(piece)){
        this.rank = "King";
   } return piece;
  };//new change, not sure about this

  this.isPieceTurn = function(){
    return ((this.isRed(piece) && whoseTurn === 0) || (this.isBlack(piece) && whoseTurn === 1));
  };

  this.isRed = function(piece){
    return (this.color === "red");
  };

  this.isBlack = function(piece){
    return (this.color === "black");
  };

  this.isKing = function(piece){
    return (this.rank === "King");
  };

  this.isValidJump = function(firstRow, firstCol, endingRow, endingCol, piece){
    return (newBoard.isJumpToSquareOpen(firstRow, firstCol, endingRow, endingCol) && this.isOpponentOnJumpOverSquare(piece, firstRow, firstCol, endingRow, endingCol) && newBoard.isValidSquare(endingRow, endingCol) && newBoard.isTwoRows(firstRow, endingRow, piece));
  };//new change

  this.isJump = function(endingRow, firstRow){
    return (Math.abs(endingRow - firstRow) === 2);
  };//OK

  this.isOpponent = function(piece, row, col){
    if (checkerboard[row][col] === null) {
        return false;
    } else if (this.color === "red" && checkerboard[row][col] === "black") {
        return true;
    } else if (this.color === "black" && checkerboard[row][col] === "red"){
        return true;
    } else {
        return false;
        }
    };//new change

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
    if (this.rank === "King"){
        return "King";
    } else if (this.rank === "Checker"){
        return "Checker";
    } else {
        return null;
    }//new change
  };

  this.getPieceAt = function(row, col){
   return checkerboard[row][col];
  };//OK

  this.isValidMove = function(firstRow, firstCol, endingRow, endingCol){
    var validSquare = new Square();
    piece = checkerboard[firstRow][firstCol];
    if (!(validSquare.isValidSquare(firstRow, firstCol) && validSquare.isValidSquare(endingRow, endingCol))){
        return false;
    } else if (newBoard.isNextRow(firstRow, endingRow, piece) && newBoard.isAdjacentSpace(firstRow, firstCol, endingRow, endingCol)){
        return true;
    } else {
        return false;
    }
  };//new change

  //elt is DOM node; piece is type of piece, data type is string
  this.selectPiece = function(elt, piece) {
    $(elt).addClass("selected");
    $(elt).siblings().removeClass("selected");

    return piece;
  };//OK

  this.isActivePiece = function(pieceRow, pieceCol) {
    if (jumped) {
      return pieceRow === activePieceCoords["row"] && pieceCol === activePieceCoords["col"];
    } else {
      return true;
    }
  };
}//OK



function Square(color, row, col){
  this.color = color;
    this.el = (function(square){
    var newSquare = $('<div class="piece ' + square.color + '" data-col="' + col + '" data-row="' + row + '" id="' + row + '_' + col + '"></div>');
    $("#checkerboard").append(newSquare);
    return newSquare
  })(this);

  this.el.on("click", function(){
    console.log("hi");
  });

  this.isJumpToSquareOpen = function(firstRow, firstCol, endingRow, endingCol){
    return (checkerboard[endingRow][endingCol] === null);
  };

  this.isOpponentOnJumpOverSquare = function(piece, firstRow, firstCol, endingRow, endingCol){
    newBoard.findMiddleRow(firstRow, endingRow);
    newBoard.findMiddleCol(firstCol, endingCol);
    return newBoard.isNextRow(firstRow, middleRow, piece) && identifyOpponent.isOpponent(piece, middleRow, middleCol)
  };//new change
}

$(document).ready(function() {
    var myGame = new Game();
    var newBoard = new Board();
    newBoard.initializeBoard();

    // // $("#checkerboard div").on("click", function(event){


        // if ($(this).find(".blackKing").length !==0 && whoseTurn == 1){
        //     piece = "King";
        // } else if ($(this).find(".redKing").length !==0 && whoseTurn == 0){
        //     piece = "King";
        // } else if ($(this).find(".redChecker").length !==0 && whoseTurn == 0){
        //     piece = "Checker";
        // } else if ($(this).find(".blackChecker").length !==0 && whoseTurn == 1){
        //     piece = "Checker";
        // }

    //     var endingPieceRow = $(this).data("row");
    //     var endingPieceCol = $(this).data("col");
    //     if (checkerboard[endingPieceRow][endingPieceCol] === null && clickedPiece.isPieceTurn() && clickedPiece.isActivePiece(pieceRow, pieceCol)){
    //       clickedPiece.move(pieceRow, pieceCol, endingPieceRow, endingPieceCol, piece);
    //     }
    // });
    //  $("#end_turn").on("click", function(){
    //     ($(this).addClass("hidden"))
    //     myGame.switchTurn();
    // });

    //  $("#restart").on("click", function(){
    //     newBoard.initializeBoard();
    //     jumped = false;
    //     whoseTurn = 0;
    //     myGame.resetCounter();
    //     $("#end_turn").addClass("hidden");
    //  });
});
