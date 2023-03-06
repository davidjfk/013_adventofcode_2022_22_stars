/*
    AdventOfCode: day 13 part 1: try_05:
    correct result adventOfCode day 13 part 1: ... in progress
    First read last status at the beginning of adVentOfCode2022Day13_part1_try02.js, idem try02.js, try03.js., try04.js
    
    SITUATION: answer not correct: code changes (inside while-loop) in this file not leading to correct result. I save it for reference.
    GOALS for this file try_05:
    1. write code
    1. do more analysis 
    2. create more design based on this additional analysis.

    status: done
    next: implement this additional dsign in the code in try_06 (so I keep current code for reference).


   MORE ANALYSIS (in try_05...:
   The rules from the assignment (both values are integers , both values are lists , exactly 1 value is an integer) must 
   be applies on 2 variables (!!!!!!!!!!!!!):
   1. packet-level: D and E. The only rule that applies to this level is: 'both values are lists'. --> when D runs out of 
      items first, then index is returned. If E runs out first or D and E at the same time, then value 'packetsInWrongOrder' is returned. 
      (status: has been implemented)
   2. next value P from D that will be compared with next value Q from  E.
      'MORE DESIGN' below explains how that must be implemented. It will be implemented in try_06.       


   Testdata:
    P or Q can be 0: 0 is falsy by nature:
    [[[0],[3,[6,6,3,7,8],5,[]]],[[[6],2,7],7]]
    [[[1,9,[1,4,9]],7,[[6,0],8,3,1,[4,6,4,5]],1],[],[1],[3],[]]

   --If both values are lists, compare the first value of each list, then the second value, and so on.--:
   2 use cases:
   a) [[], [], []] with [[], [], [], []]  --> "horizontal comparison"
   b) [[[]]] with [[[]]]  --> vertical commparison. This is what I call array with nested array (AWNA)
        -- Nested arrays in P or Q --:
        Every comparison of 2 packets must lead to 'right order' or 'wrong order'.
        A nested array for P and Q, e.g. [[4]] and [[5]] means: the next values are 2 outer values and they are the same, so
        they can be removed. (status: already implemented)

   -- If exactly one value is an integer, convert the integer to a list which contains that integer as its only value, 
   then retry the comparison. --:
   2 use cases:
   a) comparison between number and empty array: compare e.g. 5 with [], equals [5] with [] -->conclusion 
      right side runs out of items first, so packets are not in the right order.
      similar: compare e.g. [] with 5, equals [] with [5] ...in the right order, so return index (in while loop below)

    b) comparison between number and array with nested array (AWNA):
        reason: e.g.P == 2 and becomes [2] and e.g. Q == [[3]] and stays as is.
        P is inside D. Q is inside E. Comparison looks like this:
        [[2]]  compared to [[[3]]] --> comparison of AWNA with AWNA, so
            1 set of outer square brackets will be removed from both.                
        result: P == (again) 2 and Q becomes [3]
        QED:  leave P as is, but remove 1 set of outer brackets from  Q. So "mechanism" of comparing a nr with an AWNA
        removes outer brackets of the AWNA, until a comparison can be made that leads to:
        - return of index (so pairs are in right order)
        - return of a stringMessage (e.g. 'pairsNotInRightOrder') --> can be any text.
        - continue with comparing next value of P and Q (this means that the current values of P and Q
            that are being compared, are equal)

    D and E can contain:
    a) 3 --> number    --> problem: 
                syntax 'isNaN' is unreliable:
                let D = [[130]]
                log(isNaN(D[0])) // false --> WRONG: should be true
                // QED: syntax 'isNaN does not discriminate between number and object, so cannot be used. 
                log(!isNaN(D[0])) // true

                solution: use syntax 'typeof' instead: 
                log(typeof(D[0]) != 'number') // true (ok)
                log(typeof(D[0]) == 'number') // false (ok)

    b) [] --> empty array --> problem: currently code just checks for lengt of zero, but not if variable indeed is an array.
                              It could also be a number.
    c) [[3]] --> nested array -->  --> problem: currently code does NOT check if variable P or Q is AWNA (array with 
        nested array), e.g. [[]].  
    d) [3] --> array with number --> problem: currently code does NOT check if variable P or Q is array with nr (e.g. [6]). (BIG MISTAKE)

        == Pair 6 ==
        - Compare [] vs [3]  --> "[3]" means: Q is a number with value 3. --> if Q has value [3], then comparison
                                 looks like this: Compare [] vs [[3]]
        - Left side ran out of items, so inputs are in the right order

       == Pair 3 ==
        - Compare [9] vs [[8,7,6]]
        - Compare 9 vs [8,7,6]
            - Mixed types; convert left to [9] and retry comparison
            - Compare [9] vs [8,7,6]
            - Compare 9 vs 8
                - Right side is smaller, so inputs are not in the right order

            Another problem (with regard to array with number): currently I leave [9] as is and turn [[8,7,6]] into [8,7,6]. Then I make the comparison...
            but that is NOT what is being asked. 

            in the logging:
                [ '[9]', '[[8,7,6]]', '' ]
                arrayWithAllPairsOf2Packets:
                [ [ '[9]', '[[8,7,6]]' ] ]
                in while-loop: start of iteration with index: 0:-------------------------------------------------------
                start of while-loop:
                D:
                [ 9 ]
                E:
                [ [ 8, 7, 6 ] ]
                --sub-workflow 7:
                P is nr (e.g. [3], and Q is array with nested array (e.g. [[[7]]])     
                start of while-loop:
                D:
                [ 9 ]   ------------------>>>> wrong: should be 9 instead. 
                E:
                [ 8, 7, 6 ]
                --sub-workflow 1:
                P and Q are  nrs, e.g. [6]
                D[0]: 9
                E[0]: 8
                []
                testdata only contains pair(s) in wrong order. (From while loop pair in wrong order returns 'pairInWrongOrder'.
                You cannot add values 'pairInWrongOrder' together.)

    MORE DESIGN (in try_05...:
    
    As listed above, P and Q can be of 4 types:
    1. number
    2. empty array
    3. array with number
    4. array with nested array (AWNA)


    So 4*4 is 16 permutations of P and Q. This means that if you compare the next value of packet left with the next value of packet 
    right, then the combination of P and Q can be each of the following 16 permutations:

    1. number                               number
    2. number                               empty array
    3. number                               array with number
    4. number                               array with nested array (AWNA)                 
    5. empty array                          number
    6. empty array                          empty array
    7. empty array                          array with number
    8. empty array                          array with nested array (AWNA)
    9. array with number                    number
    10. array with number                   empty array
    11. array with number                   array with number
    12. array with number                   array with nested array (AWNA)                 
    13.  array with nested array (AWNA)     number
    14.  array with nested array (AWNA)     empty array
    15.  array with nested array (AWNA)     array with number
    16.  array with nested array (AWNA)     array with nested array (AWNA)  
    
    


    For each of these 4 types  I have now created the proper code to identify them inside the while-loop (there is only 1 while-loop, see end of code):
        log(`------------------------`)
        log(`goal: check if P is a number:`)
        // D = [4]; // --> P == 4 
        //goal: proof that P is nr: 
        if(!Array?.isArray(D[0]) && typeof(D[0]) == 'number' ){
            // overkill: typeof(D[0]) == 'object' &&
            log(`result: P is a nr: ${D[0]}`)
        }


        log(`---------------------`)
        log(`goal: check if P is empty array:`)
        // D = [[]]; // --> P == []
        if(Array?.isArray(D[0]) && D[0].length == 0 ){
            log(`result: P is empty array: `)
            log(D[0]);
        }


        log(`---------------------`)
        log(`goal: check if P is array with nr:`)
        // D = [[4]]; // P == [4] 
        if(Array?.isArray(D[0]) && typeof(D[0][0]) == 'number' && D[0][0].length != 0 ){
            log(`result: P is array with nr: `)
            log(D[0]);
        }

        log(`---------------------`)
        log(`goal: check if P is array with nested array (AWNA):`)
        // D = [[[]]]; // P == [[]] 
        // For the parsing of the data in the pursuit of determining if pair of packets is in right order, 
        // it does not matter what is (or is not) inside the nested brackets:
        // [[[3]]] or: [[[[[69]]]]] or: [[[]]] etc.  

        if(Array?.isArray(D[0]) && Array?.isArray(D[0][0])){
            // optional chaining operator '?' is indispensable here. 
            log(`result: P is ANWA (array with nested array): `)
            // log(`${D[0]}`); // pitfall: this console.logs value '4'.
            log(D[0]);
        }

    

    next: in try_06 I will implement this code inside the if-else logic of the while-loop. 

*/
const log = console.log;

const {readFileSync} = require("fs");
const { toNamespacedPath } = require("path");

// toggle between inputTest.txt and inputReal.txt. Use inputReal.txt to calculate the real answer for day 9 part 2.
let inputFile = readFileSync("input1.txt", "utf-8").split('\r\n');
log(inputFile);

// basic testdata to test the 9 sub-workflows of step 11 below: (status: works)
// expected result: 27
// inputFile = [
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

//     '[[[[[[[[[[18]]]]]]]]]]',
//     '[19]',
//     '', 
// ];



// STEP 1: for each 3 elements in inputFile, select only the first 2:
const convertToArayWithForEach3ArrayElementsTheFirst2Into1NestedArray = (array, chunkSize, nestedChunkSize) => {
    /*
        I have tweaked a fn from: 
       https://stackoverflow.com/questions/8495687/split-array-into-chunks
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








// STEP 3: create the outset  where P can be compared with Q (the actual compare is a next step) (result: ok)
let HASCOMPARISONBETWEENLEFTANDRIGHTFINISHED = false;
let IndicesOfThePacketPairsThatAreAlreadyInTheRightOrderMixedWithOtherOutput = arrayWithAllPairsOf2Packets
    .map((arrayWith1PairOfPackets, index) => {
        log(`in while-loop: start of iteration with index: ${index}:-------------------------------------------------------`);
        
        HASCOMPARISONBETWEENLEFTANDRIGHTFINISHED = false;
        let packetLeft = arrayWith1PairOfPackets[0];
        let packetRight = arrayWith1PairOfPackets[1];
        // D === packetLeftAsCommaSeparatedArray
        let D = JSON.parse(packetLeft); 
        // log(D);
        // R === packetRightAsCommaSeparatedArray
        let E = JSON.parse(packetRight); 
        // log(E);
        while (HASCOMPARISONBETWEENLEFTANDRIGHTFINISHED == false) { 
            /* 
               Because of the algebraic nature of the problem, I have used letters in the analysis and desgin.
               I use these letters in the  code too, to keep code and analysis an design tightly tied together.
               Normally speaking this is a very bad practice, but here it feels that it makes things easier.
            */
           log(`start of while-loop:`)
            log(`D:`)
            log(D)
            // log(typeof(D))
            log(`E:`)
            log(E)
            // log(typeof(E))

 
            /*
                choice: separate if-else statements (10 in total), or blend them together like I have done below.
                I think it does not really matter. 
            */

            if (D?.length == 0 && E?.length == 0){
                log(`D.length == 0 && E.length == 0`);
                return 'packetLeftAndRightIdentical'; // meaning: D and E are identical, so (accoring to specs) they 
                //are not in the right order. Specs say: "continue with comparing the next value".
            } else if (D?.length == 0){
                log(`D.length == 0 --> return index: ${index}`)
                return index // meaning: packetLeft has run out of values, but packetRight not.
                // --> see while loop below for meaning of 'index'.

            } else if (E?.length == 0){
                log(`E.length == 0 --> return packetRightHasRunOutOfItemsFirst`)
                return 'packetRightHasRunOutOfItemsFirst'  // // meaning: packetRight has run out of values, but packetLeft not.
            } else
            
            // 1) if (P with Q is "number with number")    --> run sub-workflow-nr-with-nr
            if (!isNaN(D[0])  && !isNaN(E[0]) ) {
                log(`--sub-workflow 1:`)
                log(`P and Q are  nrs, e.g. [6]`)
                log(`D[0]: ${D[0]}`);
                log(`E[0]: ${E[0]}`);
                //pitfall: definition: e.g. [[6]] is NOT a number, but a AWNA (array with nested array)!
                if (D[0] - E[0] < 0) {
                    log(`nr of D[0] < E[0] --> return index: ${index}`)
                    return index
                } else if ((D[0] - E[0] > 0)){
                    return 'pIsBiggerThanQ';
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
         
            // log(`middle of while-loop:`)
            // log(`logging D:`)
            // log(D)
            // log(typeof(D))
            // log('logging E:')
            // log(E)
            // log(typeof(E))

            // 2) if (P with Q is "EA with EA")           
            if (D[0]?.length == 0 && E[0]?.length == 0) {
                log(`--sub-workflow 2:`)
                log(`P and Q are  empty arrays (e.g. [])`)
                D.shift();
                E.shift();
            } else

            // 3) if (P with Q is "EA with AWNA")          
            if (D[0]?.length == 0 && Array?.isArray(E[0])) {
                log(`--sub-workflow 3:`)
                log(`P is empty array (e.g. []) and  Q is nested array (e.g. [[3]])`)
                
                // wrong: 2do: left list runs out of items first, so return index!!
                return index;

                // mistake: I am deleting the values to compare in the following:
                // D.shift();
                // let arrayFirstElement = E.shift(); //no  need to use array.flat()
                // let arrayRest = E;
                // E = [...arrayFirstElement, ...arrayRest];
                // problem of doing so: the rule 'both values are lists' (see requirements) not 
                // only applies to D and E, but also to each P (===D[0]) and Q (=== E[0])!
              

            } else

            // 4) if (P with Q is "AWNA with EA")         
            if ( Array?.isArray(D[0]) && E[0]?.length == 0) {
                log(`--sub-workflow 4:`)
                log(`P is nested array (e.g. [[8]]) and  Q is empty array (e.g. [])`)

                // wrong: 2do: right list runs out of items first, so return 'packetOrderWrong'!!
                log(`return packetOrderWrong`)
                return 'packetOrderWrong';


                // mistake: I am deleting the values to compare in the following:
                // let arrayFirstElement = D.shift(); //no  need to use array.flat()
                // let arrayRest = D;
                // D = [...arrayFirstElement, ...arrayRest];
                // E.shift();
                // problem of doing so: the rule 'both values are lists' (see requirements) not 
                // only applies to D and E, but also to each P (===D[0]) and Q (=== E[0])!


            } else

            // 5) if (P with Q is "AWNA with AWNA")       
            if ( Array?.isArray(D[0]) && Array?.isArray(E[0])) { 
                // from future: wrong this just checks if P and  Q are arrays.
                //      you must not remove square bracekts from arrays!!
                log(`--sub-workflow 5:`)
                log(`P and Q are each a nested array (e.g. [[3]])`)
                // D = D.shift();
                // E = E.shift();
                let arrayFirstElementOfD = D.shift(); //no  need to use array.flat()
                let arrayRestOfD = D;
                D = [...arrayFirstElementOfD, ...arrayRestOfD];

                let arrayFirstElementOfE = E.shift(); //no  need to use array.flat()
                let arrayRestOfE = E;
                E = [...arrayFirstElementOfE, ...arrayRestOfE];
            } else

            // 6) if (P with Q is "number with EA")        
            if (!isNaN(D[0]) && E[0]?.length == 0) {
                log(`--sub-workflow 6:`)
                log(`P is nr (e.g. [3], and Q is empty array (e.g. [])`)

                // 2do: right list runs out of items first, so return 'packetOrderWrong'!!
                // comparing e.g. 2 with [] equals comparing [2] with [] --> right runs out 
                // of items first. See requirements: 'exactly one value is an integer'.
                return 'packetOrderWrong';

                // D.shift();
                // E.shift();
                // pitfall: there is NO requirement that tells me to remove both the nr (e.g. 3) and 
                // the empty array (e.g.  []), but that is exactly what the 2 lines of code above
                // are doing!!!
            } else


            // 7) if (P with Q is "number with AWNA")      
            if (!isNaN(D[0]) && Array?.isArray(E[0])) {  //from future: do not use isNaN syntax.
                log(`--sub-workflow 7:`)
                log(`P is nr (e.g. [3], and Q is array with nested array (e.g. [[[7]]])`)
                //D.shift();

                let arrayFirstElementOfE = E.shift(); //no  need to use array.flat()
                // in this situation E.shift removes 1 set of outer brackets from Q.
                let arrayRestOfE = E;
                E = [...arrayFirstElementOfE, ...arrayRestOfE];
                
                // important: remove outer brackets of E, but leave D as is!
                // reason: e.g.P == 2 and becomes [2] and e.g. Q == [[3]] and stays as is.
                // P is inside D. Q is inside E. Comparison looks like this:
                // [[2]]  compared to [[[3]]] --> comparison of AWNA with AWNA, so
                //   1 set of outer square brackets will be removed from both.                
                // result: P == (again) 2 and Q becomes [3]
                // QED:  leave P as is, but remove 1 set of outer brackets from  Q. 
            } else


            //8) if (P with Q is "EA with number")       
            if (D[0]?.length == 0 && !isNaN(E[0])) {
                log(`--sub-workflow 8:`)
                log(`P is empty array (e.g. []) and  Q is array with nr (e.g. [8])`)

                // 2do: left list runs out of items first, so return index!!
                // comparing e.g. [] with 2 equals comparing [] with [2] --> left runs out 
                // of items first. See requirements: 'exactly one value is an integer'.
                return index;

                // D.shift();
                // E.shift();
                // pitfall: there is NO requirement that tells me to remove both the empty array (e.g. [])  
                // and the nr (e.g. 3), but that is exactly what the 2 lines of code above
                // are doing!!! 
            } else


            //9) if (P with Q is "AWNA with number")     
            if ( Array?.isArray(D[0]) && !isNaN(E[0])) {
                log(`--sub-workflow 9:`)
                log(`P is nested array (e.g. [[3]]) and Q is number (e.g. [9])`)
                    let arrayFirstElement = D.shift(); //no  need to use array.flat()
                    // in this situation D.shift removes 1 set of outer brackets from P.
                    let arrayRest = D;
                    D = [...arrayFirstElement, ...arrayRest]; 
                                     // D = D.shift();
                                     //E.shift();
                // important: remove outer brackets of D, but leave E as is!
                // reason: e.g.Q == 2 and becomes [2] and e.g. P == [[3]] and stays as is.
                // P is inside D. Q is inside E. Comparison looks like this:
                //  [[[3]]] compared to [[2]] --> comparison of AWNA with AWNA, so
                //   1 set of outer square brackets will be removed from both.
                // result: Q == (again) 2 and P becomes [3]
                // QED:  leave Q as is, but remove 1 set of outer brackets from  P. 
            }

        }
    }
)


let IndicesOfThePacketPairsThatAreAlreadyInTheRightOrder = IndicesOfThePacketPairsThatAreAlreadyInTheRightOrderMixedWithOtherOutput.filter(Number.isInteger);

// log(`IndicesOfThePacketPairsThatAreAlreadyInTheRightOrder:`)
// log(IndicesOfThePacketPairsThatAreAlreadyInTheRightOrder)

// requirement: the indices of the pairs starts at ...1, not 0:
let IndicesPlusOne = IndicesOfThePacketPairsThatAreAlreadyInTheRightOrder.map((index) => index + 1)
log(IndicesPlusOne);

if(IndicesPlusOne.length != 0) {
    let sumOfIndicesOfThePacketPairsThatAreAlreadyInTheRightOrder = 0;
    sumOfIndicesOfThePacketPairsThatAreAlreadyInTheRightOrder = IndicesPlusOne.reduce((x, y) => x + y);
    log(`SSSsumOfIndicesOfThePacketPairsThatAreAlreadyInTheRightOrder: ${sumOfIndicesOfThePacketPairsThatAreAlreadyInTheRightOrder}`);
    // input1.txt --> 13 is correct (so code works with sample data from https://adventofcode.com/2022/day/13)
    
    // input2.txt  --> 4352 is too low.
    // input2.txt  --> 4598 is too low.
    // input2.txt  --> 4987 is too low.
    // input2.txt -->  5285 is wrong.
    // input2.txt --> 5324 is wrong.
} else {
    log(`testdata only contains pair(s) in wrong order. (From while loop pair in wrong order returns 'pairInWrongOrder'. 
     You cannot add values 'pairInWrongOrder' together.)`)
}





log(`<more info: `);

log(arrayWithAllPairsOf2Packets.length);
// input1.txt: 8 pairs
// input2.txt: 150 pairs

log(inputFile.length); 
// for input1.txt: 8 pairs plus spaces in between add up to: 8*2 + 7 is 23 lines 
// input2.txt: 449 lines in the input file.

log(`</end of more info >`)