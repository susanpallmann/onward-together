$(document).ready(function () {
  /* I'm sorry, I really need a global variable, I know it's not cool :(. */
  userPath = [0,0,0,0,0];
  $('.animate-fade-in').each( function(i){
    var fadeLocation = $(this).offset().top + 0.25*($(window).height());
    var windowBottom = $(window).scrollTop() + $(window).height();
    /* If the object is visible in the window, fade in */
    if ( windowBottom > fadeLocation ) {
      $(this).delay(150).animate({'opacity':'1'},600);
    }
  });
  $('#submit-path').click(function () {
    readyPath();
  });
  $('.trigger').click(function () {
    var stage = $(this).attr('stage');
    var path = $(this).attr('path');
    var place = $(this).attr('place');
    var choice = $(this).attr('choice');
    editPath(place, choice);
    advanceStage(stage, path);
  });
  $('.alone').click(function () {
    $('.alternate-title').html('Alone');
  });
  $('.together').click(function () {
    $('.alternate-title').html('Together');
  });
});
function preLoad(num, path) {
  console.log(num + " " + path);
  var chosenPath = path;
  if (chosenPath === "A" || chosenPath === "B" || chosenPath === "C" || chosenPath === "D") {
    $('.stage-' + num + ' .option').css('display','none');
    $('.stage-' + num + ' .option[path-option=' + chosenPath + ']' ).css('display','inline');
  } else if (chosenPath === "O") {
    var randomNum = Math.floor(Math.random() * 2) + 1;
    var alone = $('.alternate-title').text() === "Alone";
    console.log(alone);
    if ( $('.alternate-title').text() === "Alone" ) {
      $('.stage-' + num + ' .option').css('display','none');
      $('.stage-' + num + ' .option[path-option=A]' ).css('display','inline');
    } else {
      $('.stage-' + num + ' .option').css('display','none');
      $('.stage-' + num + ' .option[path-option=B]' ).css('display','inline');
    }
    $('.stage-' + num + ' .random').css('display','none');
    $('.stage-' + num + ' .random[random-choice=' + randomNum + ']' ).css('display','inline');
    console.log("this ran and random choice is " + randomNum);
    if (userPath[0] === 0) {
      editPath(0, randomNum);
      console.log('the user path for slot 0 is being set to ' + randomNum);
    }
  }
}
function setBackground(num, path) {
  var newNumber = num;
  var chosenPath = path;
  if ( $('.stage-' + newNumber).hasClass('background-change') ) {
    console.log('if statement triggered');
    $('body').css('background-image','url("images/stage-' + newNumber + chosenPath + '.gif")');
  }
  console.log('setbackground function triggered');
}
function advanceStage(num , path) {
  var newNumber = num;
  var chosenPath = path;
  $('.visible').removeClass('visible');
  $('body').css('background-image','none');
  preLoad(newNumber , chosenPath);
  setBackground(newNumber , chosenPath);
  $('.stage-' + newNumber).addClass('visible');
}

// Edits the userPath variable with the choice made, filling in 1 of 5 digits.
function editPath (place, choice) {
  place = place;
  choice = choice;
  userPath[place] = choice;
}

// Puts the path together to form the full ID, then calls the newPath function when done.
function readyPath () {
  username = $('#username').val();
  id = userPath.join("");
  newPath( id , username );
}

// Submits the new path to the database.
function newPath( id , username ) {
  var values = {
    "username": "Anonymous",
    "timestamp": "Error"
  }
  var username = username;
  var id = id;
  var currentDate = new Date();
  var timestamp = currentDate.getTime();
  values.username = username;
  values.timestamp = timestamp;
  var pathRef = firebase.database().ref('paths/' + id + '/');
  var newChildRef = pathRef.push();
  var key = newChildRef.getKey();
  pathRef.child(key).setValue(username).push(values);
  });
}
