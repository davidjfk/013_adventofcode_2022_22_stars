const log = console.log;

const {readFileSync} = require("fs");
const { toNamespacedPath } = require("path");


const inputFromFile = readFileSync("input.txt", "utf-8").split('\r\n');
log('01_input-from-file: ')
log(inputFromFile)



/*  
    first read: adventOfCode2022Day12_part1_try01.js comment at the top for the bigger picture and defininitions.
    
    step 1 : make grid below work with nrs instead of words. To do this, 
    in grid below, replace each property-value (empty or block) by nrs.  
    status: works.
    
    step 2: with testdata: implement requirement: neigbor cell can be at most 1 nr bigger or less than current cell. 
    Do this in fn safeNeighbor() below.   
    status: works.

    Big problem to solve later: 
    1. prevState can get value 'visited' instead of numerical value.
    

    step 3: see next file.

    
*/
log('here:')

let grid = [
  [{ state: 1 }, { state: 9 }, { state: 1 }, { state: 1   }, { state: 1 }],
  [{ state: 1 }, { state: 9 }, { state: 1 }, { state: 9 }, { state: 1 }],
  [{ state: 1 }, { state: 9 }, { state: 1 }, { state: 9 }, { state: 1 }],
  [{ state: 1 }, { state: 1   }, { state: 2 }, { state: 3   }, { state: 1 }],
  [{ state: 1 }, { state: 9 }, { state: 1 }, { state: 3   }, { state: 1 }],
  [{ state: 1 }, { state: 9 }, { state: 1 }, { state: 9 }, { state: 'goal' }], // instead of 'goal' you can fill  out anything here.
];
let start = [0, 0];
let end = [5, 4]; // vertical, horizontal. pitfall: zero-based index.
let row = grid.length;
let col = grid[0].length;
let prevState = 1; // comment below explains why you need variable prevState. 

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
  if (grid[r][c].state - prevState > 1) return false; 
  
  return true;
};

// 2of4: fn to identify neighbors of current location
const exploreLocation = function (location) {
  let r = location.r;
  let c = location.c;
  let allNeighbors = [];
  
  //left
  if (safeNeighbor(r, c - 1)) allNeighbors.push({ r: r, c: c - 1 });
  //right
  if (safeNeighbor(r, c + 1)) allNeighbors.push({ r: r, c: c + 1 });
  //top
  if (safeNeighbor(r - 1, c)) allNeighbors.push({ r: r - 1, c: c });
  //bottom
  if (safeNeighbor(r + 1, c)) allNeighbors.push({ r: r + 1, c: c });
  
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
    prevState = grid[currentLocation.r][currentLocation.c].state;

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
  console.log(paths)
  log(paths.length) // adventofcode: I need nr of path steps.
}

let path = findPath()
printPath(path);