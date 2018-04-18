const synaptic = require('synaptic')

const logAll = false;
const maxTrainInt = 1000000; // 400;
const testIterations = 10000;
const maxRandom = 1000000;
const onlyPositive = false;

function createNet() {
  const inputLayer = new synaptic.Layer(2);
  const hiddenLayer1 = new synaptic.Layer(3);
  const hiddenLayer2 = new synaptic.Layer(5);
  const outputLayer = new synaptic.Layer(1);

  inputLayer.project(hiddenLayer1);
  hiddenLayer1.project(hiddenLayer2);
  hiddenLayer2.project(outputLayer);

   return new synaptic.Network({
    input: inputLayer,
    hidden: [hiddenLayer1, hiddenLayer2],
    output: outputLayer
  });
}


// Create a network instance...
const net = createNet();

console.log('Training...');
train(net, maxTrainInt)

console.log('Testing...');
let testsExecuted = 0;
let goodResults = 0;
for (let i = 0; i < testIterations; i++) {
    test(getRandomComb());
}
console.log('TESTS=' + testsExecuted + ' SUC=' + goodResults + ' ERR=' + (testsExecuted - goodResults) + ' SUC.RATE=' + (goodResults / testsExecuted));



// Проверяет можно ли заданную комбинацю пятнашек привести к оригинальной
function checkComb(comb) {
  const origSource = [1, 2, 3, 6, 5, 4, 7, 8];
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
  //const arr = [1,2,3,4,5,6,7,8];
  const arr = startComb || [1,2,3,4,5,6,7,8];
  for (let i = 0; i < 10; i++) {
    let rmIdx = getRandomIntInclusive(0, 7);
    let delItem = arr.splice(rmIdx, 1);
    let adIdx = getRandomIntInclusive(0, 6);
    arr.splice(adIdx, 0, delItem[0]);
  }
  return arr;
}

/*
 * train 
 */
function train(net, maxTrainInt) {
    // Create an array of samples now...
    let i = 0;
    while(i < maxTrainInt) {
      let rndComb = getRandomComb()
      let res = checkComb(rndComb)
      let resArr = res ? [1] : [0]
      if (onlyPositive && !res) {
        continue
      }
      i =  i + 1;
      net.activate(rndComb)
      net.propagate(0.3, resArr)
    }
    console.log('Number of samples: ' + i)
    // Train the network...
}

/*
 * test 
 */
function test(x) {
    let r = net.activate(x);
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
