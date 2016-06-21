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

      url: 'https://api.parse.com/1/classes/messages',
      type: 'GET',
      data: JSON.stringify(message),
      contentType: 'application/json',
      success: function(data) {
        captureData(data);
        console.log('chatterbox: Messages recieved');
      },
      error: function (data) {
        console.error('chatterbox: Failed to retrieve message', data);
      }

    });
  }
};

// another function that retrieves & stores all data

var displayMessages = function(room) {

  $('#chats').html('');
    
                      // i < 20, when room only had 4 people then the 5th is undefined hence why it couldnt read property
                      // username of undefined 
  if (app.storedData[room]) {
    for (var i = 0; i < app.storedData[room].length; i++) {
      var $user = $("<div class ='" + app.storedData[room][i].userName + "'></div>");
      var text = app.storedData[room][i].userName + ': ' + app.storedData[room][i].text;

      $user.text(text);
      $user.appendTo('#chats');	
    }
  }

  $('#chats').children().on('click', function() {
    var friendName = $(this).attr('class');

    $('div.' + friendName).addClass('friend');
  
    app.friendList[friendName] = friendName; 
  });
};

var captureData = function(data) {

  app.storedData = {};

  for (var i = 0; i < data.results.length; i++) {
    if (data.results[i].roomname !== undefined && data.results[i].username !== undefined && data.results[i].text !== undefined) {
	
      var userData = {userName: data.results[i].username,
										text: data.results[i].text};
			
      var roomName = data.results[i].roomname;

      if (app.storedData[roomName] === undefined) {
        app.storedData[roomName] = [userData];
      } else {
        app.storedData[roomName].push(userData);
      }
    }   
  }
	
  createRoomsList();
  displayMessages(app.currentRoom);
	
};

var createRoomsList = function() {
  $('.rooms').html('');

  for (var key in app.storedData) {
    $('.rooms').append( new Option(key, key));
  }

  $('.rooms').on('change', function() {
    if (this.value === 'newRoom') {
      createNewRoom();
    } else {
      app.currentRoom = this.value;
      displayMessages(this.value);
    }
  }); 
};



var createNewRoom = function() {
  var newRoomName = prompt('Please enter a room name');

  app.storedData[newRoomName] = []; 
  app.currentRoom = newRoomName;
};

$(document).ready(function () {
  $('#sendForm').on('click', function(e) {
  
    var userName = window.location.search.substring(10);
    var text = $('#msg').val();

    sendMessage(userName, text);
  });
    
});

var sendMessage = function(userName, text) {

  var message = { username: userName, text: text, roomname: app.currentRoom};

  app.send(message);
  app.fetch();

};


setInterval(function() {
  app.fetch();
}, 60000);

window.onload = app.fetch;













