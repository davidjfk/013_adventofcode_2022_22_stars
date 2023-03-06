/*
    AdventOfCode: day 13 part 1: try_02:
    correct result adventOfCode day 13 part 1: ... in progress

    First read last status at the beginning of adVentOfCode2022Day13_part1_try01.js

    GOALS for this file try_02:
    1. describe the  logic to compare packetLeft (P) and packetRight (Q) of each pair of packets.
    2. implement the solution.
    3. Output: indices of the pairs that are already in the right order.

   status: (after a good night sleep I realize that) solution below has a few problems.
   So back to the drawing board. I continue in try03.js and keep 
   this try02.js for reference.

    ANALYSIS: let's break it down:...
    1. [] == [] ...is...false (!) --> but in my code it should mean that the comparison between 
        packetLeft and packetRight must continu with the next value (!). 
        There are more of these truthy-falsy-comaparison (pitfalls).
    2. do-while loop instead of while-loop does not add extra value.
    3. I need return and continue statement, but not 'break'statement (I think).
    4. to compare P and Q there is 1 main workflow, see step  11 below.
    5. This workflow always has 2 arrays (P and Q) as input. Whatever is inside P and Q, varies.
    8. everything must fit into 1 workflow, so NO concurrency.
    9. Nr of values inside P and Q varies, so unclear how many iterations. That is why I use while loop
       (alternative: recursion).
    10. A whole bunch of checks must be performed in the same order during each iteration of the while-loop.

    11. Each iteration of the while loop has a main-workflow with the following FORMAT:
        a) "take a slice": do something that makes packetLeft D AND packetRight E smaller: 
            select "first value in array packetLeft" (P) and "first value in array packetRight" (Q), e.g. foo[0]. 
            Use array.shift() (js) for this;  
            I) select first array value: p[0] --> use array.shift() 2 benefits:
                I: modifies the original array. So less helper variables needed.
                II: assign the shifted element to a variable that can be used for the comparison....so I am not going to directly 
                compare P with Q, but...(during each iteration of the while-loop) the 'shifted element' of P and Q (!!!)

                [ [[[2]]] , 6 ] --> e.g. [[[2]]] is P, but the "shifted element of P" is [[2]] and in the next iteration [2], and
                finally 2. 

                But if you take 6 instead, then 6 is both P as welll as  the "shifted element of P".

            II) (imho) no need to select second (third, etc.) array element, because the while-loop will take you there during the
            next iteration (as long as the comparison of shifted elements of P and Q do not lead you into 1 of the 4 scenarios (see above) 
            out of the while-loop with a returned value 'index' or 'undefined'). Reasoning the other way around: the comparison is a 
            valid reason to select ONLY 1 P and Q during each iteration inside the while-loop.

        b) "determine datatype and sub-workflow" (js: number or array) of  P and Q. Based on the combi of datatypes of P AND Q, 
            you enter 1 of the 4 possible sub-workflows: (as further elaborated on in step 16 below):
                (in the following order):
                a) number with number (P with Q) === sub-workflow-nr-with-nr
                b) array with array   ( idem   ) === sub-workflow-array-with-array
                c) number with array  (idem  )   === sub-workflow-nr-with-array
                d) array with number  (idem )    === sub-workflow-array-with-nr

                implementation: switch-statement is probably a good candidate.

                2do: for each of the 4 sub-workflows step c (which comparisons) and step d (what to do based on the output of 
                a comparison), will DIFFER. But I will cross that bridge when I reach it (i.e. while writing code)
                For each extra sub-workflow I will add the testdata incrementally to implement and  test the sub-workflow.

        c) "compare": compare P with Q. This does NOT make P nor Q smaller:
            a) p === undefined, because there is no value: "empty"
            b) p === undefined, because [] is empty and you do this: [0]
                This means that empty array should win from 'no value'. 
            c) (continuation) so check: Array.isArray(p) --> for empty value 'false' and for empty array 'true'.
            d) p.length > 1?
            e) p.length == 0 ?

        d) "return value or stay in while loop":  
            I: return an index or undefined from 1 of the 4 scenarios:
                (main workflow has 4 scenarios) to get  out of the while-loop, by returning either an index or undefined:
                a) if P and Q are in the right order: return index
                b) if P and Q are not in the right order: return undefined
                c) if P has no more values, i.e. P == undefined, but Q still has 1 or more values: return undefined.
                d) if Q has no more values, i.e. Q == undefined, but P still has 1 or more values: return index.              


            ...OR...: 

                sub-workflow stays in the while loop, because:
                a)  P and Q are identical (js: by their values, NOT byRef...
                    so not by looking if they occupy same memory space on the heap!!): 
                    statement 'continue' (pitfall: do NOT use 'return' here!!!).
                   OR: 
                b)  The value of P OR Q is an integer, but NOT both. So now you must make the same comparison again, but this time 
                    with the number wrapped inside square brackets, e.g. 2 --> [2].
                
                a) and b) again, but now in pseudo-code: 

            II: if (you stay in the  while loop AND exactly 1 value is an integer) {
                wrap this value into an array (e.g. 2 --> [2])
                use 'continue' here, because your comparison has not finished, so you are NOT ready yet to return a value
                that will be mapped/pushed into variable IndicesOfThePacketPairsThatAreAlreadyInTheRightOrder
                (See this variable in the code example at the end of this file)

                } else {
                    return undefined;
                }     

                
    15.  requirement: "If exactly one value is an integer, convert the integer to a list 
            which contains that integer as its only value, then retry the 
            comparison. For example, if comparing [0,0,0] and 2, convert the right 
            value to [2] (a list containing 2); the result is then found by 
            instead comparing [0,0,0] and [2]." 

            == Pair 3 ==
            - Compare [9] vs [[8,7,6]]
            - Compare 9 vs [8,7,6]
                - Mixed types; convert left to [9] and retry comparison
                - Compare [9] vs [8,7,6]
                - Compare 9 vs 8
                - Right side is smaller, so inputs are not in the right order   
            
            As a sidenote: the following comparison has exactly the same result (!!):
            - Compare [9] vs [[[[[[[[[[[[8,7,6]]]]]]]]]]]]
            conclusion: a "bare" 9 can peel off many square brackets. This is also why I need a while loop AND
            should do only 1 "data-mutating-thing", which is to unshift the next element from array P and Q.



    16. 3 types of comparisons: nr with nr, nr with array, (array with nr), or array with array. When comparing D with E, you encounter
            a concatenation of 1 type, or a mix of these 2 types in any possible combination. On top of that, the nr 
            of comparisons can be between 1 and and many...) !!! This is another good reason for using a while-loop.         
            furthermore:

            COMPARISON TYPE 1: NR WITH ARRAY:
            == Pair 6 ==
            - Compare [] vs [3]
            - Left side ran out of items, so inputs are in the right order
            analysis: 
            array.shift() on packetLeft results in "shifted element (P) with" value undefined.
            array.shift() on packetRight results in "shifted element (Q) with" value 3.

            RULE: inside the arrays of P and Q, you compare NUMBERS, because 1 value is an integer !!

            COMPARISON TYPE 2: ARRAY WITH ARRAY:
            == Pair 7 ==
            - Compare [[[]]] vs [[]]
            - Compare [[]] vs []
            - Right side ran out of items, so inputs are not in the right order

            RULE: inside the arrays of P and Q, you compare (empty) arrays, because numbers do not "participate
            in the equation".

            conclusion: I must know the datatype of the contents of P and Q, so I know HOW
            to compare P and Q (i.e. "with or without numbers").
            There are 2 datatypes:
            a) number (in js)
            b) array (in js)

            During 1 iteration of the while-loop while comparing a P with Q, there are 4 possible comparisons
            (in the following order):
            a) number with number
            b) array with array
            c) number with array 
            d) array with number 

            These are the 4 "sub-workflows".
            The main workflow consists of these 4 sub-workflows. 


    17. All business logic must be "squashed" into EVERY iteration of the while loop in EXACTLY the right order.
        How2 do this? 
        Implement the business logic of step 11 above. Do this incrementally for each of the 4 sub-workflows given 
        (in the order given!!).

*/
const log = console.log;

const {readFileSync} = require("fs");
const { toNamespacedPath } = require("path");

// toggle between inputTest.txt and inputReal.txt. Use inputReal.txt to calculate the real answer for day 9 part 2.
const inputFile = readFileSync("input1.txt", "utf-8").split('\r\n');

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

// STEP2: (see (in adVentOfCode2022Day13_part1_try01.js ):)

// STEP 3: create the outset  where P can be compared with Q (the actual compare is a next step) (result: ok)
let HASCOMPARISONBETWEENLEFTANDRIGHTFINISHED = false;
let IndicesOfThePacketPairsThatAreAlreadyInTheRightOrder = arrayWithAllPairsOf2Packets
    .map((arrayWith1PairOfPackets, index) => {
        
        log(`index: ${index}:-------------------------------------------------------`);
        HASCOMPARISONBETWEENLEFTANDRIGHTFINISHED = false;
        // log(arrayWith1PairOfPackets);
        let packetLeft = arrayWith1PairOfPackets[0];
        // log(packetLeft); // ok
        let packetRight = arrayWith1PairOfPackets[1];
        // log(packetRight); // ok
        // requirement: VALUES inside packet left and packet right are compareds with each other.
        // requirement: value can be list or integer. 
        // requirement: values inside a packet are separated by comma's.
        // So now it is time to break down packetLeft and PacketRight into comma-separated-arrays: 

        let packetLeftAsCommaSeparatedArray = JSON.parse(packetLeft); 
        //the (wrong) usage of JSON.stringify() above, has put me on the right track.
        log(packetLeftAsCommaSeparatedArray);
        let packetRightAsCommaSeparatedArray = JSON.parse(packetRight);
        log(packetRightAsCommaSeparatedArray);
        // let result1 = packetRightAsCommaSeparatedArray[0];
        // log(Array.isArray(result1))
        // log(typeof(result2))
        // log(Array.isArray(result2))

        while (HASCOMPARISONBETWEENLEFTANDRIGHTFINISHED == false) { // just a negative number (but NOT -1) that catches the eye.
            /* index is returned if index of packet is between 0 (included) and packetLeft.length AND
                the comparison goes accoring to the requirements.
                If packetLeft runs out of items, then "look no more" and return index of PAIR of packets (of
                which the packetLeft is part). 
            */
                packetLeftAsCommaSeparatedArray = 3;  // dummy data     
                packetRightAsCommaSeparatedArray = 3; // dummy data      
            if (packetLeftAsCommaSeparatedArray == packetRightAsCommaSeparatedArray)  {  
  
                return index; // breaks out of the while loop. 
            }
        }
    }
)

log(`IndicesOfThePacketPairsThatAreAlreadyInTheRightOrder:`)
log(IndicesOfThePacketPairsThatAreAlreadyInTheRightOrder)
// example in while-loop proofs that mechanism to compare packetLeft (P) and packetRight (Q) works. 
// in try_02 the actual comparison will be made with real data from first input1.txt and then input2.txt.


