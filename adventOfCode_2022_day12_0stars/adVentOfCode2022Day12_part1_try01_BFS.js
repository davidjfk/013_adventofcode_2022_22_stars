const log = console.log;

const {readFileSync} = require("fs");
const { toNamespacedPath } = require("path");


const inputFromFile = readFileSync("input.txt", "utf-8").split('\r\n');
log('01_input-from-file: ')
log(inputFromFile)



/*  
    preparation step 1: explore js dfs-code below. Make comments and little adjustments. 
    In the next files I mould this code into the required adventofcode solution.    

    date: 230102: I cannot create a depth-first search algorithm (dfs) from scratch, 
    so I use sample code as a baseline from source:  
    https://medium.com/@vladbezden/how-to-get-min-or-max-of-an-array-in-javascript-1c264ec6e1aa
    (imho: really cool how this code has been structured into 4 cooperating fns that together lead
    you from start to end position.)

    definition: cell = combi of row and column (e.g. [3,2])
    definition: current cell === current location.

    architecture of solution: (2do later)
    1. convert array with lowercase letters (see adventofcode input) into ordered nrs ("dataD") (I have found fn for that)
    2. in grid below, replace each property-value (empty or block) by value from "dataD". Do not replace
        starting position 'S' nor end position 'E'.
    3. init variable 'start' and variable 'end' to match "heigth" and "width" of "dataB".
    4. implement requirement: neigbor cell can be at most 1 nr bigger or less than current cell. Do this 
        in fn safeNeighbor() below
    5. run the code to calculate nrs of steps from start to end, in a "breadth-first-way".

    
*/
log('here:')

let grid = [
  [{ state: 'empty' }, { state: 'block' }, { state: 'empty' }, { state: 'empty' }, { state: 'empty' }],
  [{ state: 'empty' }, { state: 'block' }, { state: 'empty' }, { state: 'block' }, { state: 'empty' }],
  [{ state: 'empty' }, { state: 'block' }, { state: 'empty' }, { state: 'block' }, { state: 'empty' }],
  [{ state: 'empty' }, { state: 'empty' }, { state: 'empty' }, { state: 'block' }, { state: 'empty' }],
  [{ state: 'empty' }, { state: 'block' }, { state: 'empty' }, { state: 'block' }, { state: 'empty' }],
  [{ state: 'empty' }, { state: 'block' }, { state: 'empty' }, { state: 'block' }, { state: 'goal' }],
];
let start = [0, 0];
let end = [5, 4]; // vertical, horizontal. pitfall: zero-based index.
let row = grid.length;
let col = grid[0].length;

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
  if (grid[r][c].state == 'block') return false; 
  
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