/*
    AdventOfCode: day 13 part 2: try_04:
    correct result adventOfCode day 13 part 2: in progress.

    GOALS for this file try_04:
    1. implement solution for problem from file try_04. (status: done)
    2. continue with implement DESIGN step nr 5.

    STATUS: all code from the DESIGN has been implemented, but the answer is again...27136 (wrong).

    NEXT: back to the drawing board in try05.js :)



    SYNTAX: see try_01.js

    -ABOUT THE (CHANGED) DEF OF D AND E: 
        in Day13-part1, D, E, D[0], E[0], P, Q had the following def:
        AdventOfCode-problem-to-solve has an algebraic nature. 
        Furthermore, a few (lengthy) words are used many times. 
        So to improve readability of the code, I have used letters in the ANALYSIS and DESIGN.
        Normally speaking this is a very bad practice, but here it feels that it makes things easier.
        You just need to know the following 4 abbreviations:
        D, E, D[0], E[0], P, Q.
                
            1 pair of packets == (D and E together) -->(see following).
            
            [
            '[1,1,3,1,1]',  --> this is D   --> e.g. 1 is P (or anything that is between 2 commas)
            '[1,1,5,1,1]',  --> this is E   --> e.g. 1 is Q (or anything that is between 2 commas)
            '',
            '[[1],[2,3,4]]',
            '[[1],4]',
            '',
            '[9]',
            '[[8,7,6]]',
            '',
            '[[4,4],4,4]',
            '[[4,4],4,4,4]',
            '',
            '[7,7,7,7]',
            '[7,7,7]',
            '',
            '[]',
            '[3]',
            '',
            '[[[]]]',
            '[[]]',
            '',
            '[1,[2,[3,[4,[5,6,7]]]],8,9]',
            '[1,[2,[3,[4,[5,6,0]]]],8,9]'
            ]                    

            That also means that:
                D[0] == P --> possible improvement: replace all P by D[0]
                E[0] == Q --> possible improvement: replace all Q by D[0]
                (I have used P and Q, because it means less typing)

            There is 1 more abbreviation:
            AWNA = array with nested array: e.g. [[3]]

        In Day13-part2 there is still a packetLeft (D) and packetRight (E) that must be compared to only each other, but
        in a totally different context...
        There is a higer-order array method 'sort' that will compare each packet to each other packet.
        So in example code above there are (16*15)/2 === 120 comparisons to be made. (see explanation of formula below).

        Each of the (here) 120 comparisons comprises 2 packets: the first one packetLeft (D) and second one packetRight (E).
        So i still  use the letters D and E, but D and E change during each of the 120 fn calls  that are needed to determine
        the order of the (here) 16 array elements (read: packets) above. 




    ANALYSIS: first see try01.js, try02.js. Then:


    -ABOUT THE SORT-FN:

        The sort-fn compares all elements in the array with each other.
        E.g. 6 elements is (6*(6-1))/ 2 === 15 comparisons.
        (so e.g. 4 basketball teams means: (4*(4-1))/ 2 === 6 matches to let
        each team play with each team once. 

        Main problem-to-solve in Day13-part2: 
        During many (not all) comparisons the elements are MUTATED.
        (analogy: during  the basketball match a team gets a red card).

        This is a problem, because after the sorting, the inputfile-elements must be in the right order AND
        still look the same as in the inputfile. So e.g. if element in inputfile looks like this: [[[[5]]]] , then 
        this same element in the sorted order may NOT look like e.g. this: [5] (which implies that brackets have been 
        removed during the sorting-process). 

        So the general solution I need is to have an 'immutable sorting process'.

        The mutation happens on 2 levels: 
        1. recursive fn-call to checkIfPacketLeftAndRightAreInCorrectOrder.  I have analysed this in try02.js.
            A recursive fn-call is made whenever 1 or 2 in the comparison, is an AWNA (array with nested array).
            SOLUTION: implementation of variable recursiveFnCallOutput (done, works).
        2.  all other situations in which D[0] or E[0] inside fn checkIfPacketLeftAndRightAreInCorrectOrder are being mutated
            (e.g. // log(`--sub-workflow 5,9,13: compare 'array' with a 'nr': (i.e. empty aray, array with nr, or nested array)`)
                  E[0] = [E[0]];)
                  analysis: after each iteration E[0]  gets one more pair of outer square brackets. (e.g. [5] becomes [[5]] becomes [[[5]]] etc.)

            SOLUTION: at the start of fn compareFnToSortPackets I make a deep copy of its 2 arguments: comparedArgument1 and comparedArgument2.
            The sort-fn (that is running the comparison show) will mutate the deep copy during the comparison process. Meanwhile the arguments themselves stay 
            preserved to show up in the final sorted order of input file elements...:).
    


    -ABOUT THE DISPLAY OF SORTED ELEMENTS:
    e.g. following inputFile:
    [[1]]
    [1]

    [1]
    [[1]]

    output with order:
    [
    [
        [
            1
        ]
    ],
    [
        1
    ],
    [
        1
    ],
    [
        [
            1
        ]
    ]
    ]    
    (i.e. same order as the input)

    with e.g. input:
    [1]
    [[1]]

    [[1]]
    [1]
    output and input also have the same order...

    explanation: [[1]], [1], [[[[1]]]] are EQUIVALENT according to the business rules, so 
    the code won't change the order of the inputs (works as intended).

    The code does this as follows: (run inputfile with these 4 elements):
    tldr; result of all comparisons is 1, indicating "wrong order", so sort-fn won't change the order
    of the input file. 

            $ node adVentOfCode2022Day13_part2_try03.js 
            TRANSFORM DATA FROM THE  TEXT INPUTFILE:
            arrayWithAllPairsOf2Packets: (i.e. D and E)
            [ [ '[1]', '[[1]]' ], [ '[[1]]', '[1]' ] ]
            same, but flattend and in json format:
            [ '[1]', '[[1]]', '[[1]]', '[1]' ]
            same, but flattend and json parsed:
            [ [ 1 ], [ [ 1 ] ], [ [ 1 ] ], [ 1 ] ]
            -----------------------------------------------------------------------------------------------------
            -----------------------------------------------------------------------------------------------------
            compareFnToSortPackets: start:
            -----------------------------------
            while-loop: start:
            D:
            [ [ 1 ] ]
            E:
            [ 1 ]
            --sub-workflow 5,9,13: compare 'array' with a 'nr': (i.e. empty aray, array with nr, or nested array)
            while-loop: start:
            D:
            [ [ 1 ] ]
            E:
            [ [ 1 ] ]
            --sub-workflow 11: compare array-with-nr with array-with-nr:
            while-loop: start:
            D:
            [ [] ]
            E:
            [ [] ]
            --sub-workflow 6: compare empty-array with empty-array:
            while-loop: start:
            D:
            []
            E:
            []
            --packet-workflow 1: D.length == 0 && E.length == 0
            out of while loop:
            orderOf2Packets (as a string):
            -777
            <fn checkIfPacketLeftAndRightAreInCorrectOrder: end />
            --------------------------
            -----------------------------------
            fn checkIfPacketLeftAndRightAreInCorrectOrder: output:
            -777
            D:
            []
            E:
            []
            resultThatCanBeUsedByArrayMethodSort:
            1
            -----------------------------------------------------------------------------------------------------
            -----------------------------------------------------------------------------------------------------
            compareFnToSortPackets: start:
            -----------------------------------
            while-loop: start:
            D:
            [ [ 1 ] ]
            E:
            [ [ 1 ] ]
            --sub-workflow 11: compare array-with-nr with array-with-nr:
            while-loop: start:
            D:
            [ [] ]
            E:
            [ [] ]
            --sub-workflow 6: compare empty-array with empty-array:
            while-loop: start:
            D:
            []
            E:
            []
            --packet-workflow 1: D.length == 0 && E.length == 0
            out of while loop:
            orderOf2Packets (as a string):
            -777
            <fn checkIfPacketLeftAndRightAreInCorrectOrder: end />
            --------------------------
            -----------------------------------
            fn checkIfPacketLeftAndRightAreInCorrectOrder: output:
            -777
            D:
            []
            E:
            []
            resultThatCanBeUsedByArrayMethodSort:
            1
            -----------------------------------------------------------------------------------------------------
            -----------------------------------------------------------------------------------------------------
            compareFnToSortPackets: start:
            -----------------------------------
            while-loop: start:
            D:
            [ 1 ]
            E:
            [ [ 1 ] ]
            --sub-workflow 2,3,4: compare nr with array (i.e. empty aray, array with nr, or nested array):
            while-loop: start:
            D:
            [ [ 1 ] ]
            E:
            [ [ 1 ] ]
            --sub-workflow 11: compare array-with-nr with array-with-nr:
            while-loop: start:
            D:
            [ [] ]
            E:
            [ [] ]
            --sub-workflow 6: compare empty-array with empty-array:
            while-loop: start:
            D:
            []
            E:
            []
            --packet-workflow 1: D.length == 0 && E.length == 0
            out of while loop:
            orderOf2Packets (as a string):
            -777
            <fn checkIfPacketLeftAndRightAreInCorrectOrder: end />
            --------------------------
            -----------------------------------
            fn checkIfPacketLeftAndRightAreInCorrectOrder: output:
            -777
            D:
            []
            E:
            []
            resultThatCanBeUsedByArrayMethodSort:
            1
            -----------------------------------------------------
            end of fn compareFnToSortPackets:
            ( fn compareFnToSortPackets === 'recursive fn' + 'fn to create the correct inputs (i.e. 1, -1) for the array-sort-method )'
            -----------------------------------------------------
            Final result of sorting all packets:
            ┌─────────┬───────┐
            │ (index) │   0   │
            ├─────────┼───────┤
            │    0    │   1   │
            │    1    │ [ 1 ] │
            │    2    │ [ 1 ] │
            │    3    │   1   │
            └─────────┴───────┘
            [
            [
                1
            ],
            [
                [
                1
                ]
            ],
            [
                [
                1
                ]
            ],
            [
                1
            ]
            ]
            <more info:
            inputFile.length:
            5
            </end of more info >    

            analysis of this data:
            In each of the 3 comparisons D and E are equal, so result is -777 (ctrl-f
            for the  meaning of -777). This nr is converted to 1, so it can be used by
            array method sort.
            Because they are equal, sort-fn only needs 3 comparisons. Each of the 3 
            comparisons leads to result 1....so the sort-fn leaves the order of the
            inputfile as is (works as intended). 

            


    DESIGN
        1. convert the outputs from Day9-part1 into the outputs of Day9-part2: e.g. 
                'correctOrderOfPairOfPacketsOnIndex_0' --> ' -1 '. I need this for the 
                array-method 'sort' (see step 3 below) to work. (status: done)

        2. Check if both 'divider packets' are unique in the  inputFile. (status: done)
            answer: There are multiple occurrences of both divider packets as P and Q.
            But as D and E both divider packets are unique. 
        3. add divider packets to the inputfile: [[2]] and [[6]] (status:done)
        4. create compare fn 'compareFnToSortPackets' that can be used in array-method 'sort'.
            a) unforeseen: compareFn is a combi of 2 fns. Put bot fns inside the compareFn (status: done)

                STATUS: UNTIL HERE: DONE.

            b) unforeseen: flatten variable arrayWithAllPairsOf2Packets. (status: done) 
                e.g.
                    [
                        [ '[[2]]', '[[6]]' ],
                        [ '[[0]]', '[[1]]' ],
                        [ '[]', '[[]]' ],
                    ]

                to:
                    [
                        '[[2]]',
                        '[[6]]',
                        '[[0]]',
                        '[[1]]',
                        '[]',
                        '[[]]',
                    ]
                reason: sort-fn needs a not-nested list with elements to sort.

            b) unforeseen: JSON.parse() before entering the compare fn    (status: done)

        5. create arrayWithAllPairsOf2Packets.sort( checkIfPacketLeftAndRightAreInCorrectOrder ) (status: done)
        6. look for index of both divider packets  (use "array.indexOf( )")
            pitfall: index with 1-based counting, but not 0-based counting.
            pitfall: see DESIGN point 2 above. 

        7. multiply both index-positions.

        First work with testdata. Implement solution incrementally.


*/
const log = console.log;

const {readFileSync} = require("fs");
const { toNamespacedPath } = require("path");


// DATA - DATA - DATA - DATA
// input1.txt == example data from https://adventofcode.com/2022/day/13 
// input2.txt == real data to calculate the real answer for day 13 part 1.
// input3.txt == more testdata (more complex than input1.txt):
/*
   expected result of input3.txt:
   [
    'correctOrderOfPairOfPacketsOnIndex_0',
    'WRONGOrderOfPairOfPacketsOnIndex_1',
    'correctOrderOfPairOfPacketsOnIndex_2',
    'WRONGOrderOfPairOfPacketsOnIndex_3',
    'correctOrderOfPairOfPacketsOnIndex_4',
    'WRONGOrderOfPairOfPacketsOnIndex_5',
    'correctOrderOfPairOfPacketsOnIndex_6',
    'WRONGOrderOfPairOfPacketsOnIndex_7'
  ]
  // array input3.txt has expected result of SSSsumOfIndicesOfThePacketPairsThatAreAlreadyInTheRightOrder: 16 (ok)
*/

let inputFile = readFileSync("input2.txt", "utf-8").split('\r\n');
// // log(inputFile);

/*
    array inputFileTest below has 2 purposes:
    1. it is an example of what the output from reading an input-file looks like.
    2. another place to quickly tweak testdata. 
*/
// array inputFileTest has expected result of SSSsumOfIndicesOfThePacketPairsThatAreAlreadyInTheRightOrder: 34 (ok)
// const inputFileTest = [
//     '[1,1,3,1,1]',
//     '[1,1,5,1,1]',
//     '',

//     '[]',
//     '[]',
//     '',

//     '[]',
//     '[[3]]',
//     '',  
    
//     '[[3]]',
//     '[]',
//     '',   

//     '[[3]]',
//     '[[[[[[[[[[[[[93]]]]]]]]]]]]]',
//     '', 

//     '[3]',
//     '[]',
//     '',       

//     '[6]',
//     '[[[[[[[[[[[[[932]]]]]]]]]]]]]',
//     '', 


//     '[]',
//     '[8]',
//     '',  

//     '[31]',
//     '[[[[[[[[[[18]]]]]]]]]]',
//     '', 

//     '[[[[[[[[[[18]]]]]]]]]]',
//     '[31]',
//     '', 
// ];

// <End of chapter DATA />

// log(`TRANSFORM DATA FROM THE  TEXT INPUTFILE:  `)
// STEP 1: for each 3 elements in inputFile, select only the first 2:
const convertToArayWithForEach3ArrayElementsTheFirst2Into1NestedArray = (array, chunkSize, nestedChunkSize) => {
    /*
        I have tweaked a fn from: 
       https://stackoverflow.com/questions/8495687/split-array-into-chunks
       so it can be used on a two-dimensional grid: 
    */
   
    // repetitive pattern: pair with 2 packets === 3 elements in arrayAsString (except for the last ):
    let arrayWithAllPairsOf2Packets = [];
    let chunk;
    let nestedChunk;
    for (let i = 0; i < array.length; i += chunkSize) {
        chunk = array.slice(i, i + chunkSize);
        // // log(chunk)
        // I just want to first 2:
        // e.g. I want [ '[1,1,3,1,1]', '[1,1,5,1,1]' ] instead of: [ '[1,1,3,1,1]', '[1,1,5,1,1]', '' ]
        for (let i = 0; i < chunk.length; i += nestedChunkSize) {
            nestedChunk = chunk.slice(i, i + nestedChunkSize);
            // arrayWithAllPairsOf2Packets.push(nestedChunk);
            /*
                output:
                [ '[1,1,3,1,1]', '[1,1,5,1,1]' ]
                [ '' ]
                [ '[[1],[2,3,4]]', '[[1],4]' ]
                [ '' ]
                [ '[9]', '[[8,7,6]]' ]
                [ '' ]
                [ '[[4,4],4,4]', '[[4,4],4,4,4]' ]
                [ '' ]
                [ '[7,7,7,7]', '[7,7,7]' ]
                [ '' ]
                [ '[]', '[3]' ]
                [ '' ]
                [ '[[[]]]', '[[]]' ]
                [ '' ]
                [ '[1,[2,[3,[4,[5,6,7]]]],8,9]', '[1,[2,[3,[4,[5,6,0]]]],8,9]' ]
            */
            if (nestedChunk.length > (nestedChunkSize - 1)){ // alternative for this data: "(nestedChunk.length > 1)"
                // // log(nestedChunk)
                arrayWithAllPairsOf2Packets.push(nestedChunk);
            } 
        }
    }
    return arrayWithAllPairsOf2Packets;
}
let arrayWithAllPairsOf2Packets = convertToArayWithForEach3ArrayElementsTheFirst2Into1NestedArray(inputFile, 3, 2);
// log(`arrayWithAllPairsOf2Packets: (i.e. D and E)`);
// log(arrayWithAllPairsOf2Packets);
/*
    format of (example) output is like  this:
        [
            [ '[[2]]', '[[6]]' ],
            [ '[[0]]', '[[1]]' ],
            [ '[]', '[[]]' ],
        ]

    Now convert into following format 'flatArrayWithEachPacketOnItsOwnLine' (array-method 'sort' needs that):

        [
            '[[2]]',
            '[[6]]',
            '[[0]]',
            '[[1]]',
            '[]',
            '[[]]',
        ]

*/
// log(`same, but flattend and in json format:`)
let flatArrayWithEachPacketOnItsOwnLine = arrayWithAllPairsOf2Packets.flat()
// from here onwards, there are just packets. Due to the flattening you cannot tell  if a packet is "left" or "right" anymore.
// But that is ok, because you do not need that info anymore. 
// log(flatArrayWithEachPacketOnItsOwnLine);


let flatArrayWithEachPacketOnItsOwnLineWithJsonParsed = flatArrayWithEachPacketOnItsOwnLine.map((packet) => {
    return JSON.parse(packet)
})
// log(`same, but flattend and json parsed:`)
// log(flatArrayWithEachPacketOnItsOwnLineWithJsonParsed);

/*
    the data (compare with example data above) should now look like this:

    [
        [ [ 2 ] ],
        [ [ 6 ] ],
        [ [ 0 ] ],
        [ [ 1 ] ],
        [],
        [ [] ],
    ]

*/

// log(`hasInputFileBeenConvertedCorrectly:`)
// log((inputFile.length +1) * 2/3 === flatArrayWithEachPacketOnItsOwnLineWithJsonParsed.length);

/*
    e.g.
        [1,1,3,1,1]
        [1,1,5,1,1]

        [[1],[2,3,4]]
        [[1],4]

        [9]
        [[8,7,6]]

        [[4,4],4,4]
        [[4,4],4,4,4]

        [7,7,7,7]
        [7,7,7]

        []
        [3]

        [[[]]]
        [[]]

        [[2]]
        [[6]]

        [1,[2,[3,[4,[5,6,7]]]],8,9]
        [1,[2,[3,[4,[5,6,0]]]],8,9]


        (26 lines + 1) * 2/3 = 18 packets (ok)

*/






// STEP 3: calculate which pairs of packets are in the right order.
let HASCOMPARISONBETWEENLEFTANDRIGHTFINISHED = false;
const VALUETHATINDICATESTHATLEFTANDRIGHTARETHESAMEBYVALSOTHEYAREINWRONGORDER = -777 // any negative nr will do. 
const CORRECTORDER = -  1;
const WRONGORDER =  1;


const compareFnToSortPackets = (comparedArgument1, comparedArgument2) => {
    // log(`-----------------------------------------------------------------------------------------------------`);
    // log(`-----------------------------------------------------------------------------------------------------`);
    // log(`compareFnToSortPackets: start:`)
    HASCOMPARISONBETWEENLEFTANDRIGHTFINISHED = false;
    let orderOf2Packets; 



    // chapter ANALYSIS explains why I make this deep copy: 
    D = JSON.parse(JSON.stringify(comparedArgument1)); 
    E = JSON.parse(JSON.stringify(comparedArgument2)); 
    /*
         source of fn: https://tutorial.eyehunts.com/js/javascript-copy-array-without-reference-example-code/ 
        
         if necessary, goto 'Deep copy techniques depend on the three array types' on:
         https://stackoverflow.com/questions/7486085/copy-array-by-value
    */

    

    let checkIfPacketLeftAndRightAreInCorrectOrder = (D,E) => {
        let recursiveFnCallOutput;
        while (HASCOMPARISONBETWEENLEFTANDRIGHTFINISHED == false) { 
            /*
                I use 'break' to exit the while-loop.
                I never set variable HASCOMPARISONBETWEENLEFTANDRIGHTFINISHED to true.
                So I could just as well write 'while(true)' here, but for 
                readability I don't.                 
            */
            // log(`while-loop: start:`)
            // log(`D:`)
            // log(D)
            // // log(typeof(D))
            // // log(`D[0]: `)
            // // log(D[0]);
            // log(`E:`)
            // log(E)
            // // log(`E[0]: `)
            // // log(E[0]);
            // // log(typeof(E))


            /*
                about the recursiveness of this fn:
                    D and E are parameters of this fn.
                    In each if-else-statement below I use D[0] and/or E[0] (so NOT D and E again).
                    So the fn ITSELF selects the next pair of values that must be compared, each next time
                    you call this fn. This is the recursive element of "doing the same thing during each iteration
                    until you reach the base case". 
                    
                    This is why in e.g. sub-workflow-16 below I do the following recursive fn-call:

                    D[0] = checkIfPacketLeftAndRightAreInCorrectOrder(D[0], E[0]);

                    instead of (the wrong code):

                    D[0] = checkIfPacketLeftAndRightAreInCorrectOrder(D[0][0], E[0][0]);
            */

            /*
                after each iteration I want to see the logging of D and E. So I have connected all separate if-statements
                into 1 big if-else-statement.
            */


            /*
                Conditions to propagate a final result ( either "correctOrderOfPackets" or "wrongOrderOfPackets" ) 
                from an execution context (with execution  stack level > 0), to the starting execution context 
                (on starting execution stack level 0).

                Without recursion everything you do inside a function, happens  on  "execution stack level 0".

                I need this answer to "inform" var indicesOfAllMappedItemsFromInputFile via the map-fn above, that
                the pair-of-packets-under-test is in correct order or wrong order. But I need this answer to bypass
                lower execution-stack-levels, because the info is not needed there (and would mess up my code).
            */

            // condition 1of3 to propagate a final  result: (scope: only respond to recursive fn-call):    

            if(!Array?.isArray(D[0]) && typeof(D[0]) != 'number' && !Array?.isArray(E[0]) && typeof(E[0]) != 'number' ){
            // if (typeof(D[0] === 'string') || typeof(D[0] === 'string')){
                if (D[0]?.includes('correctOrder') && E[0]?.includes('correctOrder')){
                    log(`propagate-workflow 1: recursion: higher stack result: packets in right order. Propagate this info.`)
                    orderOf2Packets = `correctOrderOfPairOfPacketsOnIndex_propagate-workflow 1`;
                    // orderOf2Packets = `WRONGOrderOfPairOfPackets__in_propagate-workflow 1`;
                    break;
                }
            } 
            
            // condition 2of3 to propagate a final  result: (scope: only respond to recursive fn-call):      
            if(!Array?.isArray(D[0]) && typeof(D[0]) != 'number' && !Array?.isArray(E[0]) && typeof(E[0]) != 'number' ){
                // if (typeof(D[0] === 'string') || typeof(D[0] === 'string')){

                    if (D[0]?.includes('WRONGOrder') && E[0]?.includes('WRONGOrder')){
                        log(`propagate-workflow 2: recursion: higher stack result: packets in WRONG order. Propagate this info.`)
                        orderOf2Packets = `WRONGOrderOfPairOfPackets__in_propagate-workflow 2`;
                        // orderOf2Packets = `correctOrderOfPairOfPacketsOnIndex_propagate-workflow 1`;
                        break;
                    }
            } 

                //  && recursiveFnCallOutput == 0
            if(!Array?.isArray(recursiveFnCallOutput) && typeof(recursiveFnCallOutput) == 'number' ){
                // PROBLEM: not being used by the code
                log(`propagate-workflow 3: recursion: higher stack result: packets identical (byVal). Propagate this info.`);
                //scope: ONLY in recursive fn-call: if D and E are equal, then result is 0.
                D[0] = 0;
                E[0] = 0;
                // next step: packet-workflow 1 (below)
                break;
            } 


            if(!Array?.isArray(recursiveFnCallOutput) && typeof(recursiveFnCallOutput) != 'number' && recursiveFnCallOutput?.includes('correctOrder')){
                
                    // log(`ladiela2`)
                    log(`propagate-workflow 1: recursion: higher stack result: packets in correct order. Propagate this info.`)
                    //scope: ONLY in recursive fn-call
                    orderOf2Packets = `correctOrderOfPairOfPacketsOnIndex_propagate-workflow 1`;
                    break;
            
            }

            if(!Array?.isArray(recursiveFnCallOutput) && typeof(recursiveFnCallOutput) != 'number' && recursiveFnCallOutput?.includes('WRONGOrder')){
                    // log(`ladiela3:`)
                    log(`propagate-workflow 2: recursion: higher stack result: packets in WRONG order. Propagate this info.`)
                    //scope: ONLY in recursive fn-call
                    orderOf2Packets = `WRONGOrderOfPairOfPackets__in_propagate-workflow 2`;
                    break;
            }
  

            if (D?.length == 0 && E?.length == 0){
                // log(`--packet-workflow 1: D.length == 0 && E.length == 0`);
                // orderOf2Packets = -777; // this is a magic nr...so instead:
                orderOf2Packets = VALUETHATINDICATESTHATLEFTANDRIGHTARETHESAMEBYVALSOTHEYAREINWRONGORDER;
                // orderOf2Packets = 0;
                break;
                /*
                    condition 1of1 to propagate an "intermediate" result:          
                        This is a recursive fn. There is only scenario in which I return a value from e.g. execution context on
                        stack level 4 to level 3, instead of straight to level 0 (level 0 == execution context on stack level 0, as
                        explained above). This is when when D and E have the same value. 
                        On level 3 the equal value for D[0] and E[0] will now be removed by the appropriate sub-workflow 
                        (the sub-workflows are part of the recursive fn checkIfPacketLeftAndRightAreInCorrectOrder).
                        After that the next D[0] and  E[0] can be selected to make the next comparison (as prescribed in 
                        the requirements), and so on. Specs say: "continue with comparing the next value".

                        So I must return value 0 here that must be assigned to D[0] and/or E[0] in the
                        sub-workflows 12, 15 and 16. 
                        When e.g. on level 1 you do: 
                        D[0] = checkIfPacketLeftAndRightAreInCorrectOrder("from the nested array take array as fn argument")
                        with result: D[0] = 0.
                        then on on level 1 fn checkIfPacketLeftAndRightAreInCorrectOrder can continue with process this "0" from
                        that is returned by the recursive fn on level 1.
                        Same between level 1 and level 2, level 2 and level 3, etc.

                        If this if-statement is true, then packetLeft and packetRight are the same. According to the specs,
                        if they are the same, then  they are in the WRONG order. So -777 is NOT allowed to show up 
                        in the array with indices of pairs of packets that are in the correct order. That is why I filter out
                        -777 from the result list (ctrl-f on )
                */
                
                /*
                    Var orderOf2Packets in this if-else-statement has 2 responsibilities:
                    1. propagate result (result: D and E are equal) to a lower stack-level execution context.
                    2. return result (i.e. map to var indicesOfAllMappedItemsFromInputFile ) that packets are equal and therefor in wrong order.
                */ 


                /*
                    So why use a nr here (-777) inside a const VALUETHATINDICATESTHATLEFTANDRIGHTARETHESAMEBYVALSOTHEYAREINWRONGORDER ?
                    Answer: packet-workflow 1 has 2 responsibilities:
                    1.  Communicate result, that D[0] and E[0] are identical byVal, from execution context 
                        to "calling" execution context during recursive-fn-call:
                        --> if execution context > stack-level-0 (e.g. stack-level-1), then level-1 will return to the D[0] and E[0] on 
                        stack-level-0 a value 0 ('numeric zero'). So the D[0] and E[0] will be deleted and the next comparison of
                        D[0] and E[0] can be made.  
                    2.  Commuinicate result, that D and E (not just D[0] and E[0]) are identical on stack-level-0:
                        In other words: return result from  execution context on stack-level-0, so it can be mapped to variable 
                        indicesOfAllMappedItemsFromInputFile
                        if execution context is on stack-level-0 (i.e. the first execution context on the stack), then returning -777 
                        ( by doing: 
                        a) orderOf2Packets = VALUETHATINDICATESTHATLEFTANDRIGHTARETHESAMEBYVALSOTHEYAREINWRONGORDER;
                        b) break;
                        c) below the while loop: return this result as the answer to the question: is this pairOfPackets in right order?
                            The answer: no (because packetLeft and packetRight are identical byVal).
                        d) this value -777 is returned to var indicesOfAllMappedItemsFromInputFile and it means: this pair of packets
                            are in the wrong order. 
                        e) at the end of the code (ctrl-f "VALUETHATINDICATESTHATLEFTANDRIGHTARETHESAMEBYVALSOTHEYAREINWRONGORDER") I 
                            convert each of these values to e.g. WRONGOrderOfPairOfPacketsOnIndex_8 --> 8 means that it applies to 
                            index position nr 8. 

                    2do: (but I leave it for now): give var orderOf2Packets 1 responsibility, and 
                    transfer the other responsibility to another var.
                */

                // continue; 
                /*
                    'continue' instead of 'break' is wrong: a value must be returned to the execution context on a stack level (e.g. 3)
                    right below the stack level (e.g. 4) of the current execution context. (so 4 is 'higher' than                  
                    3 'vertically' on the stack) .
                */
                // return;
                /*
                    'return' can be used as alternative. So I could use:
                    1. orderOf2Packets = VALUETHATINDICATESTHATLEFTANDRIGHTARETHESAMEBYVALSOTHEYAREINWRONGORDER;
                    2. 'return orderOf2Packets'

                    instead of:
                    1. orderOf2Packets = VALUETHATINDICATESTHATLEFTANDRIGHTARETHESAMEBYVALSOTHEYAREINWRONGORDER;
                    2. break;                      
                    3. (below while-statement): return orderOf2Packets
                */
            } 
            
            /*
                goal: Commuinicate result, that D (not just D[0]) is 0 on stack-level-0, so the pair of packets is
                in the right order:
            */
            if (D?.length == 0){
                // log(`--packet-workflow 2: D.length == 0 --> return index_`)
                orderOf2Packets = `correctOrderOfPairOfPacketsOnIndex_packet-workflow 2`;
                break;
                // meaning: packetRight (D) has run out of values before packetLeft (E).

            } else
            /*
                goal: Commuinicate result, that D (not just D[0]) is 0 on stack-level-0, so the pair of packets is
                in the WRONG order:
            */
            if (E?.length == 0){
                // log(`--packet-workflow 3: E.length == 0 --> return packetRightHasRunOutOfItemsFirst`)
                orderOf2Packets = `WRONGOrderOfPairOfPacketsOnIndex_packet-workflow 3`;
                break;
                // meaning: packetRight (E) has run out of values before packetLeft (D).
            } else
            


            /*
                goal: of sub-workflows 1-16: communicate the result of a comparison of D[0] and E[0]. 
                1 comparison in each iteration of the while-loop.
            */
            if(!Array?.isArray(D[0]) && typeof(D[0]) == 'number' && !Array?.isArray(E[0]) && typeof(E[0]) == 'number' ){
                // log(`--sub-workflow 1: compare nr with nr:`)
                // log(`P and Q are  nrs, e.g. [6]`)
                // log(`D[0]: ${D[0]}`);
                // log(`E[0]: ${E[0]}`);
                //pitfall: definition: e.g. [[6]] is NOT a number, but a AWNA (array with nested array)!
                if (D[0] - E[0] < 0) {
                    // log(`nr of D[0] < E[0] --> return index:`)
                    orderOf2Packets = `correctOrderOfPairOfPacketsOnIndex_sub-workflow 1`;
                    break;
                    // return index
                } else if ((D[0] - E[0] > 0)){
                    orderOf2Packets = `WRONGOrderOfPairOfPacketsOnIndex_sub-workflow 1`;
                    break;
                } else {
                    if (D.length > 1){
                        D.shift();
                    } else {
                        D.length = 0;
                    }
                    if (E.length > 1){
                        E.shift();
                    } else {
                        E.length = 0;
                    }                       
                }
            } else
        

            if(!Array?.isArray(D[0]) && typeof(D[0]) == 'number' && (Array?.isArray(E[0])) ){
                // log(`--sub-workflow 2,3,4: compare nr with array (i.e. empty aray, array with nr, or nested array):`)
                //put brackets around the number: e.g. 5 --> [5]
                D[0] = [D[0]];
                /*
                    You must nest D[0] inside brackets, even if you know that E[0] contains empty array. 
                    (tempting to already return 'packetOrderWrong', but do not do that yet;
                    sub-workflow 10 is going to take over next, and return a value based on the empty value.
                */
            } else

            if(Array?.isArray(D[0]) && !Array?.isArray(E[0]) && typeof(E[0]) == 'number'){
                // log(`--sub-workflow 5,9,13: compare 'array' with a 'nr': (i.e. empty aray, array with nr, or nested array)`)
                E[0] = [E[0]];
            } else

            if(Array?.isArray(D[0]) && D[0].length == 0 && Array?.isArray(E[0]) && E[0].length == 0 ){
                // log(`--sub-workflow 6: compare empty-array with empty-array:`)
                D.shift(); 
                E.shift();               
            } else

            if(Array?.isArray(D[0]) && D[0].length == 0 && Array?.isArray(E[0]) && typeof(E[0][0]) == 'number' && E[0][0].length != 0){
                // log(`--sub-workflow 7: compare empty array with array-with-nr:`)
                orderOf2Packets = `correctOrderOfPairOfPacketsOnIndex_sub-workflow 7`;
                break;
            } else

            if(Array?.isArray(D[0]) && D[0].length == 0 && Array?.isArray(E[0]) && Array?.isArray(E[0][0]) ){
                // log(`--sub-workflow 8: compare empty array with array-with-nested-array:`)
                orderOf2Packets = `correctOrderOfPairOfPacketsOnIndex_sub-workflow 8`;
                break;
            } else            

            if(Array?.isArray(D[0]) && typeof(D[0][0]) == 'number' && D[0][0].length != 0 && Array?.isArray(E[0]) && E[0].length == 0   ){
                // log(`--sub-workflow 10: compare array-with-nr with empty-array:`)
                orderOf2Packets = `WRONGOrderOfPairOfPacketsOnIndex_sub-workflow 10`;
                break;                    
            } else

            if(Array?.isArray(D[0]) && typeof(D[0][0]) == 'number' && D[0][0].length != 0 && Array?.isArray(E[0]) && typeof(E[0][0]) == 'number' && E[0][0].length != 0   ){
                // log(`--sub-workflow 11: compare array-with-nr with array-with-nr:`)

                if (D[0][0] - E[0][0] < 0) {
                    // log(`nr of D[0][0] < E[0][0]: --> return 'correct order`)
                    orderOf2Packets = `correctOrderOfPairOfPacketsOnIndex_sub-workflow 11`;
                    break;                        

                } else if ((D[0][0] - E[0][0] > 0)){
                    // log(`nr of D[0][0] > E[0][0]: --> return 'WRONG order'`)
                    orderOf2Packets = `WRONGOrderOfPairOfPacketsOnIndex_sub-workflow 11`;
                    break;                         
                } else {
                    if (D[0].length > 1){
                        D[0].shift();
                    } else {
                        D[0].length = 0;
                    }
                    if (E[0].length > 1){
                        E[0].shift();
                    } else {
                        E[0].length = 0;
                    }                       
                }
            } else

            if(Array?.isArray(D[0]) && typeof(D[0][0]) == 'number' && D[0][0].length != 0 && Array?.isArray(E[0]) && Array?.isArray(E[0][0])   ){
                // log(`--sub-workflow 12: compare array-with-nr with array-with-nested-array:`)
                // log(`  make RECURSIVE fn-call to checkIfPacketLeftAndRightAreInCorrectOrder:`) 
                recursiveFnCallOutput = checkIfPacketLeftAndRightAreInCorrectOrder(D[0], E[0])               
                break;

            } else

            if(Array?.isArray(D[0]) && Array?.isArray(D[0][0]) && Array?.isArray(E[0]) && E[0].length == 0   ){
                // log(`--sub-workflow 14: compare AWNA (array-nested-array) with empty-array:`)
                orderOf2Packets = `WRONGOrderOfPairOfPacketsOnIndex_sub-workflow 14`;
                break;                      
            } else




            if(Array?.isArray(D[0]) && Array?.isArray(D[0][0]) && Array?.isArray(E[0]) && typeof(E[0][0]) == 'number' && E[0][0].length != 0   ){
                // log(`--sub-workflow 15: compare AWNA (array-nested-array) with array-with-nr:`)  
                // log(`  make RECURSIVE fn-call to checkIfPacketLeftAndRightAreInCorrectOrder:`)               
                recursiveFnCallOutput = checkIfPacketLeftAndRightAreInCorrectOrder(D[0], E[0])
                                 
                break;               

            } else

            if(Array?.isArray(D[0]) && Array?.isArray(D[0][0]) && Array?.isArray(E[0]) && Array?.isArray(E[0][0])   ){
                // log(`--sub-workflow 16: compare AWNA (array-nested-array) with AWNA (array-nested-array):`)
                // log(`  make RECURSIVE fn-call to checkIfPacketLeftAndRightAreInCorrectOrder:`)     
                recursiveFnCallOutput = checkIfPacketLeftAndRightAreInCorrectOrder(D[0], E[0]);
            

              
            } else {
                // log(`problem in fn checkIfPacketLeftAndRightAreInCorrectOrder: please investigate:`);
            } 



        } // end of while loop

        // log(`out of while loop:`)
        // // log('D:')
        // // log(D);
        // // log('E:')
        // // log(E); 
        // log(`orderOf2Packets (as a string): `);
        // log(orderOf2Packets);
        // log(`<fn checkIfPacketLeftAndRightAreInCorrectOrder: end />`)
        // log(`--------------------------`)    

        return orderOf2Packets;

    } // end of recursive fn checkIfPacketLeftAndRightAreInCorrectOrder

    // log(`-----------------------------------`); 
    let resultFromFncheckIfPacketLeftAndRightAreInCorrectOrder = checkIfPacketLeftAndRightAreInCorrectOrder(D, E); // must be array with 2 values: 1 for D and 1 for E. (0,0 or 0,1 or 1,1)
    // log(`-----------------------------------`); 
    // log(`fn checkIfPacketLeftAndRightAreInCorrectOrder: output: `)
    // log(resultFromFncheckIfPacketLeftAndRightAreInCorrectOrder)
    // log('D:')
    // log(D);
    // log('E:')
    // log(E);


    /*
        in Day13-part2 the following problem emerges if P and/or Q is a nested array (e.g. [[]] ):...

        with e.g. the following testdata in input3.txt:
        [[[[]]]]
        [[[]]]

        the result is:
            TRANSFORM DATA FROM THE  TEXT INPUTFILE:
            arrayWithAllPairsOf2Packets: (i.e. D and E)
            [ [ '[[[[]]]]', '[[[]]]' ] ]
            same, but flattend and in json format:
            [ '[[[[]]]]', '[[[]]]' ]
            same, but flattend and json parsed:
            [ [ [ [Array] ] ], [ [ [] ] ] ]
            -----------------------------------
            while-loop: start:
            D:
            [ [ [] ] ]
            E:
            [ [ [ [] ] ] ]
            --sub-workflow 16: compare AWNA (array-nested-array) with AWNA (array-nested-array):
            while-loop: start:
            D:
            [ [ [] ] ]
            E:
            [ [] ]
            --sub-workflow 14: compare AWNA (array-nested-array) with empty-array:while loop: end:
            D:
            [ [ [] ] ]
            E:
            [ [] ]
            orderOf2Packets:
            WRONGOrderOfPairOfPacketsOnIndex_sub-workflow 14
            while-loop: start:
            D:
            [ 'WRONGOrderOfPairOfPacketsOnIndex_sub-workflow 14' ]
            E:
            [ 'WRONGOrderOfPairOfPacketsOnIndex_sub-workflow 14' ]
            propagate-workflow 2: higher stack result: packets in right order. Propagate this info.
            while loop: end:
            D:
            [ 'WRONGOrderOfPairOfPacketsOnIndex_sub-workflow 14' ]
            E:
            [ 'WRONGOrderOfPairOfPacketsOnIndex_sub-workflow 14' ]
            orderOf2Packets:
            WRONGOrderOfPairOfPackets__in_propagate-workflow 1
            -----------------------------------
            output of recursive fn:
            WRONGOrderOfPairOfPackets__in_propagate-workflow 1
            D:
            [ 'WRONGOrderOfPairOfPacketsOnIndex_sub-workflow 14' ]
            E:
            [ 'WRONGOrderOfPairOfPacketsOnIndex_sub-workflow 14' ]
            resultThatCanBeUsedByArrayMethodSort:
            WRONGOrderOfPairOfPackets__in_propagate-workflow 1
            arrayWithSortedPackets:
            [
            [ 'WRONGOrderOfPairOfPacketsOnIndex_sub-workflow 14' ],
            [ 'WRONGOrderOfPairOfPacketsOnIndex_sub-workflow 14' ]
            ]
            <more info:
            inputFile.length:
            2
            </end of more info >

            


            analysis of this PROBLEM: 
            In day13-part1 a recursive fn call is needed when D[0]  and/or E[0] are AWNA (aray  with nested array).
            This is the case in sub-workflows 12, 15 and 16.
            In the process D[0] and E[0] are mutated/ overwritten by the result of the recursive-fn-call: either 
            'correctOrderOfPackets' or 'WRONGOrderOfPackets'. (ex: see the lines marked with PROBLEM above).
            Best practice is to let 1 variable have 1 responsibility (which is violated here).
            However, in Day13-part1 I only needed this result. What happened to D and E did not matter. So everything was
            looking peachy.

            BUT...in day13-part1 I have a array-sort-fn that needs 2 inputs:
            1. resultThatCanBeUsedByArrayMethodSort: can be -1 or 1 (PS 0 is not applicable, because packet order can only be correct or wrong).
            2. array D (i.e. the first packet in the sort-array)
            3. array E (i.e. the second packet in the sort-array)
            As mentioned in the ANALYSIS (at beginning of this file), in day13-part2 there is no more distinction between a 'packetLeft' and 
            'packetRight'.

            So what I need (and needs to be implemented) is this:

            while-loop: start:
            D:
            [ 'correctOrderOfPairOfPacketsOnIndex_sub-workflow 8' ]   
            E:
            [ 'correctOrderOfPairOfPacketsOnIndex_sub-workflow 8' ]   
            propagate-workflow 1: higher stack result: packets in right order. Propagate this info.
            -----------------------------------
            output of recursive fn:
            correctOrderOfPairOfPacketsOnIndex_propagate-workflow 1
            D:
            [ 'correctOrderOfPairOfPacketsOnIndex_sub-workflow 8' ] 
            E:
            [ 'correctOrderOfPairOfPacketsOnIndex_sub-workflow 8' ] 
            resultThatCanBeUsedByArrayMethodSort:
            -1                       // GOOD: this is what I need
            arrayWithSortedPackets:
            [
            [ 'correctOrderOfPairOfPacketsOnIndex_sub-workflow 8' ],
            [ 'correctOrderOfPairOfPacketsOnIndex_sub-workflow 8' ]
            ]


    */

    // D = deepCopyOfD;
    // E = deepCopyOfE;
    // // log(`while-loop: start: (after correction)`)
    // // log(`D:`)
    // // log(D)
    // // // log(typeof(D))
    // // log(`E:`)
    // // log(E)

    const makeReturnValuesOfCompareFnCompatibleForUseBySortFn = (result) => {
        /* 
            conversion for Day13-part2. Chapter ANALYSIS at beginning of this file (ctrl-f ANALYSIS) 
            explains why this is necessary.

            checkIfPacketLeftAndRightAreInCorrectOrder is the compareFn for the higher-order 
            array method 'sort'. But the method signature of 'sort' can only handle
            -1, 1 or 0. That is why I convert them into -1, or 1.
            0 (i.e. numeric zero) is not an option, because according to specs, D and E are either in correct or
            wrong order (dichotonomous),  but there is not "draw"

        */

        if (result == VALUETHATINDICATESTHATLEFTANDRIGHTARETHESAMEBYVALSOTHEYAREINWRONGORDER){
            log(`fn makeReturnValuesOfCompareFnCompatibleForUseBySortFn: line 1154:`)
            log(`var result:`);
            log(result);
            result = 0; 
            /*
               adventOfCode requirement: if D and E are the same (byVal), then  they are in the wrong order...
               but for the array-sort-method, if 2 values are equal, then input for the sort-fn
               must be 0, instead of 'packetsInWrongOrder' (imho).
            */
            /* 
                Day13-part2: tempting to do this: 'result = 0', but 2 packets cannot be equal:
                packetOne = [1];
                packetTwo = [1];
                Same values (i.e. array elements byVal), so according to requirements: WRONGORDER. 
                Chapter ANALYSIS gives a code ex.

            */
            return result;
        } else


        if(Array?.isArray(D)) {
            if (result.includes('correctOrderOfPairOfPackets')) {
                // log(`correcto1`);  
                return CORRECTORDER;
            } else
            if (result.includes('WRONGOrderOfPairOfPackets')) {
                // log(`wrongo1`);  
                return WRONGORDER;
            } 

        }  else
        if(Array?.isArray(E)) {
            if (result.includes('correctOrderOfPairOfPackets')) {
                // log(`correcto2`);  
                return CORRECTORDER;
            } else
            if (result.includes('WRONGOrderOfPairOfPackets')) {
                // log(`wrongo2`);  
                return WRONGORDER;
            }

        } else {
            log(`fn makeReturnValuesOfCompareFnCompatibleForUseBySortFn: line 1154: result
            with unknown datatype.`)
        } 


        // if(typeof(result) != 'number'){
        //     if (result.includes('correctOrderOfPairOfPackets')) {
        //         // log(`correcto3`);
        //         return CORRECTORDER;
        //     } else
        //     if (result.includes('WRONGOrderOfPairOfPackets')) {
        //         // log(`wrongo3`);
        //         return WRONGORDER;
        //     } 
        // }  

        
        // // log(`problem: in fn makeReturnValuesOfCompareFnCompatibleForUseBySortFn variable 'result' has
        // value that is not being handled by the code`);
        /*
            Not a problem (albeit not handled by this piece of code): if D[0] and/or E[0] is undefined, 
            then that means that D and/ or E has 
            run out of items. 
        */

        // return 0; // 0 not an option: see explanation above. 
        
    }
    let resultThatCanBeUsedByArrayMethodSort = makeReturnValuesOfCompareFnCompatibleForUseBySortFn(resultFromFncheckIfPacketLeftAndRightAreInCorrectOrder);
    // log(`resultThatCanBeUsedByArrayMethodSort: `);
    // log(resultThatCanBeUsedByArrayMethodSort);



    return resultThatCanBeUsedByArrayMethodSort;

} // end of compareFnToSortPackets


let arrayWithSortedPackets = flatArrayWithEachPacketOnItsOwnLineWithJsonParsed.sort(compareFnToSortPackets);




// log(`-----------------------------------------------------`);
// log(`end of fn compareFnToSortPackets: `);
// log( `( fn compareFnToSortPackets === 'recursive fn' + 'fn to create the correct inputs (i.e. 1, -1) for the array-sort-method )'`);
// log(`-----------------------------------------------------`);
// log(`Final result of sorting all packets: `);
// console.table(arrayWithSortedPackets); (works)
/*
    concise overview, but nested arrays are shown as [Array], e.g.:
    ┌─────────┬─────────────┬────────────────┬───┬───┬───┐
    │ (index) │      0      │       1        │ 2 │ 3 │ 4 │
    ├─────────┼─────────────┼────────────────┼───┼───┼───┤
    │    0    │             │                │   │   │   │
    │    1    │     []      │                │   │   │   │
    │    2    │   [ [] ]    │                │   │   │   │
    │    3    │      1      │       1        │ 3 │ 1 │ 1 │
    │    4    │      1      │       1        │ 5 │ 1 │ 1 │
    │    5    │    [ 1 ]    │  [ 2, 3, 4 ]   │   │   │   │
    │    6    │      1      │ [ 2, [Array] ] │ 8 │ 9 │   │
    │    7    │      1      │ [ 2, [Array] ] │ 8 │ 9 │   │
    │    8    │    [ 1 ]    │       4        │   │   │   │
    │    9    │    [ 2 ]    │                │   │   │   │
    │   10    │      3      │                │   │   │   │
    │   11    │  [ 4, 4 ]   │       4        │ 4 │   │   │
    │   12    │  [ 4, 4 ]   │       4        │ 4 │ 4 │   │
    │   13    │    [ 6 ]    │                │   │   │   │
    │   14    │      7      │       7        │ 7 │   │   │
    │   15    │      7      │       7        │ 7 │ 7 │   │
    │   16    │ [ 8, 7, 6 ] │                │   │   │   │
    │   17    │      9      │                │   │   │   │
    └─────────┴─────────────┴────────────────┴───┴───┴───┘

*/
//  log(JSON.stringify(arrayWithSortedPackets, null, 2)) 
// console.table(JSON.stringify(arrayWithSortedPackets, null, 2))
/*
    shows all data, but hard to read: e.g.
    [
    [],
    [
        []
    ],
    [
        [
        []
        ]
    ],
    [
        1,
        1,
        3,
        etc.
*/

let printNestedArray = (arrayWithSortedPackets) => {
    arrayWithSortedPackets.forEach((packet, index) => {
        log(`---------------------------------------------------------------------------------------------------`)
        log(`index: ${index}`);
    
        if(Array?.isArray(packet)){
            printNestedArray(packet)
        }
        
        console.table(JSON.stringify(packet, null, 5)); 
        console.table(packet);
    })

}




arrayWithSortedPackets.forEach((packet, index) => {
    log(`---------------------------------------------------------------------------------------------------`)
    log(`index: ${index}`);

    if(Array?.isArray(packet)){

    }
    
    console.table(JSON.stringify(packet, null, 5)); 
    console.table(packet);
})


// arrayWithSortedPackets.forEach((packet, index) => {
//     log(`---------------------------------------------------------------------------------------------------`)
//     log(`index: ${index}`);

//     if(Array?.isArray(packet)){

//     }
    
//     console.table(JSON.stringify(packet, null, 5)); 
//     console.table(packet);
// })


// log(flatArrayWithEachPacketOnItsOwnLineWithJsonParsed);


/*
  https://stackoverflow.com/questions/16102263/to-find-index-of-multidimensional-array-in-javascript
  contains nice example of 'the hard way' /how not to do this (imho).
*/
let stringifyAllElementsInArray = (arrayWithSortedPackets) => {
    let stringifiedArrayElements = arrayWithSortedPackets.map((packet) => {
        return JSON.stringify(packet);    
    })
    return stringifiedArrayElements;
}
let stringifiedArrayElements = stringifyAllElementsInArray(arrayWithSortedPackets);
// log(stringifiedArrayElements); (works)

let getIndexOfNestedArray = (stringifiedArrayElements, stringifiedNestedArray ) => {
    let indexPositionOfStringifiedNestedArray = stringifiedArrayElements.indexOf(stringifiedNestedArray);
    // // log(indexPositionOfPacket1); // zero-based counting (but requirements dictate 1-based counting)
    indexPositionOfStringifiedNestedArray += 1 
    return indexPositionOfStringifiedNestedArray;
}

let dividerPacket1 = '[[2]]';

let indexPositionOfFirstDividerPacket = getIndexOfNestedArray(stringifiedArrayElements, dividerPacket1);
log(indexPositionOfFirstDividerPacket);

let dividerPacket2 = '[[6]]';

let indexPositionOfSecondDividerPacket = getIndexOfNestedArray(stringifiedArrayElements, dividerPacket2);
log(indexPositionOfSecondDividerPacket);


let decoderKey = parseInt(indexPositionOfFirstDividerPacket) * parseInt(indexPositionOfSecondDividerPacket);
log(`decoderKey: ${decoderKey}`);
// log(`-------------------------------------------------------------------------`)

// input1.txt (with data from assignment): 140 (ok)
// input2.txt: 27136 (wrong) 
// input2.txt: 26797 (wrong) 


//2do: filter: dividerpackets are first and only part of the packet.



log(`<more info: `);
log(`inputFile.length:`)
log(inputFile.length); 
log(`flatArrayWithEachPacketOnItsOwnLineWithJsonParsed: `)
log(flatArrayWithEachPacketOnItsOwnLineWithJsonParsed.length);

log(`hasInputFileBeenConvertedCorrectly:`)
log((inputFile.length +1) * 2/3 === flatArrayWithEachPacketOnItsOwnLineWithJsonParsed.length);

log(`</end of more info >`)