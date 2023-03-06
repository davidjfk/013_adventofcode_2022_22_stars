/*
    AdventOfCode: day 13 part 2: try_01:
    correct result adventOfCode day 13 part 2: in progress.

    GOALS for this file try_01:
    1. ANALYSIS (of problem) & DESIGN (of solution), to get to the correct answer for the adventOfCode-assignment.

    STATUS: finished until DESIGN-step-4a (included).
    NEXT (in try_02.js):  DESIGN-step-4b. 


    SYNTAX: (same as in day9-part1)           
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


    ANALYSIS:
        main question: how to sort all packets (i.e. D and E) from input2.txt?
        answer: (js) higher-order array method sort()
        how2: use recursive fn 'checkIfPacketLeftAndRightAreInCorrectOrder' as callback (i.e fn argument)
            in the sort-method. 
            (looks like just a regular sort of an array with a compareFn. Nothing unusual here.)

            For this to work, fn 'checkIfPacketLeftAndRightAreInCorrectOrder' must give numeric outputs
            to the sort-fn:
                    day9-part1 output:
                    [
                        'correctOrderOfPairOfPacketsOnIndex_0',
                        'WRONGOrderOfPairOfPacketsOnIndex_1',
                        'correctOrderOfPairOfPacketsOnIndex_2',
                        'WRONGOrderOfPairOfPacketsOnIndex_3',
                        'correctOrderOfPairOfPacketsOnIndex_4',
                        'WRONGOrderOfPairOfPacketsOnIndex_5'
                    ];

                    day9-part2 output:
                    [
                        - 1,  // correct order
                        1,  // wrong order
                        - 1,  // etc.
                        1,
                        - 1, 
                        1
                    ];   
                    
                Reason: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/sort
                --> see compareFn and 'return values of compareFn':

                compareFn(a, b) return value	sort order
                > 0	                            sort a after b  
                < 0	                            sort a before b
                === 0	                        keep original order of a and b

                So, the compare function has the following form:
                function compareFn(a, b) {
                if (a is less than b by some ordering criterion) {
                    return -1;
                }
                if (a is greater than b by the ordering criterion) {
                    return 1;
                }
                // a must be equal to b
                    return 0;
                }



                Now I replace 'a' by 'D' and 'b' by 'E' --> for the meaning of D and E,  see chapter SYNTAX
                above):


                compareFn(D, E) return value	sort order
                > 0	                            sort D after E  --> when D and  E are in the WRONG order.
                < 0	                            sort D before E  --> when  D and I are in the correct order.
                === 0	                        keep original order of D and E

                if (D is less than E by some ordering criterion) {
                    return -1;
                }
                if (D is greater than E by the ordering criterion) {
                    return 1;
                }
                // D must be equal to E
                    return 0;  // pitfall: adventOfCode-requirements treat 'equal' same as 'greater than'. See below.
                }



                3 comparisons:
                comparison "< 0":
                        D: []
                        E: [3]
                        (=== 'pair of packets in correct order' by ordering criteria from adventOfCode)
                        (=== D less than E )
                        QED: return - 1.
                        So recursive fn checkIfPacketLeftAndRightAreInCorrectOrder must return: - 1,
                        instead of e.g. 'correctOrderOfPairOfPacketsOnIndex_0'.

                        The goal here is to sort them like this:
                        D must be sorted after E, because I want them to be sorted like this:
                        E: []
                        D: [3]  

                comparison "> 0":
                        D: [3]
                        E: []
                        (=== 'pair of packets in WRONG order' by ordering criteria from adventOfCode)
                        (=== D greater than E )
                        QED: return 1.
                        So recursive fn checkIfPacketLeftAndRightAreInCorrectOrder must return: 1,
                        instead of e.g. 'WRONGOrderOfPairOfPacketsOnIndex_7'.

                        The goal here is to sort them like this:
                        D must be sorted after E, because I want them to be sorted like this:
                        E: []
                        D: [3]
                                 
                comparison "== 0":
                        D: []
                        E: []
                        (=== 'pair of packets in WRONG order' by ordering criteria from adventOfCode)                       
                        (=== D greater than E )
                        So recursive fn checkIfPacketLeftAndRightAreInCorrectOrder must return: 1,
                        instead of e.g. 'WRONGOrderOfPairOfPacketsOnIndex_2'.

                        The goal here is to sort them like this:
                        E: []
                        D: []
                        

                    
            In day9-part1 I compare all pairs of packets myself. But in day9-part2 I
            connect the inputfile (array) to the sort-fn (array-method) with
            with recursive fn checkIfPacketLeftAndRightAreInCorrectOrder as its argument.  
            Looks roughly like this:
                arrayWithAllPairsOf2Packets.sort( checkIfPacketLeftAndRightAreInCorrectOrder )
                    (ctrl-f arrayWithAllPairsOf2Packets )
                    (ctrl-f checkIfPacketLeftAndRightAreInCorrectOrder)


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

                STATUS: from here and further: do in next file try_02.

            b) unforeseen: flatten variable arrayWithAllPairsOf2Packets from: 
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

            b) unforeseen: JSON.parse() before entering the compare fn   

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

let inputFile = readFileSync("input3.txt", "utf-8").split('\r\n');
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
log(`arrayWithAllPairsOf2Packets:`);
log(arrayWithAllPairsOf2Packets);


// STEP2: (see (in adVentOfCode2022Day13_part1_try01.js ):)


// STEP 3: calculate which pairs of packets are in the right order.
let HASCOMPARISONBETWEENLEFTANDRIGHTFINISHED = false;
const VALUETHATINDICATESTHATLEFTANDRIGHTARETHESAMEBYVALSOTHEYAREINWRONGORDER = -777 // any negative nr will do. 
const CORRECTORDER = - 1;
const WRONGORDER = 1;



let indicesOfAllMappedItemsFromInputFile = arrayWithAllPairsOf2Packets
    .map((arrayWith1PairOfPackets, index) => {
        log(`in while-loop: start of iteration with index: ${index}:-------------------------------------------------------`);
        
        const compareFnToSortPackets = (arrayWith1PairOfPackets) => {

            HASCOMPARISONBETWEENLEFTANDRIGHTFINISHED = false;
            let packetLeft = arrayWith1PairOfPackets[0];
            let packetRight = arrayWith1PairOfPackets[1];
            // D === packetLeftAsCommaSeparatedArray
            let D = JSON.parse(packetLeft); 
            // log(D);
            // E === packetRightAsCommaSeparatedArray
            let E = JSON.parse(packetRight); 
            // log(E);
    
            let resultOfCheckIfPacketLeftAndRightAreInCorrectOrder; 

            let checkIfPacketLeftAndRightAreInCorrectOrder = (D, E) => {
                while (HASCOMPARISONBETWEENLEFTANDRIGHTFINISHED == false) { 
                    /*
                        I use 'break' to exit the while-loop.
                        I never set var HASCOMPARISONBETWEENLEFTANDRIGHTFINISHED to true.
                        So I could just as well write 'while(true)' here, but for 
                        readability I do not do that.                
                    */

                    log(`start of while-loop:`)
                    log(`D:`)
                    log(D)
                    // log(typeof(D))
                    log(`E:`)
                    log(E)
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

                    // condition 1of2 to propagate a final  result: (scope: only recursive fn-call):             
                    if(!Array?.isArray(D[0]) && typeof(D[0]) != 'number' && !Array?.isArray(E[0]) && typeof(E[0]) != 'number' ){
                    // if (typeof(D[0] === 'string') || typeof(D[0] === 'string')){
                        log(`propagate-workflow 1: higher stack result: packets in right order. Propagate this info.`)
                        if (D[0]?.includes('correctOrder') && E[0]?.includes('correctOrder')){
                            resultOfCheckIfPacketLeftAndRightAreInCorrectOrder = `correctOrderOfPairOfPacketsOnIndex_${index}`;
                            break;
                        }
                    }
                    
                    // condition 2of2 to propagate a final  result: (scope: only recursive fn-call):      
                    if(!Array?.isArray(D[0]) && typeof(D[0]) != 'number' && !Array?.isArray(E[0]) && typeof(E[0]) != 'number' ){
                        // if (typeof(D[0] === 'string') || typeof(D[0] === 'string')){
                            log(`propagate-workflow 1: higher stack result: packets in right order. Propagate this info.`)
                            if (D[0]?.includes('WRONGOrder') && E[0]?.includes('WRONGOrder')){
                                resultOfCheckIfPacketLeftAndRightAreInCorrectOrder = `WRONGOrderOfPairOfPacketsOnIndex_${index}`;
                                break;
                            }
                        }
                    
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
                        Var resultOfCheckIfPacketLeftAndRightAreInCorrectOrder in this if-else-statement has 2 responsibilities:
                        1. propagate result (result: D and E are equal) to a lower stack-level execution context.
                        2. return result (i.e. map to var indicesOfAllMappedItemsFromInputFile ) that packets are equal and therefor in wrong order.
                    */ 
                    if (D?.length == 0 && E?.length == 0){
                        log(`--packet-workflow 1: D.length == 0 && E.length == 0`);
                        // resultOfCheckIfPacketLeftAndRightAreInCorrectOrder = -777; // this is a magic nr...so instead:
                        resultOfCheckIfPacketLeftAndRightAreInCorrectOrder = VALUETHATINDICATESTHATLEFTANDRIGHTARETHESAMEBYVALSOTHEYAREINWRONGORDER;
                        break;
                        
                        /*
                            so why use a nr here (-777) inside a const VALUETHATINDICATESTHATLEFTANDRIGHTARETHESAMEBYVALSOTHEYAREINWRONGORDER ?
                            packet-workflow 1 has 2 responsibilities:
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
                                a) resultOfCheckIfPacketLeftAndRightAreInCorrectOrder = VALUETHATINDICATESTHATLEFTANDRIGHTARETHESAMEBYVALSOTHEYAREINWRONGORDER;
                                b) break;
                                c) below the while loop: return this result as the answer to the question: is this pairOfPackets in right order?
                                    The answer: no (because packetLeft and packetRight are identical byVal).
                                d) this value -777 is returned to var indicesOfAllMappedItemsFromInputFile and it means: this pair of packets
                                    are in the wrong order. 
                                e) at the end of the code (ctrl-f "VALUETHATINDICATESTHATLEFTANDRIGHTARETHESAMEBYVALSOTHEYAREINWRONGORDER") I 
                                    convert each of these values to e.g. WRONGOrderOfPairOfPacketsOnIndex_8 --> 8 means that it applies to 
                                    index position nr 8. 

                            2do: (but I leave it for now): give var resultOfCheckIfPacketLeftAndRightAreInCorrectOrder 1 responsibility, and 
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
                        1. resultOfCheckIfPacketLeftAndRightAreInCorrectOrder = VALUETHATINDICATESTHATLEFTANDRIGHTARETHESAMEBYVALSOTHEYAREINWRONGORDER;
                        2. 'return resultOfCheckIfPacketLeftAndRightAreInCorrectOrder'

                        instead of:
                        1. resultOfCheckIfPacketLeftAndRightAreInCorrectOrder = VALUETHATINDICATESTHATLEFTANDRIGHTARETHESAMEBYVALSOTHEYAREINWRONGORDER;
                        2. break;                      
                        3. (below while-statement): return resultOfCheckIfPacketLeftAndRightAreInCorrectOrder
                    */
                    } 
                    
                    /*
                        goal: Commuinicate result, that D (not just D[0]) is 0 on stack-level-0, so the pair of packets is
                        in the right order:
                    */
                    if (D?.length == 0){
                        log(`--packet-workflow 2: D.length == 0 --> return index: ${index}`)
                        resultOfCheckIfPacketLeftAndRightAreInCorrectOrder = `correctOrderOfPairOfPacketsOnIndex_${index}`;
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
                        resultOfCheckIfPacketLeftAndRightAreInCorrectOrder = `WRONGOrderOfPairOfPacketsOnIndex_${index}`;
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
                            log(`nr of D[0] < E[0] --> return index: ${index}`)
                            resultOfCheckIfPacketLeftAndRightAreInCorrectOrder = `correctOrderOfPairOfPacketsOnIndex_${index}`;
                            break;
                            // return index
                        } else if ((D[0] - E[0] > 0)){
                            resultOfCheckIfPacketLeftAndRightAreInCorrectOrder = `WRONGOrderOfPairOfPacketsOnIndex_${index}`;
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
                        resultOfCheckIfPacketLeftAndRightAreInCorrectOrder = `correctOrderOfPairOfPacketsOnIndex_${index}`;
                        break;
                    } else

                    if(Array?.isArray(D[0]) && D[0].length == 0 && Array?.isArray(E[0]) && Array?.isArray(E[0][0]) ){
                        log(`--sub-workflow 8: compare empty array with array-with-nested-array:`)
                        resultOfCheckIfPacketLeftAndRightAreInCorrectOrder = `correctOrderOfPairOfPacketsOnIndex_${index}`;
                        break;
                    } else            

                    if(Array?.isArray(D[0]) && typeof(D[0][0]) == 'number' && D[0][0].length != 0 && Array?.isArray(E[0]) && E[0].length == 0   ){
                        log(`--sub-workflow 10: compare array-with-nr with empty-array:`)
                        resultOfCheckIfPacketLeftAndRightAreInCorrectOrder = `WRONGOrderOfPairOfPacketsOnIndex_${index}`;
                        break;                    
                    } else

                    if(Array?.isArray(D[0]) && typeof(D[0][0]) == 'number' && D[0][0].length != 0 && Array?.isArray(E[0]) && typeof(E[0][0]) == 'number' && E[0][0].length != 0   ){
                        log(`--sub-workflow 11: compare array-with-nr with array-with-nr:`)
                        // remove brackets, e.g. [19] --> 19;
                        // D[0] = D[0][0]; // wrong --> solution: compare the numbers inside of the array instead.
                        // E[0] = E[0][0]; // idem.

                        // solution: 
                        if (D[0][0] - E[0][0] < 0) {
                            log(`nr of D[0][0] < E[0][0] --> return index: ${index}`)
                            resultOfCheckIfPacketLeftAndRightAreInCorrectOrder = `correctOrderOfPairOfPacketsOnIndex_${index}`;
                            break;                        

                        } else if ((D[0][0] - E[0][0] > 0)){
                            resultOfCheckIfPacketLeftAndRightAreInCorrectOrder = `WRONGOrderOfPairOfPacketsOnIndex_${index}`;
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
                        D[0] = checkIfPacketLeftAndRightAreInCorrectOrder(D[0], E[0])
                        E[0] = D[0].slice();

                        /*
                        // remove brackets, e.g. [19] --> 19;   
                        // D[0] = D[0][0]; // --> wrong (chapter ANALYSIS at the start of this file explains why)

                        // following code: --> wrong (chapter ANALYSIS at the start of this file explains why)
                        // log(`before: `)
                        // log(E);
                        // log(E[0])
                        let arrayFirstElementWith1PairOfOuterBracketsLess = E[0][0]; //no  need to use array.flat()
                        // log(`arrayFirstElement:`)
                        // log(arrayFirstElementWith1PairOfOuterBracketsLess);
                        // log(`eFirstElementRemovedFromE[0]:  ( E[0] == Q ) `);
                        E[0].shift(); // in place/ mutable deletion of 1st element.
                        // log(`all elements of E[0] except first element:`)
                        // log(E[0]);
                        E[0] = [...arrayFirstElementWith1PairOfOuterBracketsLess, ...E[0]]; 
                        // log(`after:`)
                        // log(E);
                        // log(E[0]);
                        */
                    } else

                    if(Array?.isArray(D[0]) && Array?.isArray(D[0][0]) && Array?.isArray(E[0]) && E[0].length == 0   ){
                        log(`--sub-workflow 14: compare AWNA (array-nested-array) with empty-array:`)
                        resultOfCheckIfPacketLeftAndRightAreInCorrectOrder = `WRONGOrderOfPairOfPacketsOnIndex_${index}`;
                        break;                      
                    } else

                    if(Array?.isArray(D[0]) && Array?.isArray(D[0][0]) && Array?.isArray(E[0]) && typeof(E[0][0]) == 'number' && E[0][0].length != 0   ){
                        log(`--sub-workflow 15: compare AWNA (array-nested-array) with array-with-nr:`)                    
                        D[0] = checkIfPacketLeftAndRightAreInCorrectOrder(D[0], E[0])
                        E[0] = D[0].slice();                    
                        
                        // 1of2: remove 1 pair of brackets from AWNA:   --> wrong (chapter ANALYSIS at the start of this file explains why)
                        // let arrayFirstElementWith1PairOfOuterBracketsLess = D[0][0]; 
                        // D[0].shift(); 
                        // D[0] = [...arrayFirstElementWith1PairOfOuterBracketsLess, ...D[0]]; 

                        // 2of2: remove 1 pair of brackets from empty-array:    (e.g. [19] --> 19)
                        // E[0] = E[0][0]; // --> wrong: now you do not go to sub-workflow-11 next. Intstead, you go
                        // into endless loop.
                    } else

                    if(Array?.isArray(D[0]) && Array?.isArray(D[0][0]) && Array?.isArray(E[0]) && Array?.isArray(E[0][0])   ){
                        // D and E are also arrays.
                        log(`--sub-workflow 16: compare AWNA (array-nested-array) with AWNA (array-nested-array):`)
                        // make recursive call:
                        D[0] = checkIfPacketLeftAndRightAreInCorrectOrder(D[0], E[0]);
                        /*
                            Goal: I need a way to peel off 1 set of square brackets from the AWNA 
                            (remove 1 pair during each iteration of the while-loop).

                            Why is a fn call with E[0][0]  wrong?
                            E = [[1,2,3,4,5]]
                            log(E[0])
                            log(E[0][0]) 
                            actual result: 1
                            expected result 1,2,3,4,5
                            QED: with D[0][0] you (accidentally) remove all but the first
                            element from the array!

                        */
                        E[0] = D[0].slice();                       
                        // remove 1 pair of brackets from both AWNA, e.g. [[[3]]] --> [[3]] --> wrong (chapter ANALYSIS at the start of this file explains why)
                        // let arrayFirstElementWith1PairOfOuterBracketsLessFromD = D[0][0]; 
                        // D[0].shift(); 
                        // D[0] = [...arrayFirstElementWith1PairOfOuterBracketsLessFromD, ...D[0]]; 

                        // let arrayFirstElementWith1PairOfOuterBracketsLessFromE = E[0][0]; 
                        // E[0].shift(); 
                        // E[0] = [...arrayFirstElementWith1PairOfOuterBracketsLessFromE, ...E[0]];                 
                    } else {
                        log(`problem: investigate: index: ${index}`);
                    } 

                } // end of while loop

                return resultOfCheckIfPacketLeftAndRightAreInCorrectOrder;

            } // end of recursive fn checkIfPacketLeftAndRightAreInCorrectOrder

            log(`-----------------------------------`); 
            let result = checkIfPacketLeftAndRightAreInCorrectOrder(D , E); // must be array with 2 values: 1 for D and 1 for E. (0,0 or 0,1 or 1,1)
            log(`result of recursive fn checkIfPacketLeftAndRightAreInCorrectOrder: `)
            log(result)

            const makeReturnValuesOfCompareFnCompatibleForUseBySortFn = (result) => {
                /* 
                    conversion for Day13-part2. Chapter ANALYSIS at beginning of this file (ctrl-f ANALYSIS) 
                    explains why this is necessary.

                    checkIfPacketLeftAndRightAreInCorrectOrder is the compareFn for the higher-order 
                    array method 'sort'. But the method signature of 'sort' can only handle
                    -1, 1 or 0. That is why I convert them.

                    for readability of ternary, I need a short helper variable.
                */
                if(!Array?.isArray(result) && typeof(result) != 'number'){
                    result = result.includes('correctOrderOfPairOfPacketsOnIndex') ? CORRECTORDER : result;
                }  
                if(!Array?.isArray(result) && typeof(result) != 'number'){
                    result = result.includes('WRONGOrderOfPairOfPacketsOnIndex') ? WRONGORDER : result;
                }
                if (result === VALUETHATINDICATESTHATLEFTANDRIGHTARETHESAMEBYVALSOTHEYAREINWRONGORDER){
                    result = WRONGORDER;
                    // adventOfCode requirement: if D and E are the same (byVal), then  they are in the wrong order.
                }

                let resultThatCanBeUsedByArrayMethodSort = result;
                return resultThatCanBeUsedByArrayMethodSort;

            }

            let resultThatCanBeUsedByArrayMethodSort = makeReturnValuesOfCompareFnCompatibleForUseBySortFn(result);
            return resultThatCanBeUsedByArrayMethodSort;

        } // end of compareFnToSortPackets

        let returnValueOfCompareFn = compareFnToSortPackets(arrayWith1PairOfPackets);
        return returnValueOfCompareFn;

    }) // end of map fn
    
log(`All indices (IF index is a number AND number >= 0, THEN in right order): `);
log(indicesOfAllMappedItemsFromInputFile);








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
log(arrayWithAllPairsOf2Packets.length);
// input1.txt: 8 pairs
// input2.txt: 150 pairs

log(inputFile.length); 
// for input1.txt: 8 pairs plus spaces in between add up to: 8*2 + 7 is 23 lines (ok)
// input2.txt: 449 lines in the input file. 

log(`</end of more info >`)