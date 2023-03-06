// import input.txt from "./input"

/*
    goal: calculate part 2.
    File 'adventOfCode2022Day11_part1' provides comments about the structure of fns (e.g. throwMonkey0) below.
    part 2 of 2: data: assignment testdata (not the data to solve the puzzle). business logic of part 2.

    solution (but with a hideous problem): correct result after 20 rounds and 1000 rounds. But on the way to 2000 rounds...'maximum bigint size exceeded'. 
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
let nrOfRounds = 20;

class GameOfKeepAwayPlayedByMonkeys {
    constructor(itemsWithEachMonkey) {
        this.itemsWithEachMonkey = itemsWithEachMonkey;
        // add attributes below for improved readability of the code: 
        this.worryLevelOfItemsThatAreControledByMonkey0 = this.itemsWithEachMonkey[0];
        this.worryLevelOfItemsThatAreControledByMonkey1 = this.itemsWithEachMonkey[1];
        this.worryLevelOfItemsThatAreControledByMonkey2 = this.itemsWithEachMonkey[2];
        this.worryLevelOfItemsThatAreControledByMonkey3 = this.itemsWithEachMonkey[3];
        this.monkey0TotalItemsHandled = 0;
        this.monkey1TotalItemsHandled = 0;
        this.monkey2TotalItemsHandled = 0;
        this.monkey3TotalItemsHandled = 0;
    }
 

    // convertToBigInt(){
    //    this.worryLevelOfItemsThatAreControledByMonkey0.forEach((monkey0Item) => {BigInt(monkey0Item)});
    //    this.worryLevelOfItemsThatAreControledByMonkey1.forEach((monkey1Item) => { BigInt(monkey1Item)});
    //    this.worryLevelOfItemsThatAreControledByMonkey2.forEach((monkey2Item) => { BigInt(monkey2Item)});
    //    this.worryLevelOfItemsThatAreControledByMonkey3.forEach((monkey3Item) => { BigInt(monkey3Item)});
    // }



    throwMonkey0() {
        if (this.worryLevelOfItemsThatAreControledByMonkey0.length === 0) {
        //    log('monkey 0 has not items, ao nothing to do this round.')
            return
        } else {
            this.monkey0TotalItemsHandled += this.worryLevelOfItemsThatAreControledByMonkey0.length;
            let itemsWithUpdatedWorryLevel = this.worryLevelOfItemsThatAreControledByMonkey0.map((itemToUpdateWorryLevel) => ((itemToUpdateWorryLevel *19n ) ))
            itemsWithUpdatedWorryLevel.forEach((itemWithUpdatedWorryLevel) => {
                if (itemWithUpdatedWorryLevel % 23n == 0) {
                    this.worryLevelOfItemsThatAreControledByMonkey2.push(itemWithUpdatedWorryLevel);  
                } else {
                    this.worryLevelOfItemsThatAreControledByMonkey3.push(itemWithUpdatedWorryLevel);   
                }
                this.worryLevelOfItemsThatAreControledByMonkey0.length = 0; 
            })
        }
    }

    throwMonkey1() {
        if (this.worryLevelOfItemsThatAreControledByMonkey1.length === 0) {
        //    log('monkey 1 has not items, so nothing to do this round.')
            return
        } else {
            this.monkey1TotalItemsHandled += this.worryLevelOfItemsThatAreControledByMonkey1.length;
            let itemsWithUpdatedWorryLevel = this.worryLevelOfItemsThatAreControledByMonkey1.map((itemToUpdateWorryLevel) => ((itemToUpdateWorryLevel +6n )  ))
            itemsWithUpdatedWorryLevel.forEach((itemWithUpdatedWorryLevel) => {
                if (itemWithUpdatedWorryLevel % 19n == 0) {
                    this.worryLevelOfItemsThatAreControledByMonkey2.push(itemWithUpdatedWorryLevel);  
                } else {
                    this.worryLevelOfItemsThatAreControledByMonkey0.push(itemWithUpdatedWorryLevel);   
                }
            })

        }
        this.worryLevelOfItemsThatAreControledByMonkey1.length = 0; 
    }

    throwMonkey2() {
        if (this.worryLevelOfItemsThatAreControledByMonkey2.length === 0) {
        //    log('monkey 2 has not items, so nothing to do this round.')
            return
        } else {
            this.monkey2TotalItemsHandled += this.worryLevelOfItemsThatAreControledByMonkey2.length;
            let itemsWithUpdatedWorryLevel = this.worryLevelOfItemsThatAreControledByMonkey2.map((itemToUpdateWorryLevel) => ((itemToUpdateWorryLevel * itemToUpdateWorryLevel )  ))
            itemsWithUpdatedWorryLevel.forEach((itemWithUpdatedWorryLevel) => {
                if (itemWithUpdatedWorryLevel % 13n == 0) {
                    this.worryLevelOfItemsThatAreControledByMonkey1.push(itemWithUpdatedWorryLevel);  
                } else {
                    this.worryLevelOfItemsThatAreControledByMonkey3.push(itemWithUpdatedWorryLevel);   
                }

            })
        }
        this.worryLevelOfItemsThatAreControledByMonkey2.length = 0; 
    }

    throwMonkey3() {
        if (this.worryLevelOfItemsThatAreControledByMonkey3.length === 0) {
            // log('monkey 3 has not items, so nothing to do this round.')
             return
         } else {
             this.monkey3TotalItemsHandled += this.worryLevelOfItemsThatAreControledByMonkey3.length;
             let itemsWithUpdatedWorryLevel = this.worryLevelOfItemsThatAreControledByMonkey3.map((itemToUpdateWorryLevel) => ((itemToUpdateWorryLevel +3n ) ))
             itemsWithUpdatedWorryLevel.forEach((itemWithUpdatedWorryLevel) => {
                 if (itemWithUpdatedWorryLevel % 17n == 0) {
                     this.worryLevelOfItemsThatAreControledByMonkey0.push(itemWithUpdatedWorryLevel);  
                 } else {
                     this.worryLevelOfItemsThatAreControledByMonkey1.push(itemWithUpdatedWorryLevel);   
                 }

             })
         }
         this.worryLevelOfItemsThatAreControledByMonkey3.length = 0; 
    }
}

let day11inputData =     
    [
        [79, 98],
        [54, 65, 75, 74],
        [79, 60, 97],
        [74]
    ]

let array = day11inputData;
let convertToBigInt = x => BigInt(x);
let arrayWithBigInts = array.map( subarray => subarray.map( convertToBigInt ));

log(arrayWithBigInts)

const gameOfKeepAwayPlayedByMonkeys = new GameOfKeepAwayPlayedByMonkeys(arrayWithBigInts);





// log('before:')
// console.log(gameOfKeepAwayPlayedByMonkeys)
// gameOfKeepAwayPlayedByMonkeys.convertToBigInt();

for (let i = 0; i < nrOfRounds; i++) {

    gameOfKeepAwayPlayedByMonkeys.throwMonkey0();
    gameOfKeepAwayPlayedByMonkeys.throwMonkey1();
    gameOfKeepAwayPlayedByMonkeys.throwMonkey2();
    gameOfKeepAwayPlayedByMonkeys.throwMonkey3();
}

// log('after:')
// log(gameOfKeepAwayPlayedByMonkeys.itemsWithEachMonkey)
log(gameOfKeepAwayPlayedByMonkeys.monkey0TotalItemsHandled); 
log(gameOfKeepAwayPlayedByMonkeys.monkey1TotalItemsHandled);
log(gameOfKeepAwayPlayedByMonkeys.monkey2TotalItemsHandled);
log(gameOfKeepAwayPlayedByMonkeys.monkey3TotalItemsHandled);

/*
    I could automatically select the 2 highest nrs and  multiply them.
    To save time,  I do this final step  by hand.

    
*/






















