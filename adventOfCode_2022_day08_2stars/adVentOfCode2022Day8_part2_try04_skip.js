 
/*

    first read design in adVentOfCode2022Day8_part1_try01.js.
    first read design in adVentOfCode2022Day8_part2_try01.js.
    
    

    status: try-stuff-quickly version. 2do: throw away. 
*/
    

const log = console.log;

const {readFileSync} = require("fs");
const { toNamespacedPath } = require("path");

// config 1of3: select input fiile (input2.txt or input3.txt). 
const inputFromFile = readFileSync("input1.txt", "utf-8").split('\r\n');
// log('01_input-from-file: ')
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
    log(`fn2: inputfile as grid:`)
    console.table(gridAsTable); 

// function 3: the data to use for adventOfCode assignment: 
    let grid = arrayAsArrayWithSubArrays.map((subArray, indexRow) => {
        return subArray
        .toString().split("")
        .map((number, indexCol) => {return { indexRow: indexRow, indexCol: indexCol,  scenicScore: 0, height: parseInt(number), isVisibleFromOutsideGrid: false }}) // do not change prevState.
    })
    // log(`grid: `)
    // console.table(grid);
    // log(grid.length)
    // log(grid[0].length);

// function 4:
    let selectCol = (grid, columnNr) => {
        let selectColumn = (cell) => cell.indexCol == columnNr; 
        let nestedArrWithAllValuesFromCol = grid.map( subarray => subarray.filter(selectColumn ));

        // log(nestedArrWithAllValuesFromCol) 

        //step: remove 1 pair of []:
        let nestedArrWithAllValuesFromColFlat = nestedArrWithAllValuesFromCol.flat();
        log(nestedArrWithAllValuesFromColFlat)
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
    // log(nestedArrWithAllValuesFromRowFlat); // status: ok


// function 6a: 
    const setScenicScoreForRowFromAngleLeftToRight = (nestedArrWithAllValuesFrom1ColOrRow) => {
        log(`in fn setScenicScoreForRowFromAngleLeftToRight: --------------------------------------------------------------------`)
        log(`from tree under investigation: count scenic score on LEFT side of tree: `)
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
        let arrayCellsWithScenicScore = nestedArrWithAllValuesFrom1ColOrRow.map((treeUnderInvestigation, indexOfTreeUnderInvestigation, nestedArrWithAllValuesFrom1ColOrRow) => {
            let scenicScore = 0;  
            /*
                in part1 I could use helper variable 'highestValue', but here  in part 2 I must compare treeUnderInvestigation.height with 
                each of the previous values in the row or column individually. That is why I use a for loop here: 
            */
            for (let i = 0; i <= indexOfTreeUnderInvestigation; i++) {
                // alternative: instead of 'indexOfTreeUnderInvestigation' use 'treeUnderInvestigation.indexRow'.
                // log(treeUnderInvestigation)
                // log(treeUnderInvestigation.height)
                // log(typeof(treeUnderInvestigation.height))
                // log(nestedArrWithAllValuesFrom1ColOrRow[i])
                if (nestedArrWithAllValuesFrom1ColOrRow[i].indexCol < treeUnderInvestigation.indexCol) {   
                    // check in the 4 logs for any off-by-one errors:
                    log(`<start of investigation of tree: > `)
                    log(`treeUnderInvestigation.indexRow: ${treeUnderInvestigation.indexRow}`);
                    log(`treeUnderInvestigation.indexCol: ${treeUnderInvestigation.indexCol}`);
                    log(`nestedArrWithAllValuesFrom1ColOrRow[i].indexRow: ${nestedArrWithAllValuesFrom1ColOrRow[i].indexRow}`);
                    log(`nestedArrWithAllValuesFrom1ColOrRow[i].indexCol: ${nestedArrWithAllValuesFrom1ColOrRow[i].indexCol}`);

                    if ( nestedArrWithAllValuesFrom1ColOrRow[i].height < treeUnderInvestigation.height) {
                        // any height difference between values < tree-under-consideration.height is...irrelevant.
                        // ex from https://adventofcode.com/2022/day/8 :  33549 --> 5 can see 3 and 3, while 3 is not blocking the 
                        // view of 5 on the other 3.
                        // fictitious ex: 14532  --> 5 can see 4 and 1, while  4 is not blocking the view of 5 on 1.
                        scenicScore +=1;
                        log('scenicScore += 1')
                    } else if ( nestedArrWithAllValuesFrom1ColOrRow[i].height == treeUnderInvestigation.height) {
                        // As a consequence: all previous B's (0, 1 or more) are no longer visible 
                        // from tree-under-consideration.
                        // now you can only see 1 B, so:
                        scenicScore =1;  
                        log('scenicScore = 1')                                               
                    } else {
                        // tree under investigation is bigger than tree-under-consideration. As a consequence:
                        // all previous A-arrayElements (0, 1 or more) are no longer visible from tree-under-consideration.
                        // now you can't see any tree, so:
                        scenicScore = 0;  
                        log('scenicScore = 0') 
                        // business requirement: if tree is taller than tree-under-consideration, then elves cannot see the tree
                    }
                } else {               
                    // I have reached tree-under-consideration (from either left-to-right, or bottom-to-top), so nothing left to do.
                        log(`total scenicScore: << ${scenicScore} >> for tree-under-investigation from angle left-to-right`);
                        // update the scenicScore for this particular cell <read: tree from grid/>  
                        treeUnderInvestigation.scenicScore = scenicScore;     
                        log(`</end of investigation of this tree.>`)  
                        return treeUnderInvestigation.scenicScore;  
                } 
            }
        })
        log(`<end of setScenicScoreForRowFromAngleLeftToRight/>`)
        log(grid[0])
        log(arrayCellsWithScenicScore)
        /*
            sample of output: [ 0, 1, 0, 3, 0 ]
        */
        return arrayCellsWithScenicScore;
    }

// function 6b:
    const setScenicScoreForRowFromAngleRightToLeft = (nestedArrWithAllValuesFrom1ColOrRow) => {
        log(`fn setScenicScoreForRowFromAngleRightToLeft: --------------------------------------------------------------------`)
        log(`from tree under investigation: count scenic score on RIGHT side of tree: `)
        let arrayCellsWithScenicScore = [...nestedArrWithAllValuesFrom1ColOrRow].reverse();
            let result = arrayCellsWithScenicScore.map((treeUnderInvestigation, indexOfTreeUnderInvestigation, arrayCellsWithScenicScore ) => {
                let scenicScore = 0; 
                for (let i = 0; i <= indexOfTreeUnderInvestigation; i++) {
                    // alternative: instead of 'indexOfTreeUnderInvestigation' use 'treeUnderInvestigation.indexRow'.

                    // log(treeUnderInvestigation)
                    // log(nestedArrWithAllValuesFrom1ColOrRow[i])

                    if (arrayCellsWithScenicScore[i].indexCol > treeUnderInvestigation.indexCol) {   
                        /* pitfall: I have reversed the array, but value of 'index.Col' is (was already) 
                            hard-coded inside each tree-object when the grid of trees was instantiated.
                            ex:
                            {
                                indexRow: 4,
                                indexCol: 4,
                                scenicScore: 0,
                                height: 0,
                                isVisibleFromOutsideGrid: false
                            }
                            {
                                indexRow: 4,
                                indexCol: 3,
                                scenicScore: 0,
                                height: 9,
                                isVisibleFromOutsideGrid: false
                            }
                        
                        So in fn setScenicScoreForRowOrCol it was '<', but here in fn setScenicScoreForRowOrColInReverseOrder
                        I need '>' instead !!

                        */
                        // check in the 4 logs for any off-by-one errors:
                        log(`<start of investigation of tree: > `)
                        log(`treeUnderInvestigation.indexRow: ${treeUnderInvestigation.indexRow}`);
                        log(`treeUnderInvestigation.indexCol: ${treeUnderInvestigation.indexCol}`);
                        log(`arrayCellsWithScenicScore[i].indexRow: ${arrayCellsWithScenicScore[i].indexRow}`);
                        log(`arrayCellsWithScenicScore[i].indexCol: ${arrayCellsWithScenicScore[i].indexCol}`);

                        if ( arrayCellsWithScenicScore[i].height < treeUnderInvestigation.height) {

                            // any height difference between values < tree-under-consideration.height is...irrelevant.
                            // ex from https://adventofcode.com/2022/day/8 :  33549 --> 5 can see 3 and 3, while 3 is not blocking the 
                            // view of 5 on the other 3.
                            // fictitious ex: 14532  --> 5 can see 4 and 1, while  4 is not blocking the view of 5 on 1.
                            scenicScore +=1;
                            log('scenicScore += 1')
                        } else if (arrayCellsWithScenicScore[i].height == treeUnderInvestigation.height) {
                            // As a consequence: all previous B's (0, 1 or more) are no longer visible 
                            // from tree-under-consideration.
                            // now you can only see 1 B, so:
                            scenicScore =1; 
                            log('scenicScore = 1')                                                   
                        } else {
                            // tree under investigation is bigger than tree-under-consideration. As a consequence:
                            // all previous A-arrayElements (0, 1 or more) are no longer visible from tree-under-consideration.
                            // now you can't see any tree, so:
                            scenicScore = 0;  
                            log('scenicScore = 0')  
                            // business requirement: if tree is taller than tree-under-consideration, then elves cannot see the tree
                        }
                    } else {
                        // I have reached tree-under-consideration (from either left-to-right, or bottom-to-top), so nothing left to do.
                        log(`total scenicScore: <<end ${scenicScore} >> for tree-under-investigation from angle right-to-left`);
                        // update the scenicScore for this particular cell <read: tree from grid/>  
                        treeUnderInvestigation.scenicScore *= scenicScore; // `${scenicScore.toString},`; 
                        log(`</end of investigation of this tree.>`)  
                        return treeUnderInvestigation.scenicScore;        
                    } 
                }
            })
            //arrayCellsWithScenicScore
        let arrayForestTreesInOriginalOrder = result.reverse();

        log(`<end of setScenicScoreForRowFromAngleRightToLeft/>`)
        // log(grid[0])
        log(arrayForestTreesInOriginalOrder)
        /*
            sample of output: [ 0, 1, 0, 3, 0 ]
        */
        return arrayForestTreesInOriginalOrder;
    }

// function 7a: 
    const setScenicScoreForColFromAngleTopToBottom = (nestedArrWithAllValuesFrom1Col) => {
        log(`fn setScenicScoreForColFromAngleTopToBottom: --------------------------------------------------------------------`)
        log(`from tree under investigation: count scenic score on TOP side of tree: `)
        let result = nestedArrWithAllValuesFrom1Col.forEach((treeUnderInvestigation, indexOfTreeUnderInvestigation, nestedArrWithAllValuesFrom1ColOrRow) => {
            let scenicScore = 0;  
            /*
                in part1 I could use helper variable 'highestValue', but here  in part 2 I must compare treeUnderInvestigation.height with 
                each of the previous values in the row or column individually. That is why I use a for loop here: 
            */
           log(`inside fn 7a`)
            for (let i = 0; i <= indexOfTreeUnderInvestigation; i++) {
                // alternative: instead of 'indexOfTreeUnderInvestigation' use 'treeUnderInvestigation.indexRow'.
                log(`inside the for-loop of 7a`)
                // log(treeUnderInvestigation)
                // log(treeUnderInvestigation.height)
                // log(typeof(treeUnderInvestigation.height))
                // log(nestedArrWithAllValuesFrom1ColOrRow[i])

                /*
                    pitfall: unlike part 1 (where I compare with the highest value), here I compare with the real grid table. Because
                    I compare in vertical direction ('angle: top to bottom'), I must replace in following line of code
                    '.indexCol' by '.indexRow'. !!
                */
                if (nestedArrWithAllValuesFrom1ColOrRow[i].indexRow < treeUnderInvestigation.indexRow) {   
                    // check in the 4 logs for any off-by-one errors:
                    log(`<start of investigation of tree: > `)
                    log(`treeUnderInvestigation.indexRow: ${treeUnderInvestigation.indexRow}`);
                    log(`treeUnderInvestigation.indexCol: ${treeUnderInvestigation.indexCol}`);
                    log(`nestedArrWithAllValuesFrom1ColOrRow[i].indexRow: ${nestedArrWithAllValuesFrom1ColOrRow[i].indexRow}`);
                    log(`nestedArrWithAllValuesFrom1ColOrRow[i].indexCol: ${nestedArrWithAllValuesFrom1ColOrRow[i].indexCol}`);

                    if ( nestedArrWithAllValuesFrom1ColOrRow[i].height < treeUnderInvestigation.height) {

                        scenicScore +=1;
                        log('scenicScore += 1')
                    } else if ( nestedArrWithAllValuesFrom1ColOrRow[i].height == treeUnderInvestigation.height) {
                        // As a consequence: all previous B's (0, 1 or more) are no longer visible 
                        // from tree-under-consideration.
                        // now you can only see 1 B, so:
                        scenicScore =1;  
                        log('scenicScore = 1')                                               
                    } else {
                        // tree under investigation is bigger than tree-under-consideration. As a consequence:
                        // all previous A-arrayElements (0, 1 or more) are no longer visible from tree-under-consideration.
                        // now you can't see any tree, so:
                        scenicScore = 0;  
                        log('scenicScore = 0') 
                        // business requirement: if tree is taller than tree-under-consideration, then elves cannot see the tree
                    }
                } else {               
                    // I have reached tree-under-consideration (from either left-to-right, or bottom-to-top), so nothing left to do.
                        log(`total scenicScore: << ${scenicScore} >> for tree-under-investigation from bottom-to-top`);
                        // update the scenicScore for this particular cell <read: tree from grid/>  
                        // let temp = treeUnderInvestigation.scenicScore;
                        // let result = temp * scenicScore;
                        // return result;
                        treeUnderInvestigation.scenicScore = scenicScore;  
                        log(`</end of investigation of this tree.>`)  
                        return treeUnderInvestigation.scenicScore;  
                } 
            }
        })
        log(`<end of setScenicScoreForColFromAngleTopToBottom/>`)
        log(nestedArrWithAllValuesFrom1Col)
        /*
            sample of output: [ 0, 1, 0, 3, 0 ]
        */
        return nestedArrWithAllValuesFrom1Col;
    }


// function 7b:
const setScenicScoreForColFromAngleBotomToTop = (nestedArrWithAllValuesFrom1Col) => {
    log(`fn setScenicScoreForColFromAngleBotomToTop: -------------------------------------------------------------------------------------`)
    log(`from tree under investigation: count scenic score on BOTTOM side of tree: `)
    // let arrayCellsWithScenicScore = [...nestedArrWithAllValuesFrom1Col].reverse();
    arrayCellsWithScenicScore = nestedArrWithAllValuesFrom1Col.reverse()
        let result  = nestedArrWithAllValuesFrom1Col.forEach((treeUnderInvestigation, indexOfTreeUnderInvestigation, nestedArrWithAllValuesFrom1Col ) => {
            let scenicScore = 0; 
            for (let i = 0; i <= indexOfTreeUnderInvestigation; i++) {
                // alternative: instead of 'indexOfTreeUnderInvestigation' use 'treeUnderInvestigation.indexRow'.

                // log(treeUnderInvestigation)
                // log(nestedArrWithAllValuesFrom1ColOrRow[i])

                /*
                    pitfall: unlike part 1 (where I compare with the highest value), here I compare with the real grid table. Because
                    I compare in vertical direction ('angle: top to bottom'), I must replace in following line of code
                    '.indexCol' by '.indexRow'. !!
                */
                if (nestedArrWithAllValuesFrom1Col[i].indexRow > treeUnderInvestigation.indexRow) {   
                    /* pitfall: I have reversed the array, but value of 'index.Col' is (was already) 
                        hard-coded inside each tree-object when the grid of trees was instantiated.
                        ex:
                        {
                            indexRow: 4,
                            indexCol: 4,
                            scenicScore: 0,
                            height: 0,
                            isVisibleFromOutsideGrid: false
                        }
                        {
                            indexRow: 4,
                            indexCol: 3,
                            scenicScore: 0,
                            height: 9,
                            isVisibleFromOutsideGrid: false
                        }
                    
                       So in fn setScenicScoreForRowOrCol it was '<', but here in fn setScenicScoreForRowOrColInReverseOrder
                       I need '>' instead !!

                    */
                    // check in the 4 logs for any off-by-one errors:
                    log(`<start of investigation of tree: > `)
                    log(`treeUnderInvestigation.indexRow: ${treeUnderInvestigation.indexRow}`);
                    log(`treeUnderInvestigation.indexCol: ${treeUnderInvestigation.indexCol}`);
                    log(`arrayCellsWithScenicScore[i].indexRow: ${nestedArrWithAllValuesFrom1Col[i].indexRow}`);
                    log(`arrayCellsWithScenicScore[i].indexCol: ${nestedArrWithAllValuesFrom1Col[i].indexCol}`);

                    if ( nestedArrWithAllValuesFrom1Col[i].height < treeUnderInvestigation.height) {

                        // any height difference between values < tree-under-consideration.height is...irrelevant.
                        // ex from https://adventofcode.com/2022/day/8 :  33549 --> 5 can see 3 and 3, while 3 is not blocking the 
                        // view of 5 on the other 3.
                        // fictitious ex: 14532  --> 5 can see 4 and 1, while  4 is not blocking the view of 5 on 1.
                        scenicScore +=1;
                        log('scenicScore += 1')
                    } else if (nestedArrWithAllValuesFrom1Col[i].height == treeUnderInvestigation.height) {
                        // As a consequence: all previous B's (0, 1 or more) are no longer visible 
                        // from tree-under-consideration.
                        // now you can only see 1 B, so:
                        scenicScore =1; 
                        log('scenicScore = 1')                                                   
                    } else {
                        // tree under investigation is bigger than tree-under-consideration. As a consequence:
                        // all previous A-arrayElements (0, 1 or more) are no longer visible from tree-under-consideration.
                        // now you can't see any tree, so:
                        scenicScore = 0;  
                        log('scenicScore = 0')  
                        // business requirement: if tree is taller than tree-under-consideration, then elves cannot see the tree
                    }
                } else {
                    // I have reached tree-under-consideration (from either left-to-right, or bottom-to-top), so nothing left to do.
                    log(`total scenicScore: <<end ${scenicScore} >> for tree-under-investigation from angle bottom-to-top`)   
                    // update the scenicScore for this particular cell <read: tree from grid/>  
                    treeUnderInvestigation.scenicScore *= scenicScore;  
                    log(`</end of investigation of this tree.>`)  
                    return treeUnderInvestigation.scenicScore;      
                } 
            }
        })
    log(`result:`);
    log(result);
    let arrayForestTreesInOriginalOrder = nestedArrWithAllValuesFrom1Col.reverse();
    // let arrayForestTreesInOriginalOrder = result.reverse();

    log(`<end of setScenicScoreForColFromAngleBottomToTop/>`)
    log(arrayForestTreesInOriginalOrder)
    /*
        sample of output: [ 0, 1, 0, 3, 0 ]
    */
    return arrayForestTreesInOriginalOrder;
}





// function 8:
    // status: ok (100%  test coverage on input1.txt)
    // determineScenicScoreForTreeUnderInspectionLookingAtTreeUnderInspectionFromLeftToRight
    const determineTreeVisibilityLookingAtGridFromLeftToRightAndViceVersa = (grid, rowNr) => {
        
        
        log(`inside fn 8: `);
        let nestedArrWithAllValuesFromRowFlat = selectRow(grid, rowNr);  
        // log(nestedArrWithAllValuesFromRowFlat);
        // goal: to test only from left to right: 
        // let rowArrayCellsWithUpdatedVisibilityInReverseOrder = setScenicScoreForRowFromAngleLeftToRight(nestedArrWithAllValuesFromRowFlat);
        
        // goal: to test only from right to left:  only check if reverse order works: (so fn call with different argument)
        // let rowArrayCellsWithUpdatedVisibilityInReverseOrder = setScenicScoreForRowFromAngleRightToLeft(nestedArrWithAllValuesFromRowFlat);        

        // goal: run code from left-to-right, and from right-to-left: (select this option for the final adventofcode-part2-result)
        let rowArrayCellsWithUpdatedVisibilityInReverseOrder = setScenicScoreForRowFromAngleLeftToRight(nestedArrWithAllValuesFromRowFlat);
        rowArrayCellsWithUpdatedVisibilityInReverseOrder = setScenicScoreForRowFromAngleRightToLeft(nestedArrWithAllValuesFromRowFlat);

        //2do next: 2 results, so split this fn out into 2 separate fns. 

        return rowArrayCellsWithUpdatedVisibilityInReverseOrder;
    }
    // let visibilityOfRow = determineTreeVisibilityLookingAtGridFromLeftToRightAndViceVersa(grid, 2);
    // log(visibilityOfRow);





// function 9:
    // status: ok (100%  test coverage on input1.txt)
    const determineTreeVisibilityLookingAtGridFromBottomToTopAndViceVersa = (grid, colNr) => {
        log(`inside fn 9: `);
        let nestedArrWithAllValuesFromColFlat = selectCol(grid, colNr);

        // goal: to test only from top-to-bottom: 
        // let arrayCellsWithUpdatedVisibilityInReverseOrder = setScenicScoreForColFromAngleTopToBottom(nestedArrWithAllValuesFromColFlat);
        
        // goal: to test only from Bottom-to-top:
        // let arrayCellsWithUpdatedVisibilityInReverseOrder = setScenicScoreForColFromAngleBotomToTop(nestedArrWithAllValuesFromColFlat);

         
        // goal: run code from bottom-to-top and from bottom-to-top: (select this option for the final adventofcode-part2-result)
        let arrayCellsWithUpdatedVisibilityInReverseOrder = setScenicScoreForColFromAngleTopToBottom(nestedArrWithAllValuesFromColFlat);
        arrayCellsWithUpdatedVisibilityInReverseOrder = setScenicScoreForColFromAngleBotomToTop(arrayCellsWithUpdatedVisibilityInReverseOrder);

        return arrayCellsWithUpdatedVisibilityInReverseOrder;
    }
    // let visibilityOfCol = determineTreeVisibilityLookingAtGridFromBottomToTopAndViceVersa(grid, 0);
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
    log(`and now the columns:...`)

// function 11:
    const checkGridForestWhereTreehouseCanBeBuiltViaTheColumns = (grid, determineTreeVisibilityLookingAtGridFromBottomToTopAndViceVersa ) => {
        let nrOfGridCols =  (grid[0].length);

        let gridWithTreeVisibilityFromOutsideGrid = []

        for (let i = 0; i < nrOfGridCols; i++) {
            gridWithTreeVisibilityFromOutsideGrid.push(determineTreeVisibilityLookingAtGridFromBottomToTopAndViceVersa(grid, i));
        }
        return gridWithTreeVisibilityFromOutsideGrid;
    }

    
    // let gridWithVisibilityOfEachTree = checkGridForestWhereTreehouseCanBeBuiltViaTheColumns(gridWithVisibilityOfEachTreeCheckedViaTheRows, determineTreeVisibilityLookingAtGridFromBottomToTopAndViceVersa);
    let gridWithVisibilityOfEachTree = checkGridForestWhereTreehouseCanBeBuiltViaTheColumns(grid, determineTreeVisibilityLookingAtGridFromBottomToTopAndViceVersa);
    log(gridWithVisibilityOfEachTree);




    

// function 12: 
    let countNrOfTreesVisibleFromOutsideTheGrid = (gridWithVisibilityOfEachTree) => {
        let isTreeVisibleFromOutsideTheGrid = (cell) => cell.isVisibleFromOutsideGrid ;
        let arrayWithTreesThatAreVisibleFromOutsideOfTheGrid = gridWithVisibilityOfEachTree.map( subArray => subArray.filter( isTreeVisibleFromOutsideTheGrid ));
        //step: flatten this grid (grid here is array (rows) with arrays (columns) with loads of trees):
        let flattenedArrayWithTreesThatAreVisibleFromOutsideOfTheGrid = arrayWithTreesThatAreVisibleFromOutsideOfTheGrid.flat();
        // flatten the grid, but do not cut the trees down :) pun intended.
        return flattenedArrayWithTreesThatAreVisibleFromOutsideOfTheGrid.length;
    }

    // let nrOfTreesVisibleFromOutsideTheGrid = countNrOfTreesVisibleFromOutsideTheGrid(gridWithVisibilityOfEachTree);
    // log(`nrOfVisibleTreesFromOutsideOfTheGrid: ${nrOfTreesVisibleFromOutsideTheGrid}`);
    // result: for input2.txt (i.e. the real data of the puzzle) the correct answer is: 1870.



    