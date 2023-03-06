 
/*

    ANALYSIS
    I now understand that I need Dijkstra's shortest path algorithm for this adventOfCode challenge.
    reason:
        <start>
        source: https://stackoverflow.com/questions/8379785/how-does-a-breadth-first-search-work-when-looking-for-shortest-path
            stackOverflow-rating: 72
            As pointed above, BFS can only be used to find shortest path in a graph if:
            1. There are no loops
            2. All edges have same weight or no weight.  --> <PROBLEM>
                        requirement-adventOfCode: "destination square can be at most one higher than the elevation of your current square"
                        ...this means that some edges DO have a weight (i.e. when destination square is more than 1 bigger than
                            the current square !!!!!!!
                        hypothesis / QED: I need Dijkstra's algorithm.
                        </PROBLEM>

            To find the shortest path, all you have to do is start from the source and perform a 
            breadth first search and stop when you find your destination Node. 
            The only additional thing you need to do is have an array previous[n] which will 
            store the previous node for every node visited. The previous of source can be null.

            To print the path, simple loop through the previous[] array from source 
            till you reach destination and print the nodes. DFS can also be used to find 
            the shortest path in a graph under similar conditions.

            However, if the graph is more complex, containing weighted edges and loops, 
            then we need a more sophisticated version of BFS, i.e. Dijkstra's algorithm.
        </end>

        

    DATA:
        input.txt  === source file with adventOfCode data to win adventOfCode-star.
        input2.txt  === source file with example data that is explained in the adventofCode assgnment
        input3.txt  === source file with adventOfCode data to win adventOfCode-star., with modified start and end (see backlog 1 below).
        ( https://adventofcode.com/2022/day/12 )

    CONFIG:    
        To run a test, there are 3 config-steps in the file below (to switch from testing e.g. input2.txt to input3.txt).                   
        Use ctrl+f to quickly goto (status: not used yet) 
        config 1of3
        config 2of3
        config 3of3

    BACKLOG:
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

    DESIGN:
        strategy: change implementation of Dijkstra's algorithm from Hackernoon into the code that 
                  will make me win 1 adventOfCode-star.
                  source: https://hackernoon.com/how-to-implement-dijkstras-algorithm-in-javascript-abdfd1702d04  
    
        main challenge: implement: "destination square can be at most one higher than the elevation of your current square", because
        this is what creates a different weitht  between some of the edges:
        e.g. 
            example dataset:             
            Sabqponm
            abcryxxl
            accszExk
            acctuvwj
            abdefghi

            (looking at the first row:)
            You can go from e.g. a to b, but not from b to q. 
            Here the 'weight' of the  edge between b and q is infinite. At the same 
            But there is no weight on the edge between p and (this  SAME) q.
            So you cannot say: "you can't go to a certain node (here: q)".
            What you should say: "you can't go from one node to the other if it violates the rule ('rule-max-height') that
            the destination square is more than 1 higher than the current square".
            QED: some of the edges have a weight.
        
        1. play with and study  example code from https://www.tutorialspoint.com/convert-array-into-array-of-subarrays-javascript 
        2. connect algorithm to adventOfCode example dataset:
                
                example dataset: 
                Aabqponm
                abcryxxl
                accszZxk
                acctuvwj
                abdefghi
            
                4 conditions:
                If current and destination node are the same: weight of edge: 0;
                If current node 1 smmaller than destination node (e.g. d and e, or s and t): weight of edge: 0;
                If current node 2 or more smaller than destination node (e.g. d and e, or s and t): weight of edge: infinity; --> only if you go up the mountain
                If current node 1, 2 or more bigger than destination node (e.g. d and e, or s and t): weight of edge: 0; --> no restriction if you go down the mountain

                So the edge-value is the delta of of the letter from the current edge and the letter from the destination edge: e.g.:
                            current letter: m
                            destination letter: n
                            delta: m - n === 1, so edge has a weight of 1. 
                While Dijkstra's algoritm traverses the grid, each  edge between 2 nodes must be calculated dynamically in this way.

                So instead of starting like this (as in the example code from Hackernoon below):
                
                const problem = {
                    start: {A: 5, B: 2},
                    A: {C: 4, D: 2},
                    B: {A: 8, D: 7},
                    C: {D: 6, finish: 3},
                    D: {finish: 1},
                    finish: {}    // ---> empty object === finish.
                };

                I start like this:

                const problem = {
                    start: {A: A, B: B}, // or equivalent, but shorter: {A, B}
                    A: {C, D},
                    B: {A, D},
                    C: {D, finish},
                    D: {finish},
                    finish: {}
                };

            a) convert the grid with letters from dataset (see e.g. example dataset above) into the 
               datastructure of object 'problem' (same data structure as above). 
            
            b) run the example code below as a test.

            c) build the 4 conditions into the code from Hackernoon. So the value of each edge must be calculated dynamically
                based on the direction in which Dijkstra's algorithm traverses the grid with inputdata.
                
            d)      

                ...feb 6th 2023: I have run out of time. I continue with this one later. 
            
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
    let gridRowWithLetterInEachCell = arrayAsArrayWithSubArrays[0].toString().split("") // e.g. first row here.
    log(`gridRowWithLetterInEachCell: `)
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
    let gridHeightMap = arrayAsArrayWithSubArrays.map((subArray, indexRow) => {
        return subArray
        .toString().split("")
        .map((fromLetterToNumber) => fromLetterToNumber.charCodeAt(0) - 97) 
        .map((number, indexCol) => {return { height: parseInt(number), indexRow: indexRow, IndexCol: indexCol }}) // do not change heightOfCurrentNode.
    })
    log(`gridHeightMap: in each cell: height, indexRow, indexCol: `)
    // console.table(gridHeightMap); // shows helpful info with up to 2 object properties in each cell. With more than 2 you just see:
    /*
        │ [Object] │ [Object] │ [Object] │
    */
    log(`1 gridcell looks like this: `);
    log(gridHeightMap[0][0]); //output: { height: 0, indexRow: 0, IndexCol: 0 }

    log(`nr of gridrows:`);
    log(gridHeightMap.length)
    log(`nr of gridcols:`);
    log(gridHeightMap[0].length);


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
var ROW = 41; 
var COL = 101; 



// source of following code: https://hackernoon.com/how-to-implement-dijkstras-algorithm-in-javascript-abdfd1702d04  

const problem = {
    start: {A: 5, B: 2},
    A: {C: 4, D: 2},
    B: {A: 8, D: 7},
    C: {D: 6, finish: 3},
    D: {finish: 1},
    finish: {}
  };
  
  const lowestCostNode = (costs, processed) => {
    return Object.keys(costs).reduce((lowest, node) => {
      if (lowest === null || costs[node] < costs[lowest]) {
        if (!processed.includes(node)) {
          lowest = node;
        }
      }
      return lowest;
    }, null);
  };
  
  // function that returns the minimum cost and path to reach Finish
  const dijkstra = (graph) => {
  
    // track lowest cost to reach each node
    const costs = Object.assign({finish: Infinity}, graph.start);
  
    // track paths
    const parents = {finish: null};
    for (let child in graph.start) {
      parents[child] = 'start';
    }
  
    // track nodes that have already been processed
    const processed = [];
  
    let node = lowestCostNode(costs, processed);
  
    while (node) {
      let cost = costs[node];  // --> 2do: dynamically calculate the cost of each node. Then add it to object 'problem'. 
      let children = graph[node];
      for (let n in children) {
        let newCost = cost + children[n];
        if (!costs[n]) {
          costs[n] = newCost;
          parents[n] = node;
        }
        if (costs[n] > newCost) {
          costs[n] = newCost;
          parents[n] = node;
        }
      }
      processed.push(node);
      node = lowestCostNode(costs, processed);
    }
  
    let optimalPath = ['finish'];
    let parent = parents.finish;
    while (parent) {
      optimalPath.push(parent);
      parent = parents[parent];
    }
    optimalPath.reverse();
  
    const results = {
      distance: costs.finish,
      path: optimalPath
    };
  
    return results;
  };
  
  log(dijkstra(problem));

