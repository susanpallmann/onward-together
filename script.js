$(document).ready(function () {
  $('.animate-fade-in').each( function(i){
    var fadeLocation = $(this).offset().top + 0.25*($(window).height());
    var windowBottom = $(window).scrollTop() + $(window).height();
    /* If the object is visible in the window, fade in */
    if( windowBottom > fadeLocation ){
      $(this).delay(150).animate({'opacity':'1'},600);
    }
  });
});