// import input.txt from "./input"

/*
    goal: calculate part 2.

    solution (but with a hideous problem): correct result after 20 rounds and 1000 rounds. 
    But on the way to 2000 rounds...'maximum bigint size exceeded'. 
    goal: try to solve problem from previous try_01. hypothesis: test if using separate arrays instead of array with nested arrays 
    improves performance of the many bigInts out there... (result: nope, same problem, so try something else)

    // problem: you cannot use map-fn to change array (here: e.g. this.worryLevelOfItemsThatAreControledByMonkey0) in place.  See code below. 
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
let nrOfRoundsToPlay = 20;


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

    // problem: you cannot use map-fn to change array (here: e.g. this.worryLevelOfItemsThatAreControledByMonkey0) in place.  
    convertToBigInt(){
        this.worryLevelOfItemsThatAreControledByMonkey0 = this.worryLevelOfItemsThatAreControledByMonkey0.map((monkey0Item) => {BigInt(monkey0Item)});
        this.worryLevelOfItemsThatAreControledByMonkey1= this.worryLevelOfItemsThatAreControledByMonkey1.map((monkey1Item) => { BigInt(monkey1Item)});
        this.worryLevelOfItemsThatAreControledByMonkey2 = this.worryLevelOfItemsThatAreControledByMonkey2.map((monkey2Item) => { BigInt(monkey2Item)});
        this.worryLevelOfItemsThatAreControledByMonkey3 = this.worryLevelOfItemsThatAreControledByMonkey3.map((monkey3Item) => { BigInt(monkey3Item)});
        this.worryLevelOfItemsThatAreControledByMonkey4 = this.worryLevelOfItemsThatAreControledByMonkey4.map((monkey4Item) => { BigInt(monkey4Item)});
        this.worryLevelOfItemsThatAreControledByMonkey5 = this.worryLevelOfItemsThatAreControledByMonkey5.map((monkey5Item) => { BigInt(monkey5Item)});
        this.worryLevelOfItemsThatAreControledByMonkey6 = this.worryLevelOfItemsThatAreControledByMonkey6.map((monkey6Item) => { BigInt(monkey6Item)});
        this.worryLevelOfItemsThatAreControledByMonkey7 = this.worryLevelOfItemsThatAreControledByMonkey7.map((monkey7Item) => { BigInt(monkey7Item)});
    }

    throwMonkey0() {
        // for later reference I explicitly describe what happens inside this first fn.
        
        if (this.worryLevelOfItemsThatAreControledByMonkey0.length === 0) {
            /* requirement: if monkey does not have "stolen" items
                (i.e. at beginning of the round), then monkey does nothing this round.
            */
           log('monkey 0 has not items, ao nothing to do this round.')
            return
        } else {

            /*
                Number of times monkey 0 inspects items in  this round. Add this  to the  total nr of item-inspections of this monkey in 20 rounds:
            */
            this.monkey0TotalItemsHandled += this.worryLevelOfItemsThatAreControledByMonkey0.length;

            /* items must be thrown one by one (a.k.a. in a first in, first out manner. In  logistics: "fifo". So you must not reverse the list to implement that. 
                e.g. items = [a, b, c] --> you must push [a, b, c] to implement fifo.
            */
            // let reversedWorryLevelItemsThatAreControledByMonkey0 = this.worryLevelOfItemsThatAreControledByMonkey0.slice(0).reverse().map((worryLevelItem) => worryLevelItem );   

            // worry-level-change caused by inspection of the monkey, then reduced worry (" divided by 3"), then round down.
            let itemsWithUpdatedWorryLevel = this.worryLevelOfItemsThatAreControledByMonkey0.map((itemToUpdateWorryLevel) => (itemToUpdateWorryLevel * 19 ))

            itemsWithUpdatedWorryLevel.forEach((itemWithUpdatedWorryLevel) => {
                if (itemWithUpdatedWorryLevel % 17 == 0) {
                    this.worryLevelOfItemsThatAreControledByMonkey2.push(itemWithUpdatedWorryLevel);  
                } else {
                    this.worryLevelOfItemsThatAreControledByMonkey7.push(itemWithUpdatedWorryLevel);   
                }
                // monkey has thrown all its items to other monkeys.
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
            let itemsWithUpdatedWorryLevel = this.worryLevelOfItemsThatAreControledByMonkey1.map((itemToUpdateWorryLevel) => ((itemToUpdateWorryLevel +2) ))
            itemsWithUpdatedWorryLevel.forEach((itemWithUpdatedWorryLevel) => {
                if (itemWithUpdatedWorryLevel % 19 == 0) {
                    this.worryLevelOfItemsThatAreControledByMonkey7.push(itemWithUpdatedWorryLevel);  
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
            let itemsWithUpdatedWorryLevel = this.worryLevelOfItemsThatAreControledByMonkey2.map((itemToUpdateWorryLevel) => ((itemToUpdateWorryLevel +7) ))
            itemsWithUpdatedWorryLevel.forEach((itemWithUpdatedWorryLevel) => {
                if (itemWithUpdatedWorryLevel % 7 == 0) {
                    this.worryLevelOfItemsThatAreControledByMonkey4.push(itemWithUpdatedWorryLevel);  
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
             let itemsWithUpdatedWorryLevel = this.worryLevelOfItemsThatAreControledByMonkey3.map((itemToUpdateWorryLevel) => ((itemToUpdateWorryLevel +1)))
             itemsWithUpdatedWorryLevel.forEach((itemWithUpdatedWorryLevel) => {
                 if (itemWithUpdatedWorryLevel % 11 == 0) {
                     this.worryLevelOfItemsThatAreControledByMonkey6.push(itemWithUpdatedWorryLevel);  
                 } else {
                     this.worryLevelOfItemsThatAreControledByMonkey4.push(itemWithUpdatedWorryLevel);   
                 }

             })
         }
         this.worryLevelOfItemsThatAreControledByMonkey3.length = 0; 
    }

    throwMonkey4() {
        if (this.worryLevelOfItemsThatAreControledByMonkey4.length === 0) {
            // log('monkey 4 has not items, so nothing to do this round.')
             return
         } else {
             this.monkey4TotalItemsHandled += this.worryLevelOfItemsThatAreControledByMonkey4.length;
             let itemsWithUpdatedWorryLevel = this.worryLevelOfItemsThatAreControledByMonkey4.map((itemToUpdateWorryLevel) => ((itemToUpdateWorryLevel *5) ))
             itemsWithUpdatedWorryLevel.forEach((itemWithUpdatedWorryLevel) => {
                 if (itemWithUpdatedWorryLevel % 13 == 0) {
                     this.worryLevelOfItemsThatAreControledByMonkey6.push(itemWithUpdatedWorryLevel);  
                 } else {
                     this.worryLevelOfItemsThatAreControledByMonkey5.push(itemWithUpdatedWorryLevel);   
                 }

             })
         }
         this.worryLevelOfItemsThatAreControledByMonkey4.length = 0; 
    }

    throwMonkey5() {
        if (this.worryLevelOfItemsThatAreControledByMonkey5.length === 0) {
            // log('monkey 5 has not items, so nothing to do this round.')
             return
         } else {
             this.monkey5TotalItemsHandled += this.worryLevelOfItemsThatAreControledByMonkey5.length;
             let itemsWithUpdatedWorryLevel = this.worryLevelOfItemsThatAreControledByMonkey5.map((itemToUpdateWorryLevel) => ((itemToUpdateWorryLevel +5) ))
             itemsWithUpdatedWorryLevel.forEach((itemWithUpdatedWorryLevel) => {
                 if (itemWithUpdatedWorryLevel % 3 == 0) {
                     this.worryLevelOfItemsThatAreControledByMonkey1.push(itemWithUpdatedWorryLevel);  
                 } else {
                     this.worryLevelOfItemsThatAreControledByMonkey0.push(itemWithUpdatedWorryLevel);   
                 }

             })
         }
         this.worryLevelOfItemsThatAreControledByMonkey5.length = 0; 
    }

    throwMonkey6() {
        if (this.worryLevelOfItemsThatAreControledByMonkey6.length === 0) {
            // log('monkey 6 has not items, so nothing to do this round.')
             return
         } else {
             this.monkey6TotalItemsHandled += this.worryLevelOfItemsThatAreControledByMonkey6.length;
             let itemsWithUpdatedWorryLevel = this.worryLevelOfItemsThatAreControledByMonkey6.map((itemToUpdateWorryLevel) => ((itemToUpdateWorryLevel * itemToUpdateWorryLevel ) ))
             
             itemsWithUpdatedWorryLevel.forEach((itemWithUpdatedWorryLevel) => {
                 if (itemWithUpdatedWorryLevel % 5 == 0) {
                     this.worryLevelOfItemsThatAreControledByMonkey5.push(itemWithUpdatedWorryLevel);  
                 } else {
                     this.worryLevelOfItemsThatAreControledByMonkey1.push(itemWithUpdatedWorryLevel);   
                 }

             })
         }
         this.worryLevelOfItemsThatAreControledByMonkey6.length = 0; 

    }

    throwMonkey7() {
        if (this.worryLevelOfItemsThatAreControledByMonkey7.length === 0) {
            // log('monkey 7 has not items, so nothing to do this round.')
             return
         } else {
             this.monkey7TotalItemsHandled += this.worryLevelOfItemsThatAreControledByMonkey7.length;
             let itemsWithUpdatedWorryLevel = this.worryLevelOfItemsThatAreControledByMonkey7.map((itemToUpdateWorryLevel) => ((itemToUpdateWorryLevel +3) ))
             itemsWithUpdatedWorryLevel.forEach((itemWithUpdatedWorryLevel) => {
                 if (itemWithUpdatedWorryLevel % 2 == 0) {
                     this.worryLevelOfItemsThatAreControledByMonkey2.push(itemWithUpdatedWorryLevel);  
                 } else {
                     this.worryLevelOfItemsThatAreControledByMonkey3.push(itemWithUpdatedWorryLevel);   
                 }

             })
         }
         this.worryLevelOfItemsThatAreControledByMonkey7.length = 0; 
    }


}



const gameOfKeepAwayPlayedByMonkeys = new GameOfKeepAwayPlayedByMonkeys(
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
);
// log('before:')
// console.log(gameOfKeepAwayPlayedByMonkeys)
gameOfKeepAwayPlayedByMonkeys.convertToBigInt();

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
log(gameOfKeepAwayPlayedByMonkeys.monkey0TotalItemsHandled); // 179729
log(gameOfKeepAwayPlayedByMonkeys.monkey1TotalItemsHandled);
log(gameOfKeepAwayPlayedByMonkeys.monkey2TotalItemsHandled);
log(gameOfKeepAwayPlayedByMonkeys.monkey3TotalItemsHandled);
log(gameOfKeepAwayPlayedByMonkeys.monkey4TotalItemsHandled);
log(gameOfKeepAwayPlayedByMonkeys.monkey5TotalItemsHandled); 
log(gameOfKeepAwayPlayedByMonkeys.monkey6TotalItemsHandled);
log(gameOfKeepAwayPlayedByMonkeys.monkey7TotalItemsHandled); // 179699


/*
    I could automatically select the 2 highest nrs and  multiply them.
    To save time,  I do this final step  by hand.

    179729 * 179699 = 32297121571 
*/






















