 
/*
    goal: calculate the highest scenic score of any tree.
    design: first read design in adVentOfCode2022Day8_part1_try01.js (and subsequent files). This design/ idea is 
        reused for part 2: functions 1-12 are being reused in part 2.

    functions 6 and 7 are to be replaced by functions that implement  the business logic of part2:
        step 6: new fn: setScenicScoreForRowOrCol()
        step 7: new fn: setScenicScoreForRowOrColInReverseOrder()

    definition: 
    tree-under-consideration = grid cell with a tree of which the scenic score is currently being calculated. 

        E.g. to calculate scenic score of middle 5 in the second row of
        input1.txt (=== example code in https://adventofcode.com/2022/day/8 )
        expected result: 4.

        To calculate this output of 4, fn-calls are needed:
        1. setScenicScoreForRowOrCol() on row 1.
        2. setScenicScoreForRowOrCol() on row 1 in reverse order.
        3. setScenicScoreForRowOrCol() on col 2.
        4. setScenicScoreForRowOrCol() on col 2 in reverse order.   

        Each fn-call will add (not overwrite) to object key 'scenicScore'.
        (replace key 'height' from part1 by 'scenicScore'). 
        Just like in part 1, each of the 4 fn-calls does a part of the work.

        Ex:
        How 2 implementfn call setScenicScoreForRowOrCol() on row 1:
        1. the tree-under-consideration has 2 responsibilities:
            a) provide height with which to compare the other values in the row.
            b) provide location: x and y coordinate.
        2. trick: in 'setScenicScoreForRowOrCol() on row 1' I compare from left-to-right UNTIL
            I reach the tree-under-consideration. There I stop and continue with the next fn-call: nr2:
            'setScenicScoreForRowOrCol() on row 1 in reverse order' (and then nr 3 and 4, 
            as explained above).

        </end of implementation>.

        After this change: 
        fn 8 determineTreeVisibilityLookingAtGridFromLeftToRightAndViceVersa into:
            determineTreeVisibilityLookingFromTreeUnderInvestigationFromLeftToRight
            determineTreeVisibilityLookingFromTreeUnderInvestigationFromRightToLeft
        fn 9 determineTreeVisibilityLookingAtGridFromBottomToTopAndViceVersa  into:
            determineTreeVisibilityLookingFromTreeUnderInvestigationFromBottomToTop
            determineTreeVisibilityLookingFromTreeUnderInvestigationFromtopToBottom

        Fn 10 and 11 need to be changed as well then.
        Finally, in (new) fn 12, determine which (investigated) tree provides the best view.
        
    solution-step 1: implement the info above as pseudocode in fns 6 and 7 below.

    status:done.
*/
    

const log = console.log;

const {readFileSync} = require("fs");
const { toNamespacedPath } = require("path");

// config 1of3: select input fiile (input2.txt or input3.txt). 
const inputFromFile = readFileSync("input1.txt", "utf-8").split('\r\n');
log('01_input-from-file: ')
// log(inputFromFile)


// function 1: (as input for 1of2 and 2of2 below) convert array to array with subarrays:
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


// function 2: convert input to table with object for each cell (re-use code from adventOfCodeDay12)
    // this table is just a nice overview of the  data in the console.log for more pleasant development experience: 
    let gridAsTable = arrayAsArrayWithSubArrays.map((subArray, indexRow) => {
        return subArray
        .toString().split("")
        .map((number) => {return { height: parseInt(number), indexRow: indexRow }}) // do not change prevState.
    })
    console.table(gridAsTable); 

// function 3: the data to use for adventOfCode assignment: 
    let grid = arrayAsArrayWithSubArrays.map((subArray, indexRow) => {
        return subArray
        .toString().split("")
        .map((number, indexCol) => {return { indexRow: indexRow, IndexCol: indexCol,  scenicScore: scenicScore, height: parseInt(number), isVisibleFromOutsideGrid: false }}) // do not change prevState.
    })
    // log(`grid: `)
    // log(grid.length)
    // log(grid[0].length);

// function 4:
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

// function 5:
    let selectRow = (grid, rowNr) => {
        let nestedArrWithAllValuesFromRow = grid[rowNr];
        //step: remove 1 pair of []:  
        let nestedArrWithAllValuesFromRowFlat = nestedArrWithAllValuesFromRow.flat();
        return nestedArrWithAllValuesFromRowFlat;
    }
    //    let nestedArrWithAllValuesFromRowFlat = selectRow(grid, 4);  
   //  log(nestedArrWithAllValuesFromRowFlat); // status: ok


// function 6: 
    const setScenicScoreForRowOrCol = (nestedArrWithAllValuesFrom1ColOrRow) => {
        /*
            1. the tree-under-consideration has 2 responsibilities: (step 1 is copy from design in intro at top of this file).
            a) provide height with which to compare the other values in the row.
            b) provide location: x and y coordinate.
        */
       /*
            GOAL: implement proof of concept, see intro at top of this file. 
            DEFINITIONS:
            tree-under-consideration = grid cell with a tree of which the scenic score is currently being calculated. 
            A === nestedArrWithAllValuesFrom1ColOrRow === argument of this function setScenicScoreForRowOrCol.
            B === iterated element (read: tree) of A. Each tree in the grid except for the 'tree-under-consideration' is a 'B'. 
                   All B's (from the X-axis and Y-axis of the tree-under-consideration are being compared with 
                   the tree-under-consideration in order to calculate the scenicScore for the tree-under-consideration.

                   Of each tree in the grid you want to know the scenicScore, so what is 'tree-under-consideration' and what is B, 
                   shifts continuously.
                   But at any moment there is (and can only be) only 1 tree-under-consideration and 1 B at the same time.
            
            PSEUDOCODE OF THIS FN setScenicScoreForRowOrCol: 
                let scenicScore = 0; 
                
                for (let i = 0; i < (A).length; i++) {
                    if (B.index) < (tree-under-consideration.index) {   
                        if ( B.height) < (tree-under-consideration.height) {
                            // any height difference between values < tree-under-consideration.height is...irrelevant.
                            // ex from https://adventofcode.com/2022/day/8 :  33549 --> 5 can see 3 and 3, while 3 is not blocking the 
                            // view of 5 on the other 3.
                            // fictitious ex: 14532  --> 5 can see 4 and 1, while  4 is not blocking the view of 5 on 1.
                            scenicScore +=1;
                        else if ( B.height == tree-under-consideration.height) {
                            // As a consequence: all previous B's (0, 1 or more) are no longer visible 
                            // from tree-under-consideration.
                            // now you can only see 1 B, so:
                            scenicScore =1;                                                 
                        } else {
                            // tree under investigation is bigger than tree-under-consideration. As a consequence:
                            // all previous A-arrayElements (0, 1 or more) are no longer visible from tree-under-consideration.
                            // now you can't see any tree, so:
                            scenicScore = 0;   
                            // business requirement: if tree is taller than tree-under-consideration, then elves cannot see the tree
                        }
                    } else {
                        // I work from-left-to-right and I have reached tree-under-consideration, so nothing left to do.
                        return scenicScore;           
                    } 
                }
       */

            let scenicScore = 0; 
            let arrayCellsWithScenicScore = nestedArrWithAllValuesFrom1ColOrRow.map((cell) => {
                // implement pseudocode here.
            })
        return arrayCellsWithScenicScore;
    }




// function 7:
const setScenicScoreForRowOrColInReverseOrder = (nestedArrWithAllValuesFrom1ColOrRow) => {
    /* 
        implementation of fn 7 is identical to that of fn6, except for the codelines below that do
        the reversing forth and back.
    */
    let arrayCellsToUpdateVisibility = [...nestedArrWithAllValuesFrom1ColOrRow].reverse();
        arrayCellsToUpdateVisibility.forEach((cell) => {
            // implement pseudocode here.
        })

    let arrayTreesInOriginalOrder = arrayCellsToUpdateVisibility.reverse();
    return arrayTreesInOriginalOrder;
}


// function 8:
    // status: ok (100%  test coverage on input1.txt)
    const determineTreeVisibilityLookingAtGridFromLeftToRightAndViceVersa = (grid, rowNr) => {
        let nestedArrWithAllValuesFromRowFlat = selectRow(grid, rowNr);  
        let rowArrayCellsWithUpdatedVisibility = setScenicScoreForRowOrCol(nestedArrWithAllValuesFromRowFlat);
        let rowArrayCellsWithUpdatedVisibilityInReverseOrder = setScenicScoreForRowOrColInReverseOrder(rowArrayCellsWithUpdatedVisibility);
        return rowArrayCellsWithUpdatedVisibilityInReverseOrder;
    }
    // let visibilityOfRow = determineTreeVisibilityLookingAtGridFromLeftToRightAndViceVersa(grid, 2);
    // log(visibilityOfRow);

// function 9:
    // status: ok (100%  test coverage on input1.txt)
    const determineTreeVisibilityLookingAtGridFromBottomToTopAndViceVersa = (grid, colNr) => {
        let nestedArrWithAllValuesFromColFlat = selectCol(grid, colNr);
        let arrayCellsWithUpdatedVisibility = setScenicScoreForRowOrCol(nestedArrWithAllValuesFromColFlat);
        let arrayCellsWithUpdatedVisibilityInReverseOrder = setScenicScoreForRowOrColInReverseOrder(arrayCellsWithUpdatedVisibility);
        // log(arrayCellsWithUpdatedVisibilityInReverseOrder);
        return arrayCellsWithUpdatedVisibilityInReverseOrder;
    }
    // let visibilityOfCol = determineTreeVisibilityLookingAtGridFromBottomToTopAndViceVersa(grid, 2);
    // log(visibilityOfCol);    


// function 10:
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

// function 11:
    const checkGridForestWhereTreehouseCanBeBuiltViaTheColumns = (gridWithVisibilityOfEachTreeCheckedViaTheRows, determineTreeVisibilityLookingAtGridFromBottomToTopAndViceVersa ) => {
        let nrOfGridCols =  (grid[0].length);

        let gridWithTreeVisibilityFromOutsideGrid = []

        for (let i = 0; i < nrOfGridCols; i++) {
            gridWithTreeVisibilityFromOutsideGrid.push(determineTreeVisibilityLookingAtGridFromBottomToTopAndViceVersa(gridWithVisibilityOfEachTreeCheckedViaTheRows, i));
        }
        return gridWithTreeVisibilityFromOutsideGrid;
    }

    let gridWithVisibilityOfEachTree = checkGridForestWhereTreehouseCanBeBuiltViaTheColumns(gridWithVisibilityOfEachTreeCheckedViaTheRows, determineTreeVisibilityLookingAtGridFromBottomToTopAndViceVersa);
    // log(gridWithVisibilityOfEachTree);




// function 12: 
    let countNrOfTreesVisibleFromOutsideTheGrid = (gridWithVisibilityOfEachTree) => {
        let isTreeVisibleFromOutsideTheGrid = (cell) => cell.isVisibleFromOutsideGrid ;
        let arrayWithTreesThatAreVisibleFromOutsideOfTheGrid = gridWithVisibilityOfEachTree.map( subArray => subArray.filter( isTreeVisibleFromOutsideTheGrid ));
        //step: flatten this grid (grid here is array (rows) with arrays (columns) with loads of trees):
        let flattenedArrayWithTreesThatAreVisibleFromOutsideOfTheGrid = arrayWithTreesThatAreVisibleFromOutsideOfTheGrid.flat();
        // flatten the grid, but do not cut the trees down :) pun intended.
        return flattenedArrayWithTreesThatAreVisibleFromOutsideOfTheGrid.length;
    }

    let nrOfTreesVisibleFromOutsideTheGrid = countNrOfTreesVisibleFromOutsideTheGrid(gridWithVisibilityOfEachTree);
    log(`nrOfVisibleTreesFromOutsideOfTheGrid: ${nrOfTreesVisibleFromOutsideTheGrid}`);
    // result: for input2.txt (i.e. the real data of the puzzle) the correct answer is: 1870.



    