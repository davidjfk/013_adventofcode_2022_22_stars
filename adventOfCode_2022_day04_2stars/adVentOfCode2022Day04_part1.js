// import input.txt from "./input"


const log = console.log;

const {readFileSync} = require("fs");


const input = readFileSync("input.txt", "utf-8").split('\r\n');
log('01_input-from-file: ')
// log(input)






let splitAssignmentPairs = (input) => {

    let arrayWithEachSplittedAssignmentPairsInSubArray = [];
    arrayWithEachSplittedAssignmentPairsInSubArray = input.map((assignmentParisAsOne) => {
        let result = assignmentParisAsOne.split(",");
        // log(result)
        return result;
        
    });
    return arrayWithEachSplittedAssignmentPairsInSubArray;
}

log('02_arrayWithEachSplittedAssignmentPairsInSubArray: ')
let arrayWithEachSplittedAssignmentPairsInSubArray = splitAssignmentPairs(input);
// log(arrayWithEachSplittedAssignmentPairsInSubArray);






  log('03_convertShorthandRangesIntoNumericRanges: ')
  function range(start, end) {
      let startAsInt = parseInt(start)
      let endAsInt = parseInt(end)
      let ans = [];
      if (startAsInt === endAsInt){
          ans.push(startAsInt);
      } else {
          for (let i = startAsInt; i <= endAsInt; i++) {
              ans.push(i);
          }
      }
      return ans;
  }

let convertShorthandRangesIntoNumericRanges = (input) => {
    //shorthand range e.g.  3-6
    //numeric range e.g. 3,4,5,6
    // added value: js cannot handle shorthand range notation.

    /*sample of argument input:   
        let input = [
            [ '14-28', '13-28' ], [ '72-81', '82-91' ], [ '4-4', '6-95' ],
            [ '47-49', '48-59' ], [ '26-36', '37-76' ], [ '2-99', '98-99' ]

        ];
    */

    // so each array-element has two values: A and B.

    // if time left/permits, improve readability.

    // log(input)
    let arrayWith2SubArraysThatContainNumericRanges = [];

    arrayWith2SubArraysThatContainNumericRanges = input.map((assignmentPairAsArray) => {
        // log((assignmentPairAsArray[0]))
        let firstAndLastNrOfRange1of2 = assignmentPairAsArray[0].split("-"); // [0] points to A.
        // log(firstAndLastNrOfRange1of2)
        let numericRange1of2 = range(firstAndLastNrOfRange1of2[0], firstAndLastNrOfRange1of2[1]) 
        // log(numericRange1of2);

        let firstAndLastNrOfRange2of2 = assignmentPairAsArray[1].split("-"); // [1] points to B.
        // log(firstAndLastNrOfRange2of2)
        let numericRange2of2 = range(firstAndLastNrOfRange2of2[0], firstAndLastNrOfRange2of2[1]) 
        // log(numericRange2of2);

        return [numericRange1of2, numericRange2of2]
    })
    return arrayWith2SubArraysThatContainNumericRanges;

    /*

    sample of output:
    (...)
    [
        [
        66, 67, 68, 69, 70, 71,
        72,   73, 74, 75, 76, 77,
        78,   79, 80, 81, 82, 83,
        84,   85
        ],
        [
        66, 67, 68, 69, 70, 71,
        72,   73, 74, 75, 76, 77,
        78,   79, 80, 81, 82, 83,
        84,   85, 86
        ]
    ],
    [
        [
        64, 65, 66, 67, 68, 69, 70,
        71,   72, 73, 74, 75, 76, 77,
        78,   79, 80, 81, 82, 83, 84,
        85,   86, 87, 88, 89, 90, 91,
        92,   93, 94, 95, 96
        ],
        [ 63 ]
    ],
  ... 900 more items
    */
}
log('03_convertShorthandRangesIntoNumericRanges: ')
let arrayWith2SubArraysThatContainNumericRanges = convertShorthandRangesIntoNumericRanges(arrayWithEachSplittedAssignmentPairsInSubArray);
log(arrayWith2SubArraysThatContainNumericRanges);











log('04_checkIfArray1ContainsArray2OrViceVersa: ')
let checkIfArray1ContainsArray2OrViceVersa = (outputOfFnConvertShorthandRangesIntoNumericRanges) => {
    // source: https://bobbyhadz.com/blog/javascript-check-if-array-contains-all-elements-another-array#:~:text=To%20check%20if%20an%20array,contained%20in%20the%20second%20array.
    /*
    def:     arrayWithNumericRange1of2 = A
              arrayWithNumericRange2of2 = B
    goal: check if every element of A is in B OR every element of B is in A.
    */
    // log(outputOfFnConvertShorthandRangesIntoNumericRanges);
    let counterEveryElementOfAinBorEveryElementOfBInA = 0;

    counterEveryElementOfAinBorEveryElementOfBInA = outputOfFnConvertShorthandRangesIntoNumericRanges.map((arrayWith2SubArraysThatContainNumericRanges) => {
        // def: arrayElement === arrayWith2SubArraysThatContainNumericRanges
        [arrayWithNumericRange1of2, arrayWithNumericRange2of2] = arrayWith2SubArraysThatContainNumericRanges;
        // log(arrayWithNumericRange1of2);
        // log(arrayWith2SubArraysThatContainNumericRanges)

        if ((
            arrayWithNumericRange1of2.every(element => {
              return  arrayWithNumericRange2of2.includes(element);
            }) 
            || // analysis: the effect of this OR is a XOR (quirk of javascript?? not sure why)
            arrayWithNumericRange2of2.every(element => {
               return arrayWithNumericRange1of2.includes(element);    
            })
            // an: with code until or-statement: result: 278. But if both arrays are empty, then these must be included (27 in total). So answer = 278 + 27 = 305  (correct answer)
            // 2 figure out later: why is answer below: 293??? 
        )         
    )   
        {
            return 1; // yeah, Array1 Contains entire Array2 Or ViceVersa 
        } else {
            return 0;
        }

    })
    return counterEveryElementOfAinBorEveryElementOfBInA;
}

let counterEveryElementOfAinBorEveryElementOfBInA = checkIfArray1ContainsArray2OrViceVersa(arrayWith2SubArraysThatContainNumericRanges);
// log(counterEveryElementOfAinBorEveryElementOfBInA);



log('05_sum of all numbers: ')
const sum = counterEveryElementOfAinBorEveryElementOfBInA.reduce(((a, b) => a + b),0);
console.log(sum);