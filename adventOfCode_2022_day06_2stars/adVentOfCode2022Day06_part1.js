// const util = require('node:util');
// util.inspect.defaultOptions.maxArrayLength = null;

const log = console.log;
// const dir = console.dir(myArry, {'maxArrayLength': null});

const {readFileSync} = require("fs");
const { toNamespacedPath } = require("path");


const inputFromFile = readFileSync("input.txt", "utf-8").split('\r\n');
log('01_input-from-file: ')
// log(inputFromFile)


// testdata: (all tests must pass, before testing with  inputFromFile above!!)
// let inputFromFileTestData = ['bvwbjplbgvbhsrlpgdmjqwftvncz']; //answer: 5
// let inputFromFileTestData = ['nppdvjthqldpwncqszvftbrmjlhg']; //answer: 6
// let inputFromFileTestData = ['nznrnfrfntjfmvfwmzdfjlvtqnbhcprsg']; // answer: 10
let inputFromFileTestData = ['zcfzfwzzqfrljwzlrfnpqdbhtmscgvjw']; // answer: 11

// toggle between inputFromFile and inputFromFileTestData[0]
let inputAsString = inputFromFile[0];
log(inputAsString);
log(`inputAsStringLength: ${inputAsString.length}`);
log(typeof(inputAsString));



let splittedInput = inputAsString.split(''); 
log(`splittedInput:`)
log(splittedInput);

// note to self:  splittedInputAsArray2 identical to splittedInputAsArray, so redundant. 
// let splittedInputAsArray2 = splittedInput.toString().split(',');
// log(splittedInputAsArray2); 


log(`typeof splittedInput: ${typeof(splittedInput)}`)
log(`splittedInput: `)
log( splittedInput )
let inputFromFileLength = (splittedInput.length)
log(`inputFromFileLength:${inputFromFileLength}`); // ok


let getNrOfCharactersBeforeFirstStartOfPacketMarketIsDetected = () => {
    let arrayWithFirstStartOfPacketMarkerAsString = [];
        for (let i = 0; i < inputAsString.length; i++) {
            if (splittedInput[i] != splittedInput[i+1] 
                && splittedInput[i] != splittedInput[i+2]
                && splittedInput[i] != splittedInput[i+3]
                && splittedInput[i+1] != splittedInput[i+2]
                && splittedInput[i+1] != splittedInput[i+3]
                && splittedInput[i+2] != splittedInput[i+3]
                /*
                    note-to-self:
                    I have spent 1.5 hour figuring  out the last 2 conditions.
                    lesson-learned: 'continue' on first iteration and the 'znrn' as output on  second iteration
                    (with testrun with testdata above) provided all the clues needed, but I failed to 
                    carefully analyse the data.
                */
                ) 
                {
                    log('foo')
                    log(i);
                    // log(splittedInput[i], splittedInput[i+1], splittedInput[i+2], splittedInput[i+3]);
                    arrayWithFirstStartOfPacketMarkerAsString.push(
                        splittedInput[i] + splittedInput[i+1] + splittedInput[i+2] + splittedInput[i+3]);
                    break;
                }
            // else {
            //     log('continue')
            //     arrayWithFirstStartOfPacketMarkerAsString = []
            // }
        }

    log(`FirstStartOfPacketMarkerAsString: `);
    log(arrayWithFirstStartOfPacketMarkerAsString[0]);

    const zeroBasedIndexOfFirstPositionOfMarker = inputAsString.indexOf(arrayWithFirstStartOfPacketMarkerAsString[0]);
    // log(`zeroBasedIndexOfFirstPositionOfMarker: ${zeroBasedIndexOfFirstPositionOfMarker}`);
    /*
        2 corrections needed:
            1. "+1". explanation: counting must start at position 1, instead of the default 0.
            2. "+3". explanation: marker is string of 4 letters. Intead of showing index of first letter, the index 
                of last letter must be shown. 
    */
    let nrOfCharactersBeforeFirstStartOfPacketMarketIsDetected = zeroBasedIndexOfFirstPositionOfMarker + 4
    // final answer:
    log(`nrOfCharactersBeforeFirstStartOfPacketMarketIsDetected: ${nrOfCharactersBeforeFirstStartOfPacketMarketIsDetected}`); // correct


    return nrOfCharactersBeforeFirstStartOfPacketMarketIsDetected;
}

let nrOfCharactersBeforeFirstStartOfPacketMarketIsDetected = getNrOfCharactersBeforeFirstStartOfPacketMarketIsDetected();
log(`final answer: nrOfCharactersBeforeFirstStartOfPacketMarketIsDetected: ${nrOfCharactersBeforeFirstStartOfPacketMarketIsDetected}`);





// const str = inputAsString;
// let count = 0;
// let position = str.indexOf("dfz");

// while (position !== -1) {
//   count++;
//   position = str.indexOf("df", position + 1);
// }

// console.log(count); // 