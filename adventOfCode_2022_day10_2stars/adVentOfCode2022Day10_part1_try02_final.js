/*
    goal: calculate part 1
    data: example data from the assignment.

    goal of this file: calculate final answer to obtain a silver star.
    status: done. 

*/
const log = console.log;

const {readFileSync} = require("fs");
const { toNamespacedPath } = require("path");

// toggle between inputTestdata.txt and input.txt. input.txt is the real deal. 
const inputFile = readFileSync("inputReal.txt", "utf-8").split('\r\n');
log('01_input-from-file: ')
log(inputFile)

const calculateAllAdditionsToRegisterUpUntilAndDuringFollowingCycle = (cycle, inputFile) => {
    const calculateIndexInArrayInputFileOfLastInstructionThatContributesToRegisterXDuringCycle = (cycle, inputFile) => {
        /*
            i === indexInInArrayInputFile that shows which instructions add up to the Register-X-value during a cycle
            ex: if i = 3 (so i with value 3 is returned by this fn), then i indicates the first 4 instructions (0-based counting)
            that will be used in the next fn to calculate the value of Register X during the cycle from this function's 
            first argumentsObject
        */
        let nrOfCyclesWithUpdateDelayTakenIntoAccount = cycle - 2 // delay is 2 as mentioned in analysis an design.
        // '-2' connects better to words from analysis and design, compared to '-1'.
        let nrOfCyclesDuringWhichInstructionsFromInputFileHaveUpdatedRegisterX = 0; 
        for (let i = 0; i <= nrOfCyclesWithUpdateDelayTakenIntoAccount; i++) {
            if (nrOfCyclesDuringWhichInstructionsFromInputFileHaveUpdatedRegisterX >= nrOfCyclesWithUpdateDelayTakenIntoAccount ) {
                return i; //for def of 'i', see comment above.
            }
            if (inputFile[i].includes('noop')) {
                nrOfCyclesDuringWhichInstructionsFromInputFileHaveUpdatedRegisterX +=1;
            } else {
                nrOfCyclesDuringWhichInstructionsFromInputFileHaveUpdatedRegisterX +=2;
            }
        }
    }

    let lastInstructionFromInputFileThatContributesToRegisterXForSpecifiedCycle = calculateIndexInArrayInputFileOfLastInstructionThatContributesToRegisterXDuringCycle(cycle, inputFile );
    // legenda: e.g. '10' means: add all updates to the register X up until index position 10 from inputFile.txt !!
    // log(`highest index of instruction from inputFile That Contributes To RegisterX For Specified Cycle: ${lastInstructionFromInputFileThatContributesToRegisterXForSpecifiedCycle - 1}`);
    // log(`e.g. for cycle 20, 8 instructions are executed. 8 instructions take up 18 cycles to execute. Result of up until cycle 18 included is visible during cycle 20.`)


    let calculateAllAdditionsToRegisterXFromIndex0ToIndexOf = ( lastInstructionFromInputFileThatContributesToRegisterXForSpecifiedCycle, inputFile) => {
        
        let registerXValue = 1; // requirement: starting value is 1.
        
        for (let i = 0; i < lastInstructionFromInputFileThatContributesToRegisterXForSpecifiedCycle; i++) {

            if (inputFile[i].includes('noop')) {
                // log('do nothing');
            } else {
                let result = parseInt(inputFile[i].split(' ')[1]);
                // log(`instruction index nr:< ${i} > --> causes delta in Register-X: < ${result}>`);
                registerXValue += result;
            }
        }
        return registerXValue;
    }

    const registerXValue = calculateAllAdditionsToRegisterXFromIndex0ToIndexOf(lastInstructionFromInputFileThatContributesToRegisterXForSpecifiedCycle, inputFile );
    log(`registerXValue: ${registerXValue}`);

    return registerXValue;
}
// test: ok
// let result = calculateAllAdditionsToRegisterUpUntilAndDuringFollowingCycle(20, inputFile);

const calculateSignalStrengthDuringEachCycleInArray = (arrayWithCyclesToCalculateRegisterXValues, calculateAllAdditionsToRegisterUpUntilAndDuringFollowingCycle) => {
    let signalStrengthOfEachCycleInArray = arrayWithCyclesToCalculateRegisterXValues.map((cycle) => {
        // log('foo')
        // log(cycle)
        return parseInt(calculateAllAdditionsToRegisterUpUntilAndDuringFollowingCycle(cycle, inputFile)) * parseInt(cycle);
    })
    // log(signalStrengthOfEachCycleInArray)
    return signalStrengthOfEachCycleInArray;
}


let arrayWithCyclesToCalculateRegisterXValues = [20, 60, 100, 140, 180, 220];
let arrayWithSignalStrengthForEachCycle = calculateSignalStrengthDuringEachCycleInArray(arrayWithCyclesToCalculateRegisterXValues, calculateAllAdditionsToRegisterUpUntilAndDuringFollowingCycle);





const calculateCombinedSignalStrengthOfAllCyclesInArray = (arrayWithSignalStrengthForEachCycle) => {
    const combinedSignalStrengthOfAllCyclesInArray = arrayWithSignalStrengthForEachCycle.reduce((partialSum, a) => partialSum + a, 0);
    return combinedSignalStrengthOfAllCyclesInArray;
}
let combinedSignalStrengthOfAllCyclesInArray = calculateCombinedSignalStrengthOfAllCyclesInArray(arrayWithSignalStrengthForEachCycle);
console.log(`combinedSignalStrengthOfAllCyclesInArray: ${combinedSignalStrengthOfAllCyclesInArray}`); 
// answer: 13920 (correct)









