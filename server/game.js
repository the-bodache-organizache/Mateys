const Widget = require('./db/widget');

class Game {
  constructor(players) {
    this.players = players;
    this.widgets = [];
    this.heatlh = 5;
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
    console.log(this.widgets);
  }
  
  // sendWidgets(players) {
  //   for (let i = 0; i < widgets.length; i++) {
  //     if ((i % 2) === 0) 
  //   }
  // }
}

module.exports = Game;
