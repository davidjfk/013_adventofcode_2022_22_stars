 
/*
    first read: adventOfCode2022Day12_part1_try01.js comment at the top for the bigger picture and defininitions.
    
    step 8: implement depth-first search (DFS): solve problem:
    
    problem: the logic to check if current node value is not more than 1 bigger than previous node, is wrong.
    reason: the way dfs jumps through its nodes, when it tries out another branch !! 'Jumping' makes the heightOfCurrentNode value (e.g. 22) wrong. 
    
    solution: add a check that after a "jump" the new node already has status 'visited'.

    status: failed. I need better understanding of the DFS-algorithm itself, before I can proceed. 
    I put adventOfCode_Day12 on my backlog for now. 


    (a week later): idea to understand DFS-algorithm: make it visual how the algorithm traverses the gridHeightMap, as well as  the effect
    of my code changes. Also improve naming of variables. 
    status: in progress.

    status: correct result (31) for input2.txt, but not for input3.txt.


    To run a test, there are 3 config-steps in the file below (to switch from testing e.g. input2.txt to input3.txt).

    definitions:
    input.txt  === source file with adventOfCode data.
    input2.txt  === source file with example data that is explained in the adventofCode assgnment
    input3.txt  === source file with adventOfCode data, with modified start and end (see backlog 1 below).
   ( https://adventofcode.com/2022/day/12 )


    Use ctrl+f to quickly goto
    config 1of3
    config 2of3
    config 3of3


    backlog 1:
        start and end are capitals.

            Aabqponm
            abcryxxl
            accszZxk
            acctuvwj
            abdefghi

            A is start
            Z is end

            start and end cannot be capital. I have changed A to a, and Z to z in source code. 
            2do later: change the code so startletter can be a capital.
    backlog 2:
        word 'heightOfCurrentNode' is confusing. Change to 'letterFromInputFileAsANumber'.

*/
    

    
const log = console.log;

const {readFileSync} = require("fs");
const { toNamespacedPath } = require("path");

// config 1of3: select input fiile (input2.txt or input3.txt). 
const inputFromFile = readFileSync("input3.txt", "utf-8").split('\r\n');
//log('01_input-from-file: ')
// //log(inputFromFile)



// step: (as input for 1of2 and 2of2 below) convert array to array with subarrays:
// source: https://www.tutorialspoint.com/convert-array-into-array-of-subarrays-javascript 
const convertArraytoArrayWithSubArrays = arr => {
    const size = 1;
    const chunkedArray = [];
    for (let i = 0; i < arr.length; i++) {
       const last = chunkedArray[chunkedArray.length - 1];
       if(!last || last.length === size){
          chunkedArray.push([arr[i]]);
       }else{
          last.push(arr[i]);
       }
    };
    return chunkedArray;
};
let arrayAsArrayWithSubArrays = convertArraytoArrayWithSubArrays(inputFromFile);
// //log(arrayAsArrayWithSubArrays);
/*
    snippet of output:
      [
            'abccccccccaaaaacccccccccccccccccccccacaaaaaaccccccccccccccaaacccccccccccccccaccccaaacccccccccccacaaaa'   
        ],
        [
            'abcccccccccaaaaaaccccccccccccccccaaaaaaaaaaacccccccccccccccccccccccccccccccccccccccacccccccccccaaaaaa'   
        ],
        [
            'abcccccccaaaaaaaaccccccccccccccccaaaaaaaaaaaaacccccccccccccccccccccccccccccccccccccccccccccccccaaaaaa'   
        ]
    ]
*/


// 1of2:  try-out-step: try to convert FIRST row of arrow into desired output format (status: works)
    let gridRowWithLetterInEachCell = arrayAsArrayWithSubArrays[0].toString().split("")
    // //log(gridRowWithLetterInEachCell);
    /*
        code snippet of output:
        [
            'a', 'b', 'c', 'c', 'c', 'c', 'c', 'c', 'c', 'c', 'c', 'c',
            'c', 'c', 'c', 'c', 'c', 'c', 'c', 'c', 'c', 'c', 'c', 'c',
            'c', 'c', 'c', 'c', 'c', 'c', 'c', 'c', 'c', 'a', 'a', 'a' (and more)
        ]
    */
        log(`gridHeightMap: in each cell: height (only): `);
    let gridHeightMapWithInEachCellOnlyHeight = gridRowWithLetterInEachCell
        .map((fromLetterToNumber) => fromLetterToNumber.charCodeAt(0) - 97) // to handle capitals add 57 (not required here)
        .map((number) => {return { height: number }})
    // //log(gridHeightMapWithInEachCellOnlyHeight);
    /*
        snippet of correct output:
        [
        { height: 0 }, { height: 1 }, { height: 2 }, { height: 2 }, { height: 2 },
        { height: 2 }, { height: 2 }, { height: 2 }, { height: 2 }, { height: 2 },
        { height: 2 }, { height: 2 }, { height: 2 }, { height: 2 }, { height: 2 },
        ]
    */



// now try to convert all rows in one go.
    let gridHeightMap = arrayAsArrayWithSubArrays.map((subArray, indexRow) => {
        return subArray
        .toString().split("")
        .map((fromLetterToNumber) => fromLetterToNumber.charCodeAt(0) - 97) 
        .map((number, indexCol) => {return { height: parseInt(number), indexRow: indexRow, IndexCol: indexCol }}) // do not change heightOfCurrentNode.
    })
    //log(`gridHeightMap: `)
    // console.table(gridHeightMap); // shows helpful info with up to 2 object properties in each cell. With more than 2 you just see:
    /*
        │ [Object] │ [Object] │ [Object] │
    */
    // log(`1 gridcell looks like this: `);
    // log(gridHeightMap[0][0]); //output: { height: 0, indexRow: 0, IndexCol: 0 }

    // log(`nr of gridrows:`);
    // log(gridHeightMap.length)
    // log(`nr of gridcols:`);
    // log(gridHeightMap[0].length);


// config 2of3:

// belongs to input2.txt (count starting at 0 !!)
// let xCoordinateOfStart = 0;
// let yCoordinateOfStart = 0;
// let xCoordinateOfDestination = 2;
// let yCoordinateOfDestination = 5;

// belongs to input3.txt  (count starting at 0 !!)
let xCoordinateOfStart = 20;
let yCoordinateOfStart = 0;
let xCoordinateOfDestination = 20;
let yCoordinateOfDestination = 77;


/* Driver Code (bigger alternatives: (see previous) input2.txt and input3.txt)
   if you use Driver Code,  then:
   a)  it does not matter what you select at config 1of3.
   b)  comment out previous variable gridHeightMap.
*/
// var gridHeightMap = 
// [ 
//     [ -1, 2, 3 ],
//     [ 0, 9, 8 ],
//     [ 1, 0, 1 ] 

// ];
 
// config 3of3:
// belongs to driver code gridHeightMap: // (count starting at 1 !!)
// var ROW = 3; 
// var COL = 3; 

// belongs to input2.txt: // (count starting at 1 !!)
var ROW = 5; 
var COL = 8; 

// belongs to input3.txt: // (count starting at 1 !!)
var ROW = 41; 
var COL = 101; 



/*
    optimize direction vectors:
    source: https://medium.com/@ojhasaurabh2099/traversing-a-grid-using-dfs-ac7a391f7af8
*/
// direction vectors (on input2.txt correct answer 31 as output)
// Sequence in which neighbor is sought: first look up, then right, then down, then left: (with correct answer on input2.txt)
var dRow = [0, 1, 0, -1]; //source version
var dCol = [ -1, 0, 1, 0]; ////source version


// Sequence in which neighbor is sought: first look up, then right, then left, then down: (with correct answer on input2.txt)
//  dRow = [0, 1, -1, 0]; //source version
//  dCol = [ -1, 0, 0, 1]; ////source version


/*
    from observation of data: if neighbor-node is too high (or not), does not interrupt (e.g. reset)
    this sequence. The sequence keeps going until the destination cell has been reached.
*/

// (same goal), but with: first look right, then down, then left, then up. (on input2.txt wrong answer 39 as output)
// dRow = [ 1, 0, -1, 0];
// dCol = [ 0, 1, 0, -1]

// (same goal), but with: first look down, then left, then up, then right. (on input2.txt wrong answer 39 as output)
// dRow = [ 0, -1, 0, 1];
// dCol = [ 1, 0, -1, 0];

// (same goal), but with: first look left, then up, then right, then down. (on input2.txt correct answer 31 as output)
// dRow = [ -1, 0, 1, 0];
// dCol = [ 0, -1, 0, 1];


// immitate the flow of the example data from https://adventofcode.com/2022/day/12 
// (same goal), but with: first look down, then right, then left, then up. (on input2.txt wrong answer 39 as output)
// dRow = [ 0, 1, -1, 0];
// dCol = [ 1, 0, 0, -1];

// immitate the flow of the example data from https://adventofcode.com/2022/day/12 
// (same goal), but with: first look down, then right, then up, then left. (on input2.txt wrong answer 39 as output)
// dRow = [ 0, 1, 0, -1];
// dCol = [ 1, 0, -1, 0];


// (same goal), but with: first look down, then right, then up, then left. (on input2.txt wrong answer 39 as output)
// dRow = [ 1, 0, 0, -1];
// dCol = [ 0, 1, -1, 0];


let heightOfCurrentNode = 0;  // 2do: make this an object property. 

/*
    Function to check if cell with coordinates [row][col]
    is unvisited and lies within the
    boundary of the given matrix
*/
function isValid(gridWithForEachGridCellAHasVisitedBoolean, row, col)
{
    // If cell (in gridHeightMap) is out of bounds:
    if (row < 0 || col < 0
        || row >= ROW || col >= COL)
        return false;
 
    // If cell (in gridHeightMap) has already been visited: 
    if (gridWithForEachGridCellAHasVisitedBoolean[row][col]){
        // heightOfCurrentNode = gridHeightMap[row][col].height;
        return false;
    }

    //
    if (gridWithForEachGridCellAHasVisitedBoolean[row][col] == false ){ // if true, then dfs has jumped to a node ("branch") lower on the path ("tree").
        // log(typeof(gridHeightMap[row][col].height))
        // log(typeof(heightOfCurrentNode))
        if ((gridHeightMap[row][col].height - heightOfCurrentNode) > 1){
            // neighbor node === neighbor of current node --> but the latter looks messy in the console.log.
            log(`neighbor node: letter: ${String.fromCharCode(gridHeightMap[row][col].height +97)}, row: ${row}, col: ${col} `);
            log(`neighbor-node is too high: ${gridHeightMap[row][col].height}. So delta is: ${gridHeightMap[row][col].height - heightOfCurrentNode}`);
            log(`end: `);
            log(`----------------------------------------------------------------------------------------------`)
            return false;
        }
    }
    /*

        bug in:    
        
        "if ((gridHeightMap[row][col].height - heightOfCurrentNode) > 1){ ...}   ":
        in:
        if (gridWithForEachGridCellAHasVisitedBoolean[row][col] == false ){ // if true, then dfs has jumped to a node ("branch") lower on the path ("tree").
            if ((gridHeightMap[row][col].height - heightOfCurrentNode) > 1)
                return false;
            }
        }
        
        problem: if curent cell and neighbor cell have same height (e.g.) c, then result is false. So you cannot go from current cell to 
        neighbor cell. This is wrong.
        Because of the structure of the testdata in the grid AND the direction vectors (i.e. first look up, then  right, then 
        down, then left), you will still reach your destination in 31 steps (inspite of this bug). 

        solution: 

    */




    // if ((gridHeightMap[row][col].height - heightOfCurrentNode) < -1){
    //     return false;
    // }    

    // Otherwise, it can be visited
    
    return true;
}
 
let nrOfEdgesFromCellStartToCellDestination = [];

// Function to perform DFS
// Traversal on the gridHeightMap:
function DFS(row, col, gridHeightMap, gridWithForEachGridCellAHasVisitedBoolean)
{
    // Initialize a stack of pairs and
    // push the starting cell into it
    var stack = [];
    
    let poppedCell
    stack.push([ row, col ]);
 
    // Iterate until the
    // stack is not empty
    while (stack.length!=0) {
        // Pop the top pair
        var currentNode = stack[stack.length-1];

        // poppedCell = stack.pop();
        stack.pop();

        var row = currentNode[0];
        var col = currentNode[1];
   
        // valid === cell is inside the gridHeightMap AND has not yet been visited. 
        if (!isValid(gridWithForEachGridCellAHasVisitedBoolean, row, col)){
            continue;
        }

        // log(`popped <read: gridHeightMap cell from previous iteration: ${poppedCell}`)
        // log(poppedCell)
        // heightOfCurrentNode = poppedCell.height; 
        
        // if ((gridHeightMap[row][col].height - heightOfCurrentNode > 1 &&  gridWithForEachGridCellAHasVisitedBoolean[row][col])){
        //     //log(`nr difference is too big:`)
        //     continue;
        // }
        
        // Mark the current cell as visited:
        gridWithForEachGridCellAHasVisitedBoolean[row][col] = true;
 
        // not sure if this is in the right place: 
        heightOfCurrentNode = gridHeightMap[row][col].height; // format: e.g. 22 (type is number)
        // log(heightOfCurrentNode); 
        // log(typeof(heightOfCurrentNode)) //output: number (ok)


        /* 
            Print 'cell' that will be added to to final path as a stack: 
        */
        // console.//log( gridHeightMap[row][col] + " "); // node prints this as [object Object].

        //log( gridHeightMap[row][col]); // format: e.g. { height: 22, heightOfCurrentNode: 22 }
        nrOfEdgesFromCellStartToCellDestination.push(gridHeightMap[row][col])
        log(`-----------------------------------------------------------------------------------------`);
        log(`start: `)
        log(`current node: letter: ${String.fromCharCode(gridHeightMap[row][col].height +97)}, row: ${row}, col: ${col} `);
        log(`current node: heightOfCurrentNode: ${gridHeightMap[row][col].height}`);
        log(`current node: height: ${gridHeightMap[row][col].height}`);
        
        // log(gridHeightMap[row][col]);

 
        // Push all the adjacent cells
        for (var i = 0; i < 4; i++) {
            var adjx = row + dRow[i];
            var adjy = col + dCol[i];
            stack.push([ adjx, adjy ]);
        }

        // this is my destination in gridHeightMap below.
        if (row == xCoordinateOfDestination && col == yCoordinateOfDestination) {

            return;
        }
    }
}
 
// Stores whether the current
// cell is visited or not
var gridWithForEachGridCellAHasVisitedBoolean = Array.from(Array(ROW), ()=> Array(COL).fill(false));
// log(gridWithForEachGridCellAHasVisitedBoolean)

/*
    array gridWithForEachGridCellAHasVisitedBoolean looks like this: (each nested array is a row)
    [
  [
    false, false,
    false, false,
    false, false,
    false, false
  ],
  [
    false, false,
    false, false,
    false, false,
    false, false
  ],
  [
    false, false,
    false, false,
    false, false,
    false, false
  ],
  [
    false, false,
    false, false,
    false, false,
    false, false
  ],
  [
    false, false,
    false, false,
    false, false,
    false, false
  ]
]


*/



// fn call: (main fn):
DFS(xCoordinateOfStart, yCoordinateOfStart, gridHeightMap, gridWithForEachGridCellAHasVisitedBoolean);

// code above counts vertices, but adventofCode assignment counts nodes. 
// (in general) nodesNr - verticesNr = 1. So imlement with '-1' on following line of code: 
log(`nrOfEdgesFromCellStartToCellDestination: ${nrOfEdgesFromCellStartToCellDestination.length -1}`);
/*
177 is wrong.   
1765
2573 is too high
*/

