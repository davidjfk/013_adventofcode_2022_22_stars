// import input.txt from "./input"


const log = console.log;

const {readFileSync} = require("fs");


const input = readFileSync("input.txt", "utf-8").split('\r\n');
log('01_input-from-file: ')
// log(input)




// source: https://bobbyhadz.com/blog/javascript-split-string-by-index 
function split(str, index) {
    const result = [str.slice(0, index), str.slice(index)]; 
    return result;
  }

// ex: 
// const [first, second] = split('abcd', 2);
// console.log(first); // 👉️ "ab"
// console.log(second); // 👉️ "cd"




let divideRucksackItemsBetween2Compartments = (input) => {

    let rucksacksWith2CompartmentsWithItems = [];
    rucksacksWith2CompartmentsWithItems = input.map((rucksack) => {
        let result = split(rucksack, rucksack.length / 2);
        // log(result)
        return result;
        
    });
    return rucksacksWith2CompartmentsWithItems;
    

}

let rucksacksWith2CompartmentsWithItems = divideRucksackItemsBetween2Compartments(input);
log('02_rucksacksWith2CompartmentsWithItems: ')
log(rucksacksWith2CompartmentsWithItems);



let getArrayWithOnlyItemsInBothCompartments2 = (rucksackWith2UndividedCompartments) => {
    let ruckSackItemsInBothCompartments = [];

    ruckSackItemsInBothCompartments = rucksackWith2UndividedCompartments.map((rucksack, index) => {
        
        // log(rucksack)
        
        
        let [first, second] = rucksack;
        // log('first:')
        // log(first); 
        // log(index)
        // log('second:')
        // log(second); 
        // log(index);

        for (letter of first){
            if (second.includes(letter)) {
                return letter;
            };
        }

        // for (let i = 0; i < first.length; i++) {
        //     if (second.includes((first[i]))) {
        //         ruckSackItemsInBothCompartments.push(first[i])
        //     };
        // }
    });
    return ruckSackItemsInBothCompartments;
}

let ruckSackItemsInBothCompartments = getArrayWithOnlyItemsInBothCompartments2(rucksacksWith2CompartmentsWithItems)
log('03_rucksackItemsInBothCompartments2: ')
log(ruckSackItemsInBothCompartments);



//an: in fn below the 'push' messes things up. 
// let getArrayWithOnlyItemsInBothCompartments = (input) => {

//     let ruckSackItemsInBothCompartments = [];

//     const roundScores = input.map((rucksack) => {
//         const [first, second] = split(rucksack, rucksack.length / 2);
        
        
//         // console.log(typeof(rucksack.length))
//         log('first:')
//         console.log(first); 
//         log('second:')
//         console.log(second); 

//         for (let i = 0; i < first.length; i++) {
//             if (second.includes((first[i]))) {
//                 ruckSackItemsInBothCompartments.push(first[i])
//             };
//         }
//     // return roundScores;
//     });
//     return ruckSackItemsInBothCompartments;
// }

// let ruckSackItemsInBothCompartments = getArrayWithOnlyItemsInBothCompartments(input)
// log('03_dev: array with strings, business: ruckSackItemsInBothCompartments: ')
// log(ruckSackItemsInBothCompartments)



let calculateNumericValueForEachStringValue = (character) => {

    if (character == character.toUpperCase()) {
        // log('upper case true');
        let numericValue = character.toLowerCase().charCodeAt(0) - 96
        /*
        Uppercase item types A through Z have priorities 27 through 52.
        */
        numericValue += 26; 
        // log(numericValue);
        return numericValue;

    }
    if (character == character.toLowerCase()){
        // log('lower case true');

        let numericValue = character.charCodeAt(0) - 96
        /*
        Lowercase item types a through z have priorities 1 through 26.
        */
        // log(numericValue);
        return numericValue;
    }
}

let createArrayWithNumericValueForEachString = (arrayWithLetters) => {

    let arrayWithScores = [];

    arrayWithScores = arrayWithLetters.map((letter) => {
        return calculateNumericValueForEachStringValue(letter)
    })
    // log(arrayWithScores);
    return arrayWithScores;

}

let arrayWithNumericValueForEachString = createArrayWithNumericValueForEachString(ruckSackItemsInBothCompartments);
log('04_arrayWithNumericValueForEachString: ')
log(arrayWithNumericValueForEachString)


const sum = arrayWithNumericValueForEachString.reduce((a, b) => a + b);
log('05_sum of all numbers: ')
console.log(sum);





