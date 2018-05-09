const Widget = require('./db/widget');

class Level {
  constructor(game, level) {
    this.game = game;
    this.widgets = [];
    this.seconds = 10;
    this.health = 10;
    this.score = 0;
    this.targetScore = 10;
    this.level = level;
    this.activeCommands = [];
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
    this.game.players[0].emit('send player widgets', player1Widgets);
    this.game.players[1].emit('send player widgets', player2Widgets);
    console.log(player1Widgets);
    console.log(player2Widgets)
  }

  play() {
    this.game.players.forEach(player => player.on('press box', payload => {
      const index = this.activeCommands.indexOf(payload.command);
      if (index >= 0) {
        this.score++;
        this.activeCommands.splice(index, 1);
      }
      else {
        this.health--;
      }
      if (this.score >= this.targetScore) this.game.nextLevel();
      if (this.health <= 0) this.game.end();
    }));
    const commandInterval = setInterval(() => {
      this.health -= this.activeCommands.length;
      if (this.health <= 0) this.game.end();
      this.activeCommands = [];
      const widget1 = this.widgets[Math.floor(Math.random() * this.widgets.length)];
      let widget2 = widget1;
      while (widget2.id === widget1.id) {
        widget2 = this.widgets[Math.floor(Math.random() * this.widgets.length)];
      }
      console.log('WE MADE IT to PLAY')
      this.game.players[0].emit('issue command', widget1.command);
      this.game.players[1].emit('issue command', widget2.command);
      this.activeCommands.push(widget1.command);
      this.activeCommands.push(widget2.command);
    }, this.seconds * 1000);
  }
}

module.exports = Level;
