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
  $('.submit-path').click(function () {
    readyPath();
    gatherIds();
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
  inputPercent();
});
function preLoad(num, path) {
  console.log(num + " " + path);
  var chosenPath = path;
  if (chosenPath === "A" || chosenPath === "B" || chosenPath === "C" || chosenPath === "D") {
    $('.stage-' + num + ' .option').css('display','none');
    $('.stage-' + num + ' .option[path-option=' + chosenPath + ']' ).css('display','inline');
  } else if (chosenPath === "O") {
    var alone = $('.alternate-title').text() === "Alone";
    if ( $('.alternate-title').text() === "Alone" ) {
      $('.stage-' + num + ' .option').css('display','none');
      $('.stage-' + num + ' .option[path-option=A]' ).css('display','inline');
    } else {
      $('.stage-' + num + ' .option').css('display','none');
      $('.stage-' + num + ' .option[path-option=B]' ).css('display','inline');
    }
    $('.stage-' + num + ' .random').css('display','none');
    $('.stage-' + num + ' .random[random-choice=' + userPath[0] + ']' ).css('display','inline');

    if (userPath[0] === 0) {
      var randomNum = Math.floor(Math.random() * 2) + 1;
      editPath(0, randomNum);
      console.log("this ran and random choice is " + userPath[0]);
      console.log('the user path for slot 0 is being set to ' + randomNum);
    }
  }
}
function serverPreLoad (num, path) {
  var newNumber = num;
  var chosenPath = path;
  var newStage = $('.stage-' + newNumber);
  var stageRandoms = newStage.find('.server-random');
  stageRandoms.each(function( index ) {
    max = $(this).attr('random-max');
    randomNum = Math.floor(Math.random() * max) + 1;
    console.log(max + " " + randomNum);
    $(this).find('.random-option').css('display','none');
    $(this).find('.random-option[random-option=' + randomNum + ']').css('display','inline');
  });
}
function serverInfoPreLoad (num, path) {
  var newNumber = num;
  var chosenPath = path;
  var newStage = $('.stage-' + newNumber);
  var stageLoadInfos = newStage.find('.server-load-info');
  stageLoadInfos.each(function( index ) {
    var reqPlace = $(this).attr('req-place');
    var specificPath = userPath[reqPlace];
    $(this).find('.info-option').css('display','none');
    $(this).find('.info-option[server-choice=' + specificPath + ']').css('display','inline');
  });
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
  serverPreLoad(newNumber , chosenPath);
  serverInfoPreLoad(newNumber , chosenPath);
  loadPartner(newNumber);
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
  var pathRef = firebase.database().ref('paths/' + id);
  var newChildRef = pathRef.push(values);
}

function gatherIds () {
  var id = userPath.join("");
  var gatheredIds = [];
  var choice1 = userPath[1];
  var choice2 = userPath[2];
  var choice3 = userPath[3];
  var choice4 = userPath[4];
  var string1 = '0' + choice1 + '000';
  var string2 = '0' + choice1 + choice2 + '00';
  var string3 = '000' + choice3 + '0';
  var string4 = '0000' + choice4;
  gatheredIds.push("total");
  gatheredIds.push(id);
  gatheredIds.push(string1);
  gatheredIds.push(string2);
  gatheredIds.push(string3);
  gatheredIds.push(string4);
  gatheredIds.forEach(updateCounters);
}
function updateCounters(item, index) {
  dbLocation = item;
  console.log(dbLocation);
  var pathRef = firebase.database().ref('counters/' + dbLocation);
  var countRef = firebase.database().ref('counters/' + dbLocation + '/count');
  countRef.once('value').then(function(snapshot) {
    var anotherCount = snapshot.val();
    var existingCount = parseInt(anotherCount);
    var newCount = ++existingCount;
    console.log(newCount);
    pathRef.set({ count: newCount});
  });
}
function loadPartner (num) {
  var newNumber = num;
  var partner = $('.stage-' + newNumber).attr('partner');
  if ( partner === "yes" ) {
    var partnerPath = userPath.slice();
    var first = partnerPath[0];
    console.log(first);
    if (first === 1) {
      partnerPath[0] = 2;
    } else {
      partnerPath[0] = 1;
    }
    var partnerId = partnerPath.join("");
    var partnerName;
    var pathRef = firebase.database().ref('paths/' + partnerId + '/');
    console.log(partnerId);
    console.log(userPath);
    var ref = firebase.database().ref('paths/' + partnerId + '/');
    ref.orderByChild("timestamp").limitToLast(1).on("child_added", function(snapshot) {
      partnerName = snapshot.val().username;
      $('.partner').text(partnerName);
    });
  }
}
function calculatePercent(compare,to,span) {
  var span = span;
  var compareThis = compare;
  var compareTo = to;
  var refThis = firebase.database().ref('counters/' + compareThis + '/count');
  var refTo = firebase.database().ref('counters/' + compareTo + '/count');
  var intTo;
  var intThis;
  var percentage;
  refThis.once('value').then(function(snapshot) {
    var newThis = snapshot.val();
    intThis = parseInt(newThis);
    if ( intTo == null ) {
    } else {
      percentage = (intThis/intTo)*100;
      changeSpan(percentage,span);
      fillCharts(percentage,span);
    }
  });
  refTo.once('value').then(function(snapshot) {
    var newTo = snapshot.val();
    intTo = parseInt(newTo);
    if ( intThis == null ) {
    } else {
      percentage = (intThis/intTo)*100;
      changeSpan(percentage,span);
      fillCharts(percentage,span);
    }
  });
  //return percentage;
}
function inputPercent() {
  $(".caption").each(function( index ) {
    var span = $(this);
    compareThis = $(this).attr('compare-this');
    compareTo = $(this).attr('compare-to');
    calculatePercent(compareThis,compareTo,span);
  });
}
function changeSpan(percentage,span) {
  percentage = Math.round(percentage);
  span = span;
  span.text(percentage + "%");
}
function round5(percent) {
  return (percent % 5) >= 2.5 ? parseInt(percent / 5) * 5 + 5 : parseInt(percent / 5) * 5;
}

function fillCharts (percent, span) {
  var percent = percent;
  var roundedPercent = round5(percent)
  var text = $(this).parent();
  console.log(text);
  var container = text.parent();
  var pieChart = container.find('.pie-chart');
  pieChart.find('img').addClass("percent-" + roundedPercent);
}
