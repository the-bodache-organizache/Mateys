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
  }

  async startGame() {

    await this.selectWidgets();
    this.sendWidgets();
    this.play();
  }

  async selectWidgets() {
    const widgets = await Widget.findAll();
    const numWidgets = widgets.length;
    const chosenWidgetIdxs = [];
    while (chosenWidgetIdxs.length < 4) {
      const widgetIndex = Math.floor(Math.random() * numWidgets);
      if (!chosenWidgetIdxs.includes(widgetIndex)) {
        chosenWidgetIdxs.push(widgetIndex);
      }
    }
    this.widgets = chosenWidgetIdxs.map(i => widgets[i].dataValues);
    //console.log(this.widgets);
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
    // console.log(player1Widgets);
    // console.log(player2Widgets)
  }

  play() {
    this.players.forEach(player => player.on('press box', payload => {
      if (this.score < this.targetScore) {
        const index = this.activeCommands.indexOf(payload.command);
        if (index >= 0) {
          this.score++;
          this.activeCommands.splice(index, 1);
        }
        else {
          this.health--;
        }
        if (this.score >= this.targetScore) {
          console.log("NEW LEVEL STARTING *******")
          this.nextLevel();
        }
        if (this.health <= 0) this.end();
      }
    }));
      
      const intervalId = setInterval(() => {
        this.health -= this.activeCommands.length;
        if (this.health <= 0) this.end();
        this.activeCommands = [];
        const widget1 = this.widgets[Math.floor(Math.random() * this.widgets.length)];
        let widget2 = widget1;
        while (widget2.id === widget1.id) {
          widget2 = this.widgets[Math.floor(Math.random() * this.widgets.length)];
        }
        this.players[0].emit('issue command', widget1.command);
        this.players[1].emit('issue command', widget2.command);
        this.activeCommands.push(widget1.command);
        this.activeCommands.push(widget2.command);
        console.log('HEALTH:', this.health);
        console.log('SCORE:', this.score);
        console.log('LEVEL:', this.level);
        console.log("intervalId", intervalId);
    }, this.seconds * 1000);
    this.intervalId = intervalId;
  }

  nextLevel() {
    this.level++;
    this.score = 0;
    this.health = 10;
    clearInterval(this.intervalId);
    this.startGame();
  }

  end() {
    console.log("****************GAME OVER****************")
    this.players.forEach(player => player.emit('game over'));
  }
}

module.exports = Game;
