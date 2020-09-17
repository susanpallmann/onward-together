$(document).ready(function () {
  
  /* Global variable for user path, stores a 5-digit ID */
  userPath = [0,0,0,0,0];
  
  // Animation to have elements fade in when the user reaches a certain scroll point
  $('.animate-fade-in').each( function(i){
    // 0.25 arbitrary number to make the actual point when something becomes visible more smooth
    var fadeLocation = $(this).offset().top + 0.25*($(window).height());
    var windowBottom = $(window).scrollTop() + $(window).height();
    /* If the object is visible in the window, fade in */
    if ( windowBottom > fadeLocation ) {
      $(this).delay(150).animate({'opacity':'1'},600);
    }
  });
  
  // On click of specific button (.submit-path), prepares information to submit to Firebase
  $('.submit-path').click(function () {
    readyPath();
    gatherIds();
  });
  
  // On click of a button or stage, (.trigger) gets some attributes and prepares to change the stage
  $('.trigger').click(function () {
    var stage = $(this).attr('stage');
    var path = $(this).attr('path');
    var place = $(this).attr('place');
    var choice = $(this).attr('choice');
    // If applicable, updates userPath with a value at a specified index
    editPath(place, choice);
    // Prepares to change stage
    advanceStage(stage, path);
  });
  
  // If a button with this class is clicked, change the title of the page to show "Onward Alone"
  $('.alone').click(function () {
    $('.alternate-title').html('Alone');
  });
  
  // If a button with this class is clicked, change the title of the page to show "Onward Together"
  $('.together').click(function () {
    $('.alternate-title').html('Together');
  });
  
  // Loads percentages from Firebase data
  inputPercent();
});

// Before the destination stage is made visible, loads required options, if they exist, and hides others
// Takes parameters num (destination stage number) and path (letter indicating which options to show)
function preLoad(num, path) {
  var chosenPath = path;
  
  // If it's one of the 4 possible paths (A-D) NOTE: This is specific to this project, if you want more options, you have to expand this function
  if (chosenPath === "A" || chosenPath === "B" || chosenPath === "C" || chosenPath === "D") {
    $('.stage-' + num + ' .option').css('display','none');
    $('.stage-' + num + ' .option[path-option=' + chosenPath + ']' ).css('display','inline');
    
  // If the path is set to "O" instead, indicates that there's only one path in this destination stage
  } else if (chosenPath === "O") {
    
    // Shortcut: instead of checking the userPath array, technically the choice made in position 2 or 5 is stored in the .alternate-title class
    var alone = $('.alternate-title').text() === "Alone";
    
    // If the [path] attribute of the previous .trigger was set to "O", the script will check if the user is currently on an "Alone" path or a 
    // "Together" path and treat any child .option spans as though [path-option="A"] = alone, and [path-option="B"] = together.
    if ( $('.alternate-title').text() === "Alone" ) {
      $('.stage-' + num + ' .option').css('display','none');
      $('.stage-' + num + ' .option[path-option=A]' ).css('display','inline');
    } else {
      $('.stage-' + num + ' .option').css('display','none');
      $('.stage-' + num + ' .option[path-option=B]' ).css('display','inline');
    }
    
    // Checks if a value has been set at userPath[0] and randomly chooses one if not.
    if (userPath[0] === 0) {
      var randomNum = Math.floor(Math.random() * 2) + 1;
      editPath(0, randomNum);
    }
    
    // Shows appropriate random choice that correspond with the value set at userPath[0]
    $('.stage-' + num + ' .random').css('display','none');
    $('.stage-' + num + ' .random[random-choice=' + userPath[0] + ']' ).css('display','inline');
  }
}

// Shows appropriate choices for a random number generated from attribute [random-max]
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

// Shows appropriate choices for paths matching a value looked up by attribute [req-place]
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

// If destination has class .background-change, sets the background-image of body element to file matching naming convention
function setBackground(num, path) {
  var newNumber = num;
  var chosenPath = path;
  if ( $('.stage-' + newNumber).hasClass('background-change') ) {
    $('body').css('background-image','url("images/stage-' + newNumber + chosenPath + '.gif")');
  }
}

// Progresses to the stage indicated by parameter num, and prepares the stage using parameter path
// If there are no elements in destination stage able to be acted upon by a given preload function, they won't do anything
function advanceStage(num , path) {
  var newNumber = num;
  var chosenPath = path;
  
  // Hides prior stages
  $('.visible').removeClass('visible');
  $('body').css('background-image','none');
  preLoad(newNumber , chosenPath);
  serverPreLoad(newNumber , chosenPath);
  serverInfoPreLoad(newNumber , chosenPath);
  loadPartner(newNumber);
  setBackground(newNumber , chosenPath);
  
  // Makes new stage visible
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

// Takes array userPath and forms path ID, also sorts information to prepare to update counters through updateCounters
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

// Updates counters tracking specific choices in Firebase
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

// Determines partner ID from user's ID and places the partner's username in the .partner element
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
    var ref = firebase.database().ref('paths/' + partnerId + '/');
    ref.orderByChild("timestamp").limitToLast(1).on("child_added", function(snapshot) {
      partnerName = snapshot.val().username;
      $('.partner').text(partnerName);
    });
  }
}

// Reusable function for determining percentages
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
      
      // Updates the charts on the about page
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
      
      // Updates the charts on the about page
      changeSpan(percentage,span);
      fillCharts(percentage,span);
    }
  });
}

// Determines the data needed to pass into calculatePercent function (stored in HTML attributes)
function inputPercent() {
  $(".caption").each(function( index ) {
    var span = $(this);
    compareThis = $(this).attr('compare-this');
    compareTo = $(this).attr('compare-to');
    calculatePercent(compareThis,compareTo,span);
  });
}

// Updates a parameter span element with a parameter percentage 
function changeSpan(percentage,span) {
  percentage = Math.round(percentage);
  span = span;
  span.text(percentage + "%");
}

// Rounds percentages to 5% because I literally generated images for every 5% change on a bar graph because I hate myself
function round5(percent) {
  return (percent % 5) >= 2.5 ? parseInt(percent / 5) * 5 + 5 : parseInt(percent / 5) * 5;
}

// Changes the images of pie charts to match the correct percentage using a file name convention
function fillCharts (percent, span) {
  var percent = percent;
  var roundedPercent = round5(percent)
  var text = span.parent();
  var container = text.parent();
  var pieChart = container.find('.pie-chart');
  pieChart.find('img').attr('src', 'images/pie-' + roundedPercent + '.jpg');
  pieChart.find('img').attr('alt', roundedPercent + ' percent');
}
