// create a new instance of ChatEngine
ChatEngine = ChatEngineCore.create({
  publishKey: 'YOUR_PUBNUB_PUBLISH_KEY',
  subscribeKey: 'YOUR_PUBNUB_SUBSCRIBE_KEY'
});


// create a bucket to store our ChatEngine Chat object
let homeChat;

// create a bucket to store
let me;


// compile handlebars templates and store them for use later
let peopleTemplate = Handlebars.compile($("#person-template").html());
let meTemplate = Handlebars.compile($("#message-template").html());
let userTemplate = Handlebars.compile($("#message-response-template").html());


var user_me = {};
user_me.first = 'Jim';
user_me.last = '';
user_me.full = [user_me.first, user_me.last].join(" ");
user_me.uuid = 'Jim';
user_me.avatar = 'person.png';
user_me.online = true;
user_me.lastSeen = Math.floor(Math.random() * 60);

// this is our main function that starts our chat app
const initChat = () =>
{

  ChatEngine.connect (user_me.uuid, user_me);


  ChatEngine.on('$.ready', function(data)
  {
    me = data.me;
    console.log(me);
    homeChat = new ChatEngine.Chat('home');
    //console.log(homeChat.users);

    // when we recieve messages in this chat, render them
    homeChat.on('message', (message) => {
        //console.log("RECD " + message.data.text);
        //console.log("REQ " + message.data.text);
        renderMessage(message);
    });

    homeChat.on('$.online.*', (data) => {
        $('#people-list ul').append(peopleTemplate(data.user));
      });

      // when a user goes offline, remove them from the online list
      homeChat.on('$.offline.*', (data) => {
        $('#people-list ul').find('#' + data.user.uuid).remove();
      });

      // wait for our chat to be connected to the internet
      homeChat.on('$.connected', () => {

          // search for 50 old `message` events
          homeChat.search({
            event: 'message',
            limit: 10
          }).on('message', (data) => {

            //console.log(data)

            // when messages are returned, render them like normal messages
            renderMessage(data, true);

          });

      });

      // bind our "send" button and return key to send message
      $('#sendMessage').on('submit', sendMessage)



  }); // end on ready

} // end of init function


// send a message to the Chat
const sendMessage = () => {

    // get the message text from the text input
    let message = $('#message-to-send').val().trim();

    // if the message isn't empty
    if (message.length) {

      console.log(message);

        // emit the `message` event to everyone in the Chat
        homeChat.emit('message', {
            type: 'REQUEST',
            source_text: message,
            target_text: '',
            source_lang: 'en',
            target_lang: 'de',
            request_by: user_me.first + "-" + user_me.uuid
        });

        console.log('message sent');

        // clear out the text input
        $('#message-to-send').val('');
    }

    // stop form submit from bubbling
    return false;

};



// render messages in the list
const renderMessage = (message, isHistory = false) => {

    // use the generic user template by default
    let template = userTemplate;

    console.log(message.sender.uuid + " said: " + message.data.source_text + " : " + message.data.target_text);

    // if I happened to send the message, use the special template for myself
    if (message.sender.uuid == me.uuid) {
        template = meTemplate;
    }

    var msgtxt = "";

    if (message.sender.uuid == me.uuid){
       msgtxt = message.data.source_text;
    }
    else{
       msgtxt = message.data.target_text;
    }

     let el = template({

        messageOutput: msgtxt,
        time: getCurrentTime(),
        user: message.sender.state
    });

    // render the message
    if(isHistory) {
      $('.chat-history ul').prepend(el);
    } else {
      $('.chat-history ul').append(el);
    }

    // scroll to the bottom of the chat
    scrollToBottom();

};


// scroll to the bottom of the window
const scrollToBottom = () => {
    $('.chat-history').scrollTop($('.chat-history')[0].scrollHeight);
};

// get the current time in a nice format
const getCurrentTime = () => {
    return new Date().toLocaleTimeString().replace(/([\d]+:[\d]{2})(:[\d]{2})(.*)/, "$1$3");
};


// boot the app
initChat();
