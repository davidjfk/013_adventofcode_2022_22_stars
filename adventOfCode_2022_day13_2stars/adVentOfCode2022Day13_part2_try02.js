/*
    AdventOfCode: day 13 part 2: try_02:
    correct result adventOfCode day 13 part 2: in progress.

    GOALS for this file try_02:
    1. implement DESIGN (and update design if and where needed).

    STATUS: DESIGN-step-5 is in progress


        problem: currently output looks like this:

        input file has 2 packets to compare:
        [[[[]]]]
        [[[]]]
            <start of log>

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
            --sub-workflow 14: compare AWNA (array-nested-array) with empty-array:
            out of while loop:
            orderBetween2Packets (as a string):
            WRONGOrderOfPairOfPacketsOnIndex_sub-workflow
            14
            < end of recursive fn />
            --------------------------
            while-loop: start:
            D:
            [ 'WRONGOrderOfPairOfPacketsOnIndex_sub-workflow 14' ]
            E:
            [ 'WRONGOrderOfPairOfPacketsOnIndex_sub-workflow 14' ]
            propagate-workflow 2: higher stack result: packets in WRONG order. 
            Pr
                                    opagate this info.
            out of while loop:
            orderBetween2Packets (as a string):
            WRONGOrderOfPairOfPackets__in_propagate-workflow 2
            < end of recursive fn />
            --------------------------
            -----------------------------------
            output of recursive fn:
            WRONGOrderOfPairOfPackets__in_propagate-workflow 2
            D:
            [ 'WRONGOrderOfPairOfPacketsOnIndex_sub-workflow 14' ]
            E:
            [ 'WRONGOrderOfPairOfPacketsOnIndex_sub-workflow 14' ]
            wrongo1
            resultThatCanBeUsedByArrayMethodSort:
            1
            -----------------------------------------------------
            end of fn compareFnToSortPackets:
            ( fn compareFnToSortPackets === 'recursive fn' + 'fn to create the 
            correct inputs (i.e. 1, -1) for the array-sort-method )'
            -----------------------------------------------------
            Final result of sorting all packets:
            [
            [ 'WRONGOrderOfPairOfPacketsOnIndex_sub-workflow 14' ],  --> PROBLEM: should be:  [ [ [[]] ] ]
            [ 'WRONGOrderOfPairOfPacketsOnIndex_sub-workflow 14' ]   --> PROBLEM: should be:  [ [ [] ] ]
            ]
            <more info:
            inputFile.length:
            2
            </end of more info >

            </end of log>

            analysis:
            A recursive call (in sub-workflows 12, 15 and 16) mutates/overwrites the value of D and E.
            But (contrary to Day13-part1) I need the value of D and E to show up in the final sorted list 
            of all packets (instead of the strings that are being displayed above!).

            design:

            in the following sub-workflows use a helper-variable 'recursiveFnCallOutput', that will be overwritten/mutated instead
            of D and E.

            scope of change: workflows:
            propagate-workflow 1:
            propagate-workflow 2:
            propagate-workflow 3: (must be created) for situation that recursiveFnCallOutput === 0.
            sub-workflow 12:
            sub-workflow 15:
            sub-workflow 16:

            I will implement this in part2_try03.js


    NEXT (in try_03.js): implement solution for problem above. 

    SYNTAX: see try_01.js
    ANALYSIS: see try_01.js

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

        5. create arrayWithAllPairsOf2Packets.sort( checkIfPacketLeftAndRightAreInCorrectOrder )
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

let inputFile = readFileSync("input4.txt", "utf-8").split('\r\n');
// log(inputFile);

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

log(`TRANSFORM DATA FROM THE  TEXT INPUTFILE:  `)
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
        // log(chunk)
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
                // log(nestedChunk)
                arrayWithAllPairsOf2Packets.push(nestedChunk);
            } 
        }
    }
    return arrayWithAllPairsOf2Packets;
}
let arrayWithAllPairsOf2Packets = convertToArayWithForEach3ArrayElementsTheFirst2Into1NestedArray(inputFile, 3, 2);
log(`arrayWithAllPairsOf2Packets: (i.e. D and E)`);
log(arrayWithAllPairsOf2Packets);
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
log(`same, but flattend and in json format:`)
let flatArrayWithEachPacketOnItsOwnLine = arrayWithAllPairsOf2Packets.flat()
// from here onwards, there are just packets. Due to the flattening you cannot tell  if a packet is "left" or "right" anymore.
// But that is ok, because you do not need that info anymore. 
log(flatArrayWithEachPacketOnItsOwnLine);


let flatArrayWithEachPacketOnItsOwnLineWithJsonParsed = flatArrayWithEachPacketOnItsOwnLine.map((packet) => {
    return JSON.parse(packet)
})
log(`same, but flattend and json parsed:`)
log(flatArrayWithEachPacketOnItsOwnLineWithJsonParsed);
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

// STEP 3: calculate which pairs of packets are in the right order.
let HASCOMPARISONBETWEENLEFTANDRIGHTFINISHED = false;
const VALUETHATINDICATESTHATLEFTANDRIGHTARETHESAMEBYVALSOTHEYAREINWRONGORDER = -777 // any negative nr will do. 
const CORRECTORDER = -  1;
const WRONGORDER =  1;


const compareFnToSortPackets = (D,E) => {
    // why order D, E here, but E, D in fn checkIfPacketLeftAndRightAreInCorrectOrder below?



    HASCOMPARISONBETWEENLEFTANDRIGHTFINISHED = false;
    // let packetLeft = arrayWith1PairOfPackets[0];
    // let packetRight = arrayWith1PairOfPackets[1];
    // // D === packetLeftAsCommaSeparatedArray
    // let D = JSON.parse(packetLeft); 
    // // log(D);
    // // E === packetRightAsCommaSeparatedArray
    // let E = JSON.parse(packetRight); 
    // // log(E);

    let orderBetween2Packets; 
    // deep copy of D:
    deepCopyOfD = JSON.parse(JSON.stringify(E)); // E because array-sort reverses order of D and E.
    // deep copy of E:
    deepCopyOfE = JSON.parse(JSON.stringify(D)); // D because array-sort reverses order of D and E.

    let checkIfPacketLeftAndRightAreInCorrectOrder = (D,E) => {

        while (HASCOMPARISONBETWEENLEFTANDRIGHTFINISHED == false) { 
            /*
                I use 'break' to exit the while-loop.
                I never set var HASCOMPARISONBETWEENLEFTANDRIGHTFINISHED to true.
                So I could just as well write 'while(true)' here, but for 
                readability I do not do that.                
            */


            log(`while-loop: start:`)
            log(`D:`)
            log(D)
            // log(typeof(D))
            // log(`D[0]: `)
            // log(D[0]);

            log(`E:`)
            log(E)
            // log(`E[0]: `)
            // log(E[0]);
            // log(typeof(E))




            // log(typeof(E))

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

            // condition 1of2 to propagate a final  result: (scope: only respond to recursive fn-call):             
            if(!Array?.isArray(D[0]) && typeof(D[0]) != 'number' && !Array?.isArray(E[0]) && typeof(E[0]) != 'number' ){
            // if (typeof(D[0] === 'string') || typeof(D[0] === 'string')){
                if (D[0]?.includes('correctOrder') && E[0]?.includes('correctOrder')){
                    log(`propagate-workflow 1: higher stack result: packets in right order. Propagate this info.`)
                    orderBetween2Packets = `correctOrderOfPairOfPacketsOnIndex_propagate-workflow 1`;
                    // orderBetween2Packets = `WRONGOrderOfPairOfPackets__in_propagate-workflow 1`;
                    break;
                }
            } 
            
            // condition 2of2 to propagate a final  result: (scope: only respond to recursive fn-call):      
            if(!Array?.isArray(D[0]) && typeof(D[0]) != 'number' && !Array?.isArray(E[0]) && typeof(E[0]) != 'number' ){
                // if (typeof(D[0] === 'string') || typeof(D[0] === 'string')){

                    if (D[0]?.includes('WRONGOrder') && E[0]?.includes('WRONGOrder')){
                        log(`propagate-workflow 2: higher stack result: packets in WRONG order. Pr
                        opagate this info.`)
                        orderBetween2Packets = `WRONGOrderOfPairOfPackets__in_propagate-workflow 2`;
                        // orderBetween2Packets = `correctOrderOfPairOfPacketsOnIndex_propagate-workflow 1`;
                        break;
                    }
            } 
            

            if (D?.length == 0 && E?.length == 0){
                log(`--packet-workflow 1: D.length == 0 && E.length == 0`);
                // orderBetween2Packets = -777; // this is a magic nr...so instead:
                orderBetween2Packets = VALUETHATINDICATESTHATLEFTANDRIGHTARETHESAMEBYVALSOTHEYAREINWRONGORDER;
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
                Var orderBetween2Packets in this if-else-statement has 2 responsibilities:
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
                        a) orderBetween2Packets = VALUETHATINDICATESTHATLEFTANDRIGHTARETHESAMEBYVALSOTHEYAREINWRONGORDER;
                        b) break;
                        c) below the while loop: return this result as the answer to the question: is this pairOfPackets in right order?
                            The answer: no (because packetLeft and packetRight are identical byVal).
                        d) this value -777 is returned to var indicesOfAllMappedItemsFromInputFile and it means: this pair of packets
                            are in the wrong order. 
                        e) at the end of the code (ctrl-f "VALUETHATINDICATESTHATLEFTANDRIGHTARETHESAMEBYVALSOTHEYAREINWRONGORDER") I 
                            convert each of these values to e.g. WRONGOrderOfPairOfPacketsOnIndex_8 --> 8 means that it applies to 
                            index position nr 8. 

                    2do: (but I leave it for now): give var orderBetween2Packets 1 responsibility, and 
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
                    1. orderBetween2Packets = VALUETHATINDICATESTHATLEFTANDRIGHTARETHESAMEBYVALSOTHEYAREINWRONGORDER;
                    2. 'return orderBetween2Packets'

                    instead of:
                    1. orderBetween2Packets = VALUETHATINDICATESTHATLEFTANDRIGHTARETHESAMEBYVALSOTHEYAREINWRONGORDER;
                    2. break;                      
                    3. (below while-statement): return orderBetween2Packets
                */
            } 
            
            /*
                goal: Commuinicate result, that D (not just D[0]) is 0 on stack-level-0, so the pair of packets is
                in the right order:
            */
            if (D?.length == 0){
                log(`--packet-workflow 2: D.length == 0 --> return index_`)
                orderBetween2Packets = `correctOrderOfPairOfPacketsOnIndex_packet-workflow 2`;
                break;
                // return index // meaning: packetLeft has run out of values, but packetRight not.
                // --> see while loop below for meaning of 'index'.

            } else
            /*
                goal: Commuinicate result, that D (not just D[0]) is 0 on stack-level-0, so the pair of packets is
                in the WRONG order:
            */
            if (E?.length == 0){
                log(`--packet-workflow 3: E.length == 0 --> return packetRightHasRunOutOfItemsFirst`)
                orderBetween2Packets = `WRONGOrderOfPairOfPacketsOnIndex_packet-workflow 3`;
                break;
                // return 'packetRightHasRunOutOfItemsFirst'  // // meaning: packetRight has run out of values, but packetLeft not.
            } else
            


            /*
                goal: of sub-workflows 1-16: communicate the result of a comparison of D[0] and E[0]. 
                1 comparison in each iteration of the while-loop.
            */
            if(!Array?.isArray(D[0]) && typeof(D[0]) == 'number' && !Array?.isArray(E[0]) && typeof(E[0]) == 'number' ){
                log(`--sub-workflow 1: compare nr with nr:`)
                log(`P and Q are  nrs, e.g. [6]`)
                log(`D[0]: ${D[0]}`);
                log(`E[0]: ${E[0]}`);
                //pitfall: definition: e.g. [[6]] is NOT a number, but a AWNA (array with nested array)!
                if (D[0] - E[0] < 0) {
                    log(`nr of D[0] < E[0] --> return index:`)
                    orderBetween2Packets = `correctOrderOfPairOfPacketsOnIndex_sub-workflow 1`;
                    break;
                    // return index
                } else if ((D[0] - E[0] > 0)){
                    orderBetween2Packets = `WRONGOrderOfPairOfPacketsOnIndex_sub-workflow 1`;
                    break;
                    // return 'pIsBiggerThanQ';
                } else {
                    // D and E are equal:
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
                log(`--sub-workflow 2,3,4: compare nr with array (i.e. empty aray, array with nr, or nested array):`)
                //put brackets around the number: e.g. 5 --> [5]
                D[0] = [D[0]];
                /*
                    You must nest D[0] inside brackets, even if you know that E[0] contains empty array. 
                    (tempting to already return 'packetOrderWrong', but do not do that yet;
                    sub-workflow 10 is going to take over next, and return a value based on the empty value.
                */
            } else

            if(Array?.isArray(D[0]) && !Array?.isArray(E[0]) && typeof(E[0]) == 'number'){
                log(`--sub-workflow 5,9,13: compare array with nr: (i.e. empty aray, array with nr, or nested array)`)
                E[0] = [E[0]];
            } else

            if(Array?.isArray(D[0]) && D[0].length == 0 && Array?.isArray(E[0]) && E[0].length == 0 ){
                log(`--sub-workflow 6: compare empty-array with empty-array:`)
                D.shift(); //2do: check if this works.
                E.shift();               
            } else

            if(Array?.isArray(D[0]) && D[0].length == 0 && Array?.isArray(E[0]) && typeof(E[0][0]) == 'number' && E[0][0].length != 0){
                log(`--sub-workflow 7: compare empty array with array-with-nr:`)
                orderBetween2Packets = `correctOrderOfPairOfPacketsOnIndex_sub-workflow 7`;
                break;
            } else

            if(Array?.isArray(D[0]) && D[0].length == 0 && Array?.isArray(E[0]) && Array?.isArray(E[0][0]) ){
                log(`--sub-workflow 8: compare empty array with array-with-nested-array:`)
                orderBetween2Packets = `correctOrderOfPairOfPacketsOnIndex_sub-workflow 8`;
                log(`sub-workflow 8: end`)
                log(`D:`)
                log(D)
                // log(typeof(D))
                log(`E:`)
                log(E)
                // log(typeof(E))
                break;
            } else            

            if(Array?.isArray(D[0]) && typeof(D[0][0]) == 'number' && D[0][0].length != 0 && Array?.isArray(E[0]) && E[0].length == 0   ){
                log(`--sub-workflow 10: compare array-with-nr with empty-array:`)
                orderBetween2Packets = `WRONGOrderOfPairOfPacketsOnIndex_sub-workflow 10`;
                break;                    
            } else

            if(Array?.isArray(D[0]) && typeof(D[0][0]) == 'number' && D[0][0].length != 0 && Array?.isArray(E[0]) && typeof(E[0][0]) == 'number' && E[0][0].length != 0   ){
                log(`--sub-workflow 11: compare array-with-nr with array-with-nr:`)
                // remove brackets, e.g. [19] --> 19;
                // D[0] = D[0][0]; // wrong --> solution: compare the numbers inside of the array instead.
                // E[0] = E[0][0]; // idem.

                // solution: 
                if (D[0][0] - E[0][0] < 0) {
                    log(`nr of D[0][0] < E[0][0] --> return index:`)
                    orderBetween2Packets = `correctOrderOfPairOfPacketsOnIndex_sub-workflow 11`;
                    break;                        

                } else if ((D[0][0] - E[0][0] > 0)){
                    orderBetween2Packets = `WRONGOrderOfPairOfPacketsOnIndex_sub-workflow 11`;
                    break;                         
                } else {
                    // D and E are equal:
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
                log(`--sub-workflow 12: compare array-with-nr with array-with-nested-array:`)
                // goal: make recursive fn-call:
                D[0] = checkIfPacketLeftAndRightAreInCorrectOrder(E[0], D[0])
                /*
                    in Day13-part1:   D[0] = checkIfPacketLeftAndRightAreInCorrectOrder(D[0], E[0]);
                    in Day13-part2: the fn-arguments have been reversed. Sub-workflow 16 explains why.
                    (  ...'From the future (try03.js)': WRONG, sub-workflow 16 below explains why).
                */
                E[0] = D[0].slice();


            } else

            if(Array?.isArray(D[0]) && Array?.isArray(D[0][0]) && Array?.isArray(E[0]) && E[0].length == 0   ){
                log(`--sub-workflow 14: compare AWNA (array-nested-array) with empty-array:`)
                orderBetween2Packets = `WRONGOrderOfPairOfPacketsOnIndex_sub-workflow 14`;
                break;                      
            } else

            if(Array?.isArray(D[0]) && Array?.isArray(D[0][0]) && Array?.isArray(E[0]) && typeof(E[0][0]) == 'number' && E[0][0].length != 0   ){
                log(`--sub-workflow 15: compare AWNA (array-nested-array) with array-with-nr:`)   
                // goal: make recursive fn-call:                 
                D[0] = checkIfPacketLeftAndRightAreInCorrectOrder(E[0], D[0])
                /*
                    in Day13-part1:   D[0] = checkIfPacketLeftAndRightAreInCorrectOrder(D[0], E[0]);
                    in Day13-part2: the fn-arguments have been reversed. Sub-workflow 16 explains why.
                    (  ...'From the future (try03.js)': WRONG, sub-workflow 16 below explains why).
                */
                E[0] = D[0].slice();                    
                

            } else

            if(Array?.isArray(D[0]) && Array?.isArray(D[0][0]) && Array?.isArray(E[0]) && Array?.isArray(E[0][0])   ){
                log(`--sub-workflow 16: compare AWNA (array-nested-array) with AWNA (array-nested-array):`)
                // goal: make recursive fn-call:
                D[0] = checkIfPacketLeftAndRightAreInCorrectOrder(E[0], D[0]);
                /*
                    in Day13-part1:   D[0] = checkIfPacketLeftAndRightAreInCorrectOrder(D[0], E[0]);
                    I have reversed the fn-arguments of the fn-call, because the sort-fn requires that.
                    By isolating the (symptom of) the problem, I have figured this out.

                    testdata: (expected result: packets in wrong order)
                        D = [[[[]]]]
                        E = [[[]]]

                    result with Day13-part1 fn-call:
                        while-loop: start:
                        D:
                        [ [ [] ] ]   --> "D has become E" . I assume the array-sort-method does this.
                                    (  'From the future (try03.js)': WRONG, so do NOT reverse arguments!!!: 
                                        --> D has NOT become E (nor has E "become" D). Reason: the array-sort-method determines the order of 
                                         of the 2 arguments that it compares. So D in the comparison can be 
                                         the first or second argument. Same for E. The sort-fn determines this. 
                                         In try03.js I have undone/ removed this "quick fix". 
                                    )
                        D[0]:
                        [ [] ]
                        E:
                        [ [ [ [] ] ] ] --> E has become D. I assume the array-sort-method does this.
                        E[0]:
                        [ [ [] ] ]
                        --sub-workflow 16: compare AWNA (array-nested-array) with AWNA (array-nested-array):
                        while-loop: start:
                        D:
                        [ [ [] ] ]  --> solution: fn-call with reversed arguments makes "D D again".
                        D[0]:
                        [ [] ]
                        E:
                        [ [] ]     --> solution: fn-call with reversed arguments makes "E E again".
                        E[0]:
                        []

                        Without this quick-fix, the actual result is that both packets are in the correct order. 

                    I assume that the internal working of array-sort needs this. I consider that
                    a blackbox.
                */

                E[0] = D[0].slice();   
                
                


              
            } else {
                log(`problem: investigate: index:`);
            } 



        } // end of while loop

        log(`out of while loop:`)
        // log('D:')
        // log(D);
        // log('E:')
        // log(E); 
        log(`orderBetween2Packets (as a string): `);
        log(orderBetween2Packets);
        log(`< end of recursive fn />`)
        log(`--------------------------`)        
        return orderBetween2Packets;

    } // end of recursive fn checkIfPacketLeftAndRightAreInCorrectOrder

    log(`-----------------------------------`); 
    let result = checkIfPacketLeftAndRightAreInCorrectOrder(D, E); // must be array with 2 values: 1 for D and 1 for E. (0,0 or 0,1 or 1,1)
    log(`-----------------------------------`); 
    log(`output of recursive fn: `)
    log(result)
    log('D:')
    log(D);
    log('E:')
    log(E);


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
            orderBetween2Packets:
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
            orderBetween2Packets:
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
    // log(`while-loop: start: (after correction)`)
    // log(`D:`)
    // log(D)
    // // log(typeof(D))
    // log(`E:`)
    // log(E)

    const makeReturnValuesOfCompareFnCompatibleForUseBySortFn = (result) => {
        /* 
            conversion for Day13-part2. Chapter ANALYSIS at beginning of this file (ctrl-f ANALYSIS) 
            explains why this is necessary.

            checkIfPacketLeftAndRightAreInCorrectOrder is the compareFn for the higher-order 
            array method 'sort'. But the method signature of 'sort' can only handle
            -1, 1 or 0. That is why I convert them into -1, or 1.
            0 (i.e. numeric zero) is not an option, because according to specs, D and E are either in correct or
            wrong order (dichotonomous),  but there is not "draw"

            for readability of ternary, I use short helper variable 'result'.
        */

        if(Array?.isArray(D)) {
            if (D[0].includes('correctOrderOfPairOfPackets')) {
                log(`correcto1`);  
                return CORRECTORDER;
            } else
            if (D[0].includes('WRONGOrderOfPairOfPackets')) {
                log(`wrongo1`);  
                return WRONGORDER;
            } 

        }  
        if(Array?.isArray(E)) {
            if (E[0].includes('correctOrderOfPairOfPackets')) {
                log(`correcto2`);  
                return CORRECTORDER;
            } else
            if (E[0].includes('WRONGOrderOfPairOfPackets')) {
                log(`wrongo2`);  
                return WRONGORDER;
            } 

        }  

        if(typeof(result) != 'number'){
            if (result.includes('correctOrderOfPairOfPackets')) {
                log(`correcto3`);
                return CORRECTORDER;
            } else
            if (result.includes('WRONGOrderOfPairOfPackets')) {
                log(`wrongo3`);
                return WRONGORDER;
            } 
        }  

        if (result === VALUETHATINDICATESTHATLEFTANDRIGHTARETHESAMEBYVALSOTHEYAREINWRONGORDER){
            result = WRONGORDER;
            // adventOfCode requirement: if D and E are the same (byVal), then  they are in the wrong order.
            return result;
        } else {
        log(`problem: in fn makeReturnValuesOfCompareFnCompatibleForUseBySortFn variable 'result' has
        value that is not being handled by the code`);
        /*
            Not a problem (albeit not handled by this piece of code): if D[0] and/or E[0] is undefined, 
            then that means that D and/ or E has 
            run out of items. 
        */

        // return 0; // 0 not an option: see explanation above. 
        }
    }
    let resultThatCanBeUsedByArrayMethodSort = makeReturnValuesOfCompareFnCompatibleForUseBySortFn(result);
    log(`resultThatCanBeUsedByArrayMethodSort: `);
    log(resultThatCanBeUsedByArrayMethodSort);



    return resultThatCanBeUsedByArrayMethodSort;

} // end of compareFnToSortPackets


let arrayWithSortedPackets = flatArrayWithEachPacketOnItsOwnLineWithJsonParsed.sort(compareFnToSortPackets);



log(`-----------------------------------------------------`);
log(`end of fn compareFnToSortPackets: `);
log( `( fn compareFnToSortPackets === 'recursive fn' + 'fn to create the correct inputs (i.e. 1, -1) for the array-sort-method )'`);
log(`-----------------------------------------------------`);
log(`Final result of sorting all packets: `);
log(arrayWithSortedPackets);

// log(flatArrayWithEachPacketOnItsOwnLineWithJsonParsed);















// let IndicesOfThePacketPairsThatAreAlreadyInTheRightOrder = indicesOfAllMappedItemsFromInputFile
//     .map((a, index) => a == -777 ? `WRONGOrderOfPairOfPacketsOnIndex_minus777_${index}` : a) 
    /*
        `--packet-workflow 1: D.length == 0 && E.length == 0` explains why I convert -777 into
        `WRONGOrderOfPairOfPacketsOnIndex_minus777_${index}`.

        ex of the data I receive here:
        [
            'correctOrderOfPairOfPacketsOnIndex_0',
            'correctOrderOfPairOfPacketsOnIndex_1',
            -777,                 --> 2do: convert into 'WRONGOrderOfPairOfPacketsOnIndex_2',
            'correctOrderOfPairOfPacketsOnIndex_3',
            'WRONGOrderOfPairOfPacketsOnIndex_4',
            'correctOrderOfPairOfPacketsOnIndex_5',
            'WRONGOrderOfPairOfPacketsOnIndex_6',
            'WRONGOrderOfPairOfPacketsOnIndex_7'
        ];
    */
    // .filter(result => result.includes('correctOrder'))
    // .map(result => result.split('_')[1])
    // .map(result => parseInt(result))

// log(`IndicesOfThePacketPairsThatAreAlreadyInTheRightOrder:`)
// log(IndicesOfThePacketPairsThatAreAlreadyInTheRightOrder)

// requirement: the indices of the pairs starts at ...1, not 0:
// let IndicesPlusOne = IndicesOfThePacketPairsThatAreAlreadyInTheRightOrder.map((index) => index + 1);
// log(`IndicesPlusOne: `)
// log(IndicesPlusOne);

// if(IndicesPlusOne.length != 0) {
//     let sumOfIndicesOfThePacketPairsThatAreAlreadyInTheRightOrder = 0;
//     sumOfIndicesOfThePacketPairsThatAreAlreadyInTheRightOrder = IndicesPlusOne.reduce((x, y) => x + y);
//     log(`SSSsumOfIndicesOfThePacketPairsThatAreAlreadyInTheRightOrder: ${sumOfIndicesOfThePacketPairsThatAreAlreadyInTheRightOrder}`);
//     // input1.txt --> 13 is correct (so code works with sample data from https://adventofcode.com/2022/day/13)
    
//     // input2.txt  --> 4352 is too low.
//     // input2.txt  --> 4598 is too low.
//     // input2.txt  --> 4987 is too low.
//     // input2.txt -->  5285 is wrong.
//     // input2.txt -->  5353 is wrong.
//     // input2.txt -->  5500 is wrong.
//     // input2.txt -->  5177 is wrong.
//     // input2.txt -->  5393 is CORRECT YES YES YES YES YES YES :).
// } else {
//     log(`testdata only contains pair(s) in wrong order.`)
// }

log(`<more info: `);
log(`inputFile.length:`)
log(inputFile.length); 
// log(arrayWithAllPairsOf2Packets.length);
// input1.txt: 8 pairs
// input2.txt: 150 pairs

// for input1.txt: 8 pairs plus spaces in between add up to: 8*2 + 7 is 23 lines (ok)
// input2.txt: 449 lines in the input file. 

log(`</end of more info >`)