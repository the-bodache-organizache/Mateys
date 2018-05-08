const Widget = require('./db/widget');

class Game {
  constructor(players) {
    this.players = players;
    this.widgets = [];
    this.health = 5;
    this.score = 0;
    this.level = 1
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
    console.log(player1Widgets);
    console.log(player2Widgets)
  }
}

module.exports = Game;
