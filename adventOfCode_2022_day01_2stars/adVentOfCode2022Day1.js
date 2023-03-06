// import input.txt from "./input"



const log = console.log;

const {readFileSync} = require("fs");


const input = readFileSync("input.txt", "utf-8").split('\r\n');
// log(input)



let inputAsString = input.toString()
// log(inputAsString)
let arrayWithStrings = inputAsString.split(',,')
// log(arrayWithStrings)

let arrayWithArrays = arrayWithStrings.map((row) => row.toString().split(','));
log(arrayWithArrays)

let arrayWithArraysAsNumbers = arrayWithArrays.map((row) => row.reduce((a, b) => +a + +b));

log(arrayWithArraysAsNumbers)


// let arrayWithCaloriesperElf = arrayWithArrays.map((elf) => elf.reduce((a, b) => a + b))
// log(arrayWithCaloriesperElf)

// const sum = roundScores.reduce((a, b) => a + b);

let total;
log('hier:')
let highestNumber1 = (Math.max(...arrayWithArraysAsNumbers));
log(highestNumber1)
total = highestNumber1;

let index = arrayWithArraysAsNumbers.indexOf(highestNumber1);
// log(index)
arrayWithArraysAsNumbers[index] = 0;

highestNumber2 = (Math.max(...arrayWithArraysAsNumbers));
log(highestNumber2)
total += highestNumber2;

index = arrayWithArraysAsNumbers.indexOf(highestNumber2);
// log(index)
arrayWithArraysAsNumbers[index] = 0;

highestNumber3 = (Math.max(...arrayWithArraysAsNumbers));
log(highestNumber3)
total += highestNumber3;

log(total)

const list = [1, 2, 3, 4, 5, 6];
const middleIndex = Math.ceil(list.length / 2);

const firstHalf = list.splice(0, middleIndex);   
const secondHalf = list.splice(-middleIndex);

console.log(firstHalf);  // [1, 2, 3]
console.log(secondHalf); // [4, 5, 6]
console.log(list);       // []