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

var testsExecuted = 0;
var goodResults = 0;

for (var i = 0; i < testIterations; i++) {
    var x = Math.floor(Math.random() * maxRandom);
    var y = Math.floor(Math.random() * maxRandom);

    // Adjust numbers aacording to requirements...
    if (withNegative) {
        x -= maxRandom;
        y -= maxRandom;
        if (withPositive) {
            x += maxRandom / 2;
            y += maxRandom / 2;
        }
    }

    test(x, y);
    test(x, x);
    // test(0, x);
    // test(x, 0);
}

console.log('TESTS=' + testsExecuted + ' SUC=' + goodResults + ' ERR=' + (testsExecuted - goodResults) + ' SUC.RATE=' + (goodResults / testsExecuted));

/*
 * train 
 */
function train(net, trainOptions, maxTrainInt) {
    // Expected output formats...
    const oLT = { // Less then (for a < b)
        lt: 1
    };
    const oGT = { // Greater then (for a > b)
        gt: 1
    };
    const oEQ = { // Equal to (for a = b)
        eq: 1
    };

    // Create an array of samples now...
    var samples = [];
    for (var i = 0; i < maxTrainInt; i++) {
        // x = Math.floor(Math.random() * maxRandom);
        x = i;

        if (withPositive) {
            // An example of the a < b...
            samples.push({
                input: {
                    a: x,
                    b: x + 1
                },
                output: oLT
            });

            // An example of the a > b...
            samples.push({
                input: {
                    a: x + 1,
                    b: x
                },
                output: oGT
            });

            // An example of the a = b...
            samples.push({
                input: {
                    a: x,
                    b: x
                },
                output: oEQ
            });
        }

        if (withNegative) {
            // An example of the a < b...
            samples.push({
                input: {
                    a: -x - 1,
                    b: -x
                },
                output: oLT
            });

            // An example of the a > b...
            samples.push({
                input: {
                    a: -x,
                    b: -x - 1
                },
                output: oGT
            });

            // An example of the a = b...
            samples.push({
                input: {
                    a: -x,
                    b: -x
                },
                output: oEQ
            });
        }

        if (withNegative && withPositive) {
            // An example of the a < b...
            samples.push({
                input: {
                    a: -x,
                    b: x
                },
                output: oLT
            });

            // An example of the a > b...
            samples.push({
                input: {
                    a: x,
                    b: -x
                },
                output: oGT
            });
        }
    }
    console.log('Number of samples: ' + samples.length)

    // Train the network...
    net.train(samples, trainOptions);
}

/*
 * test 
 */
function test(x, y) {
    var r = net.run({
        a: x,
        b: y
    });
    testsExecuted++;

    var eq = r.eq > r.lt && r.eq > r.gt;
    var lt = r.lt > r.eq && r.lt > r.gt;
    var gt = r.gt > r.eq && r.gt > r.lt;

    var correct =
        eq && x == y ||
        lt && x < y ||
        gt && x > y

    var vs = ' vs ';
    if (eq) vs = ' = '
    if (lt) vs = ' < '
    if (gt) vs = ' > ';

    if (correct)
        goodResults++;

    if (logAll)
        console.log(
            (correct ? 'OK  ' : 'ERR ') + x + vs + y +
            ' lt=' + r.lt + ' gt=' + r.gt + ' eq=' + r.eq
        );
    else if (!correct)
        console.log(
            'ERR ' + x + vs + y +
            ' lt=' + r.lt + ' gt=' + r.gt + ' eq=' + r.eq
        );
}