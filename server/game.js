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
  }

  async startGame() {
    try {
      await this.selectWidgets();
      this.sendWidgets();
      this.play();
    } catch (err) {
      console.log(`Game couldn't start!`);
    }
  }

  async selectWidgets() {
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
    const player1Widgets = [];
    const player2Widgets = [];

    for (let i = 0; i < this.widgets.length; i++) {
      if ((i % 2) === 0) {
        player1Widgets.push(this.widgets[i]);
      } else {
        player2Widgets.push(this.widgets[i]);
      }
    }
    this.players[0].emit('send player widgets', player1Widgets);
    this.players[1].emit('send player widgets', player2Widgets);
  }

  randomIndex(length) {
    return Math.floor(Math.random() * length);
  }

  play() {
    const {
      players,
      score,
      targetScore,
      health,
      level,
      nextLevel,
      end
    } = this;
    let { activeCommands } = this;
    players.forEach(player => player.removeAllListeners('press box'));

    players.forEach(player => player.on('press box', payload => {
      const index = activeCommands.indexOf(payload.command);
      if (score < targetScore) {
        const status = {
          expected: activeCommands,
          actual: payload.command,
          health: health,
          score: score,
          level: level
        };
        player.emit('move status', status);
        if (index >= 0) {
          this.score++;
          this.activeCommands.splice(index, 1);
        } else {
          this.health--;
        }
        if (score >= targetScore) nextLevel();
        if (health <= 0) end();
      }
    }));

    this.intervalId = setInterval(() => {
      const { randomIndex, widgets } = this;
      const [ player1, player2 ] = this.players;
      const { length } = this.widgets;
      this.health -= activeCommands.length;
      if (this.health <= 0) this.end();
      activeCommands = [];
      const widget1 = widgets[randomIndex(length)];
      let widget2 = widget1;
      while (widget2.id === widget1.id) {
        widget2 = widgets[randomIndex(length)];
      }
      player1.emit('issue command', widget1.command);
      player2.emit('issue command', widget2.command);
      activeCommands.push(widget1.command, widget2.command);
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
