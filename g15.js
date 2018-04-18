const brain = require('brain.js');

const logAll = false;
const maxTrainInt = 400; // 400;
const testIterations = 10000;
const maxRandom = 1000000;
const withPositive = true;
const withNegative = true;

// Create a network instance...
const net = new brain.NeuralNetwork({
    activation: 'sigmoid', // activation function
    hiddenLayers: [2, 2], // [4],
    learningRate: 0.6 // global learning rate, useful when training using streams
});

// Training parameters...
const trainOpts = {
    // Defaults values --> expected validation
    iterations: 20000, // 20000,    // the maximum times to iterate the training data --> number greater than 0
    errorThresh: 0.005, // 0.005,   // the acceptable error percentage from training data --> number between 0 and 1
    log: false, // true to use console.log, when a function is supplied it is used --> Either true or a function
    logPeriod: 10, // iterations between logging out --> number greater than 0
    learningRate: 0.02, //0.3, // scales with delta to effect training rate --> number between 0 and 1
    momentum: 0.1, // scales with next layer's change value --> number between 0 and 1
    callback: null, // a periodic call back that can be triggered while training --> null or function
    callbackPeriod: 10, // the number of iterations through the training data between callback calls --> number greater than 0
    timeout: Infinity // the max number of milliseconds to train for --> number greater than 0
}

console.log('Training...');
train(net, trainOpts, maxTrainInt);

console.log('Testing...');

let testsExecuted = 0;
let goodResults = 0;

for (let i = 0; i < testIterations; i++) {
    test(getRandomComb());
}

console.log('TESTS=' + testsExecuted + ' SUC=' + goodResults + ' ERR=' + (testsExecuted - goodResults) + ' SUC.RATE=' + (goodResults / testsExecuted));


// Проверяет можно ли заданную комбинацю пятнашек привести к оригинальной
function checkComb(comb) {
  const origSource = [1, 2, 3, 4, 8, 7, 6, 5, 9, 10, 11, 12, 15, 14, 13];
  // Проверка четности
  const checkParity = inVal => {
    let valParity = inVal.reduce((acc, curr, idx, arr) => {
      let rArr = arr.slice(idx + 1);
      acc += rArr.filter(rVal => rVal < curr).length;
      return acc;
    }, 0)
    return !(valParity % 2);
  }
  // Записываем четность оригинальной комбинации всегда false :)
  const origParity = checkParity(origSource)
  // Сверяем четность оригинальной комбинации с заданой, если четность одинаковая значит в заданую комбинацию можно перейти перестановками
  return origParity === checkParity(comb)
}




function getRandomComb (startComb) {
  function getRandomIntInclusive(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min; //The maximum is inclusive and the minimum is inclusive
  }
  //const arr = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15];
  const arr = startComb || [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15];
  for (let i = 0; i < 16; i++) {
    let rmIdx = getRandomIntInclusive(0, 14);
    let delItem = arr.splice(rmIdx, 1);
    let adIdx = getRandomIntInclusive(0, 13);
    arr.splice(adIdx, 0, delItem[0]);
  }
  return arr;
}

/*
 * train 
 */
function train(net, trainOptions, maxTrainInt) {
    // Create an array of samples now...
    let samples = [];
    for (let i = 0; i < maxTrainInt; i++) {
      let rndComb = getRandomComb()
      samples.push({
        input: rndComb,
        output: checkComb(rndComb) ? [1] : [0]
      });
    }
    console.log('Number of samples: ' + samples.length)
    // Train the network...
    net.train(samples, trainOptions);
}

/*
 * test 
 */
function test(x) {
    let r = net.run(x);
    testsExecuted++;

    let can = r[0] > 0.5;
    let rAnswer = checkComb(x)

    let correct =
        can && rAnswer ||
        !can && !rAnswer

    let vs = ' vs ';
    if (can) vs = ' CAN '
    else vs = ' CAN NOT '

    if (correct)
        goodResults++;

    if (logAll)
        console.log(
            (correct ? 'OK  ' : 'ERR ') + x + vs +
            ' can=' + r
        );
    else if (!correct)
        console.log(
            'ERR ' + x +
            ' can=' + r
        );
}