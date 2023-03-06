/*
    goal: calculate part 1
    status: requirements intake
    data: example data from the assignment.

    ANALYSIS:
    cycle --> state --> cycle --> state --> cycle --> etc.
    During a cycle, a fn that does something.
    Between 2 cycles, there is state. State === value of the CPU-register === interim result of this fn.
    So there is continuous alternation between 'doing' and 'being'. 

    CPU-register === X === register-X. 
    Value of X (=== CPU-register) during the 20th cycle === value of X at the start of 20th cycle === value of X at end of 19th cycle. 
    Reason: the updated  value becomes available in between 2 cycles.
    
    Calculation (===fn !!) that starts during cycle 19 === calculation that starts at beginning of cycle 19.
    Result (=== state !) of calculation that starts during cycle 19 becomes available between cycle 20 and 21.
    
    Value of register X during cycle 20 === addition of all 'addx' (e.g. addx 4) up until 18th cyle included.
    Reason: if cycle 19 is 'noop' then nothing is added to register X.
    
    If cycle 19 is e.g. addx 1, then register X is updated between cycle 20 and cycle 21.
    If cycle 18 is e.g. addx 1, then register X is updated between cycle 19 and cycle 20.
    conclusion: there is a time delay between adding and seeing the result of this addition in register X.
    I need the accumulation of 'noops' and 'addx' up until cycle 18 included, to see the result 
    of register X during cycle 20.

    noop takes 1 cycle.
    addx (plus nr), e.g. 'addx 5' takes 2 cycles to complete. 

    DESIGN:
    Goal of this file: calculate value of register-X during cycle 20.
    step 1: how many instructions from input file must be executed until the 18th cycle has finished. So the end point is the state BETWEEN
        cycle 18 and cycle 19.
    how to do this:
        I loop thru input.txt. If 'noop', then counter +=1.
        If 'addx' then counter +=2. I do this until counter has value 18 (=== 18 cycles).
    
    By using the counter value that belongs to value 18 as an index (B), I select the nr of array elements from the array from input.txt
    up until the index value (B) that belongs to 18.

    Now I can add up the values. 

    
    status: done. 

*/
const log = console.log;

const {readFileSync} = require("fs");
const { toNamespacedPath } = require("path");

const inputFromFile = readFileSync("inputTestData.txt", "utf-8").split('\r\n');
log('01_input-from-file: ')
log(inputFromFile)


/*
config:
*/

let arrayWithCyclesToCalculateSignalStrengths = [20, 60];




let calculateSignalStrengthDuringCycle = (cycle, inputFromFile) => {
    let nrOfCyclesWithDelayTakenIntoAccount = cycle - 2
    let nrOfCyclesThatHaveUpdatedRegisterX = 1; // compensate zero-based index. 
    for (let i = 0; i < nrOfCyclesWithDelayTakenIntoAccount; i++) {
        if (nrOfCyclesThatHaveUpdatedRegisterX >= nrOfCyclesWithDelayTakenIntoAccount ) {
            return i;
        }
        if (inputFromFile[i].includes('noop')) {
            nrOfCyclesThatHaveUpdatedRegisterX +=1;
        } else {
            nrOfCyclesThatHaveUpdatedRegisterX +=2;
        }
    }
}

// e.g. '10' means: add all updates to the register X up until index position 10 from inputFromFile.txt !!
let highestIndexPositionWithWhichToCalculateSignalStrength = calculateSignalStrengthDuringCycle(20, inputFromFile );
log(highestIndexPositionWithWhichToCalculateSignalStrength);


let calculateAllAdditionsToRegisterXFromIndex0ToIndex = ( indexUpperValueIncluded, inputFromFile) => {
    
    let signalStrength = 1; // requirement: starting value is 1.
    
    for (let i = 0; i < indexUpperValueIncluded; i++) {

        if (inputFromFile[i].includes('noop')) {
            log('do nothing');
        } else {
            let result = parseInt(inputFromFile[i].split(' ')[1]);
            log(result);
            signalStrength += result;
        }
    }
    return signalStrength;
}

let signalStrength = calculateAllAdditionsToRegisterXFromIndex0ToIndex(highestIndexPositionWithWhichToCalculateSignalStrength, inputFromFile );
log(`signalStrength: ${signalStrength}`);






















// class GameOfKeepAwayPlayedByMonkeys {
//     constructor(itemsWithEachMonkey) {
//         this.itemsWithEachMonkey = itemsWithEachMonkey;
//         // add attributes below for improved readability of the code: 
//         this.worryLevelOfItemsThatAreControledByMonkey0 = this.itemsWithEachMonkey[0];
//         this.worryLevelOfItemsThatAreControledByMonkey1 = this.itemsWithEachMonkey[1];
//         this.worryLevelOfItemsThatAreControledByMonkey2 = this.itemsWithEachMonkey[2];
//         this.worryLevelOfItemsThatAreControledByMonkey3 = this.itemsWithEachMonkey[3];
//         this.worryLevelOfItemsThatAreControledByMonkey4 = this.itemsWithEachMonkey[4];
//         this.worryLevelOfItemsThatAreControledByMonkey5 = this.itemsWithEachMonkey[5];
//         this.worryLevelOfItemsThatAreControledByMonkey6 = this.itemsWithEachMonkey[6];
//         this.worryLevelOfItemsThatAreControledByMonkey7 = this.itemsWithEachMonkey[7];
//         this.monkey0TotalItemsHandled = 0;
//         this.monkey1TotalItemsHandled = 0;
//         this.monkey2TotalItemsHandled = 0;
//         this.monkey3TotalItemsHandled = 0;
//         this.monkey4TotalItemsHandled = 0;
//         this.monkey5TotalItemsHandled = 0;
//         this.monkey6TotalItemsHandled = 0;
//         this.monkey7TotalItemsHandled = 0;
//     }

    

//     throwMonkey0() {
//         // for later reference I explicitly describe what happens inside this first fn.
        
//         if (this.worryLevelOfItemsThatAreControledByMonkey0.length === 0) {
//             /* requirement: if monkey does not have "stolen" items
//                 (i.e. at beginning of the round), then monkey does nothing this round.
//             */
//         //    log('monkey 0 has not items, ao nothing to do this round.')
//             return
//         } else {

//             /*
//                 Number of times monkey 0 inspects items in  this round. Add this  to the  total nr of item-inspections of this monkey in 20 rounds:
//             */
//             this.monkey0TotalItemsHandled += this.worryLevelOfItemsThatAreControledByMonkey0.length;

//             /* items must be thrown one by one (a.k.a. in a first in, first out manner. In  logistics: "fifo". So you must not reverse the list to implement that. 
//                 e.g. items = [a, b, c] --> you must push [a, b, c] to implement fifo.
//             */
//             // let reversedWorryLevelItemsThatAreControledByMonkey0 = this.worryLevelOfItemsThatAreControledByMonkey0.slice(0).reverse().map((worryLevelItem) => worryLevelItem );   

//             // worry-level-change caused by inspection of the monkey, then reduced worry (" divided by 3"), then round down.
//             let itemsWithUpdatedWorryLevel = this.worryLevelOfItemsThatAreControledByMonkey0.map((itemToUpdateWorryLevel) => Math.floor(itemToUpdateWorryLevel * 19 / 3))

//             itemsWithUpdatedWorryLevel.forEach((itemWithUpdatedWorryLevel) => {
//                 if (itemWithUpdatedWorryLevel % 17 == 0) {
//                     this.worryLevelOfItemsThatAreControledByMonkey2.push(itemWithUpdatedWorryLevel);  
//                 } else {
//                     this.worryLevelOfItemsThatAreControledByMonkey7.push(itemWithUpdatedWorryLevel);   
//                 }
//                 // monkey has thrown all its items to other monkeys.
//                 this.worryLevelOfItemsThatAreControledByMonkey0.length = 0; 
//             })
//         }
//     }

//     throwMonkey1() {
//         if (this.worryLevelOfItemsThatAreControledByMonkey1.length === 0) {
//         //    log('monkey 1 has not items, so nothing to do this round.')
//             return
//         } else {
//             this.monkey1TotalItemsHandled += this.worryLevelOfItemsThatAreControledByMonkey1.length;
//             let itemsWithUpdatedWorryLevel = this.worryLevelOfItemsThatAreControledByMonkey1.map((itemToUpdateWorryLevel) => Math.floor((itemToUpdateWorryLevel +2) / 3))
//             itemsWithUpdatedWorryLevel.forEach((itemWithUpdatedWorryLevel) => {
//                 if (itemWithUpdatedWorryLevel % 19 == 0) {
//                     this.worryLevelOfItemsThatAreControledByMonkey7.push(itemWithUpdatedWorryLevel);  
//                 } else {
//                     this.worryLevelOfItemsThatAreControledByMonkey0.push(itemWithUpdatedWorryLevel);   
//                 }
//             })

//         }
//         this.worryLevelOfItemsThatAreControledByMonkey1.length = 0; 
//     }

//     throwMonkey2() {
//         if (this.worryLevelOfItemsThatAreControledByMonkey2.length === 0) {
//         //    log('monkey 2 has not items, so nothing to do this round.')
//             return
//         } else {
//             this.monkey2TotalItemsHandled += this.worryLevelOfItemsThatAreControledByMonkey2.length;
//             let itemsWithUpdatedWorryLevel = this.worryLevelOfItemsThatAreControledByMonkey2.map((itemToUpdateWorryLevel) => Math.floor((itemToUpdateWorryLevel +7) / 3))
//             itemsWithUpdatedWorryLevel.forEach((itemWithUpdatedWorryLevel) => {
//                 if (itemWithUpdatedWorryLevel % 7 == 0) {
//                     this.worryLevelOfItemsThatAreControledByMonkey4.push(itemWithUpdatedWorryLevel);  
//                 } else {
//                     this.worryLevelOfItemsThatAreControledByMonkey3.push(itemWithUpdatedWorryLevel);   
//                 }

//             })
//         }
//         this.worryLevelOfItemsThatAreControledByMonkey2.length = 0; 
//     }

//     throwMonkey3() {
//         if (this.worryLevelOfItemsThatAreControledByMonkey3.length === 0) {
//             // log('monkey 3 has not items, so nothing to do this round.')
//              return
//          } else {
//              this.monkey3TotalItemsHandled += this.worryLevelOfItemsThatAreControledByMonkey3.length;
//              let itemsWithUpdatedWorryLevel = this.worryLevelOfItemsThatAreControledByMonkey3.map((itemToUpdateWorryLevel) => Math.floor((itemToUpdateWorryLevel +1) / 3))
//              itemsWithUpdatedWorryLevel.forEach((itemWithUpdatedWorryLevel) => {
//                  if (itemWithUpdatedWorryLevel % 11 == 0) {
//                      this.worryLevelOfItemsThatAreControledByMonkey6.push(itemWithUpdatedWorryLevel);  
//                  } else {
//                      this.worryLevelOfItemsThatAreControledByMonkey4.push(itemWithUpdatedWorryLevel);   
//                  }

//              })
//          }
//          this.worryLevelOfItemsThatAreControledByMonkey3.length = 0; 
//     }

//     throwMonkey4() {
//         if (this.worryLevelOfItemsThatAreControledByMonkey4.length === 0) {
//             // log('monkey 4 has not items, so nothing to do this round.')
//              return
//          } else {
//              this.monkey4TotalItemsHandled += this.worryLevelOfItemsThatAreControledByMonkey4.length;
//              let itemsWithUpdatedWorryLevel = this.worryLevelOfItemsThatAreControledByMonkey4.map((itemToUpdateWorryLevel) => Math.floor((itemToUpdateWorryLevel *5) / 3))
//              itemsWithUpdatedWorryLevel.forEach((itemWithUpdatedWorryLevel) => {
//                  if (itemWithUpdatedWorryLevel % 13 == 0) {
//                      this.worryLevelOfItemsThatAreControledByMonkey6.push(itemWithUpdatedWorryLevel);  
//                  } else {
//                      this.worryLevelOfItemsThatAreControledByMonkey5.push(itemWithUpdatedWorryLevel);   
//                  }

//              })
//          }
//          this.worryLevelOfItemsThatAreControledByMonkey4.length = 0; 
//     }

//     throwMonkey5() {
//         if (this.worryLevelOfItemsThatAreControledByMonkey5.length === 0) {
//             // log('monkey 5 has not items, so nothing to do this round.')
//              return
//          } else {
//              this.monkey5TotalItemsHandled += this.worryLevelOfItemsThatAreControledByMonkey5.length;
//              let itemsWithUpdatedWorryLevel = this.worryLevelOfItemsThatAreControledByMonkey5.map((itemToUpdateWorryLevel) => Math.floor((itemToUpdateWorryLevel +5) / 3))
//              itemsWithUpdatedWorryLevel.forEach((itemWithUpdatedWorryLevel) => {
//                  if (itemWithUpdatedWorryLevel % 3 == 0) {
//                      this.worryLevelOfItemsThatAreControledByMonkey1.push(itemWithUpdatedWorryLevel);  
//                  } else {
//                      this.worryLevelOfItemsThatAreControledByMonkey0.push(itemWithUpdatedWorryLevel);   
//                  }

//              })
//          }
//          this.worryLevelOfItemsThatAreControledByMonkey5.length = 0; 
//     }

//     throwMonkey6() {
//         if (this.worryLevelOfItemsThatAreControledByMonkey6.length === 0) {
//             // log('monkey 6 has not items, so nothing to do this round.')
//              return
//          } else {
//              this.monkey6TotalItemsHandled += this.worryLevelOfItemsThatAreControledByMonkey6.length;
//              let itemsWithUpdatedWorryLevel = this.worryLevelOfItemsThatAreControledByMonkey6.map((itemToUpdateWorryLevel) => Math.floor((itemToUpdateWorryLevel * itemToUpdateWorryLevel ) / 3))
//              itemsWithUpdatedWorryLevel.forEach((itemWithUpdatedWorryLevel) => {
//                  if (itemWithUpdatedWorryLevel % 5 == 0) {
//                      this.worryLevelOfItemsThatAreControledByMonkey5.push(itemWithUpdatedWorryLevel);  
//                  } else {
//                      this.worryLevelOfItemsThatAreControledByMonkey1.push(itemWithUpdatedWorryLevel);   
//                  }

//              })
//          }
//          this.worryLevelOfItemsThatAreControledByMonkey6.length = 0; 

//     }

//     throwMonkey7() {
//         if (this.worryLevelOfItemsThatAreControledByMonkey7.length === 0) {
//             // log('monkey 7 has not items, so nothing to do this round.')
//              return
//          } else {
//              this.monkey7TotalItemsHandled += this.worryLevelOfItemsThatAreControledByMonkey7.length;
//              let itemsWithUpdatedWorryLevel = this.worryLevelOfItemsThatAreControledByMonkey7.map((itemToUpdateWorryLevel) => Math.floor((itemToUpdateWorryLevel +3) / 3))
//              itemsWithUpdatedWorryLevel.forEach((itemWithUpdatedWorryLevel) => {
//                  if (itemWithUpdatedWorryLevel % 2 == 0) {
//                      this.worryLevelOfItemsThatAreControledByMonkey2.push(itemWithUpdatedWorryLevel);  
//                  } else {
//                      this.worryLevelOfItemsThatAreControledByMonkey3.push(itemWithUpdatedWorryLevel);   
//                  }

//              })
//          }
//          this.worryLevelOfItemsThatAreControledByMonkey7.length = 0; 
//     }


// }



// const gameOfKeepAwayPlayedByMonkeys = new GameOfKeepAwayPlayedByMonkeys(
//     [
//         [83, 97, 95, 67],
//         [71, 70, 79, 88, 56, 70],
//         [98, 51, 51, 63, 80, 85, 84, 95],
//         [77, 90, 82, 80, 79],
//         [68],
//         [60, 94],
//         [81, 51, 85],
//         [98, 81, 63, 65, 84, 71, 84]
//     ]
// );
// // log('before:')
// // console.log(gameOfKeepAwayPlayedByMonkeys)


// for (let i = 0; i < nrOfRoundsToPlay; i++) {

//     gameOfKeepAwayPlayedByMonkeys.throwMonkey0();
//     gameOfKeepAwayPlayedByMonkeys.throwMonkey1();
//     gameOfKeepAwayPlayedByMonkeys.throwMonkey2();
//     gameOfKeepAwayPlayedByMonkeys.throwMonkey3();
//     gameOfKeepAwayPlayedByMonkeys.throwMonkey4();
//     gameOfKeepAwayPlayedByMonkeys.throwMonkey5();
//     gameOfKeepAwayPlayedByMonkeys.throwMonkey6();
//     gameOfKeepAwayPlayedByMonkeys.throwMonkey7();

// }

// log('after:')
// console.log(gameOfKeepAwayPlayedByMonkeys.itemsWithEachMonkey)
// log(gameOfKeepAwayPlayedByMonkeys.monkey0TotalItemsHandled);
// log(gameOfKeepAwayPlayedByMonkeys.monkey1TotalItemsHandled);
// log(gameOfKeepAwayPlayedByMonkeys.monkey2TotalItemsHandled);
// log(gameOfKeepAwayPlayedByMonkeys.monkey3TotalItemsHandled);
// log(gameOfKeepAwayPlayedByMonkeys.monkey4TotalItemsHandled);
// log(gameOfKeepAwayPlayedByMonkeys.monkey5TotalItemsHandled); // 328
// log(gameOfKeepAwayPlayedByMonkeys.monkey6TotalItemsHandled);
// log(gameOfKeepAwayPlayedByMonkeys.monkey7TotalItemsHandled); // 330


/*
    I could automatically select the 2 highest nrs and  multiply them.
    To save time,  I do this final step  by hand.

    330 * 328 = 108240
*/








