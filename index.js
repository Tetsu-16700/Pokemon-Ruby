let counter = 10;

let intervalId = setInterval(() => {
  console.clear();
  console.log("El juego empezará en... " + counter);
  counter--;
}, 1000);

setTimeout(() => {
  clearInterval(intervalId);
  const game = new Game();
  game.start();
}, (counter + 1) * 1000);
