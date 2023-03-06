// solution-step 6: 
const setScenicScoreForRowOrCol_version1 = (nestedArrWithAllValuesFrom1ColOrRow) => {
        
    let highestValue = -1; // pesky bug: first and/or last value in grid can be value 0. So highest value must start at -1.
        let arrayCellsWithUpdatedVisibility = nestedArrWithAllValuesFrom1ColOrRow.map((cell) => {
            if (cell.scenicScore > highestValue){
            highestValue = cell.scenicScore;
            cell.isVisibleFromOutsideGrid = true;
            return cell;
            }
            return cell;
        })
    return arrayCellsWithUpdatedVisibility;
}


// solution-step 7:
const setScenicScoreForRowOrColInReverseOrder = (nestedArrWithAllValuesFrom1ColOrRow) => {
    let highestValue = -1; // pesky bug: first and/or last value in grid can be value 0. So highest value must start at -1.
    /* 
        goal: instead of left-to-right or top-to-bottom, you will look at the grid from right-to-left or bottom-to-top.
        1. "array.reverse()" 
        2. compare scenicScore to figure out which trees are not suitable for building treehouse.
        2. undo the reverse, by reversing again.
        3. then return the result.
    */
    let arrayCellsToUpdateVisibility = [...nestedArrWithAllValuesFrom1ColOrRow].reverse();
        arrayCellsToUpdateVisibility.forEach((cell) => {
            if (cell.scenicScore > highestValue){
            highestValue = cell.scenicScore;
            cell.isVisibleFromOutsideGrid = true;
            return cell;
            }
            return cell;
        })

    let arrayTreesInOriginalOrder = arrayCellsToUpdateVisibility.reverse();
    return arrayTreesInOriginalOrder;
}





// function 6: 
const setScenicScoreForRowOrCol_version2 = (nestedArrWithAllValuesFrom1ColOrRow) => {

    /*
       
        1. the tree-under-consideration has 2 responsibilities: (step 1 is copy from design in intro at top of this file).
        a) provide height with which to compare the other values in the row.
        b) provide location: x and y coordinate.
    */
   /*
        GOAL: implement proof of concept, see intro at top of this file. 
        DEFINITIONS:
        A === nestedArrWithAllValuesFrom1ColOrRow === argument of this function setScenicScoreForRowOrCol.
        B === iterated element (read: tree) of A. Each tree in the grid except for the 'tree-under-consideration' is a 'B'. All B's (from the X-axis and Y-axis of 
               the tree-under-consideration are being compared with 
               the tree-under-consideration in order to calculate the scenicScore for the tree-under-consideration.

               Of each tree in the grid you want to know the scenicScore, so what is 'tree-under-consideration' and what is B, shifts continuously.
               But at any moment there is (and can only be) only 1 tree-under-consideration and 1 B at the same time.
        
        PSEUDOCODE OF THIS FN setScenicScoreForRowOrCol: 
            let scenicScore = 0; 
            
            let heightOfTallesTreeThatIsSmallerOrSameSizeAsCurrentTree = 0;  (= F) --> 2do: skip this variable alltogether.

            for (let i = 0; i < (A).length; i++) {
                if (B.index) < (tree-under-consideration.index) {   
                    if ( B.height) < (tree-under-consideration.height) {
                        // any height difference between values < tree-under-consideration.height is...irrelevant.
                        // ex from https://adventofcode.com/2022/day/8 :  33549 --> 5 can see 3 and 3, while 3 is not blocking the view of 5 on the other 3..
                        // fictitious ex: 14532  --> 5 can see 4 and 1, while  4 is not blocking the view of 5 on 1.
                        
                        if ( B.height) < (F) {
                            scenicScore +=1;

                             problem: ...   imho: (F) is irrelevant, so skip this if-statement!!!!!!!!!!!!!!!!!!!!

                        else if ( B.height) == (F) {
                            // tree under investigation (=== B) is as tall as 
                            // heightOfTallesTreeThatIsSmallerOrSameSizeAsCurrentTree. As a consequence all previous 
                            // A-arrayElements (0, 1 or more) are no longer visible from tree-under-consideration.
                            // now you can only see the "1 tree under investigation", so
                            scenicScore =1;    
                        }
                        } else {
                            // tree under investigation (=== B) is taller than
                            // heightOfTallesTreeThatIsSmallerOrSameSizeAsCurrentTree. As a consequence all previous 
                            // A-arrayElements (0, 1 or more) are no longer visible from tree-under-consideration.
                            // now you can only see the "1 tree under investigation", so
                            scenicScore =1;                           
                            F = B.height //
                        }

                    else if ( B.height) == (tree-under-consideration height) {
                        // tree under investigation (=== B) is as tall as tree-under-consideration. 
                        // As a consequence: all previous A-arrayElements (0, 1 or more) are no longer visible 
                        // from tree-under-consideration.
                        // now you can only see the "1 tree under investigation", so
                        scenicScore =1;  

                        // pitfall: the next B (i.e. in next iteration) can be smaller, same size or bigger. Each 
                        // has its own impact on variable scenicScore (as explained in this pseudocode).
                        
                        }                       
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

    let highestValue = -1; // pesky bug: first and/or last value in grid can be value 0. So highest value must start at -1.
        let arrayCellsWithUpdatedVisibility = nestedArrWithAllValuesFrom1ColOrRow.map((cell) => {
            if (cell.scenicScore > highestValue){
            highestValue = cell.scenicScore;
            cell.isVisibleFromOutsideGrid = true;
            return cell;
            }
            return cell;
        })
    return arrayCellsWithUpdatedVisibility;
}


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
        A === nestedArrWithAllValuesFrom1ColOrRow === argument of this function setScenicScoreForRowOrCol.
        B === iterated element (read: tree) of A. Each tree in the grid except for the 'tree-under-consideration' is a 'B'. 
               All B's (from the X-axis and Y-axis of 
               the tree-under-consideration are being compared with 
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

    let highestValue = -1; // pesky bug: first and/or last value in grid can be value 0. So highest value must start at -1.
        let arrayCellsWithUpdatedVisibility = nestedArrWithAllValuesFrom1ColOrRow.map((cell) => {
            if (cell.scenicScore > highestValue){
            highestValue = cell.scenicScore;
            cell.isVisibleFromOutsideGrid = true;
            return cell;
            }
            return cell;
        })
    return arrayCellsWithUpdatedVisibility;
}