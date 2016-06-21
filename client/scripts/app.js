var app = { 

  storedData: {},
	
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
  for (var i = 0; i < app.storedData[room].length; i++) {
    var $user = $("<div class ='" + app.storedData[room][i].userName + "'></div");
    var text = app.storedData[room][i].userName + ': ' + app.storedData[room][i].text;

    $user.text(text);
    $user.appendTo('#chats');	
  }
};

var captureData = function(data) {

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
  displayMessages();
	
};

var createRoomsList = function() {
  for (var key in app.storedData) {
    $('.rooms').append( new Option(key, key));
  }

  $('.rooms').on('change', function() {
    displayMessages(this.value);
  }); 
};


$('.sendMessage').on('submit', function() { 
  console.log("hi");
});

window.onload = app.fetch;













