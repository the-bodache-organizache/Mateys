const Widget = require('./db/widget');

class Game {
  constructor(players) {
    this.players = players;
    this.widgets = [];
  }

  async play() {
    const widgets = await Widget.findAll();
    const numWidgets = widgets.length;
    const chosenWidgetIdxs = [];
    while (chosenWidgetIdxs.length < 4) {
      const widgetIndex = Math.floor(Math.random() * numWidgets);
      if (!chosenWidgetIdxs.includes(widgetIndex)) {
        chosenWidgetIdxs.push(widgetIndex);
      }
    }
    this.widgets = chosenWidgetIdxs.map(i => widgets[i]);
    console.log(this.widgets);
  }
}

module.exports = Game;
