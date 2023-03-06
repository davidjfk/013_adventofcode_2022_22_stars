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
// let inputFromFileTestData = ['mjqjpqmgbljsphdztnvjfqwrcgsmlb']; //answer: 19
// let inputFromFileTestData = ['bvwbjplbgvbhsrlpgdmjqwftvncz']; //answer: 23
// let inputFromFileTestData = ['nppdvjthqldpwncqszvftbrmjlhg']; //answer: 23
// let inputFromFileTestData = ['nznrnfrfntjfmvfwmzdfjlvtqnbhcprsg']; // answer: 29
// let inputFromFileTestData = ['zcfzfwzzqfrljwzlrfnpqdbhtmscgvjw']; // answer: 26

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
    
    let arrayWithMessageMarker = [];
    let arrayWithIndexPositionOfLetterThatWasLastAddedToMessageMarker = [];
        for (let i = 0; i < splittedInput.length; i++) {
            if ((arrayWithMessageMarker.length == 14) ) {
                log('-----------------------')
                log('14 different letters found:')
                log(arrayWithMessageMarker)
                break;
            } else if (
                arrayWithMessageMarker.length == 0 
            ) {
                log('----------------')
                log('0 found: add first one. start: ');
                arrayWithMessageMarker.push(splittedInput[i]);

                // create the data in order to handle condition 2 above:
                arrayWithIndexPositionOfLetterThatWasLastAddedToMessageMarker.pop();
                arrayWithIndexPositionOfLetterThatWasLastAddedToMessageMarker.push(i);
                log('first one: position of letter in index:');
                log(arrayWithIndexPositionOfLetterThatWasLastAddedToMessageMarker[0])
                log('first one: message marker total:')
                log(arrayWithMessageMarker);
            } else if 
             (
                /*
                    Two conditions:
                    1. each letter in array must be unique.
                    2. the 'next' unique letter must be 1 index bigger than the previous unique letter.

                */
                // condition 1: each letter in array must be unique.
                !(arrayWithMessageMarker.includes(splittedInput[i])) 
                
                  &&
                 // condition 2 and 3: the 'next' unique letter must be 1 index bigger than the previous unique letter,
                 // if there is at least one letter inside array Message Marker.
               
                arrayWithMessageMarker[arrayWithIndexPositionOfLetterThatWasLastAddedToMessageMarker[0]] === arrayWithMessageMarker[i -1]  
                // && 
                // arrayWithMessageMarker.length != 0  
                // && 
                // arrayWithMessageMarker.length < 14 
                ) 
                {
                    log('----------------')
                    log('add another one. start: ')
                    log(i);
                    log(splittedInput[i])
                    log(typeof(i))

                    arrayWithMessageMarker.push(splittedInput[i]);
                    log('another: message marker total:')
                    log(arrayWithMessageMarker);
                    // create the data in order to handle condition 2 above:
                    arrayWithIndexPositionOfLetterThatWasLastAddedToMessageMarker.pop();
                    arrayWithIndexPositionOfLetterThatWasLastAddedToMessageMarker.push(i);
                    log('another one: position of letter in index:');
                    log(arrayWithIndexPositionOfLetterThatWasLastAddedToMessageMarker[0])

              

                } else {
                log('----------------')
                log('same letter found. start:')
                // arrayWithMessageMarker.shift(); // remove first element  from array. 
                /*
                    problem: when you discover a double, then the first item (e.g. 'b') can already be
                    on the (e.g.) second index.
                    ex: ['a', 'b', 'c', 'f', 'b']
                    QED: shift() will remove 'a', but that is wrong, because here 'a' and 'b' must be removed.
                */
                let firstOccurrenceOfletterThatMustBeDeleted = arrayWithMessageMarker.indexOf(splittedInput[i]);
                log(`firstOccurrenceOfletterThatMustBeDeleted: ${firstOccurrenceOfletterThatMustBeDeleted}`)

                arrayWithMessageMarker.splice(0, firstOccurrenceOfletterThatMustBeDeleted + 1 )

                arrayWithMessageMarker.push(splittedInput[i]);
                arrayWithIndexPositionOfLetterThatWasLastAddedToMessageMarker.pop();
                arrayWithIndexPositionOfLetterThatWasLastAddedToMessageMarker.push(i);
                
                log('----------------')
                log('same letter found: message marker total:')
                log(arrayWithMessageMarker);
            }
        }


    log(`FirstStartOfPacketMarkerAsString: `);
    log(arrayWithMessageMarker);
    log(arrayWithMessageMarker.join(''))

    const zeroBasedIndexOfFirstPositionOfMarker = inputAsString.indexOf(arrayWithMessageMarker.join(''));
    log(`zeroBasedIndexOfFirstPositionOfMarker: ${zeroBasedIndexOfFirstPositionOfMarker}`);
    /*
        2 corrections needed:
            1. "+1". explanation: counting must start at position 1, instead of the default 0.
            2. "+14". explanation: marker is string of 4 letters. Intead of showing index of first letter, the index 
                of last letter must be shown.
    */
    let nrOfCharactersBeforeFirstStartOfPacketMarketIsDetected = zeroBasedIndexOfFirstPositionOfMarker + 14
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