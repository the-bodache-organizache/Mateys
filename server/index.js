const { db } = require('./db');
const app = require('./app');
const socketEvents = require('../client/utils/socketEvents');
const PORT = process.env.PORT || 8080;
const env = process.env.NODE_ENV || 'development';

const http = require('http');
const socketIo = require('socket.io');
const easyrtc = require('easyrtc');
const Game = require('./game');

process.title = 'node-easyrtc';

// Start Express http server on port 8080
const webServer = http.createServer(app);

// Start Socket.io so it attaches itself to Express server
const socketServer = socketIo.listen(webServer, { 'log level': 1 });


let rooms = {};

socketServer.on('connection', socket => {
  const {
    ENTER_ROOM,
    RERENDER_PAGE,
    REQUEST_GAME_START,
    REQUEST_GAME_RESTART,
    DISCONNECT,
    EDIT_ROOM,
    GAME_OVER
  } = socketEvents;

  socket.on(ENTER_ROOM, roomName => {
    if (socketServer.sockets.clients(roomName).length > 2) {

      // socket.disconnect();
    }
  });

  socket.on(EDIT_ROOM, () => {
    socket.broadcast.emit(RERENDER_PAGE);
  });

  socket.on(REQUEST_GAME_START, async (myRoom) => {
    const roomName = myRoom.name;
    if (!rooms[roomName]) {
      rooms[roomName] = {
        room: roomName,
        players: [],
        startRequests: 0,
        leaveRequests: 0
      };
    }
    rooms[roomName].players.push(socket);
    rooms[roomName].startRequests++;
    if (rooms[roomName].startRequests === 2) {
      const game = new Game(rooms[roomName]);
      await game.startGame();
      socket.on(DISCONNECT, () => {
        game.end();
        rooms[roomName].players = [];
      });
    }
    socket.on(DISCONNECT, () => {
      rooms[roomName].players = rooms[roomName].players.filter(player => player.id !== socket.id);
    });
  });

  socket.on(REQUEST_GAME_RESTART, async (myRoom) => {
    const roomName = myRoom.name;
    rooms[roomName].startRequests++;

    if (rooms[roomName].startRequests === 2) {
      const game = new Game(rooms[roomName]);
      await game.startGame();
      socket.on(DISCONNECT, () => {
        game.end();
        rooms[roomName].players = [];
      });
    }
    socket.on(DISCONNECT, () => {

      rooms[roomName].players = rooms[roomName].players.filter(player => player.id !== socket.id);
    });
  });

  socket.on('REQUEST_LEAVE_ROOM', (myRoom) => {
    const roomName = myRoom.name;
    rooms[roomName].leaveRequests += 1;
    if (rooms[roomName].leaveRequests === 2) {
      socket.emit('DELETE_ROOM');
    }
  })
});


// *********************** EASYRTC *************************
// easyrtc.setOption('logLevel', 'debug');

// Overriding the default easyrtcAuth listener, only so we can directly access its callback
easyrtc.events.on('easyrtcAuth', function(
  socket,
  easyrtcid,
  msg,
  socketCallback,
  callback
) {
  easyrtc.events.defaultListeners.easyrtcAuth(
    socket,
    easyrtcid,
    msg,
    socketCallback,
    function(err, connectionObj) {
      if (err || !msg.msgData || !msg.msgData.credential || !connectionObj) {
        callback(err, connectionObj);
        return;
      }

      connectionObj.setField('credential', msg.msgData.credential, {
        isShared: false
      });

      callback(err, connectionObj);
    }
  );
});

// Start EasyRTC server
const rtc = easyrtc.listen(app, socketServer, null, function(err, rtcRef) {

  rtcRef.events.on('roomCreate', function(
    appObj,
    creatorConnectionObj,
    roomName,
    roomOptions,
    callback
  ) {

    appObj.events.defaultListeners.roomCreate(
      appObj,
      creatorConnectionObj,
      roomName,
      roomOptions,
      callback
    );
  });
});

// To test, lets print the credential to the console for every room join!
easyrtc.events.on('roomJoin', function(
  connectionObj,
  roomName,
  roomParameter,
  callback
) {

  easyrtc.events.defaultListeners.roomJoin(
    connectionObj,
    roomName,
    roomParameter,
    callback
  );
});

if (env !== 'production') {
  try {
    require('./secrets');
  } catch (err) {
    console.log('No secrets file found - make sure to add one!');
  }
}

if (env === 'production') {
  const forceSsl = function(req, res, next) {
    if (req.headers['x-forwarded-proto'] !== 'https') {
      return res.redirect(['https://', req.get('Host'), req.url].join(''));
    }
    return next();
  };

  app.use(forceSsl);
}

db.sync().then(() => {
  webServer.listen(PORT, () => console.log(`Listening on port ${PORT}`));
});
