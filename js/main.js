
var checkerboard = [[null, null, null, null, null, null, null, null],
                    [null, null, null, null, null, null, null, null],
                    [null, null, null, null, null, null, null, null],
                    [null, null, null, null, null, null, null, null],
                    [null, null, null, null, null, null, null, null],
                    [null, null, null, null, null, null, null, null],
                    [null, null, null, null, null, null, null, null],
                    [null, null, null, null, null, null, null, null]];

var Game = function(){
 this.resetGame = function(){
  $("#end_turn").addClass("hidden");
    setTimeout(function(){
        initializeBoard();
        resetCounter();
    }, 2000);
    whoseTurn = 0;
    jumped = false;
  }
}

var Board = function(){
  this.initializeBoard = function (){
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
  };
  this.drawBoard = function(){
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
  };
}

