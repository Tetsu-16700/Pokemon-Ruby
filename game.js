// se importa lo siguiente hacia game.js
import { Player, Bot} from "./player.js";
import { randomBetween} from "./utils.js";
import { Pokemons } from "./pokedex.js";
import { Battle} from "./battle.js";


class Game {
  start() {
    let [name, pokemon, pokemonName] = Game.welcome();
    this.player = new Player(name, pokemon, pokemonName, 3);

    let option;
    while (option !== null) {
      option = Game.menu();

      switch (option) {
        case "Train":
          this.train();
          break;
        case "Leader":
          this.challengeLeader();
          break;
        case "Stats":
          this.showStats();
          break;
      }
    }

    Game.goodbye();
  }

  train() {
    const randomIndex = randomBetween(0, Pokemons.length - 1);

    const opponent = new Bot(
      "Random Person",
      Pokemons[randomIndex].species,
      null,
      randomBetween(1, 5)
    );

    console.log(
      `%c${this.player.name} challenges ${opponent.name} for training`,
      "font-weight: bold"
    );
    console.log(
      `${opponent.name} has a ${opponent.pokemon.name} level ${opponent.pokemon.level}`
    );
    const wantToFight = confirm("Do you want to fight?");

    if (wantToFight) {
      const battle = new Battle(this.player, opponent);
      battle.start();
    }
  }

  challengeLeader() {
    const opponent = new Bot("Brock", "Onix", null, 10);
    const battle = new Battle(this.player, opponent);

    console.log(
      `%c${this.player.name} challenges ${opponent.name} for training`,
      "font-weight: bold"
    );
    console.log(
      `${opponent.name} has a ${opponent.pokemon.name} level ${opponent.pokemon.level}`
    );

    const wantToFight = confirm("Do you want to fight?");
    if (wantToFight) {
      battle.start();
    }
  }

  showStats() {
    const pokemon = this.player.pokemon;
    const stats = pokemon.stats;
    console.table({
      species: pokemon.species,
      level: pokemon.level,
      type: pokemon.type.join(", "),
      experiencePoints: pokemon.experiencePoints,
      stats: "",
      hp: stats.hp,
      attack: stats.attack,
      defense: stats.defense,
      specialAttack: stats.specialAttack,
      specialDefense: stats.specialDefense,
      speed: stats.speed,
    });
  }

  static welcome() {
    alert(`Welcome to Pokemon Yellow

Hello there! Welcome to the world of POKEMON! My name is OAK! People call me the POKEMON PROF!

This world is inhabited by creatures called POKEMON! For some people, POKEMON are pets. Others use them for fights.

Myself... I study POKEMON as a profession.`);

    const name = prompt("First, what is your name?", "Ash");

    alert(`Right! So your name is ${name.toUpperCase()}!

Your very own POKEMON legend is about to unfold! A world of dreams and adventures with POKEMON awaits! Let's go!

Here, ${name.toUpperCase()}! There are 3 POKEMON here!

When I was young, I was a serious POKEMON trainer. In my old age, I have only 3 left, but you can have one!`);

    const options = ["Bulbasaur", "Charmander", "Squirtle"];
    let pokemon;
    while (true) {
      pokemon = prompt(
        `Choose your pokemon:\n${options.join("\n")}`,
        options[0]
      );
      if (options.includes(pokemon)) break;

      alert("Invalid option");
    }

    alert(`You selected ${pokemon.toUpperCase()}. Great choice!`);

    const pokemonName =
      prompt("You can name your pokemon:", pokemon) || pokemon;

    alert(`${name.toUpperCase()}, raise your young ${pokemonName.toUpperCase()} by making it fight!

When you feel ready you can challenge BROCK, the PEWTER's GYM LEADER`);

    return [name, pokemon, pokemonName];
  }

  static menu() {
    const options = ["Train", "Stats", "Leader"];

    let option;
    while (true) {
      option = prompt(
        "What do you want to do next?\n" + options.join("\n"),
        options[0]
      );
      if (options.includes(option) || option === null) break;

      alert("Invalid option");
    }

    return option;
  }

  static goodbye() {
    console.log("%cThanks for playing Pokemon Yellow", "font-weight: bold");
    console.log("This game was created with love by: ...");
  }
}
//se exporta el codigo a index.js// segunda manera//
export { Game} ;