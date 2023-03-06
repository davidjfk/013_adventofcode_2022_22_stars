// import input.txt from "./input"

/*
    goal: calculate part 2.
    File 'adventOfCode2022Day11_part1' provides comments about the structure of fns (e.g. throwMonkey0) below.
    part 2 of 2: data: assignment data to solve the puzzle combined with business logic of part 2.
    goal: to prevent range error (the ints and BigInts get to big without measures), combine 2 techniques:
        a) instead of int use BigInt
        b) use math rounding trick from fn throwMonkey2 from file 'adVentOfCode2022Day11_part2_try05.js'.
    
    result: ok, problem solved.                     
*/

const log = console.log;

const {readFileSync} = require("fs");
const { toNamespacedPath } = require("path");


const input = readFileSync("input.txt", "utf-8").split('\r\n');
log('01_input-from-file: ')
// log(input)

/*
config:
*/
let nrOfRoundsToPlay = 10000;


class GameOfKeepAwayPlayedByMonkeys {
    constructor(itemsWithEachMonkey) {
        this.itemsWithEachMonkey = itemsWithEachMonkey;
        // add attributes below for improved readability of the code: 
        this.worryLevelOfItemsThatAreControledByMonkey0 = this.itemsWithEachMonkey[0];
        this.worryLevelOfItemsThatAreControledByMonkey1 = this.itemsWithEachMonkey[1];
        this.worryLevelOfItemsThatAreControledByMonkey2 = this.itemsWithEachMonkey[2];
        this.worryLevelOfItemsThatAreControledByMonkey3 = this.itemsWithEachMonkey[3];
        this.worryLevelOfItemsThatAreControledByMonkey4 = this.itemsWithEachMonkey[4];
        this.worryLevelOfItemsThatAreControledByMonkey5 = this.itemsWithEachMonkey[5];
        this.worryLevelOfItemsThatAreControledByMonkey6 = this.itemsWithEachMonkey[6];
        this.worryLevelOfItemsThatAreControledByMonkey7 = this.itemsWithEachMonkey[7];
        this.monkey0TotalItemsHandled = 0;
        this.monkey1TotalItemsHandled = 0;
        this.monkey2TotalItemsHandled = 0;
        this.monkey3TotalItemsHandled = 0;
        this.monkey4TotalItemsHandled = 0;
        this.monkey5TotalItemsHandled = 0;
        this.monkey6TotalItemsHandled = 0;
        this.monkey7TotalItemsHandled = 0;
    }

    throwMonkey0() {
        if (this.worryLevelOfItemsThatAreControledByMonkey0.length == 0) {
            return
        } else {
            this.monkey0TotalItemsHandled += this.worryLevelOfItemsThatAreControledByMonkey0.length;
            let itemsWithUpdatedWorryLevel = this.worryLevelOfItemsThatAreControledByMonkey0.map((itemToUpdateWorryLevel) => (itemToUpdateWorryLevel * 19n ))

            itemsWithUpdatedWorryLevel.forEach((itemWithUpdatedWorryLevel) => {
                if (itemWithUpdatedWorryLevel % 17n == 0) {
                    this.worryLevelOfItemsThatAreControledByMonkey2.push(itemWithUpdatedWorryLevel);  
                } else {
                    this.worryLevelOfItemsThatAreControledByMonkey7.push(itemWithUpdatedWorryLevel);   
                }
                this.worryLevelOfItemsThatAreControledByMonkey0.length = 0; 
            })
        }
    }

    throwMonkey1() {
        if (this.worryLevelOfItemsThatAreControledByMonkey1.length == 0) {
            return
        } else {
            this.monkey1TotalItemsHandled += this.worryLevelOfItemsThatAreControledByMonkey1.length;
            let itemsWithUpdatedWorryLevel = this.worryLevelOfItemsThatAreControledByMonkey1.map((itemToUpdateWorryLevel) => ((itemToUpdateWorryLevel +2n) ))
            itemsWithUpdatedWorryLevel.forEach((itemWithUpdatedWorryLevel) => {
                if (itemWithUpdatedWorryLevel % 19n == 0) {
                    this.worryLevelOfItemsThatAreControledByMonkey7.push(itemWithUpdatedWorryLevel);  
                } else {
                    this.worryLevelOfItemsThatAreControledByMonkey0.push(itemWithUpdatedWorryLevel);   
                }
            })

        }
        this.worryLevelOfItemsThatAreControledByMonkey1.length = 0; 
    }

    throwMonkey2() {
        if (this.worryLevelOfItemsThatAreControledByMonkey2.length == 0) {
            return
        } else {
            this.monkey2TotalItemsHandled += this.worryLevelOfItemsThatAreControledByMonkey2.length;
            let itemsWithUpdatedWorryLevel = this.worryLevelOfItemsThatAreControledByMonkey2.map((itemToUpdateWorryLevel) => ((itemToUpdateWorryLevel +7n) ))
            itemsWithUpdatedWorryLevel.forEach((itemWithUpdatedWorryLevel) => {
                if (itemWithUpdatedWorryLevel % 7n == 0) {
                    this.worryLevelOfItemsThatAreControledByMonkey4.push(itemWithUpdatedWorryLevel);  
                } else {
                    this.worryLevelOfItemsThatAreControledByMonkey3.push(itemWithUpdatedWorryLevel);   
                }

            })
        }
        this.worryLevelOfItemsThatAreControledByMonkey2.length = 0; 
    }

    throwMonkey3() {
        if (this.worryLevelOfItemsThatAreControledByMonkey3.length == 0) {
             return
         } else {
             this.monkey3TotalItemsHandled += this.worryLevelOfItemsThatAreControledByMonkey3.length;
             let itemsWithUpdatedWorryLevel = this.worryLevelOfItemsThatAreControledByMonkey3.map((itemToUpdateWorryLevel) => ((itemToUpdateWorryLevel +1n)))
             itemsWithUpdatedWorryLevel.forEach((itemWithUpdatedWorryLevel) => {
                 if (itemWithUpdatedWorryLevel % 11n == 0) {
                     this.worryLevelOfItemsThatAreControledByMonkey6.push(itemWithUpdatedWorryLevel);  
                 } else {
                     this.worryLevelOfItemsThatAreControledByMonkey4.push(itemWithUpdatedWorryLevel);   
                 }

             })
         }
         this.worryLevelOfItemsThatAreControledByMonkey3.length = 0; 
    }

    throwMonkey4() {
        if (this.worryLevelOfItemsThatAreControledByMonkey4.length == 0) {
             return
         } else {
             this.monkey4TotalItemsHandled += this.worryLevelOfItemsThatAreControledByMonkey4.length;
             let itemsWithUpdatedWorryLevel = this.worryLevelOfItemsThatAreControledByMonkey4.map((itemToUpdateWorryLevel) => ((itemToUpdateWorryLevel*5n) ))
             
                        
             itemsWithUpdatedWorryLevel.forEach((itemWithUpdatedWorryLevel) => {
                 if (itemWithUpdatedWorryLevel % 13n == 0) { 
                    // itemWithUpdatedWorryLevel = BigInt(itemWithUpdatedWorryLevel);
                     this.worryLevelOfItemsThatAreControledByMonkey6.push(itemWithUpdatedWorryLevel);  
                    //  log('hi')
                 } else {
                    // log('bar')
                    // itemWithUpdatedWorryLevel = BigInt(itemWithUpdatedWorryLevel);
                     this.worryLevelOfItemsThatAreControledByMonkey5.push(itemWithUpdatedWorryLevel);   
                 }
             })
         }
         this.worryLevelOfItemsThatAreControledByMonkey4.length = 0; 
    }

    throwMonkey5() {
        if (this.worryLevelOfItemsThatAreControledByMonkey5.length == 0) {
             return
         } else {
             this.monkey5TotalItemsHandled += this.worryLevelOfItemsThatAreControledByMonkey5.length;
             let itemsWithUpdatedWorryLevel = this.worryLevelOfItemsThatAreControledByMonkey5.map((itemToUpdateWorryLevel) => ((itemToUpdateWorryLevel +5n) ))
                        
             itemsWithUpdatedWorryLevel.forEach((itemWithUpdatedWorryLevel) => {
                 if (itemWithUpdatedWorryLevel % 3n == 0) {
                     this.worryLevelOfItemsThatAreControledByMonkey1.push(itemWithUpdatedWorryLevel);  
                 } else {
                     this.worryLevelOfItemsThatAreControledByMonkey0.push(itemWithUpdatedWorryLevel);   
                 }

             })
         }
         this.worryLevelOfItemsThatAreControledByMonkey5.length = 0; 
    }

    throwMonkey6() {
        if (this.worryLevelOfItemsThatAreControledByMonkey6.length == 0) {
             return
         } else {
             this.monkey6TotalItemsHandled += this.worryLevelOfItemsThatAreControledByMonkey6.length;
             let itemsWithUpdatedWorryLevel = this.worryLevelOfItemsThatAreControledByMonkey6.map((itemToUpdateWorryLevel) => {

                let itemWithUpdatedWorryLevel = itemToUpdateWorryLevel * itemToUpdateWorryLevel;
                // log(itemWithUpdatedWorryLevel)
                // if (itemWithUpdatedWorryLevel > Number.MAX_SAFE_INTEGER) {console.warn(`use BigInt instead.`)}
                // log(typeof( Number.MAX_SAFE_INTEGER))

                let multiplicationOfDivisorsFromAll7MonkeyFns = (17*19*7*11*13*3*5*2);   // value of this BigInt: 9699690n
                if (itemWithUpdatedWorryLevel > multiplicationOfDivisorsFromAll7MonkeyFns ) {
                    // log(`is bigger: ${itemWithUpdatedWorryLevel}`)    // uncommenting indicates that the nrs get to big to store inside a number. 
                    /*
                        before making the nr smaller, the nr is already to big. I see e.g. at round 18 '3.121619265482557e+25'.
                        problem: this nr has been rounded / cut off at 16 decimals. This introduces rounding differences!!
                        QED: use the same approach but with bigInt!
                    */
                    itemWithUpdatedWorryLevel = (itemWithUpdatedWorryLevel % BigInt(Math.round(multiplicationOfDivisorsFromAll7MonkeyFns))) 
                    return itemWithUpdatedWorryLevel; 
                } else {
                    return itemWithUpdatedWorryLevel;  
                }

                //  return itemWithUpdatedWorryLevel;  
                }
             )
             // comment in fn throwMonkey2 from file 'adVentOfCode2022Day11_part2_try05.js' explains the next code block.

             itemsWithUpdatedWorryLevel.forEach((itemWithUpdatedWorryLevel) => {
                 if (itemWithUpdatedWorryLevel % 5n == 0) {
                     this.worryLevelOfItemsThatAreControledByMonkey5.push(itemWithUpdatedWorryLevel);  
                 } else {
                     this.worryLevelOfItemsThatAreControledByMonkey1.push(itemWithUpdatedWorryLevel);   
                 }

             })
         }
         this.worryLevelOfItemsThatAreControledByMonkey6.length = 0; 

    }

    throwMonkey7() {
        if (this.worryLevelOfItemsThatAreControledByMonkey7.length == 0) {
             return
         } else {
             this.monkey7TotalItemsHandled += this.worryLevelOfItemsThatAreControledByMonkey7.length;
             let itemsWithUpdatedWorryLevel = this.worryLevelOfItemsThatAreControledByMonkey7.map((itemToUpdateWorryLevel) => ((itemToUpdateWorryLevel +3n) ))
             itemsWithUpdatedWorryLevel.forEach((itemWithUpdatedWorryLevel) => {
                 if (itemWithUpdatedWorryLevel % 2n == 0) {
                     this.worryLevelOfItemsThatAreControledByMonkey2.push(itemWithUpdatedWorryLevel);  
                 } else {
                     this.worryLevelOfItemsThatAreControledByMonkey3.push(itemWithUpdatedWorryLevel);   
                 }

             })
         }
         this.worryLevelOfItemsThatAreControledByMonkey7.length = 0; 
    }


}


let day11inputData =     
[
    [83, 97, 95, 67],
    [71, 70, 79, 88, 56, 70],
    [98, 51, 51, 63, 80, 85, 84, 95],
    [77, 90, 82, 80, 79],
    [68],
    [60, 94],
    [81, 51, 85],
    [98, 81, 63, 65, 84, 71, 84]
]




let array = day11inputData;
let convertToBigInt = x => BigInt(x);
let arrayWithBigInts = array.map( subarray => subarray.map( convertToBigInt ));

// log(arrayWithBigInts)

const gameOfKeepAwayPlayedByMonkeys = new GameOfKeepAwayPlayedByMonkeys(arrayWithBigInts);
// log('before:')
// console.log(gameOfKeepAwayPlayedByMonkeys)
// gameOfKeepAwayPlayedByMonkeys.convertToBigInt();

for (let i = 0; i < nrOfRoundsToPlay; i++) {

    gameOfKeepAwayPlayedByMonkeys.throwMonkey0();
    gameOfKeepAwayPlayedByMonkeys.throwMonkey1();
    gameOfKeepAwayPlayedByMonkeys.throwMonkey2();
    gameOfKeepAwayPlayedByMonkeys.throwMonkey3();
    gameOfKeepAwayPlayedByMonkeys.throwMonkey4();
    gameOfKeepAwayPlayedByMonkeys.throwMonkey5();
    gameOfKeepAwayPlayedByMonkeys.throwMonkey6();
    gameOfKeepAwayPlayedByMonkeys.throwMonkey7();

}

log('after:')
console.log(gameOfKeepAwayPlayedByMonkeys.itemsWithEachMonkey)
// log(gameOfKeepAwayPlayedByMonkeys.monkey0TotalItemsHandled); 
// log(gameOfKeepAwayPlayedByMonkeys.monkey1TotalItemsHandled);
// log(gameOfKeepAwayPlayedByMonkeys.monkey2TotalItemsHandled);
// log(gameOfKeepAwayPlayedByMonkeys.monkey3TotalItemsHandled);
// log(gameOfKeepAwayPlayedByMonkeys.monkey4TotalItemsHandled);
// log(gameOfKeepAwayPlayedByMonkeys.monkey5TotalItemsHandled); 
// log(gameOfKeepAwayPlayedByMonkeys.monkey6TotalItemsHandled);
// log(gameOfKeepAwayPlayedByMonkeys.monkey7TotalItemsHandled); 


let arrayWithResults = [

(gameOfKeepAwayPlayedByMonkeys.monkey0TotalItemsHandled),
(gameOfKeepAwayPlayedByMonkeys.monkey1TotalItemsHandled),
(gameOfKeepAwayPlayedByMonkeys.monkey2TotalItemsHandled),
(gameOfKeepAwayPlayedByMonkeys.monkey3TotalItemsHandled),
(gameOfKeepAwayPlayedByMonkeys.monkey4TotalItemsHandled),
(gameOfKeepAwayPlayedByMonkeys.monkey5TotalItemsHandled),
(gameOfKeepAwayPlayedByMonkeys.monkey6TotalItemsHandled),
(gameOfKeepAwayPlayedByMonkeys.monkey7TotalItemsHandled)
]

log(arrayWithResults)


let highestNrOfItemInspectionByMonkey = (Math.max(...arrayWithResults));
log(highestNrOfItemInspectionByMonkey);

let MonkeyNrWithhighestNrOfItemInspections = (arrayWithResults.indexOf((Math.max(...arrayWithResults))));
//log(MonkeyNrWithhighestNrOfItemInspections);


// get monkey with second highest nr of item-inspections:
arrayWithResults.splice(MonkeyNrWithhighestNrOfItemInspections,1);

let secondHighestNrOfItemInspectionByMonkey = (Math.max(...arrayWithResults));
log(secondHighestNrOfItemInspectionByMonkey);


let MonkeyNrWithSecondHighestNrOfItemInspections = (arrayWithResults.indexOf((Math.max(...arrayWithResults))));
// log(MonkeyNrWithSecondHighestNrOfItemInspections);


//final score:
let levelOfMonkeyBusinessAfter10000Rounds = highestNrOfItemInspectionByMonkey * secondHighestNrOfItemInspectionByMonkey;
log(levelOfMonkeyBusinessAfter10000Rounds);

// correct answer: 25712998901 





















