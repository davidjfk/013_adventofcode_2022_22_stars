/*
    AdventOfCode: day 9: part .
    correct result adventOfCode day 9 part 2: E G L H B L F J

    data: example data from the assignment: 'inputTest.txt.
    data: data to calculate answer for day 9 part 2: 'inputReal.txt'.
    In both files 145 instructions. 

    ANALYSIS:
    Clock circuit drives CRT-screen (=== CRT === screen), CPU and (its) CPU-register.
    Clock circuit ticks at a constant rate; each tick is called a cycle.
    CPU-register === memory.
    CPU uses instructions to tell screen what to draw.
    2 types of instructions:
        addx V takes two cycles to complete. After two cycles, the X register is increased by the value V. (V can be negative.)
        noop takes one cycle to complete. It has no other effect.   
        (noop === no operation)
    central tenet: calculate the value of the X register during each cycle (of the clock circuit) 
        --> I have calculated this in part 1_try02 as variable (see log) registerXValue.

    Now read the requirements intake of adVentOfCode2022Day10_part1_try01.

    On to part 2:
    CPU-register starts with the value 1 (=== requirement). 
    This "1" indicates an index-position on the CRT-screen of 1. That is why at the start of the example from
    https://adventofcode.com/2022/day/10 (part 2)

    the sprite can position itself on index 1, index 0 (1 to the left) and index 2 (1 to the right).
    Sprite position: ###.....................................

    CRT-screen starts drawing a pixel at 0 (0-based counting)...
    but a sprite is 3 pixels wide AND X register sets the horizontal position of the middle of that sprite.
    Furthermore, if the sprite is positioned such that one of its three pixels is the pixel currently being drawn (by the CRT-screen then), 
    the screen produces a lit pixel (#); otherwise, the screen leaves the pixel dark (.).

    CPU-register and CRT-screen align as follows:

    e.g. addx 15 (takes 2 cycles to complete, then "jumps" 15 positions to the right)
    cycle1:
    crt: 0 (index position 0 lights up)
    cpu: 1 (sprite is drawn on index 0, 1 and 2)
    result: match on index '0', so the pixel lights up in the end result as a "#".

    cycle2:
    crt: 1 (index position 1 lights up)
    cpu: 2 (sprite is drawn on index 0, 1 and 2)
    result: match on index '1', so the pixel lights up in the end result as a "#".   
    
    cycle 3:
    now a jump of 15 to the right (and so on). So I need the fn (from part 1) to calculate for each of 
    the 6*40 == 240 index positions of the CRT-screen where the CPU-register is drawing a sprite at that
    very same time and place.
    Time and place, beause in CRT the index refers to a place on the screen where the pixel is drawn a moment of
    writing that same pixel on the screen. So time == place (--> time space complexity, but with the
    "complexity" of AdventOfCode :). 

    Because a sprite is 3 pixels wide, but a CRT-pixel only 1 pixel, during each cycle the "lighting-up"
    CRT-pixel must be compared to the first, the second and the third pixel of the sprite: i.e. during each  cycle
    3 comparisons must be made. 

    (same example as above:)
    cycle1:
    crt: 0 (index position 0 (A) lights up)
    cpu: 1 (sprite is drawn on index 0 (C), 1 (B) and 2 (D))
    result: match on index '0', so the pixel lights up in the end result as a "#".

    comparison 1: A with B: match, so pixel lights up.
    comparison 2: A with C: no match.
    comparison 3: A with D: no match.

    Upfront you do not know if there will be a match. 
    If there is a match, then B, C or D will match with A.
    But upfront you do not know which one. 

    You can also write this (same example as above) as:

    comparison 1: A with B: match, so pixel lights up.
    comparison 2: A with (B + 1): no match.
    comparison 3: A with (B - 1): no match.    

    So I do 3 comparisons, just using variables A and B.


    goal: 

    DESIGN:
        1. for each cycle calculate position (of middle of each sprite) of the CPU-register:
            a) create array (F) with nrs 1-240 (these are 240 cycles that correspond to the 240 pixels from the crt-screen)
                pitfall: a cycle starts at 1 (!!)

            b)  G === function call ==  calculateSignalStrengthDuringEachCycleInArray(arrayWithCyclesToCalculateRegisterXValues, calculateAllAdditionsToRegisterUpUntilAndDuringFollowingCycle);
                This is the reusable code from part1. 

                F === array nrs 1-240 (array with 0-based index. E.g. F.indexOf(1) is 0, NOT 1 !)

            c)  map thru (F):   let H = F.map((cycle) => {G(cycle)})

                H == array with value of Register-X for each  of the nrs 1-240 (array with 0-based index. E.g. H.indexOf(1) is 0, NOT 1 !)

                Now for each (1-based !!) index of F, I make the 3 comparisons as described in the ANALYSIS above.

                If (position of CRT-pixel that is currently drawn === position of CPU-register where (actually: on and around which) the sprite is currently being drawn) {
                    draw the pixel on crt-screen
                }


                I can write this as: 
                (remark: the "1" in F(1) is  the first cycle from the sequence 1-240, but it can be any nr from this range.  )

                If (F[1].indexOf === H[1]) {
                    draw the pixel on the crt-screen
                    arrayWithPixelsToDraw[(H[1].indexOf] = "#";
                }   
                // remark: G(1) as in the map-fn above              

                Now the other 2 pixels of the sprite:

                pixel to the left (C from example further above)
                If ((F[1].indexOf) === H[1] - 1) {
                    draw the pixel on the crt-screen
                    arrayWithPixelsToDraw[(H[1].indexOf] = "#";
                }  

                pixel to the right (D from example further above)
                If ((F[1].indexOf) === H[1] + 1) {
                    draw the pixel on the crt-screen
                    arrayWithPixelsToDraw[(H[1].indexOf] = "#";
                }  
                //pitfall: there is only 1 "F[1]", because there is only one "1", but in "H[1]" there can 
                    be 1 or more "ones". So use F[1] instead of H[1]. 
                
            d) calculate array H.
                let H = F.map((cycle) => {G(cycle)})

            e) create fn calculateOutputToShowOnCrtScreen(H) { 
                    let outputToShowOnScreen = H.map((cycle) => {
                        // 3 if-else statements
                    })

                    }
               };


        2. show arrayWithPixelsToDraw in grid with 6 rows with each 40 rows. (see code from  day 8 or 9).

    
    status: in progress. 

*/
const log = console.log;

const {readFileSync} = require("fs");
const { toNamespacedPath } = require("path");

// toggle between inputTest.txt and inputReal.txt. Use inputReal.txt to calculate the real answer for day 9 part 2.
const inputFile = readFileSync("inputReal.txt", "utf-8").split('\r\n');
// log('01_input-from-file: ')
// log(inputFile)

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
    // log(`registerXValue: ${registerXValue}`);

    return registerXValue;
}



// design: 1a: create array (F):
function range(start, end) {
    var ans = [];
    for (let i = start; i <= end; i++) {
        ans.push(i);
    }
    return ans;
}
let arrayWithCyclesToCalculateRegisterXValues  = range(1, 241); // start value in cpu-register is 1, NOT 0. So start range at 1, NOT 0.
// arrayWithCyclesToCalculateRegisterXValues = [20, 60, 100, 140, 180, 220];

const calculateSignalStrengthDuringEachCycleInArray = (arrayWithCyclesToCalculateRegisterXValues, calculateAllAdditionsToRegisterUpUntilAndDuringFollowingCycle) => { 
    let signalStrengthOfEachCycleInArray = arrayWithCyclesToCalculateRegisterXValues.map((cycle) => {
        return parseInt(calculateAllAdditionsToRegisterUpUntilAndDuringFollowingCycle(cycle, inputFile ));
    } )
    return signalStrengthOfEachCycleInArray;
}


let arrayWithSignalStrengthForEachCycle = calculateSignalStrengthDuringEachCycleInArray(arrayWithCyclesToCalculateRegisterXValues, calculateAllAdditionsToRegisterUpUntilAndDuringFollowingCycle);
// log(`arrayWithSignalStrengthForEachCycle: ${arrayWithSignalStrengthForEachCycle}`);


// task: index must restart at 0 after every 40 pixels: (learning: I overlooked this at first in the requirements)

// source of function convertArraytoArrayWithSubArrays: https://www.tutorialspoint.com/convert-array-into-array-of-subarrays-javascript 
const convertArraytoArrayWithSubArrays = (arr, nrOfPixelsOn1Row) => {
    const size = nrOfPixelsOn1Row;
    const chunkedArray = [];
    for (let i = 0; i < arr.length; i++) {
       const last = chunkedArray[chunkedArray.length - 1];
       if(!last || last.length === size){
          chunkedArray.push([arr[i]]);
       }else{
          last.push(arr[i]);
       }
    };
    return chunkedArray;
 };
 let gridCrtScreenWith6RowsOf40Pixels = convertArraytoArrayWithSubArrays(arrayWithSignalStrengthForEachCycle, 40);
// log(gridCrtScreenWith6RowsOf40Pixels);




const calculateOutputToShowOnCrtScreen = ( rowWithRegisterXValues) => { 
    /*
        
        note to self: parameters of map-fn allow for shorter code than 
        what I first had in mind while writing the ANALYSIS and DESIGN above.
    */
    let outputToShowOnScreen = rowWithRegisterXValues.map((registerXValue, index) => {
        if (index == registerXValue){
            // log(`index: ${index}, registerXValue: ${registerXValue}`)
            
            // draw the illuminated pixel on the crt-screen as '#'.
            return "#";
        } else if             
        // Now the other 2 pixels of the sprite:

        // pixel to the left (C from example further above)
         (index  == (registerXValue - 1)){
            // log(`index: ${index}, registerXValue: ${registerXValue}`)
            // draw the pixel on the crt-screen
            // draw the illuminated pixel on the crt-screen as '#'.
            return "#";
        } else if

        // pixel to the right (D from example further above)
         (index == (registerXValue + 1)) {
            // log(`index: ${index}, registerXValue: ${registerXValue}`)
            // draw the illuminated pixel on the crt-screen as '#'.
            return "#";
        } else {
            // log(`index: ${index}, registerXValue: ${registerXValue}`)
            // draw the "dark" pixel on the crt-screen as '0'.
            return 0; 
            /*
             the numeric 0 creates a proper contrast in the console.log of vsCode:
                numbers are printed in yellow.
                alphanumeric (including the '#') are printed in green.
            */
        }
    })
    return outputToShowOnScreen;
};


// option 1:
let result01 = calculateOutputToShowOnCrtScreen( gridCrtScreenWith6RowsOf40Pixels[0] )
// console.table(result01);
let result02 = calculateOutputToShowOnCrtScreen( gridCrtScreenWith6RowsOf40Pixels[1] )
// console.table(result02);
let result03 = calculateOutputToShowOnCrtScreen( gridCrtScreenWith6RowsOf40Pixels[2] )
// console.table(result03);
let result04 = calculateOutputToShowOnCrtScreen( gridCrtScreenWith6RowsOf40Pixels[3] )
// console.table(result04);
let result05 = calculateOutputToShowOnCrtScreen( gridCrtScreenWith6RowsOf40Pixels[4] )
// console.table(result05);
let result06 = calculateOutputToShowOnCrtScreen( gridCrtScreenWith6RowsOf40Pixels[5] )
// console.table(result06);

let ROW = 5;
let COL = 40;
let gridWithResults = Array.from(Array(ROW), ()=> Array(COL).fill(false));
gridWithResults[0] = result01;
gridWithResults[1] = result02;
gridWithResults[2] = result03;
gridWithResults[3] = result04;
gridWithResults[4] = result05;
gridWithResults[5] = result06;
log('correct result, but a bit verbose:')
console.table(gridWithResults);
// correct result adventOfCode day 9 part 2: E G L H B L F J



// option 2:
const calculate8LettersOnScreen = (gridCrtScreenWith6RowsOf40Pixels) => {
    let gridWith8LettersOnTheScreen = gridCrtScreenWith6RowsOf40Pixels.map(row => calculateOutputToShowOnCrtScreen(row));   
    return gridWith8LettersOnTheScreen;
}
log('correct result, with more concise code:')
let eightLettersOnTheScreen = calculate8LettersOnScreen(gridCrtScreenWith6RowsOf40Pixels) 
console.table(eightLettersOnTheScreen);
// correct result adventOfCode day 9 part 2: E G L H B L F J

