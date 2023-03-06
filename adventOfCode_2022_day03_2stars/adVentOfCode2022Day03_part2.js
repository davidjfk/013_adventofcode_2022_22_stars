// import input.txt from "./input"

const log = console.log;

const {readFileSync} = require("fs");


const input = readFileSync("input.txt", "utf-8").split('\r\n');
log('01_input-from-file: ')
log(input)




// source: https://bobbyhadz.com/blog/javascript-split-string-by-index 
function split(str, index) {
    const result = [str.slice(0, index), str.slice(index)]; 
    return result;
}

// ex: 
// const [first, second] = split('abcd', 2);
// console.log(first); // 👉️ "ab"
// console.log(second); // 👉️ "cd"




function sliceIntoChunks(arr, chunkSize) {
    const res = [];
    for (let i = 0; i < arr.length; i += chunkSize) {
        const chunk = arr.slice(i, i + chunkSize);
        res.push(chunk);
    }
    return res;
}

const entireArrayWithElves = input;
arrayWith3ElvesPerSubArray =  (sliceIntoChunks(entireArrayWithElves, 3));
log('02_arrayWith3ElvesPerSubArray: ')
log(arrayWith3ElvesPerSubArray);




let getBadgeItemCommonBetweenAllThreeElves = (arrayWith3ElvesPerSubArray) => {
    let badgeItemInRucksackOfAll3ElvesOfEachGroup = [];

    badgeItemInRucksackOfAll3ElvesOfEachGroup = arrayWith3ElvesPerSubArray.map((arrayWith3Elves, index) => {
        
        // log(rucksack)
        
        
        let [elf1, elf2, elf3] = arrayWith3Elves;
        // log('first:')
        // log(first); 
        // log(index)
        // log('second:')
        // log(second); 
        // log(index);

        for (letter of elf1){
            if ((elf2.includes(letter) && (elf3.includes(letter))) )  {
                return letter;
            };
        }




        // for (let i = 0; i < first.length; i++) {
        //     if (second.includes((first[i]))) {
        //         ruckSackItemsInBothCompartments.push(first[i])
        //     };
        // }
    });
    return badgeItemInRucksackOfAll3ElvesOfEachGroup;
}

let arrayWithBadgeItemsWith1BadgeItemForEachGroupOf3Elves = getBadgeItemCommonBetweenAllThreeElves(arrayWith3ElvesPerSubArray)
log('03_arrayWithBadgeItemsWith1BadgeItemForEachGroupOf3Elves: ')
log(arrayWithBadgeItemsWith1BadgeItemForEachGroupOf3Elves);






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

let arrayWithNumericValueForEachString = createArrayWithNumericValueForEachString(arrayWithBadgeItemsWith1BadgeItemForEachGroupOf3Elves);
log('04_arrayWithNumericValueForEachString: ')
log(arrayWithNumericValueForEachString)




const sum = arrayWithNumericValueForEachString.reduce((a, b) => a + b);
log('05_sum of all numbers: ')
console.log(sum);





