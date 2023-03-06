 
/*
    design:
    goal: check height of each tree (to determine if it is suitable for building a tree house),
    from 4 angles: left-to-right, right-to-left, up-to-down, down-to-up.

    Each tree is object in grid. 
    Grid is array (the rows) with nested arrays (the columns).
    Each tree has key 'visiblity' with default value false.
    So I am going to look for the trees that are visible from outside the grid and then set 
    each visible tree to 'visibility: true'.


    step 1: as proof of concept implement column 'up-to-down'.
    status: done, works.
*/
    

const log = console.log;

const {readFileSync} = require("fs");
const { toNamespacedPath } = require("path");

// config 1of3: select input fiile (input2.txt or input3.txt). 
const inputFromFile = readFileSync("input1.txt", "utf-8").split('\r\n');
log('01_input-from-file: ')
// log(inputFromFile)


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
// log(arrayAsArrayWithSubArrays);
/*
    output:
   [ [ '30373' ], [ '25512' ], [ '65332' ], [ '33549' ], [ '35390' ] ]
*/


// convert input to table with object for each cell (re-use code from adventOfCodeDay12)
    // this table is just a nice overview of the  data in the console.log for more pleasant development experience: 
    let gridAsTable = arrayAsArrayWithSubArrays.map((subArray, indexRow) => {
        return subArray
        .toString().split("")
        .map((number) => {return { height: number, indexRow: indexRow }}) // do not change prevState.
    })
    log(`grid: `)
    console.table(gridAsTable); 
    // log(grid.length)
    // log(grid[0].length);


// the data to use for adventOfCode assignment: 
    let grid = arrayAsArrayWithSubArrays.map((subArray, indexRow) => {
        return subArray
        .toString().split("")
        .map((number, indexCol) => {return { height: number, indexRow: indexRow, IndexCol: indexCol, visible: false }}) // do not change prevState.
    })
    log(`grid: `)
    // console.table(grid); // shows helpful info with up to 2 object properties in each cell. With more than 2 you just see:
    log(grid); // shows helpful info with up to 2 object properties in each cell. With more than 2 you just see:
    /*
        │ [Object] │ [Object] │ [Object] │
    */
    log(grid.length)
    log(grid[0].length);


    // let gridTestData = [
    //     { height: '3', indexRow: 4, IndexCol: 0 },
    //     { height: '5', indexRow: 4, IndexCol: 1 },
    //     { height: '3', indexRow: 4, IndexCol: 2 },
    //     { height: '9', indexRow: 4, IndexCol: 3 },
    //     { height: '0', indexRow: 4, IndexCol: 4 }
    // ]


    // create fn:
    // select 1 column to check angles up-to-down, down-to-up (see intro above for more info)
    let array = grid;
    let selectColumn = (cell) => cell.IndexCol == 0; // make 0 dynamic. 
    let nestedArrWithAllValuesFromIndexColWithValue0 = array.map( subarray => subarray.filter(selectColumn ));
    // log(nestedArrWithAllValuesFromIndexColWithValue0)

    //step: remove 1 pair of []  --> 2do: combine with map-fn above.
    let nestedArrWithAllValuesFromIndexColWithValue0Flat = nestedArrWithAllValuesFromIndexColWithValue0.flat();
    log(nestedArrWithAllValuesFromIndexColWithValue0Flat)

    /* to enhance code readability I prefer to make a separate fn to select rows. 
       perhaps I will merge this fn with fn to select columns later, if that
      turns out to be handier.
    */




    // step: create fn setTreesThatAreVisibleFromOutsideGridToVisible:
    let highestValue = 0; 
    /*pitfall: 
    don't put  this variable inside the map fn below, because it will be reset
    to 0 every iteration !
    */
    let arrayCellsWithUpdatedVisibility = nestedArrWithAllValuesFromIndexColWithValue0Flat.map((cell) => {
        if (cell.height > highestValue){
        highestValue = cell.height;
        cell.visible = true;
        return cell;
        }
        return cell;
    })

    log(arrayCellsWithUpdatedVisibility);