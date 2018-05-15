const { Widget, Rooms } = require('./db');
const socketEvents = require('../client/utils/socketEvents');

class Game {
  constructor(players, room) {
    this.players = players;
    this.level = 1;
    this.widgets = [];
    this.seconds = 8;
    this.health = 10;
    this.score = 0;
    this.targetScore = 4;
    this.activeCommands = [];
    this.intervalId = null;
    this.numOfWidgets = 4;
    this.nextLevel = this.nextLevel.bind(this);
    this.end = this.end.bind(this);
    this.randomIndex = this.randomIndex.bind(this);
    this.room = room;
  }

  async startGame() {
    try {
      await this.selectWidgets();
      this.sendWidgets();
      this.play();
    } catch (err) {
      console.error.bind(err);
    }
  }

  async selectWidgets() {
    this.widgets = [];
    const { randomIndex, widgets, numOfWidgets } = this;
    const dbWidgets = await Widget.findAll();
    while (widgets.length < numOfWidgets) {
      const i = randomIndex(dbWidgets.length)
      const randWidg = dbWidgets[i].dataValues;
      if (!widgets.includes(randWidg)) {
        widgets.push(randWidg);
      }
    }
  }

  sendWidgets() {
    const { SEND_WIDGETS } = socketEvents;
    const { widgets } = this;
    const [ player1, player2 ] = this.players;
    const player1Widgets = [];
    const player2Widgets = [];

    for (let i = 0; i < widgets.length; i++) {
      if ((i % 2) === 0) {
        player1Widgets.push(widgets[i]);
      } else {
        player2Widgets.push(widgets[i]);
      }
    }
    player1.emit(SEND_WIDGETS, player1Widgets);
    player2.emit(SEND_WIDGETS, player2Widgets);
  }

  randomIndex(length) {
    return Math.floor(Math.random() * length);
  }

  play() {
    const {
      players,
      nextLevel,
      end
    } = this;
    const {
      WIDGET_PRESSED,
      RIGHT_MOVE,
      WRONG_MOVE,
      ISSUE_COMMAND
    } = socketEvents;
    players.forEach(player => player.removeAllListeners(WIDGET_PRESSED));

    players.forEach(player => player.on(WIDGET_PRESSED, payload => {
      const index = this.activeCommands.indexOf(payload.command);
      if (this.score < this.targetScore) {
        if (index >= 0) {
          player.emit(RIGHT_MOVE);
          this.score++;
          this.activeCommands.splice(index, 1);
        } else {
          player.emit(WRONG_MOVE);
          this.health--;
        }
        if (this.score >= this.targetScore) nextLevel();
        if (this.health <= 0) end();
        this.sendStatus();
      }
    }));

    this.intervalId = setInterval(() => {
      const { randomIndex, widgets } = this;
      const [ player1, player2 ] = this.players;
      const { length } = this.widgets;
      this.health -= this.activeCommands.length;
      if (this.health <= 0) end();
      this.activeCommands = [];
      const widget1 = widgets[randomIndex(length)];
      let widget2 = widget1;
      while (widget2.id === widget1.id) {
        widget2 = widgets[randomIndex(length)];
      }
      player1.emit(ISSUE_COMMAND, widget1.command);
      player2.emit(ISSUE_COMMAND, widget2.command);
      this.activeCommands.push(widget1.command, widget2.command);
      console.log('HEALTH:', this.health);
      console.log('SCORE:', this.score);
      console.log('LEVEL:', this.level);
      this.sendStatus();
    }, this.seconds * 1000);
  }

  nextLevel() {
    const { NEXT_LEVEL } = socketEvents;
    this.level++;
    if (this.seconds >= 4.4) {
      this.seconds -= 0.4;
    }
    if (this.targetScore < 18) this.targetScore += 1;
    if (this.level % 2 === 0) {
      if (this.numOfWidgets <= 10) this.numOfWidgets += 2;
    }
    this.score = 0;
    this.health = 10;
    clearInterval(this.intervalId);
    this.players.forEach(player => player.emit(NEXT_LEVEL, { level: this.level }));
    this.sendStatus();
    this.startGame();
  }

  sendStatus() {
    const { MOVE_STATUS } = socketEvents;
    const status = {
      health: this.health,
      score: this.score,
      targetScore: this.targetScore,
      level: this.level
    };
    this.players.forEach(player => player.emit(MOVE_STATUS, status));
  }

  async end() {
    const { GAME_OVER, RERENDER_PAGE } = socketEvents;
    this.players.forEach(player => player.emit(GAME_OVER));
    clearInterval(this.intervalId);
    this.players.forEach(player => player.leave(this.room.name));
    await Rooms.destroy({ where: {name: this.room.name }});
    this.players.forEach(player => {
      player.broadcast.emit(RERENDER_PAGE);
      player.emit(RERENDER_PAGE);
    });
  }
}

module.exports = Game;
