const brain = require('brain.js');

const logAll = false;
const maxTrainInt = 400; // 400;
const testIterations = 10000;
const maxRandom = 1000000;

// Create a network instance...
const net = new brain.NeuralNetwork({
    activation: 'sigmoid', // activation function
    //hiddenLayers: [2, 2], // [4],
    //learningRate: 0.6 // global learning rate, useful when training using streams
});

// Training parameters...
const trainOpts = {
    // Defaults values --> expected validation
    iterations: 20000, // 20000,    // the maximum times to iterate the training data --> number greater than 0
    errorThresh: 0.005, // 0.005,   // the acceptable error percentage from training data --> number between 0 and 1
    log: false, // true to use console.log, when a function is supplied it is used --> Either true or a function
    logPeriod: 10, // iterations between logging out --> number greater than 0
    learningRate: 0.2, //0.3, // scales with delta to effect training rate --> number between 0 and 1
    momentum: 0.1, // scales with next layer's change value --> number between 0 and 1
    callback: null, // a periodic call back that can be triggered while training --> null or function
    callbackPeriod: 10, // the number of iterations through the training data between callback calls --> number greater than 0
    timeout: Infinity // the max number of milliseconds to train for --> number greater than 0
}

console.log('Training...');
train(net, trainOpts, maxTrainInt);

console.log('Testing...');

var testsExecuted = 0;
var goodResults = 0;

for (var i = 0; i < testIterations; i++) {
    var x = Math.floor(Math.random() * maxRandom);
    test(x);
}

console.log('TESTS=' + testsExecuted + ' SUC=' + goodResults + ' ERR=' + (testsExecuted - goodResults) + ' SUC.RATE=' + (goodResults / testsExecuted));

/*
 * train 
 */
function train(net, trainOptions, maxTrainInt) {
    // Expected output formats...
   // Create an array of samples now...
    var samples = [];
    for (var i = 0; i < maxTrainInt; i++) {
      //x = Math.floor(Math.random() * maxRandom);
      x = i;
      samples.push({input: [x], output: [x % 2]});
    }
    console.log('Number of samples: ' + samples.length)
    // Train the network...
    net.train(samples, trainOptions);
}

/*
 * test 
 */
function test(x) {
  let r = net.run([x]);
  testsExecuted++;

  let can = r[0] > 0.5;
  let rAnswer = x % 2

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