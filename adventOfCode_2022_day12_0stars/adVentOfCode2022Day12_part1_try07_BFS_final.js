/*  
    first read: adventOfCode2022Day12_part1_try01.js comment at the top for the bigger picture and defininitions.
    
        Use ctrl+f to quickly goto:
            config_1of2: choose file (e.g. input2.txt);
            config_2of2: choose start and destination coordinates (that fit the selected gridHeightMap at config_1of3)
        

    data:
        input2.txt is example data from: https://adventofcode.com/2022/day/12
        input3.txt is data to win an adventOfCode-start from: https://adventofcode.com/2022/day/12
    
    status: correct result (31) for input2.txt, but not for input3.txt
    goal: make code work for input3.txt . First make code more readable by improving variable names and adding comments.
    status: in progress. I put this one on my backlog.  (date: 220110). I lack a theoretic foundation. so I need to study algorithms and datastructures first. 

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
        word 'prevHeight' is confusing. Change to 'letterFromInputFileAsANumber'.
    
  */
    
const log = console.log;

const {readFileSync} = require("fs");
const { toNamespacedPath } = require("path");

// config_1of2: choose file (e.g. input2.txt);
    const inputFromFile = readFileSync("input2.txt", "utf-8").split('\r\n');
    // log('01_input-from-file: ')
    // log(inputFromFile)
    // let inputAsArrayWithArrays = inputFromFile[10].split(',');
    // log(inputAsArrayWithArrays);


// config_2of2: choose start and destination coordinates (that fit the selected gridHeightMap at config_1of3)
    // values belonging to commented out gridHeightMap (right above this comment) (for this gridHeightMap, configf_1of2 is irrelevant).
    // let start = [0, 0];
    // let end = [5, 4]; // vertical, horizontal. pitfall: zero-based index.

    // values belonging to file input.txt
    // use input3.txt instead. Reason: see backlog issue at top of file. 

    // values belonging to file input2.txt
    let start = [0, 0];
    let end = [2, 5]; // vertical, horizontal. pitfall: zero-based index.

    // values belonging to file input3.txt
    // let start = [20,0];
    // let end = [ 20, 77]; // vertical, horizontal. pitfall: zero-based index.


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
        .map((number) => {return { height: number }})
    // log(gridHeightMapWithInEachCellOnlyHeight);
    /*
        snippet of correct output:
        [
        { height: 0 }, { height: 1 }, { height: 2 }, { height: 2 }, { height: 2 },
        { height: 2 }, { height: 2 }, { height: 2 }, { height: 2 }, { height: 2 },
        { height: 2 }, { height: 2 }, { height: 2 }, { height: 2 }, { height: 2 },
        ]
    */




// now try to convert all rows in one go.
    let gridHeightMap = arrayAsArrayWithSubArrays.map((subArray) => {
        return subArray
        .toString().split("")
        .map((fromLetterToNumber) => fromLetterToNumber.charCodeAt(0) - 97) 
        .map((number) => {return { height: number, prevHeight: number }}) // do not change prevHeight.
    })
    console.table(gridHeightMap);
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
        { height: 2 }, { height: 2 }, { height: 2 }, { height: 0 }, { height: 2 },
        { height: 2 }, { height: 2 }, { height: 2 }, { height: 2 }, { height: 2 },
        { height: 2 }, { height: 2 }, { height: 2 }, { height: 2 }, { height: 2 },
        { height: 0 }, { height: 0 }, { height: 0 }, { height: 0 }, { height: 0 },
        ... 1 more item
    ],
    [
        { height: 0 }, { height: 1 }, { height: 2 }, { height: 2 }, { height: 2 },
        { height: 2 }, { height: 2 }, { height: 2 }, { height: 2 }, { height: 0 },
        { height: 0 }, { height: 0 }, { height: 0 }, { height: 0 }, { height: 0 },
        { height: 0 }, { height: 0 }, { height: 2 }, { height: 2 }, { height: 2 },
        { height: 2 }, { height: 2 }, { height: 2 }, { height: 2 }, { height: 2 },
        { height: 2 }, { height: 2 }, { height: 2 }, { height: 2 }, { height: 2 },
        { height: 2 }, { height: 2 }, { height: 2 }, { height: 0 }, { height: 0 },
        { height: 0 }, { height: 0 }, { height: 0 }, { height: 0 }, { height: 0 },
        { height: 0 }, { height: 0 }, { height: 0 }, { height: 0 }, { height: 0 },
        { height: 0 }, { height: 2 }, { height: 2 }, { height: 2 }, { height: 2 },
        { height: 2 }, { height: 2 }, { height: 2 }, { height: 2 }, { height: 2 },
        { height: 2 }, { height: 2 }, { height: 2 }, { height: 2 }, { height: 2 },
        { height: 2 }, { height: 2 }, { height: 2 }, { height: 2 }, { height: 2 },
        { height: 2 }, { height: 2 }, { height: 2 }, { height: 2 }, { height: 2 },
        { height: 2 }, { height: 2 }, { height: 2 }, { height: 2 }, { height: 2 },
        { height: 2 }, { height: 2 }, { height: 2 }, { height: 2 }, { height: 2 },
        { height: 2 }, { height: 2 }, { height: 2 }, { height: 2 }, { height: 2 },
        { height: 2 }, { height: 2 }, { height: 2 }, { height: 2 }, { height: 2 },
        { height: 2 }, { height: 2 }, { height: 2 }, { height: 2 }, { height: 2 },
        { height: 0 }, { height: 0 }, { height: 0 }, { height: 0 }, { height: 0 },
        ... 1 more item
    ]
    ]

    */

/*
   2of2: run code with adventOfCode data. advenOfCodeFile is input3.txt. Set this correctly at the fn readFileSync at top of file
*/

// let gridHeightMap = [
//   [{ height: 1 }, { height: 9 }, { height: 1 }, { height: 1   }, { height: 1 }],
//   [{ height: 1 }, { height: 9 }, { height: 1 }, { height: 9 }, { height: 1 }],
//   [{ height: 1 }, { height: 9 }, { height: 1 }, { height: 9 }, { height: 1 }],
//   [{ height: 1 }, { height: 1   }, { height: 2 }, { height: 3   }, { height: 1 }],
//   [{ height: 1 }, { height: 9 }, { height: 1 }, { height: 3   }, { height: 1 }],
//   [{ height: 1 }, { height: 9 }, { height: 1 }, { height: 9 }, { height: 'goal' }], // instead of 'goal' you can fill  out anything here.
// ];






let row = gridHeightMap.length;
let col = gridHeightMap[0].length;
let prevHeight; // comment below explains why you need variable prevHeight. 

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
//   if (gridHeightMap[r][c].height == 9) return false; 
    
    // log(`prevHeight: ${prevHeight}`);
    if (gridHeightMap[r][c].prevHeight - prevHeight > 1)  {
        return false
    }
    // if (gridHeightMap[r][c].prevHeight - prevHeight < -1)  {
    //     return false
    // }
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
// config: hardcode start position in the gridHeightMap. pitfall: in adventOfCode start position is not in upper left corner.
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

    log(`-----------------------------------------------------------------------------------------`);
    log(`start: `)
    log(`current node: letter: ${String.fromCharCode(gridHeightMap[currentLocation.r][currentLocation.c] +97)}, row: ${currentLocation.r}, col: ${currentLocation.c} `);
    // log(`current node: letter: ${(gridHeightMap[currentLocation.r][currentLocation.c])}, row: ${currentLocation.r}, col: ${currentLocation.c} `);
    log(`current node: heightOfCurrentNode: ${gridHeightMap[currentLocation.r][currentLocation.c].height}`);
    log(`current node: height: ${gridHeightMap[currentLocation.r][currentLocation.c].height}`);


    if (currentLocation.r == end[0] && currentLocation.c == end[1])
      return currentLocation;

    /* you need previous height to check the height difference:
        e.g. prevHeight = 3 and (new) height= 4. 4-3==1. Allowed to step  into cell with new height 4.
        e.g. prevHeight = 3 and (new) height= 5. 5-3==2. NOT allowed to step  into cell with new height 4. Try other cell instead!
        e.g. prevHeight = 3 and (new) height= 1. 1-3==-2, so you are allowed to step  into cell with new height 4. (see requirements
        of assignment)
    */
    prevHeight = gridHeightMap[currentLocation.r][currentLocation.c].prevHeight; // value (expRes), or: 'visited'. problem: 'visited' is problem.

    gridHeightMap[currentLocation.r][currentLocation.c].height = 'visited';
    

    // you only get neighbors that meet the criteria of fn exploreLocation. 
    let neighbors = exploreLocation(currentLocation);
    let neighbor;
    for(neighbor of neighbors)
    {
       // don't re-visit an intersection of row and column (i.e. the 'same cell')  
      if(gridHeightMap[neighbor.r][neighbor.c].height != "visited")
      {
        queue.push(neighbor);
        gridHeightMap[neighbor.r][neighbor.c]["parent"]=currentLocation;
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
   let parent = gridHeightMap[r][c].parent;
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
//  log(`answer to adventOfCode Day 12, part 1: ${paths.length - 1}`);
 
//  log(`path from start to end: `);
//  log(paths.reverse());

  log(`answer to adventOfCode Day 12, part 1: ${paths.length - 1}`);
}

let path = findPath()
printPath(path);
// log(gridHeightMap)