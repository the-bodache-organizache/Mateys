const Level = require('./level');

class Game {
  constructor(players) {
    this.players = players;
    this.level = 1;
    this.currentLevel = null
  }

  async startGame() {
    const level = new Level(this, this.level);
    this.currentLevel = level;
    await level.selectWidgets();
    level.sendWidgets();
    level.play();
  }

  nextLevel() {
    this.level++;
    clearInterval(this.level.intervalId);
    this.startGame();
  }

  end() {
    this.players.forEach(player => player.emit('game over'));
  }
}

module.exports = Game;
