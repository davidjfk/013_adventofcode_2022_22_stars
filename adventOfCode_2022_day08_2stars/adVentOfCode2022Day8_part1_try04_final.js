 
/*
    first read design in adVentOfCode2022Day8_part1_try01.js

    step6: use the fns:...
            determineTreeVisibilityLookingAtGridFromBottomToTopAndViceVersa  ("F")
            and:
            determineTreeVisibilityLookingAtGridFromLeftToRightAndViceVersa  ("G")
            ...to check the entire grid. 

            implementation:
            Fn checkGridForestWhereTreehouseCanBeBuilt will do the following:
            1. calculate nr of rows (code must be able to handle smaller or bigger datasets)
            2. calculate nr of columns (code must be able to handle smaller or bigger datasets)

            3. For grid for each row call fn determineTreeVisibilityLookingAtGridFromLeftToRightAndViceVersa
            4. For grid for each col call fn determineTreeVisibilityLookingAtGridFromBottomToTopAndViceVersa
            4.a: (status) result is grid with each tree as an object. 
            5. Count the nr of trees that are visible from outside of the grid.

*/
    

const log = console.log;

const {readFileSync} = require("fs");
const { toNamespacedPath } = require("path");

// config 1of3: select input fiile (input2.txt or input3.txt). 
const inputFromFile = readFileSync("input1.txt", "utf-8").split('\r\n');
log('01_input-from-file: ')
// log(inputFromFile)


// step 1: (as input for 1of2 and 2of2 below) convert array to array with subarrays:
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


// step 2: convert input to table with object for each cell (re-use code from adventOfCodeDay12)
    // this table is just a nice overview of the  data in the console.log for more pleasant development experience: 
    let gridAsTable = arrayAsArrayWithSubArrays.map((subArray, indexRow) => {
        return subArray
        .toString().split("")
        .map((number) => {return { height: parseInt(number), indexRow: indexRow }}) // do not change prevState.
    })
    // console.table(gridAsTable); // toggle on for matrix-effect :).

// step 3: the data to use for adventOfCode assignment: 
    let grid = arrayAsArrayWithSubArrays.map((subArray, indexRow) => {
        return subArray
        .toString().split("")
        .map((number, indexCol) => {return { height: parseInt(number), indexRow: indexRow, IndexCol: indexCol, isVisibleFromOutsideGrid: false }}) // do not change prevState.
    })
    // log(`grid: `)
    // log(grid.length)
    // log(grid[0].length);

// step 4:
    let selectCol = (grid, columnNr) => {
        let selectColumn = (cell) => cell.IndexCol == columnNr; 
        let nestedArrWithAllValuesFromCol = grid.map( subarray => subarray.filter(selectColumn ));
        // log(`step 4: inside fn selectCol: `)
        // log(nestedArrWithAllValuesFromCol)
        //step: remove 1 pair of []:
        let nestedArrWithAllValuesFromColFlat = nestedArrWithAllValuesFromCol.flat();
        // log(nestedArrWithAllValuesFromColFlat)
        return nestedArrWithAllValuesFromColFlat;
    }
    // log(`step 4: print result:`)
    // let nestedArrWithAllValuesFromColFlat = selectCol(grid, 4);
    // log(nestedArrWithAllValuesFromColFlat); // status: ok

// step 5:
    let selectRow = (grid, rowNr) => {
        let nestedArrWithAllValuesFromRow = grid[rowNr];
        //step: remove 1 pair of []:  
        let nestedArrWithAllValuesFromRowFlat = nestedArrWithAllValuesFromRow.flat();
        return nestedArrWithAllValuesFromRowFlat;
    }
    //    let nestedArrWithAllValuesFromRowFlat = selectRow(grid, 4);  
   //  log(nestedArrWithAllValuesFromRowFlat); // status: ok


// step 6: 
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


// step 7:
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

// step 8:
    // status: ok (100%  test coverage on input1.txt)
    const determineTreeVisibilityLookingAtGridFromLeftToRightAndViceVersa = (grid, rowNr) => {
        let nestedArrWithAllValuesFromRowFlat = selectRow(grid, rowNr);  
        let rowArrayCellsWithUpdatedVisibility = setTreesThatAreVisibleFromOutsideGridToVisible(nestedArrWithAllValuesFromRowFlat);
        let rowArrayCellsWithUpdatedVisibilityInReverseOrder = setTreesThatAreVisibleFromOutsideGridToVisibleInReverseOrder(rowArrayCellsWithUpdatedVisibility);
        return rowArrayCellsWithUpdatedVisibilityInReverseOrder;
    }
    // let visibilityOfRow = determineTreeVisibilityLookingAtGridFromLeftToRightAndViceVersa(grid, 2);
    // log(visibilityOfRow);

// step 9:
    // status: ok (100%  test coverage on input1.txt)
    const determineTreeVisibilityLookingAtGridFromBottomToTopAndViceVersa = (grid, colNr) => {
        let nestedArrWithAllValuesFromColFlat = selectCol(grid, colNr);
        let arrayCellsWithUpdatedVisibility = setTreesThatAreVisibleFromOutsideGridToVisible(nestedArrWithAllValuesFromColFlat);
        let arrayCellsWithUpdatedVisibilityInReverseOrder = setTreesThatAreVisibleFromOutsideGridToVisibleInReverseOrder(arrayCellsWithUpdatedVisibility);
        // log(arrayCellsWithUpdatedVisibilityInReverseOrder);
        return arrayCellsWithUpdatedVisibilityInReverseOrder;
    }
    // let visibilityOfCol = determineTreeVisibilityLookingAtGridFromBottomToTopAndViceVersa(grid, 2);
    // log(visibilityOfCol);    


// step 10:
    const checkGridForestWhereTreehouseCanBeBuiltViaTheRows = (grid, determineTreeVisibilityLookingAtGridFromLeftToRightAndViceVersa) => {
        let nrOfGridRows = (grid.length);

        let gridWithTreeVisibilityFromOutsideGrid = []

        for (let i = 0; i < nrOfGridRows; i++) {
            gridWithTreeVisibilityFromOutsideGrid.push(determineTreeVisibilityLookingAtGridFromLeftToRightAndViceVersa(grid, i));
        }

        return gridWithTreeVisibilityFromOutsideGrid;
    }

    let gridWithVisibilityOfEachTreeCheckedViaTheRows = checkGridForestWhereTreehouseCanBeBuiltViaTheRows(grid, determineTreeVisibilityLookingAtGridFromLeftToRightAndViceVersa);
    // log(gridWithVisibilityOfEachTreeCheckedViaTheRows);
    // the output of step 10 is used as input of step 11.

// step 11:
    const checkGridForestWhereTreehouseCanBeBuiltViaTheColumns = (gridWithVisibilityOfEachTreeCheckedViaTheRows, determineTreeVisibilityLookingAtGridFromBottomToTopAndViceVersa ) => {
        /*
            situation: in fn argument gridWithVisibilityOfEachTreeCheckedViaTheRows the visibility has just been set checking the trees in the grid from left-to-right and vice versa. 
            In this fn I do the same for top-to-bottom and vice versa.
            Caveat: each col (from top-to-bottom or vice versa) with updated visibility, is pushed to array gridWithTreeVisibilityFromOutsideGrid as a ROW (!!!!!!!!!!!!!!)
            So as a side-effect each col becomes a row (!!!!!!!)
            
            (from the near future: this is a problem for adventOfCode part 2. In part 2 I describe why (as a matter of rubber-ducking).

            backlog: how2 insert column in grid, without making the columns grid rows.
            Answer: can be done with cell (read: forest tree) properties indexRow and indexCol. Then you must map each column value separately into the grid. Try this out. 
            However, in part 2 I use another approach. )

        */
        let nrOfGridCols =  (grid[0].length);

        let gridWithTreeVisibilityFromOutsideGrid = []

        for (let i = 0; i < nrOfGridCols; i++) {
            gridWithTreeVisibilityFromOutsideGrid.push(determineTreeVisibilityLookingAtGridFromBottomToTopAndViceVersa(gridWithVisibilityOfEachTreeCheckedViaTheRows, i));
            
        }
        return gridWithTreeVisibilityFromOutsideGrid;
    }

    let gridWithVisibilityOfEachTree = checkGridForestWhereTreehouseCanBeBuiltViaTheColumns(gridWithVisibilityOfEachTreeCheckedViaTheRows, determineTreeVisibilityLookingAtGridFromBottomToTopAndViceVersa);
    // log(gridWithVisibilityOfEachTree);




// step 12: 
    let array = gridWithVisibilityOfEachTree;
    log(`step 12: `)
    // log(array)
    let isTreeVisibleFromOutsideTheGrid = (cell) => cell.isVisibleFromOutsideGrid ;
    let arrayWithTreesThatAreVisibleFromOutsideOfTheGrid = array.map( subArray => subArray.filter( isTreeVisibleFromOutsideTheGrid ));
    // log(arrayWithTreesThatAreVisibleFromOutsideOfTheGrid);

    //step: flatten this grid (grid here is array (rows) with arrays (columns) with loads of trees)
    let flattenedArrayWithTreesThatAreVisibleFromOutsideOfTheGrid = arrayWithTreesThatAreVisibleFromOutsideOfTheGrid.flat();
    // flatten the grid, but do not cut the trees down :) pun intended.


    // counting is zero-based, so add 1 (to avoid off-by-one error)
    // log(flattenedArrayWithTreesThatAreVisibleFromOutsideOfTheGrid);
    log(`nrOfVisibleTreesFromOutsideOfTheGrid: ${flattenedArrayWithTreesThatAreVisibleFromOutsideOfTheGrid.length}`)
    log(flattenedArrayWithTreesThatAreVisibleFromOutsideOfTheGrid.length);
    // result: for input2.txt (i.e. the real data of the puzzle) the correct answer is: 1870.







        // const checkGridForestWhereTreehouseCanBeBuilt = (grid, determineTreeVisibilityLookingAtGridFromLeftToRightAndViceVersa, determineTreeVisibilityLookingAtGridFromBottomToTopAndViceVersa ) => {
    //     let nrOfGridRows = (grid.length);
    //     let nrOfGridCols =  (grid[0].length);

    //     let gridWithTreeVisibilityFromOutsideGrid = []

    //     for (let i = 0; i < nrOfGridRows; i++) {
    //         gridWithTreeVisibilityFromOutsideGrid.push(determineTreeVisibilityLookingAtGridFromLeftToRightAndViceVersa(grid, i));
    //     }

    //     /*
    //       important: gridWithTreeVisibilityFromOutsideGrid (pitfall: not variable grid!) is argument for fn  call in next for loop.
    //     */
    //     for (let i = 0; i < nrOfGridCols; i++) {
    //         gridWithTreeVisibilityFromOutsideGrid.push(determineTreeVisibilityLookingAtGridFromBottomToTopAndViceVersa(gridWithTreeVisibilityFromOutsideGrid, i));
    //     }
    //     return gridWithTreeVisibilityFromOutsideGrid;
    // }

    // let gridWithVisibilityOfEachTree = checkGridForestWhereTreehouseCanBeBuilt(grid, determineTreeVisibilityLookingAtGridFromLeftToRightAndViceVersa, determineTreeVisibilityLookingAtGridFromBottomToTopAndViceVersa);
    // log(gridWithVisibilityOfEachTree)