/*
    AdventOfCode: day 13 part 1: try_07:
    correct result adventOfCode day 13 part 1: ... in progress

    GOALS for this file try_07:
    1. more analysis & design, to get to the correct answer for the assignment.

    status: (see DESIGN) put while-loop and all sub-workflows 
                inside a fn checkIfPacketLeftAndRightAreInCorrectOrder --> done.

                    
                I need an easy way to tell TO THE MAP-FN if comparison of D and E is in correct or wrong order.
                Currently  I return the result from  each  of the sub-workflows.
                But now with  the recursive fn, I need another approach:
                if result has been reached (i.e. return index or return 'PacketsInwrongOrder'), then
                break  out of the for loop and let recursive fn checkIfPacketLeftAndRightAreInCorrectOrder
                return that result.
                Based on which of the 2 possible results, the  map fn for this  set of 2 packets will receive either the index 
                (meaning: pacckets in right order) , or 'PacketsInwrongOrder' (indicating that packets
                are not in right order). 
                
                (The 3rd possible result: )  when D and E are the same in recursive fn (on the stack: execution env level 1), 
                then its P and Q on level 0 should be assigned a 0. 
                D[0] = checkIfPacketLeftAndRightAreInCorrectOrder("array inside nested array")
                E[0] = checkIfPacketLeftAndRightAreInCorrectOrder("array inside nested array")
                output:
                D[0] = 0;
                E[0] = 0;
                Now the same fn checkIfPacketLeftAndRightAreInCorrectOrder on level 0 can continue with its comparison of 
                the NEXT P and Q. So when D and E are equal (byVal comparison), then I cannot break out of the while-loop, 
                but must continue with the comparison until a value (index or 'PacketsInwrongOrder') can be returned to the map
                fn for that particular pair of packetLeft (D) and packetRight (E).

                
                
    next:This is a significant change in the code. So I implement this in try_08.js



    ANALYSIS:
        my wrong assumption in try_05: (line 183):

        "For the parsing of the data in the pursuit of determining if pair of packets is in right order, 
        it does not matter what is (or is not) inside the nested brackets:
        [[[3]]] or: [[[[[69]]]]] or: [[[]]] etc. "
    
        compare AWNA with array with numbers: 
        P= [[3]]
        Q = [8,8]
        remove outer brackets:
        P = [3]
        Q = 8,8
        compare [3] with 8.
        compare [3] with [8]
        conclusion: packets in right order....problem: the list around Q has been removed. The business rules 
        also apply to this list, so you cannot remove it.

        In general:
        D = [[[ 1 ,   1],  [ 1 ]], 6]
        E = [[[ 1], [ 1 , 1 ]]   , 7]
        1st P  is AWNA with 2 elements.
        1st Q is AWNA with 1 element.
        correct answer: D and E are not in the right order.

        But suppose you remove outer brackets around P and Q, then D and E will look  like this:
        D = [[ 1 ,   1,  [ 1 ]], 6]
        E = [[ 1, [ 1 , 1 ]]   , 7]    
        now the wrong answer becomes: packetLeft D and packetright E are in the right order...(but they are not)!!
        QED: RULE: you cannot remove brackets.


        my pitfall / what has made it hard to track down this rule, is that if P and Q have SAME nr of values, then  you can 
        remove outer brackets: ex:
        D = [[[ 1 ,   1],  [ 1 ]], 5]
        E = [[[ 1 ,   1],  [ 1 ]], 9]
        The packets are  in the right order.
        again remove outer brackets:
        D = [[ 1 ,   1,  [ 1 ]], 5]
        E = [[ 1 ,   1,  [ 1 ]], 9]
        The packets are still in the right order.

        
        conclusion: you cannot remove brackets, not in arrays neither in nested arrays.
        conclusion: all rules need to apply to all arrays,  nomatter if they are nested or not.
        Suppose P and Q (that inside a nested array become their own D and E!) are equal, in right order or wrong order, then
        the result must be given back to the "calling" D and E, so the calling D and E  know whether to move on with comparing the 
        next P and Q (in case of a draw), or to pass on the "message" that a value must be returned: an index because packets are 
        in correct order, or 'packetsAreInWrongOrder'.
        So... I  I MUST use recursion. I cannot use a while-loop for every AWNA that I encounter.

        This is a different ballgame.



    DESIGN
        16 sub-workflows in total (same as in version  try_06.js):
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
        
        Combine 2, 3 and 4 into:  comparison of P with Q:  number with array
        Combine 5, 9 and 13 into: comparison of P with Q:  array with number 


        3 sub-workflows must be made recursive: 12, 15 and 16.


        For this to work I need the following changes:
        1. put while-loop and all sub-workflows inside a fn checkIfPacketLeftAndRightAreInCorrectOrder
        2. now make sub-workflow 12 recursive. Implement in small incremental steps and test thoroughly before moving on.
        3. idem: sub-workflow 15
        4. idem: sub-workflow 16

*/
const log = console.log;

const {readFileSync} = require("fs");
const { toNamespacedPath } = require("path");

// toggle between inputTest.txt and inputReal.txt. Use inputReal.txt to calculate the real answer for day 9 part 2.
let inputFile = readFileSync("input1.txt", "utf-8").split('\r\n');
// log(inputFile);

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

//     '[31]',
//     '[[[[[[[[[[18]]]]]]]]]]',
//     '', 

//     '[[[[[[[[[[18]]]]]]]]]]',
//     '[31]',
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
// log(arrayWithAllPairsOf2Packets);


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



        let checkIfPacketLeftAndRightAreInCorrectOrder = (D, E) => {
            let resultOfCheckIfPacketLeftAndRightAreInCorrectOrder;

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
                    log(`--packet-workflow 1: D.length == 0 && E.length == 0`);

                    return 'packetLeftAndRightIdentical'; // meaning: D and E are identical, so (accoring to specs) they 
                    //are not in the right order. Specs say: "continue with comparing the next value".
                } 
                
                if (D?.length == 0){
                    log(`--packet-workflow 2: D.length == 0 --> return index: ${index}`)
                    return index // meaning: packetLeft has run out of values, but packetRight not.
                    // --> see while loop below for meaning of 'index'.

                } 
                
                if (E?.length == 0){
                    log(`--packet-workflow 3: E.length == 0 --> return packetRightHasRunOutOfItemsFirst`)
                    return 'packetRightHasRunOutOfItemsFirst'  // // meaning: packetRight has run out of values, but packetLeft not.
                } 
                



                if(!Array?.isArray(D[0]) && typeof(D[0]) == 'number' && !Array?.isArray(E[0]) && typeof(E[0]) == 'number' ){
                    log(`--sub-workflow 1: compare nr with nr:`)
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
                } 
            

                if(!Array?.isArray(D[0]) && typeof(D[0]) == 'number' && (Array?.isArray(E[0])) ){
                    log(`--sub-workflow 2,3,4: compare nr with array (i.e. empty aray, array with nr, or nested array):`)
                    //put brackets around the number: e.g. 5 --> [5]
                    D[0] = [D[0]];
                    /*
                        You must nest D[0] inside brackets, even if you know that E[0] contains empty array. 
                        (tempting to already return 'packetOrderWrong', but do not do that yet;
                        sub-workflow 10 is going to take over next, and return a value based on the empty value.

                    */
                }

                if(Array?.isArray(D[0]) && !Array?.isArray(E[0]) && typeof(E[0]) == 'number'){
                    log(`--sub-workflow 5,9,13: compare array with nr: (i.e. empty aray, array with nr, or nested array)`)
                    E[0] = [E[0]];
                }

                if(Array?.isArray(D[0]) && D[0].length == 0 && Array?.isArray(E[0]) && E[0].length == 0 ){
                    log(`--sub-workflow 6: compare empty-array with empty-array:`)
                    D.shift(); //2do: check if this works.
                    E.shift();               
                }

                if(Array?.isArray(D[0]) && D[0].length == 0 && Array?.isArray(E[0]) && typeof(E[0][0]) == 'number' && E[0][0].length != 0){
                    log(`--sub-workflow 7: compare empty array with array-with-nr:`)
                    return index;
                }

                if(Array?.isArray(D[0]) && D[0].length == 0 && Array?.isArray(E[0]) && Array?.isArray(E[0][0]) ){
                    log(`--sub-workflow 8: compare empty array with array-with-nested-array:`)
                    return index;
                }            

                if(Array?.isArray(D[0]) && typeof(D[0][0]) == 'number' && D[0][0].length != 0 && Array?.isArray(E[0]) && E[0].length == 0   ){
                    log(`--sub-workflow 10: compare array-with-nr with empty-array:`)
                    return 'packetOrderWrong';
                } 

                if(Array?.isArray(D[0]) && typeof(D[0][0]) == 'number' && D[0][0].length != 0 && Array?.isArray(E[0]) && typeof(E[0][0]) == 'number' && E[0][0].length != 0   ){
                    log(`--sub-workflow 11: compare array-with-nr with array-with-nr:`)
                    // remove brackets, e.g. [19] --> 19;
                    // D[0] = D[0][0]; // wrong: do a comparison instead!! See 'if both values are lists'. 
                    // E[0] = E[0][0]; // wrong: do a comparison instead!! See 'if both values are lists'. 

                    if (D[0][0] - E[0][0] < 0) {
                        log(`nr of D[0][0] < E[0][0] --> return index: ${index}`)
                        return index
                    } else if ((D[0][0] - E[0][0] > 0)){
                        return 'pIsBiggerThanQ';
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
                } 

                if(Array?.isArray(D[0]) && typeof(D[0][0]) == 'number' && D[0][0].length != 0 && Array?.isArray(E[0]) && Array?.isArray(E[0][0])   ){
                    log(`--sub-workflow 12: compare array-with-nr with array-with-nested-array:`)
                    // remove brackets, e.g. [19] --> 19;
                    // D[0] = D[0][0]; // --> wrong: now you do not go to sub-workflow-11 next. Intstead, you go
                    // into endless loop.



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
                } 

                if(Array?.isArray(D[0]) && Array?.isArray(D[0][0]) && Array?.isArray(E[0]) && E[0].length == 0   ){
                    log(`--sub-workflow 14: compare AWNA (array-nested-array) with empty-array:`)
                    return 'packetOrderWrong';
                } 


                if(Array?.isArray(D[0]) && Array?.isArray(D[0][0]) && Array?.isArray(E[0]) && typeof(E[0][0]) == 'number' && E[0][0].length != 0   ){
                    log(`--sub-workflow 15: compare AWNA (array-nested-array) with array-with-nr:`)
                    // remove 1 pair of brackets from AWNA and also from the empty-array, e.g. [19] --> 19;
                    
                    
                    let arrayFirstElementWith1PairOfOuterBracketsLess = D[0][0]; 
                    D[0].shift(); 
                    D[0] = [...arrayFirstElementWith1PairOfOuterBracketsLess, ...D[0]]; 
                    
                    

                
                    // E[0] = E[0][0]; // --> wrong: now you do not go to sub-workflow-11 next. Intstead, you go
                    // into endless loop.
                } 

                if(Array?.isArray(D[0]) && Array?.isArray(D[0][0]) && Array?.isArray(E[0]) && Array?.isArray(E[0][0])   ){
                    log(`--sub-workflow 16: compare AWNA (array-nested-array) with array-with-nr:`)
                    // remove 1 pair of brackets from both AWNA, e.g. [[[3]]] --> [[3]]
                    let arrayFirstElementWith1PairOfOuterBracketsLessFromD = D[0][0]; 
                    D[0].shift(); 
                    D[0] = [...arrayFirstElementWith1PairOfOuterBracketsLessFromD, ...D[0]]; 

                    let arrayFirstElementWith1PairOfOuterBracketsLessFromE = E[0][0]; 
                    E[0].shift(); 
                    E[0] = [...arrayFirstElementWith1PairOfOuterBracketsLessFromE, ...E[0]];                 
                } 

            } // end of while loop
            return resultOfCheckIfPacketLeftAndRightAreInCorrectOrder;
        } // end of recursive fn checkIfPacketLeftAndRightAreInCorrectOrder
        checkIfPacketLeftAndRightAreInCorrectOrder(D,E);



    })
    


let IndicesOfThePacketPairsThatAreAlreadyInTheRightOrder = IndicesOfThePacketPairsThatAreAlreadyInTheRightOrderMixedWithOtherOutput.filter(Number.isInteger);

log(`IndicesOfThePacketPairsThatAreAlreadyInTheRightOrder:`)
log(IndicesOfThePacketPairsThatAreAlreadyInTheRightOrder)

// requirement: the indices of the pairs starts at ...1, not 0:
let IndicesPlusOne = IndicesOfThePacketPairsThatAreAlreadyInTheRightOrder.map((index) => index + 1);
log(`IndicesPlusOne: `)
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
    // input2.txt -->  5353 is wrong.
    // input2.txt -->  5500 is wrong.
    // input2.txt -->  5177 is wrong.
} else {
    log(`testdata only contains pair(s) in wrong order. (From while loop pair in wrong order returns 'pairInWrongOrder'. 
     You cannot add values 'pairInWrongOrder' together.)`)
}





log(`<more info: `);

log(arrayWithAllPairsOf2Packets.length);
// input1.txt: 8 pairs
// input2.txt: 150 pairs

log(inputFile.length); 
// for input1.txt: 8 pairs plus spaces in between add up to: 8*2 + 7 is 23 lines (ok)
// input2.txt: 449 lines in the input file. 

log(`</end of more info >`)