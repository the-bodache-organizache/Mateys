const { db } = require('./db');
const app = require('./app');
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

let players = [];
let socketEvents = {};

socketServer.on('connection', socket => {
  socket.on('SEND_EVENTS', payload => {
    socketEvents = payload;
  });

  const { REQUEST_GAME_START, DISCONNECT } = socketEvents;

  socket.on(REQUEST_GAME_START, async (payload) => {
    console.log('Another client has connected!: ', socket.id);
    const { socketEvents, myRoom} = payload;
    players.push(socket);
    if (players.length >= 2) {
      const game = await new Game(players, myRoom);
      game.startGame();
      socket.on(DISCONNECT, () => {game.end()});
    }
    socket.on(DISCONNECT, () => {
      console.log('A client has disconnected!: ', socket.id);
      players = players.filter(player => player.id !== socket.id);
      console.log(players.length);
    });
  });
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

      console.log(
        '[' + easyrtcid + '] Credential saved!',
        connectionObj.getFieldValueSync('credential')
      );

      callback(err, connectionObj);
    }
  );
});

// Start EasyRTC server
const rtc = easyrtc.listen(app, socketServer, null, function(err, rtcRef) {
  console.log('Initiated');

  rtcRef.events.on('roomCreate', function(
    appObj,
    creatorConnectionObj,
    roomName,
    roomOptions,
    callback
  ) {
    console.log('roomCreate fired! Trying to create: ' + roomName);

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
  console.log(
    '[' + connectionObj.getEasyrtcid() + '] Credential retrieved!',
    connectionObj.getFieldValueSync('credential')
  );
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
  console.log('The database is synced');
  webServer.listen(PORT, () => console.log(`Listening on port ${PORT}`));
});
