const Level = require('./level');

class Game {
  constructor(players) {
    this.players = players;
    this.level = 1;
  }

  async startGame() {
    const level = new Level(this, this.level);
    await level.selectWidgets();
    level.sendWidgets();
    level.play();
  }

  nextLevel() {
    this.level++;
    this.startGame();
  }

  end() {
    this.players.forEach(player => player.emit('game over'));
  }
}

module.exports = Game;