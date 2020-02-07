$(document).ready(function () {
  $('.animate-fade-in').each( function(i){
    var fadeLocation = $(this).offset().top + 0.25*($(window).height());
    var windowBottom = $(window).scrollTop() + $(window).height();
    /* If the object is visible in the window, fade in */
    if( windowBottom > fadeLocation ){
      $(this).delay(150).animate({'opacity':'1'},600);
    }
  });
  $('.trigger').click(function () {
    var stage = $(this).attr('stage');
    var path = $(this).attr('path');
    advanceStage(stage, path);
  });
});

function preLoad(num, path) {
  console.log(num + " " + path);
  var chosenPath = path;
  $('.stage .option').css('display','none');
  $('.stage .option[path-option=' + chosenPath ).css('display','inline');
}

function advanceStage(num , path) {
  var newNumber = num;
  var chosenPath = path;
  $('.visible').removeClass('visible');
  preLoad(newNumber , chosenPath);
  $('.stage-' + newNumber).addClass('visible');
}
