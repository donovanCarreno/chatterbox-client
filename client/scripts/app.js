var app = { 

  currentRoom: '',
  storedData: {},
  friendList: {},
	
  send: function(message) {
				
    $.ajax({
      // This is the url you should use to communicate with the parse API server.
      url: 'https://api.parse.com/1/classes/messages',
      type: 'POST',
      data: JSON.stringify(message),
      contentType: 'application/json',
      success: function (data) {
        console.log('chatterbox: Message sent');
      },
      error: function (data) {
      // See: https://developer.mozilla.org/en-US/docs/Web/API/console.error
        console.error('chatterbox: Failed to send message', data); 
      }
    });
  },

  fetch: function(message) {
    $.ajax({
      // This is the url you should use to communicate with the parse API server.
      url: 'https://api.parse.com/1/classes/messages',
      type: 'GET',
      data: JSON.stringify(message),
      contentType: 'application/json',
      success: function(data) {
        captureData(data);
        console.log('chatterbox: Messages recieved');
      },
      // See: https://developer.mozilla.org/en-US/docs/Web/API/console.error
      error: function (data) {
        console.error('chatterbox: Failed to retrieve message', data);
      }

    });
  }
};

var displayMessages = function(room) {

  // Clears the chat of all messages 
  $('#chats').html('');
  
  // If the stored data contains a room 
  if (app.storedData[room]) {

    // Append each message from users to given room 
    for (var i = 0; i < app.storedData[room].length; i++) {

      var userName = app.storedData[room][i].userName;
      var text = app.storedData[room][i].text;

      // Creating div classes for each userName 
      var $user = $("<div class ='" + userName + "'></div>");
      var userText = userName + ': ' + text;

      // Appending messages to the page 
      $user.text(userText);
      $user.appendTo('#chats');

      // If user is friend, highlight name 
      if (app.friendList.hasOwnProperty(userName)) {
        $($user).addClass('friend');
      }	
    }
  }

  // On click, highlight name and add to friend list
  $('#chats').children().on('click', function() {
    var friendName = $(this).attr('class');

    $('div.' + friendName).addClass('friend');
  
    app.friendList[friendName] = friendName; 
  });

};


var captureData = function(data) {
  // Empty out the stored data 
  app.storedData = {};

  // Iterate over the data 
  for (var i = 0; i < data.results.length; i++) {
    // If roomname, username or text are undefined then do not add that data 
    if (data.results[i].roomname !== undefined && data.results[i].username !== undefined && data.results[i].text !== undefined) {
	
      var userData = {userName: data.results[i].username, text: data.results[i].text};
      var roomName = data.results[i].roomname;

      // If the room is undefined than add the roomname plus its messages 
      if (app.storedData[roomName] === undefined) {
        app.storedData[roomName] = [userData];
      } else {
        // Else add the messages to room 
        app.storedData[roomName].push(userData);
      }
    }   
  }
	
  // Creates a list of rooms 
  createRoomsList();

  // Displays messages from the current room 
  displayMessages(app.currentRoom);
	
};

var createRoomsList = function() {
  // Clear the room list 
  $('.rooms').html('');

  // Iterate over stored data, append all of the rooms
  for (var key in app.storedData) {
    $('.rooms').append( new Option(key, key));
  }

  // Change event for room change 
  $('.rooms').on('change', function() {
    // If choice newRoom call createNewRoom function
    if (this.value === 'newRoom') {
      createNewRoom();
    } else {
      // Else current room is sent to display messages
      app.currentRoom = this.value;
      displayMessages(this.value);
    }
  }); 
};


var createNewRoom = function() {
  // User prompted for new room name
  var newRoomName = prompt('Please enter a room name');

  // newRoom name becomes current room
  app.storedData[newRoomName] = []; 
  app.currentRoom = newRoomName;
};


$(document).ready(function () {

  // On send message click call function sendMessage
  $('#sendForm').on('click', function(e) {
    
    // User name is stored at subtring from 10 
    var userName = window.location.search.substring(10);
    var text = $('#msg').val();

    sendMessage(userName, text);
  });
    
});

var sendMessage = function(userName, text) {

  // Format to do POST for AJAX to parse server 
  var message = { username: userName, text: text, roomname: app.currentRoom};

  // Send the message, and fetch new messages 
  app.send(message);
  app.fetch();

};

// Fetch new messages every minute 
setInterval(function() {
  app.fetch();
}, 60000);

// Fetch new messages on page open
window.onload = app.fetch;













