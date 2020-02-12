$(document).ready(function () {
  $('.animate-fade-in').each( function(i){
    var fadeLocation = $(this).offset().top + 0.25*($(window).height());
    var windowBottom = $(window).scrollTop() + $(window).height();
    /* If the object is visible in the window, fade in */
    if ( windowBottom > fadeLocation ) {
      $(this).delay(150).animate({'opacity':'1'},600);
    }
  });
  $('.trigger').click(function () {
    var stage = $(this).attr('stage');
    var path = $(this).attr('path');
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
  $('#body-container').css('background-color','rgba(0,0,0,1)');
  $('body').css('background-image','none');
  preLoad(newNumber , chosenPath);
  setBackground(newNumber , chosenPath);
  setTimeout(function() {
    $('#body-container').css('background-color','rgba(0,0,0,0)');
  }, 2000);
  $('.stage-' + newNumber).addClass('visible');
}
