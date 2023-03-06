 
/*
    first read design in adVentOfCode2022Day8_part1_try01.js

    step 2: put code below in fns
    step 3: make fn to implement "left-to-right" and "bottom-to-top" (see file adVentOfCode2022Day8_part1_try01.js for explanation): "regular order"
    step 4: make fn to implement "right-to-left" and "down-to-up": "reverse order"

    step5: (in next file): merge the fn for "regular order" with fn for "reverse order". Result of this is "Foo". Then combine "Foo" in 
            a fn with row selection and a separate fn for col selection.

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
        .map((number) => {return { height: parseInt(number), indexRow: indexRow }}) // do not change prevState.
    })
    log(`grid: `)
    console.table(gridAsTable); 
    // log(grid.length)
    // log(grid[0].length);


// the data to use for adventOfCode assignment: 
    let grid = arrayAsArrayWithSubArrays.map((subArray, indexRow) => {
        return subArray
        .toString().split("")
        .map((number, indexCol) => {return { height: parseInt(number), indexRow: indexRow, IndexCol: indexCol, isVisibleFromOutsideGrid: false }}) // do not change prevState.
    })
    log(`grid: `)
    // console.table(grid); // shows helpful info with up to 2 object properties in each cell. With more than 2 you just see:
    // log(grid); // shows helpful info with up to 2 object properties in each cell. With more than 2 you just see:
    /*
        │ [Object] │ [Object] │ [Object] │
    */
    log(grid.length)
    log(grid[0].length);


    // let gridTestData = [
    //     { height: 3, indexRow: 4, IndexCol: 0 },
    //     { height: 5, indexRow: 4, IndexCol: 1 },
    //     { height: 3, indexRow: 4, IndexCol: 2 },
    //     { height: 9, indexRow: 4, IndexCol: 3 },
    //     { height: 0, indexRow: 4, IndexCol: 4 }
    // ]


    let selectCol = (grid, columnNr) => {
        let selectColumn = (cell) => cell.IndexCol == columnNr; 
        let nestedArrWithAllValuesFromCol = grid.map( subarray => subarray.filter(selectColumn ));
        // log(nestedArrWithAllValuesFromIndexColWithValue0)
    
        //step: remove 1 pair of []  --> 2do: combine with map-fn above.
        let nestedArrWithAllValuesFromColFlat = nestedArrWithAllValuesFromCol.flat();
        // log(nestedArrWithAllValuesFromColFlat)
        return nestedArrWithAllValuesFromColFlat;
    }
    let nestedArrWithAllValuesFromColFlat = selectCol(grid, 4);
    // log(nestedArrWithAllValuesFromColFlat); // status: ok

    /* to enhance code readability I prefer to make a separate fn to select rows. 
       perhaps I will merge this fn with fn to select columns later, if that
      turns out to be handier.
    */

      let selectRow = (grid, rowNr) => {
        // let selectRow = (cell) => cell.IndexRow == rowNr;  
        let nestedArrWithAllValuesFromRow = grid[rowNr];
        // log(nestedArrWithAllValuesFromRow)
    
        //step: remove 1 pair of []  
        let nestedArrWithAllValuesFromRowFlat = nestedArrWithAllValuesFromRow.flat();
        // log(nestedArrWithAllValuesFromRowFlat);
        return nestedArrWithAllValuesFromRowFlat;
    }
   let nestedArrWithAllValuesFromRowFlat = selectRow(grid, 4);  
   //  log(nestedArrWithAllValuesFromRowFlat); // status: ok


    


    const setTreesThatAreVisibleFromOutsideGridToVisible = (nestedArrWithAllValuesFrom1ColOrRow) => {
        let highestValue = -1; // pesky bug: first and/or last value in grid can be value 0. So highest value must start at -1.
        /*pitfall: 
        don't put  this variable inside the map fn below, because it will be reset
        to 0 every iteration !
        */
        let arrayCellsWithUpdatedVisibility = nestedArrWithAllValuesFrom1ColOrRow.map((cell) => {
            if (cell.height > highestValue){
            highestValue = cell.height;
            cell.isVisibleFromOutsideGrid = true;
            return cell;
            }
            return cell;
        })
    
        // log(arrayCellsWithUpdatedVisibility);
        return arrayCellsWithUpdatedVisibility;
    }



    const setTreesThatAreVisibleFromOutsideGridToVisibleInReverseOrder = (nestedArrWithAllValuesFrom1ColOrRow) => {
        let highestValue = -1; // pesky bug: first and/or last value in grid can be value 0. So highest value must start at -1.
        /* 
            goal: instead of left-to-right or top-to-bottom, you will look at the grid from right-to-left or bottom-to-top.
            1. "array.reverse()" 
            2. compare height to figure out which trees are not suitable for building treehouse.
            2. undo the reverse, by reversing again.
            3. then return the result.
        */
        let arrayCellsToUpdateVisibility = [...nestedArrWithAllValuesFrom1ColOrRow].reverse();
        arrayCellsToUpdateVisibility.forEach((cell) => {
            if (cell.height > highestValue){
            highestValue = cell.height;
            cell.isVisibleFromOutsideGrid = true;
            return cell;
            }
            return cell;
        })

        let arrayTreesInOriginalOrder = arrayCellsToUpdateVisibility.reverse();
        return arrayTreesInOriginalOrder;
    }


    // status: ok (100%  test coverage on input1.txt)
    // let arrayCellsWithUpdatedVisibility = setTreesThatAreVisibleFromOutsideGridToVisible(nestedArrWithAllValuesFromColFlat);
    // let arrayCellsWithUpdatedVisibilityInReverseOrder = setTreesThatAreVisibleFromOutsideGridToVisibleInReverseOrder(arrayCellsWithUpdatedVisibility);
    // log(arrayCellsWithUpdatedVisibilityInReverseOrder);
    /*
        QED: I can update the  grid from  top-to-bottom (see intro for explanation) and then grab the output to update the grid from  bottom-to-top.
        update === set isVisibleFromOutsideGrid to true for each tree that is visible from outside the grid.

        Likewise I can use my code as-is to update for (see code above) left-to-right combined with right-to-left: see following code: 
    */

    // status: ok (100%  test coverage on input1.txt)
    let rowArrayCellsWithUpdatedVisibility = setTreesThatAreVisibleFromOutsideGridToVisible(nestedArrWithAllValuesFromRowFlat);
    let rowArrayCellsWithUpdatedVisibilityInReverseOrder = setTreesThatAreVisibleFromOutsideGridToVisibleInReverseOrder(rowArrayCellsWithUpdatedVisibility);
    log(rowArrayCellsWithUpdatedVisibilityInReverseOrder);


    /*
        2do next (in next file): merge fn-pairs above into 1 fn that clearly describes the purpose of the fn (and its 2 constituent fns)
    */

        