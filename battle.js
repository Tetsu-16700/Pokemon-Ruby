class Battle {
  constructor(player1, player2) {
    this.player1 = player1;
    this.player2 = player2;
  }

  start() {
    console.log("%cThe battle is about to start!", "font-weight: bold;");
    this.prepareBattle();

    console.log("%cBattle Start!", "font-weight: bold;");

    let first;
    let second;
    while (
      !this.player1.pokemon.isFainted() &&
      !this.player2.pokemon.isFainted()
    ) {
      this.printBattleStatus();
      let exit = this.player1.selectMove();
      if (exit) {
        console.log(`${this.player1.name} run away!`);
        return;
      }
      exit = this.player2.selectMove();
      if (exit) {
        console.log(`${this.player2.name} run away!`);
        return;
      }

      first = this.getFirstPokemon();

      second =
        first === this.player1.pokemon
          ? this.player2.pokemon
          : this.player1.pokemon;

      first.attack(second);

      if (!second.isFainted()) {
        second.attack(first);
      }
    }

    const winner = first.isFainted() ? second : first;
    const loser = winner === first ? second : first;

    console.log(loser.name + " FAINTED!");
    console.log(winner.name + " WINS!");

    const playerWinner =
      this.player1.pokemon === winner ? this.player1 : this.player2;
    const playerLoser =
      this.player1 === playerWinner ? this.player2 : this.player1;
    if (!(playerWinner instanceof Bot)) {
      winner.processVictory(loser);
    }

    if (playerLoser.name === "Brock") {
      console.log(
        "%cCongratulation! You have won the game! 🌟🌟🌟",
        "font-weight: bold"
      );
      console.log("You can continue training your Pokemon if you want");
    }
  }

  prepareBattle() {
    this.player1.pokemon.prepareForBattle();
    this.player2.pokemon.prepareForBattle();

    console.log(
      `${
        this.player1.name
      } sent out ${this.player1.pokemon.name.toUpperCase()}!`
    );
    console.log(
      `${
        this.player2.name
      } sent out ${this.player2.pokemon.name.toUpperCase()}!`
    );
  }

  getFirstPokemon() {
    let winner = this.firstByPriority();
    if (winner) return winner;

    winner = this.firstBySpeed();
    if (winner) return winner;

    const randomIndex = randomBetween(0, 1);
    return [this.player1.pokemon, this.player2.pokemon][randomIndex];
  }

  firstByPriority() {
    const priorityDif =
      this.player1.pokemon.currentMove.priority -
      this.player2.pokemon.currentMove.priority;

    if (priorityDif < 0) return this.player2.pokemon;
    if (priorityDif > 0) return this.player1.pokemon;

    return null;
  }

  firstBySpeed() {
    const speedDif =
      this.player1.pokemon.stats.speed - this.player2.pokemon.stats.speed;

    if (speedDif < 0) return this.player2.pokemon;
    if (speedDif > 0) return this.player1.pokemon;

    return null;
  }

  printBattleStatus() {
    console.table([
      {
        player: this.player1.name,
        pokemon: this.player1.pokemon.name,
        level: this.player1.pokemon.level,
        HP: this.player1.pokemon.currentHp,
      },
      {
        player: this.player2.name,
        pokemon: this.player2.pokemon.name,
        level: this.player2.pokemon.level,
        HP: this.player2.pokemon.currentHp,
      },
    ]);
  }
}
