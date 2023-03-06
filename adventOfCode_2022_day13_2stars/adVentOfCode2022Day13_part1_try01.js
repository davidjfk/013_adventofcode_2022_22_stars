/*
    AdventOfCode: day 13 part 1: try_01:
    correct result adventOfCode day 13 part 1: ... in progress

    GOALS for this file try_01:
    1. do ANALYSIS and DESIGN
    2. create the mechanism that makes it possible for the packetLeft (P) and packetRight (Q) of each pair of packets 
       to be compared with each other.
       status:
        example in while-loop below (at end of file) proofs that mechanism to compare packetLeft (P) and packetRight (Q) works. 
        in try_02 the actual comparison will be made with real data from first input1.txt and then input2.txt.
        Code is divided in:
        STEP1
        STEP2 --> deleted in adVentOfCode2022Day13_part1_try02.js 
        STEP3

    NEXT: (in adVentOfCode2022Day13_part1_try02.js ):
    1. describe the  logic to compare packetLeft (P) and packetRight (Q) of each pair of packets.
    2. implement the solution.
    3. Output: indices of the pairs that are already in the right order.


    ----------------------------------------------------------------------------------------------------------------------


    ANALYSIS:
    data: example data from the assignment: 'input1.txt.
    data: data to calculate answer for day 9 part 2: 'input2.txt'.
  
    experiment:
    in all previous adventOfCode puzzles I have done this:
    read puzzle --> write analysis and design --> write code --> solve problem (or get stuck on day 7 and 12)

    This time:
    read puzzle --> put it in my mind --> during a few days think about puzzle every now and then --> write analysis (...rest is the same)
    

    DEFINITIONS:
    left == left packet == packet-left-array == first packet from a group of 2 packets that must be compared with each other (to determine if packets are in  the right order)
    right == right packet == packet-right-array == second packet from (...).
    array == (generic pythonic word)'list' in assignment.


    There are 2 major parts
    1. recursion and/or while loop is indispendable. Reason: amount of brackets between 2 comma's (i.e. for 1 D and/or E, see below) ranges from 0 to (near) infinity.
    2. comparison (of each D and E) must take place inside a for-loop: each pair must be compared during 1 iteration of a for-loop. Inside this for-loop I need a while-loop, because
        length of D (i.e. amount of P) and/or Q ranges between 1 and (near) infinity.
    3. Each packet must be array.split on the comma. Result is an array with length between 1 and (near) infinity. So another recursion and/or while loop is needed.
    4. No packet in input2.txt is missing. In other words: no packet - before running the code - has value undefined. 
    5. The smalles packet input2.txt is empty array: []
    6. The main unit of comparison is the array: 
        a) empty array
        b) array with nr
        c) array with nested array(s)
        d) number (e.g. 9) that is transformed into an array (e.g. [9]) as a preparation to make the comparison. 
    7. 2 candidates to break out of a while loop:
        a) (last value P and/or Q) of (D and/or E) (DESIGN below explains definition of P and Q) has value undefined.
        b) (last value P and/or Q) of (D and/or E) is a number, so datatype === number
    8. separate each B in D and E before you remove all apostrophes. 
    9. many comparisons must be made between P and Q and also in the right order. --> I do not put this in the design, implement this on-the-fly while coding. 


    DESIGN:
 
    l. Map thru input file to create array (A) with a 'pair of packets' (B) in each array element (C) of A. Rem
        Each B consists of a packet-left (D) and a packet-right (E). Each D and E is still a comma-separated-string.
    2. Map thru (A) to create grid (array with nested arrays) (G). Do this as follows: remove the apostrophe's around D and E 
        (see further for definition of D and E) and split each array element (C) on the comma. 
        Result: a packet-left-array (D) and a packet-right-array (E). (D) and (E) must end up
        as nested arrays of (G). So (G) contains all (B)'s, but the D's and E's are now comma-separated-arrays. 
    3. Map thru grid (G) to create grid (W). (W) will contain the indices of the pairs that are already in the right order. To get there, do:  
        a) Inside (the fn body of the callback of) G create a for-loop (I).
        b) in each iteration of (I) 1 pair of packets (B) is compared. (you know how many pairs of packets there are, so a for-loop can be used)
        c) inside (I) do another iteration to compare each (D) and (E) (of a B)
        d) problem: length of  array (D) and (E) varies. solution: create while loop (K) inside (I).
        e) inside (K) compare each element of array D (--> called: P) with element of array E (--> called Q).
            so P === 'what is compared on left hand side
            so Q === 'what is compared on right hand  side
            ex: 


            See below: B === D and E together.
            
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

        f) problem: number of comparisons of D and E varies between 1 up to (near) infinity.
        g) solution: use another nested while-loop. --> this while loop runs as long as the comparison between 'left' and 'right' must continue. 
    4. Now compare the 'left' and 'right' (as described in the assignment on https://adventofcode.com/2022/day/13). 

            in short: map 3 times, then for loop with 2 nested while loops to get to the point where you are actually going to compare P with Q.
 

*/
const log = console.log;

const {readFileSync} = require("fs");
const { toNamespacedPath } = require("path");

// toggle between inputTest.txt and inputReal.txt. Use inputReal.txt to calculate the real answer for day 9 part 2.
const inputFile = readFileSync("input1.txt", "utf-8").split('\r\n');
// log('01_input-from-file: ')
// log(inputFile)

// STEP 1: for each 3 elements in inputFile, select only the first 2:
// problem: regex and split (in js) only work on string, but NOT on array:
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
        // I just want the first 2:
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
// log(arrayWithAllPairsOf2Packets); // ok

// STEP 2: get rid of the apostrophes, so I can search the arrays inside...  (wrong)
    /*
    ...no need to get rid of the apostrophes (!!!): String indexes are zero-based:
    The first character is in position 0, the second in 1, and so on.
    ( https://www.w3schools.com/jsref/jsref_obj_string.asp )
    I can use bracket notation on strings, the same way as on arrays
    ( https://education.launchcode.org/intro-to-professional-web-dev/chapters/strings/bracket-notation.html)
    learning: I knew this already, but I started coding too quickly, without enough critical thought upfront. 

    Not just that: the apostrophes (single quotes or double quotes serve a purpose: they make sure that 
    each pair of packets consists of 2 packets, but not of 4 (see json-example at end of STEP 2)). 

    Time spent on step 2: 2 hours (I have learned a lot, although I do not need step 2 to solve the adventOfCode problem).
    */


    // proof of concept:
        /*
        future referrence: regEx not working in this situation: 
            // log(typeof(flattenedArray[0].replace(/'/g,)))
            (maybe because the string is still encapsulated inside of an array)

            //however, this works for a "stand-alone" string: remove apostrophes around stringified array: (status: works)
            let myStringifiedArray = '[1,1,3,1,1]';
            //in place conversion (i.e. mutable): 
            // myStringifiedArray = myStringifiedArray.replace(/'/g,'');
            // console.log(myStringifiedArray);
        */
        // let flattenedArray = arrayWithAllPairsOf2Packets.flat(); // I flatten just for the proof of concept.
        // // my solution / trick: from string (pitfall: not array!!) flattenedArray[0] remove the square brackets '[' and ']'.
        // let result1 = flattenedArray[0].slice(1, -1)
        // log(result1)
        // log(typeof(result1))
        // let result2 = result1.split(',')
        // log(result2)
        // let result3 = result2.map((element) => parseInt(element))
        // log(result3) // [ 1, 1, 3, 1, 1 ]
        // log(Array.isArray(result3)); // output: true (ok)
        // log(typeof(result3[0])); // from [ 1, 1, 3, 1, 1 ] , 1 is a number. (ok)
    // end of proof of concept.

    //  QED: proof of concept works. Now put this code inside of a fn:
    const deleteApostrophesAroundArray = (arrayEnclosedByApostrophes ) => { 
        // input: e.g. '[1,1,3,1,1]'
        // output: e.g. [1,1,3,1,1]
        let stringifiedArrayWithoutSquareBrackets = arrayEnclosedByApostrophes.slice(1, -1)
        // log(result1)
        // log(typeof(result1))
        let arrayWithStrings = stringifiedArrayWithoutSquareBrackets.split(',')
        // log(arrayWithStrings)
        let arrayWithNumbers = arrayWithStrings.map((element) => parseInt(element))
        // log(arrayWithNumbers) // [ 1, 1, 3, 1, 1 ]
        // log(Array.isArray(arrayWithNumbers)); // output: true (ok)
        // log(typeof(arrayWithNumbers[0])); // from [ 1, 1, 3, 1, 1 ] , 1 is a number. (ok)

        //problem: parseInt not working on e.g. [1] from '[[1],[2,3,4]]', '[[1],4]' ]. (so...not ok)
        return arrayWithNumbers;
    }

    /*
    Test this fn deleteApostrophesAroundArray on 1 grid cell: 
    grid:
    [
        [ '[1,1,3,1,1]', '[1,1,5,1,1]' ],
        [ '[[1],[2,3,4]]', '[[1],4]' ],
        [ '[9]', '[[8,7,6]]' ],
        [ '[[4,4],4,4]', '[[4,4],4,4,4]' ],
        [ '[7,7,7,7]', '[7,7,7]' ],
        [ '[]', '[3]' ],
        [ '[[[]]]', '[[]]' ],
        [ '[1,[2,[3,[4,[5,6,7]]]],8,9]', '[1,[2,[3,[4,[5,6,0]]]],8,9]' ]
    ]
    
    */
    // let gridCellWithoutApostrophes = deleteApostrophesAroundArray(flattenedArray[0]);
    // in data above '[1,1,3,1,1]' is flattenedArray[0]
    // log(gridCellWithoutApostrophes); // [ 1, 1, 3, 1, 1 ] (result: ok)...again NOT ok on grid cell '[[1],[2,3,4]]'

    // now apply this fn on first row of the grid:
    let pairOfPackets = [ '[1,1,3,1,1]', '[1,1,5,1,1]' ]; // contains 2 strings separated by a comma:
    let pairOfPacketsWithoutApostrophes = pairOfPackets
        .map((string) => [deleteApostrophesAroundArray(string)]
        .flat()
        );
    // log(pairOfPacketsWithoutApostrophes) // [ [ 1, 1, 3, 1, 1 ], [ 1, 1, 5, 1, 1 ] ]  (ok)
    // again: not ok when applied on e.g.: [ '[[1],[2,3,4]]', '[[1],4]' ],

    // QED: solution not working, so like this NOT possible to get rid of the apostrophes in the entire grid:

        // let grid = arrayWithAllPairsOf2Packets;
        // let arrayWithAllPairsOf2PacketsWithoutApostrophes = grid.map( subarray => subarray
        //     .map((string) => [deleteApostrophesAroundArray(string)])
        //     .flat()
        //     );
        // log(arrayWithAllPairsOf2PacketsWithoutApostrophes);

    // solution:
    let packetToTest = [ '[1,1,3,1,1]', '[1,1,5,1,1]' ];
    packetToTest =  [ '[[1],[2,3,4]]', '[[1],4]' ];
    // log(obj)
    const myJSON = JSON.stringify(packetToTest);
    // log(myJSON);
    // log(myJSON.replace(/"|'/g, ""))
    // log(myJSON);
    // log(typeof(myJSON));
    
    // output:
    // [ '[[1],[2,3,4]]', '[[1],4]' ]
    // [[[1],[2,3,4]],[[1],4]]
    // ["[[1],[2,3,4]]","[[1],4]"] 
    // string 
    // PROBLEM: now I have an array pairOfPackets with 4 elements...(error...)
    // conclusion: I need the apostrophes (single or double quotes), so that each pairOfPackets consists of
    // 2 packets, but NOT 4 (!!!)
   


// STEP 3: create the outset  where P can be compared with Q (the actual compare is a next step) (result: ok)
// STEP 4: compare P with Q
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