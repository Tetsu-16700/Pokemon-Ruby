class Pokemon {
  constructor(species, name, level = 1) {
    // Por parametros
    this.species = species;
    this.name = name || species;
    this.level = level;

    // Desde Pokedex
    let pokeData = Pokemons.find((p) => p.species === species);

    this.type = pokeData.type;
    this.baseExp = pokeData.baseExp;
    this.effortPoints = pokeData.effortPoints;
    this.growthRate = pokeData.growthRate;
    this.baseStats = pokeData.baseStats;
    this.moves = pokeData.moves;

    // Propiedades con cálculo de valor inicial
    this.experiencePoints = level === 1 ? 0 : this.expForLevel(level);
    this.individualValues = {
      hp: randomBetween(0, 31),
      attack: randomBetween(0, 31),
      defense: randomBetween(0, 31),
      specialAttack: randomBetween(0, 31),
      specialDefense: randomBetween(0, 31),
      speed: randomBetween(0, 31),
    };
    this.effortValues = {
      hp: 0,
      attack: 0,
      defense: 0,
      specialAttack: 0,
      specialDefense: 0,
      speed: 0,
    };
  }

  get stats() {
    const stats = {};
    for (let stat in this.baseStats) {
      const baseValue = this.baseStats[stat];

      const e = Math.floor(this.effortValues[stat] / 4);

      let value;
      if (stat === "hp") {
        value = Math.floor(
          ((2 * baseValue + this.individualValues[stat] + e) * this.level) /
            100 +
            this.level +
            10
        );
      } else {
        value = Math.floor(
          ((2 * baseValue + this.individualValues[stat] + e) * this.level) /
            100 +
            5
        );
      }

      stats[stat] = value;
    }

    return stats;
  }

  expForLevel(n) {
    const expCurve = ExperienceCurves[this.growthRate];

    return Math.ceil(expCurve(n));
  }

  prepareForBattle() {
    this.currentHp = this.baseStats.hp;
    this.currentMove = null;
  }

  receiveDamage(damage) {
    this.currentHp -= damage;
    if (this.currentHp < 0) this.currentHp = 0;
  }

  setCurrentMove(move) {
    this.currentMove = Moves.find((m) => m.name === move);
  }

  isFainted() {
    return this.currentHp === 0;
  }

  attack(target) {
    const summary = {
      attacker: this,
      defender: target,
      move: this.currentMove,
    };

    console.log(
      `%c${this.name} used ${this.currentMove.name.toUpperCase()}!`,
      "font-weight: bold"
    );

    summary.moveHits = this.moveHits();

    if (summary.moveHits) {
      const baseDamage = this.calculateBaseDamage(target);

      const isCritical = this.isCritical();
      if (isCritical) console.log("It was a CRITICAL hit!");

      const effectiveness = this.calculateEffectiveness(target);

      if (effectiveness <= 0.5) console.log("It's not very effective...");
      if (effectiveness >= 1.5) console.log("It's super effective!");
      if (effectiveness === 0) console.log(`It doesn't affect ${target.name}!`);

      let damage = isCritical ? baseDamage * 1.5 : baseDamage;
      damage = Math.floor(damage * effectiveness);

      target.receiveDamage(damage);
      console.log(`And it hit ${target.name} with ${damage} damage`);

      summary.isCritical = isCritical;
      summary.effectiveness = effectiveness;
      summary.damage = damage;
    } else {
      console.log("But it MISSED!");
    }

    return summary;
  }

  moveHits() {
    return randomBetween(1, 100) < this.currentMove.accuracy;
  }

  isCritical() {
    return randomBetween(1, 16) === 1;
  }

  calculateBaseDamage(target) {
    const isSpecial = SpecialMoveTypes.includes(this.currentMove.type);

    const offensiveStat = isSpecial
      ? this.stats.specialAttack
      : this.stats.attack;

    const defensiveStat = isSpecial
      ? target.stats.specialDefense
      : target.stats.defense;

    return (
      Math.floor(
        Math.floor(
          (Math.floor((2 * this.level) / 5 + 2) *
            offensiveStat *
            this.currentMove["power"]) /
            defensiveStat
        ) / 50
      ) + 2
    );
  }

  calculateEffectiveness(target) {
    return target.type.reduce((product, type) => {
      const multiplier = TypeMultiplier[this.currentMove.type][type] || 1;

      return product * multiplier;
    }, 1);
  }

  processVictory(target) {
    const experienceGained = Math.floor((target.baseExp * target.level) / 7);
    this.experiencePoints += experienceGained;
    this.effortValues[target.effortPoints.type] += target.effortPoints.amount;
    console.log(`${this.name} gained ${experienceGained} experience points`);

    let increasedLevel = false;

    while (this.experiencePoints >= this.expForLevel(this.level + 1)) {
      increasedLevel = true;
      this.level++;
    }

    if (increasedLevel) {
      console.log(`${this.name} reached level ${this.level}!`);
    }

    return {
      experienceGained,
      increasedLevel,
    };
  }
}
