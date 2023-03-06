 
/*
    first read design in adVentOfCode2022Day8_part1_try01.js

    <previous file>
    step 3: make fn to implement "left-to-right" and "bottom-to-top" (see file adVentOfCode2022Day8_part1_try01.js for explanation): "regular order"
    step 4: make fn to implement "right-to-left" and "down-to-up": "reverse order"
    </end of previous file>

    step5: (in THIS file): merge the fn for "regular order" with fn for "reverse order". Result of this is "Foo". Then combine "Foo" in 
            a fn with row selection and a separate fn for col selection.
    step6: (in next file) use the fns:...
        determineTreeVisibilityLookingAtGridFromBottomToTopAndViceVersa  
        and:
        determineTreeVisibilityLookingAtGridFromLeftToRightAndViceVersa
        ...to check the entire grid. 

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
        //step: remove 1 pair of []:
        let nestedArrWithAllValuesFromColFlat = nestedArrWithAllValuesFromCol.flat();
        // log(nestedArrWithAllValuesFromColFlat)
        return nestedArrWithAllValuesFromColFlat;
    }
    // let nestedArrWithAllValuesFromColFlat = selectCol(grid, 4);
    // log(nestedArrWithAllValuesFromColFlat); // status: ok



    let selectRow = (grid, rowNr) => {
        let nestedArrWithAllValuesFromRow = grid[rowNr];
        //step: remove 1 pair of []:  
        let nestedArrWithAllValuesFromRowFlat = nestedArrWithAllValuesFromRow.flat();
        return nestedArrWithAllValuesFromRowFlat;
    }
    //    let nestedArrWithAllValuesFromRowFlat = selectRow(grid, 4);  
   //  log(nestedArrWithAllValuesFromRowFlat); // status: ok



    const setTreesThatAreVisibleFromOutsideGridToVisible = (nestedArrWithAllValuesFrom1ColOrRow) => {
        let highestValue = -1; // pesky bug: first and/or last value in grid can be value 0. So highest value must start at -1.
        let arrayCellsWithUpdatedVisibility = nestedArrWithAllValuesFrom1ColOrRow.map((cell) => {
            if (cell.height > highestValue){
            highestValue = cell.height;
            cell.isVisibleFromOutsideGrid = true;
            return cell;
            }
            return cell;
        })
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
    const determineTreeVisibilityLookingAtGridFromBottomToTopAndViceVersa = (grid, colNr) => {
        let nestedArrWithAllValuesFromColFlat = selectCol(grid, colNr);
        let arrayCellsWithUpdatedVisibility = setTreesThatAreVisibleFromOutsideGridToVisible(nestedArrWithAllValuesFromColFlat);
        let arrayCellsWithUpdatedVisibilityInReverseOrder = setTreesThatAreVisibleFromOutsideGridToVisibleInReverseOrder(arrayCellsWithUpdatedVisibility);
        // log(arrayCellsWithUpdatedVisibilityInReverseOrder);
        return arrayCellsWithUpdatedVisibilityInReverseOrder;
    }
    let visibilityOfCol = determineTreeVisibilityLookingAtGridFromBottomToTopAndViceVersa(grid, 2);
    log(visibilityOfCol);    


    // status: ok (100%  test coverage on input1.txt)
    const determineTreeVisibilityLookingAtGridFromLeftToRightAndViceVersa = (grid, rowNr) => {
        let nestedArrWithAllValuesFromRowFlat = selectRow(grid, rowNr);  
        let rowArrayCellsWithUpdatedVisibility = setTreesThatAreVisibleFromOutsideGridToVisible(nestedArrWithAllValuesFromRowFlat);
        let rowArrayCellsWithUpdatedVisibilityInReverseOrder = setTreesThatAreVisibleFromOutsideGridToVisibleInReverseOrder(rowArrayCellsWithUpdatedVisibility);
        return rowArrayCellsWithUpdatedVisibilityInReverseOrder;
    }

    let visibilityOfRow = determineTreeVisibilityLookingAtGridFromLeftToRightAndViceVersa(grid, 2);
    log(visibilityOfRow);


        