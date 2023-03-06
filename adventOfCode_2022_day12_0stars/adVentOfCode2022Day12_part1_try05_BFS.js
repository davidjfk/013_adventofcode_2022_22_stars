/*  
    first read: adventOfCode2022Day12_part1_try01.js comment at the top for the bigger picture and defininitions.
    

    step 5: problem to solve: prevState can get value 'visited' instead of numerical value.
            This is big problem, because now the BFS-algoritm does not check if: value current cell - previous cell <= 1 .

            proposed solution: put prevState inside each obj (each value in the matrix is an object) as a property.
            e.g. 
                /*
        snippet of desired output:
        [{ state: 1, prevState: 0 }, { state: 1, prevState: 0 }, (...) ]
        
        instead of the former:
        [{ state: 1 }, { state: 1 }, (...)]

        basic idea: value visited cannot pollute property-value 'prevState' if property 'state' and 'prevState'
        are completely separate. 

        status problem solved. 

    step 6: new problem: code works good with data from input2.txt, but not with input3.txt.
        analysis: assumption: performance issue, because dataset of  input3.txt > input2.txt (adventofcode day 10 
            provided a performance issue  to solve).
            Then (after 2 hours...) I realize that climbing down the mountain would also require using climbing gear if
            elevation of new location (e.g. 'n') would more than 1 letter lower than previous location (e.g. 'p').
            So based on logic reasoning, not just 'at most one higher', but also 'at most one lower'.
            2do (in next file): test this hypothesis.



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
        word 'prevState' is confusing. Change to 'letterFromInputFileAsANumber'.
    
  */
    
const log = console.log;

const {readFileSync} = require("fs");
const { toNamespacedPath } = require("path");


const inputFromFile = readFileSync("input2.txt", "utf-8").split('\r\n');
log('01_input-from-file: ')
// log(inputFromFile)
log('here:')
// let inputAsArrayWithArrays = inputFromFile[10].split(',');
// log(inputAsArrayWithArrays);


// convert array to array with subarrays:
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
// log(arrayAsArrayWithSubArrays);
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
    // log(gridRowWithLetterInEachCell);
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
        .map((number) => {return { state: number }})
        log(gridHeightMapWithInEachCellOnlyHeight);
    /*
        snippet of correct output:
        [
        { state: 0 }, { state: 1 }, { state: 2 }, { state: 2 }, { state: 2 },
        { state: 2 }, { state: 2 }, { state: 2 }, { state: 2 }, { state: 2 },
        { state: 2 }, { state: 2 }, { state: 2 }, { state: 2 }, { state: 2 },
        ]
    */




// now try to convert all rows in one go.
    let grid = arrayAsArrayWithSubArrays.map((subArray) => {
        return subArray
        .toString().split("")
        .map((fromLetterToNumber) => fromLetterToNumber.charCodeAt(0) - 97) 
        .map((number) => {return { state: number, prevState: number }}) // do not change prevState.
    })
    // console.table(grid);

    // log(`1 gridcell looks like this: `);
    // log(gridHeightMap[0][0]); //output: { height: 0, indexRow: 0, IndexCol: 0 }

    // log(`nr of gridrows:`);
    // log(gridHeightMap.length)
    // log(`nr of gridcols:`);
    // log(gridHeightMap[0].length);


    /*
        sample of output:

    [
        [
            (more data)
        { state: 2 }, { state: 2 }, { state: 2 }, { state: 0 }, { state: 2 },
        { state: 2 }, { state: 2 }, { state: 2 }, { state: 2 }, { state: 2 },
        { state: 2 }, { state: 2 }, { state: 2 }, { state: 2 }, { state: 2 },
        { state: 0 }, { state: 0 }, { state: 0 }, { state: 0 }, { state: 0 },
        ... 1 more item
    ],
    [
        { state: 0 }, { state: 1 }, { state: 2 }, { state: 2 }, { state: 2 },
        { state: 2 }, { state: 2 }, { state: 2 }, { state: 2 }, { state: 0 },
        { state: 0 }, { state: 0 }, { state: 0 }, { state: 0 }, { state: 0 },
        { state: 0 }, { state: 0 }, { state: 2 }, { state: 2 }, { state: 2 },
        { state: 2 }, { state: 2 }, { state: 2 }, { state: 2 }, { state: 2 },
        { state: 2 }, { state: 2 }, { state: 2 }, { state: 2 }, { state: 2 },
        { state: 2 }, { state: 2 }, { state: 2 }, { state: 0 }, { state: 0 },
        { state: 0 }, { state: 0 }, { state: 0 }, { state: 0 }, { state: 0 },
        { state: 0 }, { state: 0 }, { state: 0 }, { state: 0 }, { state: 0 },
        { state: 0 }, { state: 2 }, { state: 2 }, { state: 2 }, { state: 2 },
        { state: 2 }, { state: 2 }, { state: 2 }, { state: 2 }, { state: 2 },
        { state: 2 }, { state: 2 }, { state: 2 }, { state: 2 }, { state: 2 },
        { state: 2 }, { state: 2 }, { state: 2 }, { state: 2 }, { state: 2 },
        { state: 2 }, { state: 2 }, { state: 2 }, { state: 2 }, { state: 2 },
        { state: 2 }, { state: 2 }, { state: 2 }, { state: 2 }, { state: 2 },
        { state: 2 }, { state: 2 }, { state: 2 }, { state: 2 }, { state: 2 },
        { state: 2 }, { state: 2 }, { state: 2 }, { state: 2 }, { state: 2 },
        { state: 2 }, { state: 2 }, { state: 2 }, { state: 2 }, { state: 2 },
        { state: 2 }, { state: 2 }, { state: 2 }, { state: 2 }, { state: 2 },
        { state: 0 }, { state: 0 }, { state: 0 }, { state: 0 }, { state: 0 },
        ... 1 more item
    ]
    ]

    */

/*
   2of2: run code with adventOfCode data. advenOfCodeFile is input3.txt. Set this correctly at the fn readFileSync at top of file
*/

// let grid = [
//   [{ state: 1 }, { state: 9 }, { state: 1 }, { state: 1   }, { state: 1 }],
//   [{ state: 1 }, { state: 9 }, { state: 1 }, { state: 9 }, { state: 1 }],
//   [{ state: 1 }, { state: 9 }, { state: 1 }, { state: 9 }, { state: 1 }],
//   [{ state: 1 }, { state: 1   }, { state: 2 }, { state: 3   }, { state: 1 }],
//   [{ state: 1 }, { state: 9 }, { state: 1 }, { state: 3   }, { state: 1 }],
//   [{ state: 1 }, { state: 9 }, { state: 1 }, { state: 9 }, { state: 'goal' }], // instead of 'goal' you can fill  out anything here.
// ];

// values belonging to commented out grid (right above this comment)
// let start = [0, 0];
// let end = [5, 4]; // vertical, horizontal. pitfall: zero-based index.

// values belonging to file input.txt
// use input3.txt instead. Reason: see backlog issue at top of file. 

// values belonging to file input2.txt
let start = [0, 0];
let end = [2, 5]; // vertical, horizontal. pitfall: zero-based index.

// values belonging to file input3.txt
// let start = [20, 0];
// let end = [20, 77]; // vertical, horizontal. pitfall: zero-based index.




let row = grid.length;
let col = grid[0].length;
let prevState; // comment below explains why you need variable prevState. 

// 1of4: fn to judge if a cell is safe or not
const safeNeighbor = function (r, c) {
  if (r < 0 || r >= row) return false;
  if (c < 0 || c >= col) return false;
  /*
  adventOfCode: 2do: update following condition to implement 
  requirement: neigbor cell can be at most 1 nr bigger or less than current cell. 
   update in such a way that same code can be used to check
   left, right, top and bottom.    
  */
//   if (grid[r][c].state == 9) return false; 
    let value2 = grid[r][c].prevState;
    log(`prevState: ${prevState}`);

    if (typeof(prevState) == 'visited'){  // value is 'visited'
        // do nothing...problem: I cannot check difference in value between current and previous cell. 
        log('not working yet')
    } else if (value2 - prevState > 1)  {
        return false
    }
  return true;
};

// 2of4: fn to identify neighbors of current location
const exploreLocation = function (location) {
  let r = location.r;
  let c = location.c;
  let allNeighbors = [];
  
  //left
  if (safeNeighbor(r, c - 1)) {
    allNeighbors.push({ r: r, c: c - 1 });
  };

  //right
  if (safeNeighbor(r, c + 1)) {
    allNeighbors.push({ r: r, c: c + 1 });
  };

  //top
  if (safeNeighbor(r - 1, c)) {
    allNeighbors.push({ r: r - 1, c: c });
  };

  //bottom
  if (safeNeighbor(r + 1, c)) {
  allNeighbors.push({ r: r + 1, c: c });
  }

  return allNeighbors;
};

// 3of4: find path between two cells
// config: hardcode start position in the grid. pitfall: in adventOfCode start position is not in upper left corner.
const findPath = function () {
  let location = {
    r: start[0],
    c: start[1],
  };
  let queue = [];
  // start in upper-left: corner:
  queue.push(location);
  // length becomes 0 (so while loop ends) only when destination is reached.
  // imho: if you cannot reach the destination with given data, then you end up in infinite loop (so room for improvement here) 
  while (queue.length) {
    var currentLocation = queue.shift(); // shift() method removes first array element in place and returns that removed element. 
    if (currentLocation.r == end[0] && currentLocation.c == end[1])
      return currentLocation;

    /* you need previous state to check the height difference:
        e.g. prevState = 3 and (new) state= 4. 4-3==1. Allowed to step  into cell with new state 4.
        e.g. prevState = 3 and (new) state= 5. 5-3==2. NOT allowed to step  into cell with new state 4. Try other cell instead!
        e.g. prevState = 3 and (new) state= 1. 1-3==-2, so you are allowed to step  into cell with new state 4. (see requirements
        of assignment)
    */
    prevState = grid[currentLocation.r][currentLocation.c].prevState; // value (expRes), or: 'visited'. problem: 'visited' is problem.

    grid[currentLocation.r][currentLocation.c].state = 'visited';
    

    // you only get neighbors that meet the criteria of fn exploreLocation. 
    let neighbors = exploreLocation(currentLocation);
    let neighbor;
    for(neighbor of neighbors)
    {
       // don't re-visit an intersection of row and column (i.e. the 'same cell')  
      if(grid[neighbor.r][neighbor.c].state != "visited")
      {
        queue.push(neighbor);
        grid[neighbor.r][neighbor.c]["parent"]=currentLocation;
      }
    }
   }
  return false;
};

// 4of4: Code to traverse, and print path of route
const printPath = function(path){
 let paths = [path];
 
 while(true){
   let r = path.r;
   let c = path.c;
   let parent = grid[r][c].parent;
   if(parent == undefined)
     break;
   paths.push(parent);
   path = {r:parent.r,c:parent.c};
 }
 /*
    problem: adventOfCode assignment counts nr of vertices, but code above counts
    nr of nodes, so off-by-one error.
    solution: paths.length -1 (instead of just paths.length)
 */
 log(`answer to adventOfCode Day 12, part 1: ${paths.length - 1}`);
 log(`path from start to end: `);
 log(paths.reverse());
 log(`answer to adventOfCode Day 12, part 1: ${paths.length - 1}`);
}

let path = findPath()
printPath(path);
// log(grid)