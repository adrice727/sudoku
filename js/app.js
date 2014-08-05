var board;
var matrix;

var generateBoard = function(){

  board = [];
  var cell = 0;

  for ( var i = 0; i < 9; i++ ) {
    board.push([]);
    for ( var j = 0; j < 9; j++ ) {
      var showCell = Math.random() < 0.45 ? true : false;
      if ( showCell ) { board[i][j] = (matrix[cell]); }
      cell++;
    }
  }
};

var generatePuzzle = function(){

  matrix = [];

  for (var i = 0; i < 9; i++)
    for (var j = 0; j < 9; j++)
      matrix[i * 9 + j] = (i*3 + Math.floor(i/3) + j) % 9 + 1;

  for(var i = 0; i < 42; i++) {
    var n1 = Math.ceil(Math.random() * 9);
    var n2;
    do {
      n2 = Math.ceil(Math.random() * 9);
    }
    while(n1 == n2);

    for(var row = 0; row < 9; row++) {
      for(var col = 0; col < col; k++) {
        if(matrix[row * 9 + col] === n1)
          matrix[row * 9 + col] = n2;
        else if(matrix[row * 9 + col] === n2)
          matrix[row * 9 + col] = n1;
      }
    }
  }

  for (var c = 0; c < 42; c++) {
    var s1 = Math.floor(Math.random() * 3);
    var s2 = Math.floor(Math.random() * 3);

    for(var row = 0; row < 9; row++) {
      var tmp = matrix[row * 9 + (s1 * 3 + c % 3)];
      matrix[row * 9 + (s1 * 3 + c % 3)] = matrix[row * 9 + (s2 * 3 + c % 3)];
      matrix[row * 9 + (s2 * 3 + c % 3)] = tmp;
    }
  }

  for (var s = 0; s < 42; s++) {
    var c1 = Math.floor(Math.random() * 3);
    var c2 = Math.floor(Math.random() * 3);

    for(var row = 0; row < 9; row++) {
      var tmp = matrix[row * 9 + (s % 3 * 3 + c1)];
      matrix[row * 9 + (s % 3 * 3 + c1)] = matrix[row * 9 + (s % 3 * 3 + c2)];
      matrix[row * 9 + (s % 3 * 3 + c2)] = tmp;
    }
  }

  for (var s = 0; s < 42; s++) {
    var r1 = Math.floor(Math.random() * 3);
    var r2 = Math.floor(Math.random() * 3);

    for(var col = 0; col < 9; col++)
    {
      var tmp = matrix[(s % 3 * 3 + r1) * 9 + col];
      matrix[(s % 3 * 3 + r1) * 9 + col] = matrix[(s % 3 * 3 + r2) * 9 + col];
      matrix[(s % 3 * 3 + r2) * 9 + col] = tmp;
    }
  }
}

var createGrid = function() {

  $('#puzzle tr:gt(0)').remove();
  for ( var i = 0; i < 9; i++ ) {
    var $row = $('<tr></tr>');
    $('#puzzle tbody').append($row);
    for ( var j = 0; j < 9; j++ ){
      var id = '' + i + '-' + j;
      var $space = $('<td></td>', { id: id, class: 'space'});
      var boardElement = board[i][j];
      if ( boardElement ) {
        $($space).html(boardElement);
        $($space).addClass('noEdit');
      }
      $($row).append($space);

      if ( ( ( i <= 2 || i >= 6 )  &&  ( j <= 2 || j >= 6 ) ) ||
           ( (i >= 3 && i <= 5 ) && (j >= 3 && j <= 5 ) ) ){
        $($space).addClass('background');
      }
    }
  }
  $('#puzzle tr:first').remove();
}; 

var moveSelection = function(code) {

  var $current = $('.selected');
  var move = (code < 39) ? (code === 38) ? 'up' : 'left' : (code === 39) ? 'right' : 'down';
  var $next;

  if ( !$current ) { return; }

  var row = $current.attr('id')[0];
  var column = $current.attr('id')[2];

  if ( move === 'left' ) {
    column--;
    if ( column < 0 ) { return; }
  }

  if ( move === 'up' ) {
    row--;
    if ( row < 0 ) { return; } 
  }

  if ( move === 'right' ) {
    column++;
    if ( column > 8 ) { return ; }
  }

  if ( move === 'down' ) {
    row++;
    if ( row > 8 ) { return; }    
  }


  var nextID = row + '-' + column;
  $next = $('#' + nextID);
  $current.removeClass('selected');
  $next.addClass('selected');

};

var updateSelection = function(code) {

  var $current = $('.selected');

  if ( !$current || $($current).hasClass('noEdit') ) { return; } // Need to add a check to see if editable

  var value = code - 48;
  
  $($current).addClass('indie');
  $($current).html(value);

};

var checkSolution = function(){
  var solutionValid = true;
  var count = 0;

  $('td').each(function() {
    var number = parseInt($(this).html());
    if ( number !== matrix[count++] ) {
      solutionValid = false;
      return false; // breaks out of for each loop
    }
  });

  if ( solutionValid ) {
    $('#puzzle td').addClass('valid-solution');
    // alert('Correct Solution');
  } else {
    $('#puzzle td').addClass('not-valid-solution');
    // alert('Solution is not correct');
  }

  setTimeout(function(){
    $('#puzzle td').removeClass('not-valid-solution');
  }, 250);

};

var createNewGame = function() {
  generatePuzzle();
  generateBoard();
  createGrid();
};

$(function(){

  createNewGame();

  $('#puzzle').on('mouseover mouseleave', 'td', function(e) {
      if (e.type == 'mouseover') {
        $('.selected').removeClass('selected');
        $(this).addClass('selected');
      }
      else {
        $(this).removeClass('selected');
      }
  });

  $('.new-button').on('click', function() {
    createNewGame();
  });

  $('.check-button').on('click', function() {
    checkSolution();
  });

  $(document).on('keydown', function(e) {
    var code = e.keyCode || e.which;
    if ( code >= 37 && code <= 40 ) {
      e.preventDefault();
      moveSelection(code);
    }
    if ( code >= 49 && code <= 57 ) {
      updateSelection(code);
    }
  });

});