const Widget = require('./db/widget');

class Game {
  constructor(players) {
    this.players = players;
    this.level = 1;
    this.widgets = [];
    this.seconds = 10;
    this.health = 10;
    this.score = 0;
    this.targetScore = 10;
    this.activeCommands = [];
    this.intervalId = null;
    this.numOfWidgets = 4;
    this.nextLevel = this.nextLevel.bind(this);
    this.end = this.end.bind(this);
    this.randomIndex = this.randomIndex.bind(this);
  }

  async startGame() {
    const { selectWidgets, sendWidgets, play } = this;
    try {
      await this.selectWidgets();
      this.sendWidgets();
      this.play();
    } catch (err) {
      console.log(`Game couldn't start!`);
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
    player1.emit('send player widgets', player1Widgets);
    player2.emit('send player widgets', player2Widgets);
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
    players.forEach(player => player.removeAllListeners('press box'));

    players.forEach(player => player.on('press box', payload => {
      const index = this.activeCommands.indexOf(payload.command);
      if (this.score < this.targetScore) {
        const status = {
          expected: this.activeCommands,
          actual: payload.command,
          health: this.health,
          score: this.score,
          level: this.level
        };
        player.emit('move status', status);
        if (index >= 0) {
          this.score++;
          this.activeCommands.splice(index, 1);
        } else {
          this.health--;
        }
        if (this.score >= this.targetScore) nextLevel();
        if (this.health <= 0) end();
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
      player1.emit('issue command', widget1.command);
      player2.emit('issue command', widget2.command);
      this.activeCommands.push(widget1.command, widget2.command);
      console.log('HEALTH:', this.health);
      console.log('SCORE:', this.score);
      console.log('LEVEL:', this.level);
    }, this.seconds * 1000);
  }

  nextLevel() {
    this.level++;
    this.score = 0;
    this.health = 10;
    clearInterval(this.intervalId);
    this.players.forEach(player => player.emit('next level'));
    this.startGame();
  }

  end() {
    console.log("****************GAME OVER****************")
    this.players.forEach(player => player.emit('game over'));
  }
}

module.exports = Game;
