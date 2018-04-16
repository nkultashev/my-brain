# Neural Numbers

A simple demo script on how to create and train a neural network capable to compare a pair of integer numbers.

## Requirements

- Node.js
- Node.js module brain.js

## Execution

- Install node.js
- Install brain.js:
```
npm install brain.js
```
- Run the script:
```
node nnums.js
```
## Output

Here is an example of the output:

```
nkvmbp:neural-numbers nkv$ node nnums.js
Training...
Number of samples: 3200
Testing...
TESTS=20000 SUC=20000 ERR=0 SUC.RATE=1
```

And another example:

```
nkvmbp:neural-numbers nkv$ node nnums.js
Training...
Number of samples: 3200
Testing...
ERR 112896 = 112836 lt=0.08772516250610352 gt=0.09226405620574951 eq=0.8677831888198853
TESTS=20000 SUC=19999 ERR=1 SUC.RATE=0.99995
```