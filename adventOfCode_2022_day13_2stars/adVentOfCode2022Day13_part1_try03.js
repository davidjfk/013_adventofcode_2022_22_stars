/*
    AdventOfCode: day 13 part 1: try_02:
    correct result adventOfCode day 13 part 1: ... in progress

    First read last status at the beginning of adVentOfCode2022Day13_part1_try02.js, idem try02.js

    GOALS for this file try_02:
    1. describe the  logic to compare packetLeft (P) and packetRight (Q) of each pair of packets.
    2. implement the solution.
    3. Output: indices of the pairs that are already in the right order.

   status: design is finished and ready to code...but design can be simplified: empty array [] can take  the role of 'undefined' in step 11 below.
   This will reduce the nr of sub-workflows from  currently 9 to just 5.
   I continue in try04.js to update the design and keep this try03.js for reference.

    ANALYSIS: let's break it down:...
    1. [] == [] ...is...false (!) --> but in my code it should mean that the comparison between 
        packetLeft and packetRight must continu with the next value (!). 
        There are more of these truthy-falsy-comaparison (pitfalls).
    2. do-while loop instead of while-loop does not add extra value.
    3. I need return and continue statement, but not 'break'statement (I think).
    4. to compare P and Q there is 1 main workflow, see step  11 below.
    5. Nr of values inside P and Q varies, so unclear how many iterations. That is why I use while loop
       (alternative: recursion).
    6. A whole bunch of checks must be performed in the same order during each iteration of the while-loop.
    7. This workflow always has 2 arrays (P and Q) as input. Whatever is inside P and Q, varies.
        There is a lurking problem here...
        a) D.length and E.length varies
        b) D.length and E.length can be the same or different.
        c) "HORIZONTALLY:" Each P and/or  Q can have the same structure as D and/or E, when you access P and/or Q. That means that P and Q
           by themselves can also contain multiple value: e.g. [3, 2, 4]
        d) Each P and Q can contain a not nested element, e.g. 6 or [3], or [].
        e) "VERTICALLY: " Each P and Q can contain nested elements: e.g. [[[3]]].
        f) "HORIZONTALLY and VERTICALLY:" (combining c and e) [3, 2, 4,  [[[3]]]]
        
        problem: how to traverse D and E (and all P's and Q's for that matter) if the traversal takes place as a combination of going 
        VERTICAL and/or HORIZONTAL a few or many times and...there are all kinds of combinations of VERTICAL and HORIZONTAL?
        In other words: how to get access to the next P and Q to make to make a comparison, if D and E contain nested elements?

        solution: the following info comes to the rescue:
        If exactly one value is an integer, convert the integer to a list 
        which contains that integer as its only value, then retry the 
        comparison. For example, if comparing [0,0,0] and 2, convert the right 
        value to [2] (a list containing 2); the result is then found by 
        instead comparing [0,0,0] and [2].

        This mechanism allows me to combine going VERTICAL with going HORIZONTAL.
    8.  4 comparisons: nr with nr, nr with array, (array with nr), or array with array.
            A 'nr' is actually a nr inside of an array, e.g. [2].
            Two flavors of arrays: empty, e.g. [] and with nested array, e.g. [[[5]]]
            This leads to 9 comparisons (see step 11 further down below).
            A comparison of P and Q inside D and E is a concatenation of Horizontal and vertical comparisons. The nr of comparisons to compare
            1 set of P and Q can be between 1 and many... --> so I need a while-loop (or a recursive fn).         
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


    9. All business logic must be "squashed" into EVERY iteration of the while loop in EXACTLY the right order.
        How2 do this? 
        Implement the business logic of step 11 above. Do this incrementally for each of the 4 sub-workflows given 
        (in the order given!!).

    10.  requirement: "If exactly one value is an integer, convert the integer to a list 
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
            
            This means that the following comparison has exactly the same result (!!):
            - Compare [9] vs [[[[[[[[[[[[8,7,6]]]]]]]]]]]]
            conclusion: a "bare" 9 can peel off many square brackets. This is also why I need a while loop AND
            should do only 1 "data-mutating-thing", which is to unshift the next element from array P and Q.


    11. Each iteration of the while loop has a main-workflow with the following FORMAT:
        a)  "check if D and/or E has run out of elements"
             I: check if D "has no more value, is empty", a.k.a. has value 'undefined' AND is not an array:
                if (D.length == 0){}

             II: check if E "has no more value, is empty", a.k.a. has value 'undefined' AND is not an array: 
                if (E.length == 0){}
                a) undefined with undefined     (D with E) --> sub-workflow-undefined-with-undefined
                b) undefined with not-undefined (D with E) --> sub-workflow-undefined-with-not-undefined
                c) not-undefined with undefined (D with E) --> sub-workflow-not-undefined-with-undefined   

                combined:
                if (D.length == 0 && E.length == 0){
                    return undefined; // meaning: D and E are identical, so (accoring to specs) they 
                    //are not in the right order. Specs say: "continue with comparing the next value".
                } else if (D.length == 0){
                    return index // meaning: packetLeft has run out of values, but packetRight not.
                    // --> see while loop below for meaning of 'index'.
                } else if (E.length == 0){
                    return undefined  // // meaning: packetRight has run out of values, but packetLeft not.
                }

                // from this point onwards, with the "undefineds" out of the way, in the remainder of each
                // while-loop, P and Q can ONLY be an array. 


        b)  "determine datatype of P and Q:"
            select "first value in array packetLeft" (P) and "first value in array packetRight" (Q) with 
            square-bracket-notation, e.g. foo[0]. 
            Do NOT use array.shift() (js), because this makes P and Q smaller. But if P and  Q should be made smaller, and how to do so
            depend on the datatype of P and Q. But...up to this point the datatypes are not available. So leave
            P and Q intact for now.

            No need to select second (third, etc.) array element of D nor E, because the while-loop will take you there during the
            next iteration (as long as a return-statement has not gotten you out of the while-loop). 
 
            There are 3 datatypes: undefined, number and array. 

            I need to know the datatype of the NEXT ELEMENT (according to the specs). To be more precise: 
                the next element in D (which is P, or a next element of a P)
                the next element in E (which is Q, or a next element of a Q)

                (definition)
                NEXT ELEMENT = next value of P of D (or Q of E):
                ex: 
                D === packetLeft === [ [[[2]]] , 6 ] 
                P === [[[2]]] 
                "shifted element of P" === [[2]] and in the next iteration [2], then    
                2 and finally 6.             

            NEXT ELEMENT P and/or Q can be:
            (0. undefined --> the 'undefineds' have been taken care of in 11.a above.)
            1. empty array: [] 
            2. array with number: [8]
            3. nested array with value: [[8]]
            4. nested array without value: [[[]]] --> same if-statement as [[8]]
            5. nested array in all other flavors, e.g. [[[[[5]]]]] --> same if-statement as [[8]]

    
                combined: 
            if (P.length == 0){
                log(`I am an empty array: e.g. []`)
                // required action: compare P with Q.

            } else if (!isNaN(P[4]) && Array.isArray(P)){    //I could skip &&-condition, but leave it in to make code more robust and allows for easier debugging.
                log(`I am a number inside an array: e.g. [4]`)
                // required action: compare P with Q.

            } else if (Array.isArray(P[0]) && Array.isArray(P)){ //I could skip &&-condition, but leave it in to make code more robust and allows for easier debugging.
                log(`I am a nested array: e.g. [[8]] or: [[[]]] `)
                // required action: remove outer pair of brackets and continue  (goto)
                // next iteration.
            } else {
                console.warn(`datatype mismatch. Please investigate.`)
            }

            important: all 3 types of arrays require a different actions (in the upcoming  9 sub-workflows), based on what is inside of the  array:
            1. EA: empty array: []                                  --> nothing inside.
            2. AWN: array with number: [8]                          --> number inside
            3. AWNA: array with nested array: e.g. [[8]] or [[[]]]  --> nested array inside

            For Q same structure of if-else-statements as P.

            Now I have the building blocks to create if-else-logic for each of the necessary 9 sub-workflows:
            (see next step)
     
        c) "choose sub-workflow to compare P and Q (and perform actions):" 
                I create the word sub-workflows here, because what needs to happen in the comparison of P and Q
                depends on the data types of P and Q and on whether P and/or Q are empty or not. 

                There are 4 sub-workflows, but the distinction between empty array (EA) and
                    array-with-nested-array (AWNA) is still missing:
                    a) if (P with Q is "number with number") --> run sub-workflow-nr-with-nr
                    b) if (P with Q is "array-with-array") --> run sub-workflow-array-with-array
                    c) if (P with Q is "number with array") --> run sub-workflow-nr-with-array
                    d) if (P with Q is "array with number") --> run sub-workflow-array-with-nr

                    Now with distinction between EA and AWNA: 
                    EA = empty array
                    AWNA = array with nested array
                    AWN = array with number = "number (just in the following overview)"

                    9 sub-workflows:
                    (following order is mandatory):
                    1) if (P with Q is "number with number")    --> run sub-workflow-nr-with-nr
                    2) if (P with Q is "EA with EA")            --> run sub-workflow-array-with-array
                    3) if (P with Q is "EA with AWNA")          --> run sub-workflow-array-with-array
                    4) if (P with Q is "AWNA with EA")          --> run sub-workflow-array-with-array
                    5) if (P with Q is "AWNA with AWNA")        --> run sub-workflow-array-with-array
                    6) if (P with Q is "number with EA")        --> run sub-workflow-nr-with-nr
                    7) if (P with Q is "number with AWNA")      --> run sub-workflow-nr-with-nr
                    8) if (P with Q is "EA with number")        --> run sub-workflow-nr-with-nr
                    9) if (P with Q is "AWNA with number")      --> run sub-workflow-nr-with-nr

                Each sub-workflow has following tasks: 
                1) compare P and Q for a unique combi of datatypes of P and Q

                    which comparisons you make, depends on the datatypes of P and Q involved:

                2) (if possible) return 'index' (meaning: packet D and E in correct order) or return
                    undefined (meaning: packet D and E in incorrect order)
                    a) if P and Q are in the right order: return index
                    b) if P and Q are not in the right order: return undefined
                    c) if P and Q have the same value (e.g. [3] == [3], or [] == []), then continue to next comparison of P and Q
                       in the comparison of packetLeft (D) and packetRight (E).
                    d) if P AND Q have no more values (at the same time): return undefined. ( if packetLeft (D) and packetRight (E) 
                        are identical then they are not in the right order --> requirements tell you to 'continue checking
                        the next part of the input'.)
                    c) if P has no more values, i.e. P == undefined, but Q still has 1 or more values: return undefined.
                    d) if Q has no more values, i.e. Q == undefined, but P still has 1 or more values: return index.  

                    return a value === map a value to variable IndicesOfThePacketPairsThatAreAlreadyInTheRightOrder
                    (ctrl-f on this variable)

                3)  (if appicable) the value of P or Q is an integer, but NOT both. So now you must make the same comparison again, 
                    but this time with the number wrapped inside square brackets.
                    
                    e.g. P === 2 and Q == [[3, 2, 6]].
                    how2: update the variable of P. Currently it contains 2 and after the update [2]. 
                    Do NOT update Q (so do not remove e.g. the outer brackets, but leave Q as is)
                    Now go to the next iteration using statement 'continue' inside the while-loop.
                    In this next iteration the comparison will be between P == [2] and Q == [[3, 2, 6]].
                    (2 is less than 3, so packetLeft and packetRight are in the right order).

                4) (else) "make packetLeft and packetRicht smaller": (otherwise the while-loop will go on forever). 
                    How you do this DIFFERS for each of the 9 sub-workflows:
                    scenarios:
                    1. if P and Q are both 6, then value is equal. Now you can shift (read: delete) first element
                    from arrays P and Q.
                    2. if P is [[[[]]]] and Q is [[4]], then remove 1 outer pair of brackets from both (array.shift()
                        comes in handy here.
                    3. if P and Q are both [], then value is equal (pitfall: in js this returns false!), so delete first element
                    from arrays P and Q. 
                    4. (hypothesis upfront: 3 scenarios is comprehensive list)

                    (js) trick: use array.shift() to make pacet P and Q smaller has 2 benefits:
                        I: modifies the original array. So less helper variables needed.
                        II: assign the shifted element to a variable that can be used for the comparison. 
                    array.shift (in js) comes in handy in all 3 scenarios.  
         
                    Now (after making the packets smaller) goto (continue to) next iteration of the while-loop.      

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
        let packetLeft = arrayWith1PairOfPackets[0];
        let packetRight = arrayWith1PairOfPackets[1];
        // D === packetLeftAsCommaSeparatedArray
        let D = JSON.parse(packetLeft); 
        log(D);
        // R === packetRightAsCommaSeparatedArray
        let E = JSON.parse(packetRight); 
        log(E);
        while (HASCOMPARISONBETWEENLEFTANDRIGHTFINISHED == false) { 
            /* 
               Because of the algebraic nature of the problem, I have used letters in the analysis and desgin.
               I use these letters in the  code too, to keep code and analysis an design tightly tied together.
               Normally speaking this is a very bad practice, but here it feels that it makes things easier.
            */


            D = 3;  // dummy data     
            E = 3; // dummy data      
            if (D == E)  {  
  
                return index; // breaks out of the while loop. 
            }
        }
    }
)

log(`IndicesOfThePacketPairsThatAreAlreadyInTheRightOrder:`)
log(IndicesOfThePacketPairsThatAreAlreadyInTheRightOrder)
// example in while-loop proofs that mechanism to compare packetLeft (P) and packetRight (Q) works. 
// in try_02 the actual comparison will be made with real data from first input1.txt and then input2.txt.


