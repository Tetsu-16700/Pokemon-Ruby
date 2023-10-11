// se importa 

class Player {
  constructor(name, species, pokeName, level) {
    this.name = name;
    this.pokemon = new Pokemon(species, pokeName, level);
  }

  selectMove() {
    const options = this.pokemon.moves;

    let move;
    while (true) {
      move = prompt(`Choose a move:\n${options.join("\n")}`, options[0]);
      if (this.pokemon.moves.includes(move) || move === null) break;

      alert("Invalid option");
      this.selectMove();
    }
    if (move === null) return true;

    this.pokemon.setCurrentMove(move);
  }
}

class Bot extends Player {
  selectMove() {
    let randomIndex = Math.floor(Math.random() * this.pokemon.moves.length);
    let move = this.pokemon.moves[randomIndex];
    this.pokemon.setCurrentMove(move);
  }
}

export { Player, Bot};
