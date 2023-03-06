/*
     first read comment (about design) at the start of adVentOfCode2022Day09_part1_try01.js    (and then try02.js, try03.js, try04_no_logs.js).


            Goal: create method calculateXAndYCoordinatesOfTail that combines ALL directions (south, north-west, etc.) !!
            next: implement this in part2_try06.js.


            status: Result from input3.txt === 36 (correct: same answer as example code  on https://adventofcode.com/2022/day/9)

            next: in part2_try08.js Remove all comments and run code with input2.txt.


    definitions:
    head = Object1 = 1st object that traverses gridToPlotPositionOfTail. head takes the input from inputfile (e.g. input1.txt or
         input2.txt) to position itself on the grid.
    tail = objects 2-10 = e.g. object2, object7. A tail-object takes the output from the previous object 
        (head or tail) to position itself on the grid.




    CRUD of variables (compared to day 9 part 1):
        1. movefRopeTailOnRopeBridgeOneStepAtATime (old) --> movefRopeTailOnRopeBridgeOneStepAtATimeForEachInstructionFromInputFile (new)
        2. xCoordinateOfTailInGrid (old) --> xCoordinateOfTail1InGrid (new)
        3.  yCoordinateOfTailInGrid (old) --> yCoordinateOfTail1InGrid (new)



*/

const log = console.log;

const {readFileSync} = require("fs");
const { toNamespacedPath } = require("path");


const motionsOfRopeHeadOfRopeBridge = readFileSync("input3.txt", "utf-8").split('\r\n');
// log('01_input-from-file: ')
// log(input)

// globalCounterSetTailNineToTrueInMethodnmovefRopeTailOnRopeBridgeOneStepAtATimeForEachInstructionFromInputFile:
let globalCounterSetTailNineToTrue = 0;
// uc: use variable globalCounterSetTailNineToTrue to quickly search the console.log-statements in the vscode terminal,
// for the cell in the grid where you want to investigate.
// in inputfile3.txt 36 cells are set to 'tru1', so I can look for e.g. globalCounterSetTailNineToTrue:29

// const motionsOfRopeHeadOfRopeBridge = [
//     'R 4', 
//     'U 4',
//     'L 3', 
//     'D 1',
//     'R 4', 'D 1',
//     'L 5', 'R 2'
//   ];


// const motionsOfRopeHeadOfRopeBridge = [
//   'R 5',  'U 8',
//   'L 8',  'D 3',
//   'R 17', 'D 10',
//   'L 25', 'U 20'
// ]

// const motionsOfRopeHeadOfRopeBridge = [
//     'U 12', 'L 16', 'R 30', 'D 40'
//   ]
// 'L 8', 'D 3'  ,  'U 14'

//input2.txt:
// let nrOfRequiredRowsInGridHardCoded = 1000;
// let nrOfRequiredColsInGridHardCoded = 1000;
// let cellXAndYCoordinatesOfStartPointInGridHardCoded = [500, 500];


//input3.txt:
let nrOfRequiredRowsInGridHardCoded = 33;
let nrOfRequiredColsInGridHardCoded = 33;
let cellXAndYCoordinatesOfStartPointInGridHardCoded = [16,12];


class MachineToModelKnotsPositionsInGrid {
    constructor() {
        this.xPreviousCoordinateOfHead = 0; //only used in method createArrayWithDataThatIsNeededInOtherCodeAsInputToCalculateNrOfRowsAndColsInGrid
        this.yPreviousCoordinateOfHead = 0; // idem.
        this.xPreviousCoordinateOfTail = 0; // not in use. 2do: remove.
        this.yPreviousCoordinateOfTail = 0; // not in use. 2do: remove.
        this.xCoordinateLowestAndHighestDistanceFromStartPoint = []; 
        /*
            used in 3 fns:
            a) createArrayWithDataThatIsNeededInOtherCodeAsInputToCalculateNrOfRowsAndColsInGrid
            b) calculateNrOfRequiredRowsInGrid
            c) calculateCellXAndYCoordinatesOfStartingPointInGrid
        */
        this.yCoordinateLowestAndHighestDistanceFromStartPoint = []; // idem.
        this.gridNrOfRows = 0; //calculate with fn calculateNrOfRequiredRowsInGrid, or set manually. See above.
        this.gridNrOfCols = 0; // idem.
        this.xCoordinateOfHeadInGrid; // remark: head object will be adjusted with xCoordinateStartingPointInGrid, to put the instructions on top of the grid.
        this.yCoordinateOfHeadInGrid; // remark: head object will be adjusted with yCoordinateStartingPointInGrid, to put the instructions on top of the grid.
        this.xCoordinateOfTailInGrid; // not in use. 2do: remove.
        this.yCoordinateOfTailInGrid;  // not in use. 2do: remove.
        
        this.xCoordinateOfTail1InGrid; 
        this.yCoordinateOfTail1InGrid; 
        this.xCoordinateOfTail2InGrid; 
        this.yCoordinateOfTail2InGrid; 
        this.xCoordinateOfTail3InGrid; 
        this.yCoordinateOfTail3InGrid; 
        this.xCoordinateOfTail4InGrid; 
        this.yCoordinateOfTail4InGrid;  
        this.xCoordinateOfTail5InGrid; 
        this.yCoordinateOfTail5InGrid; 
        this.xCoordinateOfTail6InGrid; 
        this.yCoordinateOfTail6InGrid;  
        this.xCoordinateOfTail7InGrid; 
        this.yCoordinateOfTail7InGrid; 
        this.xCoordinateOfTail8InGrid; 
        this.yCoordinateOfTail8InGrid;   
        this.xCoordinateOfTail9InGrid; 
        this.yCoordinateOfTail9InGrid;     

        this.xCoordinateStartingPointInGrid;
        this.yCoordinateStartingPointInGrid;
        this.gridToPlotPositionOf9TailsWithForEachGridCellABooleanIsVisited; // you need the instanciated object to create this grid.  
        
    }

    // use this static if this.gridToPlotPositionOf9TailsWithForEachGridCellABooleanIsVisited 
    // turns out to by byVal instead of byRef...in that case the 1 head-object and 9 tail-objects
    // cannot share the same grid. If so, using a static will save the day :).
    static gridToStoreOutputOfMethodMovefRopeTailOnRopeBridgeOneStepAtATimeSoNextTailObjectCanUseIt = [];

//calculateRopeBridgeNrOfRowsAndColsAndStartingPoint

    createArrayWithDataThatIsNeededInOtherCodeAsInputToCalculateNrOfRowsAndColsInGrid(motionOfRopeHeadOfRopeBridge){
        let directionOfMovement, nrOfRopeHeadStepsOnRopeBridge;
        let arrayWithSplittedMotionOfElvesOnRopeBridge = motionOfRopeHeadOfRopeBridge.split(" ");
        directionOfMovement = arrayWithSplittedMotionOfElvesOnRopeBridge[0];
        nrOfRopeHeadStepsOnRopeBridge = parseInt(arrayWithSplittedMotionOfElvesOnRopeBridge[1]);
        
        // log(directionOfMovement, nrOfRopeHeadStepsOnRopeBridge); // e.g. R 4  or U 4 or L 3 etc.
        switch(directionOfMovement){
            case 'D':
                this.xCoordinateLowestAndHighestDistanceFromStartPoint.push(this.xPreviousCoordinateOfHead + nrOfRopeHeadStepsOnRopeBridge ); 
                this.xPreviousCoordinateOfHead  += nrOfRopeHeadStepsOnRopeBridge;
                break;
            case 'L':
                this.yCoordinateLowestAndHighestDistanceFromStartPoint.push(this.yPreviousCoordinateOfHead - nrOfRopeHeadStepsOnRopeBridge ); 
                this.yPreviousCoordinateOfHead -= nrOfRopeHeadStepsOnRopeBridge;
                break;            
            case 'R':
                this.yCoordinateLowestAndHighestDistanceFromStartPoint.push(this.yPreviousCoordinateOfHead + nrOfRopeHeadStepsOnRopeBridge ); 
                this.yPreviousCoordinateOfHead += nrOfRopeHeadStepsOnRopeBridge;
                break;
            case 'U':
                this.xCoordinateLowestAndHighestDistanceFromStartPoint.push(this.xPreviousCoordinateOfHead - nrOfRopeHeadStepsOnRopeBridge ); 
                this.xPreviousCoordinateOfHead -= nrOfRopeHeadStepsOnRopeBridge;
                break;            
        }
        // log(`head coordinates: x: ${this.xPreviousCoordinateOfHead}, y:${this.yPreviousCoordinateOfHead} `)
        /*
            output of input1.txt:

            head coordinates: x: 0, y:4
            head coordinates: x: -4, y:4
            head coordinates: x: -4, y:1
            head coordinates: x: -3, y:1
            head coordinates: x: -3, y:5
            head coordinates: x: -2, y:5
            head coordinates: x: -2, y:0
            head coordinates: x: -2, y:2

            analysis: because you start at [0,0] in the lower left corner, you end up 2 rows higher and 2 cols to the right: [-2, 2]
            Code works correctly. 
            Problem: the algorithm moves outside of the grid.
            Solution: move the starting point from above [0,0] to [4,0]. 
            PS: my fn calculateCellXAndYCoordinatesOfStartingPointInGrid has calculated [4,0]. 
            This adjustment/ correction of [4,0] been implemented in fn moveOnRopeBridge next:
        */
    }


    moveRopeHeadOnRopeBridgeByJumpingToDestinationCell_NOTINUSE(motionOfRopeHeadOfRopeBridge) {
        /*
         this fn is useful to check  if an instruction  (e.g. D 4,  R 5, L2, etc.) leads to the correct destination cell.
         So I use this fn to visually quickly jump through the grid and check if the correct destination cells 
         in gridRopeBridge are set to false. This fn is also a stepping stone to create fn moveOnRopeBridgeOneStepAtATime.
        */ 

        /* 
           Caveat: e.g. D 4 means: 4 steps down. For EACH step on the way, you must check if the tail hits a new cell.
           But in this fn you jump straight to the destination cell. In e.g. D 4 you jump 4 cells down and at the destination cell,  you 
           check the position of the tail. But you must do this for EACH of the steps on the way.
        */ 
        let directionOfMovement, nrOfRopeHeadStepsOnRopeBridge;
        let arrayWithSplittedMotionOfElvesOnRopeBridge = motionOfRopeHeadOfRopeBridge.split(" ");
        directionOfMovement = arrayWithSplittedMotionOfElvesOnRopeBridge[0];
        nrOfRopeHeadStepsOnRopeBridge = parseInt(arrayWithSplittedMotionOfElvesOnRopeBridge[1]);       
        // log(directionOfMovement, nrOfRopeHeadStepsOnRopeBridge); // e.g. R 4  or U 4 or L 3 etc.

        //set starting position (on the rope bridge) where the elves start to walk: 
        this.gridToPlotPositionOf9TailsWithForEachGridCellABooleanIsVisited[this.xCoordinateOfHeadInGrid][this.yCoordinateOfHeadInGrid] = 'tru';
        log(this.gridToPlotPositionOf9TailsWithForEachGridCellABooleanIsVisited);
        
        switch(directionOfMovement){
            case 'D':
                this.xCoordinateOfHeadInGrid += nrOfRopeHeadStepsOnRopeBridge;
                break;
            case 'L':
                this.yCoordinateOfHeadInGrid -= nrOfRopeHeadStepsOnRopeBridge;
                break;            
            case 'R':
                this.yCoordinateOfHeadInGrid += nrOfRopeHeadStepsOnRopeBridge;
                break;
            case 'U':
                this.xCoordinateOfHeadInGrid -= nrOfRopeHeadStepsOnRopeBridge;
                break;            
        }
        log(`head coordinates: x: ${this.xCoordinateOfHeadInGrid}, y:${this.yCoordinateOfHeadInGrid} `)
        /*
            output:
                head coordinates: x: 4, y:4  --> startingPoint [4,0] "plus" the first instruction from input1.txt "R 4": 4 elf steps to the right.
                head coordinates: x: 0, y:4  --> 2nd instruction from input1.txt "U 4": 4 elf steps down.
                head coordinates: x: 0, y:1
                head coordinates: x: 1, y:1
                head coordinates: x: 1, y:5
                head coordinates: x: 2, y:5
                head coordinates: x: 2, y:0
                head coordinates: x: 2, y:2

            analysis: I end in [2,2]. Because I make at the start a correction of [4,0]:
            a) all elf steps lie within the created grid, so all tail positions visited at least once, are now also inside the grid. 
            b) I can use [0,0] as the grid origin. This helps me to visualize what is going on in the 
            grid (just like reading the instructions of how to traverse a chess board with a list of chess steps ). Now I have all the building 
            blocks / ingredients to track the location of the rope-tail.
        */       
        
        log`method moveOnRopeBridge: after each elf step another boolean false is added to gridRopeBridge:`
        this.gridToPlotPositionOf9TailsWithForEachGridCellABooleanIsVisited[this.xCoordinateOfHeadInGrid][this.yCoordinateOfHeadInGrid] = 'tru';
        log(this.gridToPlotPositionOf9TailsWithForEachGridCellABooleanIsVisited);
        //pitfall: the starting position in the grid is NOT set to 'tru'. So off-by-one error. This is corrected above the switch-statement.
    }

    
    calculateXAndYCoordinatesOfTail = (xLeadingKnot, yLeadingKnot, xFollowingTailKnot, yFollowingTailKnot) => {  
        log(`fn: calculateXAndYCoordinatesOfTail:`) 
        log(`xLeadingKnot: before update: ${xLeadingKnot}`);
        log(`yLeadingKnot: before update: ${yLeadingKnot}`);
        log(`xFollowingTailKnot: before update: ${xFollowingTailKnot}`);
        log(`yFollowingTailKnot: before update: ${yFollowingTailKnot}`); 
        
        if(xLeadingKnot - xFollowingTailKnot == 0 && 
           yLeadingKnot - yFollowingTailKnot == 0)
        {
            log('head on top of tail')
        // } else if (
        //     yLeadingKnot - yFollowingTailKnot ==  1 ) {
        //     //log('right: head and tail adjacent, so tail not moving.')
        // } else if (xLeadingKnot - xFollowingTailKnot == 0 && 
        //     (Math.abs(yLeadingKnot - yFollowingTailKnot)) == 1 ) {
        //     //log('right: head and tail adjacent, so tail not moving.')

        // South === down: 

        //North === up:
        } else if (xLeadingKnot - xFollowingTailKnot == -2 && 
            yLeadingKnot - yFollowingTailKnot == 0 ) {
            //log(`U: going north: `)
            xFollowingTailKnot -= 1;
        } else if (xLeadingKnot - xFollowingTailKnot == -2 && // scope: only rope-tail 2-10. out-of-scope: rope-tail 1.
            yLeadingKnot - yFollowingTailKnot == 1 ) {
            //log(`R: tail goes north-north-east: `)
            xFollowingTailKnot -= 1;
            yFollowingTailKnot += 1;
        } else if (xLeadingKnot - xFollowingTailKnot == - 2 && 
            yLeadingKnot - yFollowingTailKnot ==  2 ) {
            //log(`R: tail goes North-East: `)
            xFollowingTailKnot -= 1;
            yFollowingTailKnot += 1;   
        } else if (xLeadingKnot - xFollowingTailKnot == -1 && 
            yLeadingKnot - yFollowingTailKnot == 2 ) {
            //log(`R: tail goes East-North-East:`)
            xFollowingTailKnot += -1;
            yFollowingTailKnot += 1;


        //East === right: 
        } else if (xLeadingKnot - xFollowingTailKnot == 0 && 
            yLeadingKnot - yFollowingTailKnot == 2 ) {
            //log(`R: going east: `)
            // xFollowingTailKnot = xFollowingTailKnot ;
            yFollowingTailKnot += 1;

        } else if (xLeadingKnot - xFollowingTailKnot == 1 && 
            yLeadingKnot - yFollowingTailKnot == 2 ) {
            //log(`R: going east-south-east: `)
            xFollowingTailKnot += 1;
            yFollowingTailKnot += 1;

        } else if (xLeadingKnot - xFollowingTailKnot == 2 && 
            yLeadingKnot - yFollowingTailKnot == 2 ) {
            //log(`tail goes South-East: `)
            xFollowingTailKnot += 1;
            yFollowingTailKnot += 1; 


                                    
        } else if (xLeadingKnot - xFollowingTailKnot == 2 && 
            yLeadingKnot - yFollowingTailKnot == 1 ) {
            //log(`tail goes South-South-East: `)
            xFollowingTailKnot += 1;
            yFollowingTailKnot += 1;

        } else if (xLeadingKnot - xFollowingTailKnot == 2 && 
            yLeadingKnot - yFollowingTailKnot == 0 ) {
            //log(`tail goes South: `)
            xFollowingTailKnot += 1;
        } else if (xLeadingKnot - xFollowingTailKnot == 2 && 
            yLeadingKnot - yFollowingTailKnot == -1 ) {
            //log(`tail goes South-South-West: `)
            xFollowingTailKnot += 1;
            yFollowingTailKnot -= 1;

        } else if (xLeadingKnot - xFollowingTailKnot == 2 && 
            yLeadingKnot - yFollowingTailKnot == - 2 ) {
            //log(`tail goes South-West: `)
            xFollowingTailKnot += 1;
            yFollowingTailKnot -= 1;  

        } else if (xLeadingKnot - xFollowingTailKnot == 1 && 
            yLeadingKnot - yFollowingTailKnot == -2 ) {
            //log(`L: going west-south-west: `)
            xFollowingTailKnot += 1;
            yFollowingTailKnot -= 1;      

 
      
            //West === Left:
        } else if (xLeadingKnot - xFollowingTailKnot == 0 && 
            yLeadingKnot - yFollowingTailKnot == -2 ) {
            //log(`L: going west: `)
            yFollowingTailKnot -= 1;    

        } else if (xLeadingKnot - xFollowingTailKnot == -1 && 
            yLeadingKnot - yFollowingTailKnot == -2 ) {
            //log(`L: going west-north-west: `)
            xFollowingTailKnot -= 1;
            yFollowingTailKnot -= 1;        

        } else if (xLeadingKnot - xFollowingTailKnot == - 2 && 
            yLeadingKnot - yFollowingTailKnot == - 2 ) {
            //log(`U: tail goes North-West: `)
            xFollowingTailKnot -= 1;
            yFollowingTailKnot -= 1;   

        } else if (xLeadingKnot - xFollowingTailKnot == -2 && 
            yLeadingKnot - yFollowingTailKnot == -1 ) {
            //log(`U: tail goes north-north-west: `)
            xFollowingTailKnot -= 1;
            yFollowingTailKnot -= 1;
              
        } else { 
            log(`fn calculateXAndYCoordinatesOfTail: ELSE-statement: problem location:`)
            log(`x,y head: ${xLeadingKnot}, ${xFollowingTailKnot} `);
            log(`x,y tail:  ${yLeadingKnot} , ${yFollowingTailKnot}  `); 
        };
            log(`xFollowingTailKnot: (updated): ${xFollowingTailKnot}`);
            log(`yFollowingTailKnot: (updated): ${yFollowingTailKnot}`); 
        return [xFollowingTailKnot, yFollowingTailKnot]
    
}


calculateXAndYCoordinatesOfTailNine = (xLeadingKnot, yLeadingKnot, xFollowingTailKnot, yFollowingTailKnot) => { 
    // sets  tail 9 knots to 'true' in  grid (if applicable)
    log(`fn: calculateXAndYCoordinatesOfTail:`) 
    log(`xLeadingKnot: before update: ${xLeadingKnot}`);
    log(`yLeadingKnot: before update: ${yLeadingKnot}`);
    log(`xFollowingTailKnot: before update: ${xFollowingTailKnot}`);
    log(`yFollowingTailKnot: before update: ${yFollowingTailKnot}`); 

    
        if(xLeadingKnot - xFollowingTailKnot == 0 && 
            yLeadingKnot - yFollowingTailKnot == 0)
        {
            //log('right: head on top of tail')
        // } else if (
        //     yLeadingKnot - yFollowingTailKnot ==  1 ) {
        //     //log('right: head and tail adjacent, so tail not moving.')
        // } else if (xLeadingKnot - xFollowingTailKnot == 0 && 
        //     (Math.abs(yLeadingKnot - yFollowingTailKnot)) == 1 ) {
        //     //log('right: head and tail adjacent, so tail not moving.')



    } else if (xLeadingKnot - xFollowingTailKnot == -2 && 
        yLeadingKnot - yFollowingTailKnot == 0 ) {
        //log(`U: going north: `)
        xFollowingTailKnot -= 1;
        this.gridToPlotPositionOf9TailsWithForEachGridCellABooleanIsVisited[xFollowingTailKnot][yFollowingTailKnot] = 'tru';
        globalCounterSetTailNineToTrue +=1;
        log(`globalCounterSetTailNineToTrue:${globalCounterSetTailNineToTrue} `)
    } else if (xLeadingKnot - xFollowingTailKnot == -2 && // scope: only rope-tail 2-10. out-of-scope: rope-tail 1.
        yLeadingKnot - yFollowingTailKnot == 1 ) {
        //log(`R: tail goes north-north-east: `)
        xFollowingTailKnot -= 1;
        yFollowingTailKnot += 1;
        this.gridToPlotPositionOf9TailsWithForEachGridCellABooleanIsVisited[xFollowingTailKnot][yFollowingTailKnot] = 'tru';
        globalCounterSetTailNineToTrue +=1;
        log(`globalCounterSetTailNineToTrue:${globalCounterSetTailNineToTrue} `)
    } else if (xLeadingKnot - xFollowingTailKnot == - 2 && 
        yLeadingKnot - yFollowingTailKnot ==  2 ) {
        //log(`R: tail goes North-East: `)
        xFollowingTailKnot -= 1;
        yFollowingTailKnot += 1;   
        this.gridToPlotPositionOf9TailsWithForEachGridCellABooleanIsVisited[xFollowingTailKnot][yFollowingTailKnot] = 'tru';
        globalCounterSetTailNineToTrue +=1;
        log(`globalCounterSetTailNineToTrue:${globalCounterSetTailNineToTrue} `)
    } else if (xLeadingKnot - xFollowingTailKnot == -1 && 
        yLeadingKnot - yFollowingTailKnot == 2 ) {
        //log(`R: tail goes East-North-East:`)
        xFollowingTailKnot += -1;
        yFollowingTailKnot += 1;
        this.gridToPlotPositionOf9TailsWithForEachGridCellABooleanIsVisited[xFollowingTailKnot][yFollowingTailKnot] = 'tru';
        globalCounterSetTailNineToTrue +=1;
        log(`globalCounterSetTailNineToTrue:${globalCounterSetTailNineToTrue} `)

    //East === right: 
    } else if (xLeadingKnot - xFollowingTailKnot == 0 && 
        yLeadingKnot - yFollowingTailKnot == 2 ) {
        //log(`R: going east: `)
        yFollowingTailKnot += 1;
        this.gridToPlotPositionOf9TailsWithForEachGridCellABooleanIsVisited[xFollowingTailKnot][yFollowingTailKnot] = 'tru';
        globalCounterSetTailNineToTrue +=1;
        log(`globalCounterSetTailNineToTrue:${globalCounterSetTailNineToTrue} `)

    } else if (xLeadingKnot - xFollowingTailKnot == 2 && 
        yLeadingKnot - yFollowingTailKnot == 2 ) {
        //log(`tail goes South-East: `)
        xFollowingTailKnot += 1;
        yFollowingTailKnot += 1; 
        this.gridToPlotPositionOf9TailsWithForEachGridCellABooleanIsVisited[xFollowingTailKnot][yFollowingTailKnot] = 'tru';
        globalCounterSetTailNineToTrue +=1;
        log(`globalCounterSetTailNineToTrue:${globalCounterSetTailNineToTrue} `)

    } else if (xLeadingKnot - xFollowingTailKnot == 2 && 
        yLeadingKnot - yFollowingTailKnot == 0 ) {
        //log(`tail goes South: `)
        xFollowingTailKnot += 1;
        this.gridToPlotPositionOf9TailsWithForEachGridCellABooleanIsVisited[xFollowingTailKnot][yFollowingTailKnot] = 'tru';
        globalCounterSetTailNineToTrue +=1;
        log(`globalCounterSetTailNineToTrue:${globalCounterSetTailNineToTrue} `)
                                
    } else if (xLeadingKnot - xFollowingTailKnot == 2 && 
        yLeadingKnot - yFollowingTailKnot == 1 ) {
        //log(`tail goes South-South-East: `)
        xFollowingTailKnot += 1;
        yFollowingTailKnot += 1;
        this.gridToPlotPositionOf9TailsWithForEachGridCellABooleanIsVisited[xFollowingTailKnot][yFollowingTailKnot] = 'tru';
        globalCounterSetTailNineToTrue +=1;
        log(`globalCounterSetTailNineToTrue:${globalCounterSetTailNineToTrue} `)
    } else if (xLeadingKnot - xFollowingTailKnot == 2 && 
        yLeadingKnot - yFollowingTailKnot == -1 ) {
        //log(`tail goes South-South-West: `)
        xFollowingTailKnot += 1;
        yFollowingTailKnot -= 1;
        this.gridToPlotPositionOf9TailsWithForEachGridCellABooleanIsVisited[xFollowingTailKnot][yFollowingTailKnot] = 'tru';
        globalCounterSetTailNineToTrue +=1;
        log(`globalCounterSetTailNineToTrue:${globalCounterSetTailNineToTrue} `)

    } else if (xLeadingKnot - xFollowingTailKnot == 1 && 
        yLeadingKnot - yFollowingTailKnot == 2 ) {
        //log(`R: going east-south-east: `)
        xFollowingTailKnot += 1;
        yFollowingTailKnot += 1;
        this.gridToPlotPositionOf9TailsWithForEachGridCellABooleanIsVisited[xFollowingTailKnot][yFollowingTailKnot] = 'tru';
        globalCounterSetTailNineToTrue +=1;
        log(`globalCounterSetTailNineToTrue:${globalCounterSetTailNineToTrue} `)

    } else if (xLeadingKnot - xFollowingTailKnot == 1 && 
        yLeadingKnot - yFollowingTailKnot == -2 ) {
        //log(`L: going west-south-west: `)
        xFollowingTailKnot += 1;
        yFollowingTailKnot -= 1;   
        this.gridToPlotPositionOf9TailsWithForEachGridCellABooleanIsVisited[xFollowingTailKnot][yFollowingTailKnot] = 'tru';
        globalCounterSetTailNineToTrue +=1;
        log(`globalCounterSetTailNineToTrue:${globalCounterSetTailNineToTrue} `)   

    } else if (xLeadingKnot - xFollowingTailKnot == 2 && 
        yLeadingKnot - yFollowingTailKnot == - 2 ) {
        //log(`tail goes South-West: `)
        xFollowingTailKnot += 1;
        yFollowingTailKnot -= 1;   
        this.gridToPlotPositionOf9TailsWithForEachGridCellABooleanIsVisited[xFollowingTailKnot][yFollowingTailKnot] = 'tru';
        globalCounterSetTailNineToTrue +=1;
        log(`globalCounterSetTailNineToTrue:${globalCounterSetTailNineToTrue} `)
  
        //West === Left:
    } else if (xLeadingKnot - xFollowingTailKnot == 0 && 
        yLeadingKnot - yFollowingTailKnot == -2 ) {
        //log(`L: going west: `)
        yFollowingTailKnot -= 1;    
        this.gridToPlotPositionOf9TailsWithForEachGridCellABooleanIsVisited[xFollowingTailKnot][yFollowingTailKnot] = 'tru';
        globalCounterSetTailNineToTrue +=1;
        log(`globalCounterSetTailNineToTrue:${globalCounterSetTailNineToTrue} `)

    } else if (xLeadingKnot - xFollowingTailKnot == -1 && 
        yLeadingKnot - yFollowingTailKnot == -2 ) {
        //log(`L: going west-north-west: `)
        xFollowingTailKnot -= 1;
        yFollowingTailKnot -= 1;   
        this.gridToPlotPositionOf9TailsWithForEachGridCellABooleanIsVisited[xFollowingTailKnot][yFollowingTailKnot] = 'tru';
        globalCounterSetTailNineToTrue +=1;
        log(`globalCounterSetTailNineToTrue:${globalCounterSetTailNineToTrue} `)     

    } else if (xLeadingKnot - xFollowingTailKnot == - 2 && 
        yLeadingKnot - yFollowingTailKnot == - 2 ) {
        //log(`U: tail goes North-West: `)
        xFollowingTailKnot -= 1;
        yFollowingTailKnot -= 1;  
        this.gridToPlotPositionOf9TailsWithForEachGridCellABooleanIsVisited[xFollowingTailKnot][yFollowingTailKnot] = 'tru';
        globalCounterSetTailNineToTrue +=1;
        log(`globalCounterSetTailNineToTrue:${globalCounterSetTailNineToTrue} `) 

    } else if (xLeadingKnot - xFollowingTailKnot == -2 && 
        yLeadingKnot - yFollowingTailKnot == -1 ) {
        //log(`U: tail goes north-north-west: `)
        xFollowingTailKnot -= 1;
        yFollowingTailKnot -= 1;
        this.gridToPlotPositionOf9TailsWithForEachGridCellABooleanIsVisited[xFollowingTailKnot][yFollowingTailKnot] = 'tru';
        globalCounterSetTailNineToTrue +=1;
        log(`globalCounterSetTailNineToTrue:${globalCounterSetTailNineToTrue} `)
          
    } else { 
        log(`fn calculateXAndYCoordinatesOfTail: ELSE-statement: problem location:`)
        log(`x,y head: ${xLeadingKnot}, ${xFollowingTailKnot} `);
        log(`x,y tail:  ${yLeadingKnot} , ${yFollowingTailKnot}  `); 
    };
        log(`xFollowingTailKnot: (updated): ${xFollowingTailKnot}`);
        log(`yFollowingTailKnot: (updated): ${yFollowingTailKnot}`);  
    return [xFollowingTailKnot, yFollowingTailKnot]

}

    movefRopeHeadOnRopeBridgeOneStepAtATime_NOTINUSE(motionOfRopeHeadOfRopeBridge) {
        //first read comment in fn moveOnRopeBridgeByJumpingToDestinationCell.
        let directionOfMovement, nrOfRopeHeadStepsOnRopeBridge;
        let arrayWithSplittedMotionOfElvesOnRopeBridge = motionOfRopeHeadOfRopeBridge.split(" ");
        directionOfMovement = arrayWithSplittedMotionOfElvesOnRopeBridge[0];
        nrOfRopeHeadStepsOnRopeBridge = parseInt(arrayWithSplittedMotionOfElvesOnRopeBridge[1]);       
        // log(directionOfMovement, nrOfRopeHeadStepsOnRopeBridge); // e.g. R 4  or U 4 or L 3 etc.

        //set starting position (on the rope bridge) where the elves start to walk: 
        this.gridToPlotPositionOf9TailsWithForEachGridCellABooleanIsVisited[this.xCoordinateOfHeadInGrid][this.yCoordinateOfHeadInGrid] = 'tru';
        // log(this.gridToPlotPositionOf9TailsWithForEachGridCellABooleanIsVisited);
        switch(directionOfMovement){
            case 'D':
                for (let i = 0; i < nrOfRopeHeadStepsOnRopeBridge; i++) {
                    this.xCoordinateOfHeadInGrid += 1;             
                    this.gridToPlotPositionOf9TailsWithForEachGridCellABooleanIsVisited[this.xCoordinateOfHeadInGrid][this.yCoordinateOfHeadInGrid] = 'tru';
                }
                break;
            case 'L':
                for (let i = 0; i < nrOfRopeHeadStepsOnRopeBridge; i++) {
                    this.yCoordinateOfHeadInGrid -= 1;
                    this.gridToPlotPositionOf9TailsWithForEachGridCellABooleanIsVisited[this.xCoordinateOfHeadInGrid][this.yCoordinateOfHeadInGrid] = 'tru';
                }
                break;            
            case 'R':
                for (let i = 0; i < nrOfRopeHeadStepsOnRopeBridge; i++) {
                    this.yCoordinateOfHeadInGrid += 1;
                    log(this.yCoordinateOfHeadInGrid)
                    this.gridToPlotPositionOf9TailsWithForEachGridCellABooleanIsVisited[this.xCoordinateOfHeadInGrid][this.yCoordinateOfHeadInGrid] = 'tru';
                }
                break;
            case 'U':
                for (let i = 0; i < nrOfRopeHeadStepsOnRopeBridge; i++) {
                    this.xCoordinateOfHeadInGrid -= 1;
                    this.gridToPlotPositionOf9TailsWithForEachGridCellABooleanIsVisited[this.xCoordinateOfHeadInGrid][this.yCoordinateOfHeadInGrid] = 'tru';
                }
                break;            
        }
            log(`head coordinates: x: ${this.xCoordinateOfHeadInGrid}, y:${this.yCoordinateOfHeadInGrid} `)
            // log`method moveOnRopeBridge: after each elf step another boolean false is added to gridRopeBridge:`
            
            // this.gridToPlotPositionOf9TailsWithForEachGridCellABooleanIsVisited[this.xCoordinateOfHeadInGrid][this.yCoordinateOfHeadInGrid] = 'tru';
            log(this.gridToPlotPositionOf9TailsWithForEachGridCellABooleanIsVisited);
            //pitfall: the starting position in the grid is NOT set to 'tru'. So off-by-one error. This is corrected above the switch-statement.
            /*
                output:
                    head coordinates: x: 4, y:4  --> startingPoint [4,0] "plus" the first instruction from input1.txt "R 4": 4 elf steps to the right.
                    head coordinates: x: 0, y:4  --> 2nd instruction from input1.txt "U 4": 4 elf steps down.
                    head coordinates: x: 0, y:1
                    head coordinates: x: 1, y:1
                    head coordinates: x: 1, y:5
                    head coordinates: x: 2, y:5
                    head coordinates: x: 2, y:0
                    head coordinates: x: 2, y:2

                analysis: I end in [2,2]. Because I make at the start a correction of [4,0]:
                a) all elf steps lie within the created grid, so all tail positions visited at least once, are now also inside the grid. 
                b) I can use [0,0] as the grid origin. This helps me to visualize what is going on in the 
                grid (just like reading the instructions of how to traverse a chess board with a list of chess steps ). Now I have all the building 
                blocks / ingredients to track the location of the rope-tail.
            */
    };

    movefRopeTailOnRopeBridgeOneStepAtATimeForEachInstructionFromInputFile(motionOfRopeHeadOfRopeBridge) {
        //first read comment in fn moveOnRopeBridgeByJumpingToDestinationCell.
        let directionOfMovement, nrOfRopeHeadStepsOnRopeBridge;
        let arrayWithSplittedMotionOfElvesOnRopeBridge = motionOfRopeHeadOfRopeBridge.split(" ");
        directionOfMovement = arrayWithSplittedMotionOfElvesOnRopeBridge[0];
        nrOfRopeHeadStepsOnRopeBridge = parseInt(arrayWithSplittedMotionOfElvesOnRopeBridge[1]);       
        // log(directionOfMovement, nrOfRopeHeadStepsOnRopeBridge); // e.g. R 4  or U 4 or L 3 etc.


        // Set starting position (on the rope bridge) where the elves start to walk: 
        // this.gridToPlotPositionOf9TailsWithForEachGridCellABooleanIsVisited[this.xCoordinateOfTail1InGrid][this.yCoordinateOfTail1InGrid] = 'tru';
        /*
            problem: fn motionOfRopeHeadOfRopeBridge is called for every instruction (e.g. R 4, then U 4, etc.) from input file (e.g. input1.txt). 
            But I just want to set the starting cell of rope-tail number 9 to 'tru'.
            So this is not the place to do that.
        */
        
        // log(this.gridToPlotPositionOf9TailsWithForEachGridCellABooleanIsVisited);
        log('in fn: movefRopeTailOnRopeBridgeOneStepAtATimeForEachInstructionFromInputFile:')
        switch(directionOfMovement){
            case 'D':
                log(`----------------------------------------------------------------------------------------------------------------------------------------`);
                log(' case D-D-D-D-D-D:')
                for (let i = 0; i < nrOfRopeHeadStepsOnRopeBridge; i++) { 
                    log(`------------------next cell in loop of instruction-----------------------------------------------------------------------------------`);
                    log(`D: for-loop: i: ${i}`);
                    log(`D: for-loop: nrOfRopeHeadStepsOnRopeBridge: ${nrOfRopeHeadStepsOnRopeBridge}`);
                    log(`D: output of previous instruction:`)
                    log(`D: x,y rope-head (not updated): ${this.xCoordinateOfHeadInGrid}, ${this.yCoordinateOfHeadInGrid} `);              
                    this.xCoordinateOfHeadInGrid += 1;
                    log(`D: x,y rope-head (updated:.....:      ${this.xCoordinateOfHeadInGrid}, ${this.yCoordinateOfHeadInGrid} `);
                    log(`D: x,y rope-tail1 (not updated):  ${this.xCoordinateOfTail1InGrid} , ${this.yCoordinateOfTail1InGrid}  `); 
                    log('D: lets update the tails 1-9:')


                    const calculateNewXAndYCoordinateOfFollowingTailKnotInCaseD = (xLeadingKnot, yLeadingKnot, xFollowingTailKnot, yFollowingTailKnot) => {   
                        // the coordinates of LeadingKnot stay the same.
                        
                        //each comparison has following format: "leadingKnot operator followingKnot"
                        // xLeadingKnot (e.g. rope-knot 4)
                        // xFollowingTailKnot (e.g. rope-knot 5) (always the one after the leading rope-knot)
                        log(`D: fn: calculateNewXAndYCoordinateOfFollowingTailKnotInCaseD: `)                        
                        log(`D: for-loop: i: ${i}`);
                        log(`D: for-loop: nrOfRopeHeadStepsOnRopeBridge: ${nrOfRopeHeadStepsOnRopeBridge}`);
                        log(`D: xLeadingKnot: ${xLeadingKnot}`);
                        log(`D: yLeadingKnot: ${yLeadingKnot}`);
                        log(`D: xFollowingTailKnot: ${xFollowingTailKnot}`);
                        log(`D: yFollowingTailKnot: ${yFollowingTailKnot}`); 
                        if(xLeadingKnot - xFollowingTailKnot == 0 && 
                           yLeadingKnot - yFollowingTailKnot == 0)
                        {
                            log('D: head on top of tail')
                        // } else if (
                        //     yLeadingKnot - yFollowingTailKnot ==  1 ) {
                        //     log('right: head and tail adjacent, so tail not moving.')
                        // } else if (xLeadingKnot - xFollowingTailKnot == 0 && 
                        //     (Math.abs(yLeadingKnot - yFollowingTailKnot)) == 1 ) {
                        //     log('right: head and tail adjacent, so tail not moving.')
                        } else if (xLeadingKnot - xFollowingTailKnot == 2 && 
                            yLeadingKnot - yFollowingTailKnot == 0 ) {
                            log(`D: tail goes South: `)
                            xFollowingTailKnot += 1;
                                                    
                        } else if (xLeadingKnot - xFollowingTailKnot == 2 && 
                            yLeadingKnot - yFollowingTailKnot == 1 ) {
                            log(`D: tail goes South-South-East: `)
                            xFollowingTailKnot += 1;
                            yFollowingTailKnot += 1;
                                                    
                        } else if (xLeadingKnot - xFollowingTailKnot == 2 && 
                            yLeadingKnot - yFollowingTailKnot == 2 ) {
                            log(`D: tail goes South-East: `)
                            xFollowingTailKnot += 1;
                            yFollowingTailKnot += 1;   
                        } else if (xLeadingKnot - xFollowingTailKnot == 2 && 
                            yLeadingKnot - yFollowingTailKnot == - 2 ) {
                            log(`D: tail goes South-West: `)
                            xFollowingTailKnot += 1;
                            yFollowingTailKnot -= 1;   
                        } else if (xLeadingKnot - xFollowingTailKnot == 2 && 
                            yLeadingKnot - yFollowingTailKnot == -1 ) {
                            log(`D: tail goes South-South-West: `)
                            xFollowingTailKnot += 1;
                            yFollowingTailKnot -= 1;
                                                    
                        } else if (xLeadingKnot - xFollowingTailKnot == 1 && // scope: only rope-tail 2-10. out-of-scope: rope-tail 1.
                            yLeadingKnot - yFollowingTailKnot == 2 ) {
                            log(`D: tail goes south-east-south: `)
                            xFollowingTailKnot += 1;
                            yFollowingTailKnot += 1;
                           
                        } else if (xLeadingKnot - xFollowingTailKnot == 1 && // scope: only rope-tail 2-10. out-of-scope: rope-tail 1.
                            yLeadingKnot - yFollowingTailKnot == - 2 ) {
                            log(`D: tail goes south-west-south: `)
                            xFollowingTailKnot += 1;
                            yFollowingTailKnot -= 1;
                              
                        // } else if (xLeadingKnot - xFollowingTailKnot == 0 && 
                        //     yLeadingKnot - yFollowingTailKnot == -2 ) {
                        //     log(`D: tail goes West: `)
                        //     yFollowingTailKnot -= 1; 
                        // } else if (xLeadingKnot - xFollowingTailKnot ==  0 && 
                        //     yLeadingKnot - yFollowingTailKnot == 2 ) {
                        //     log(`D: tail goes East: `)
                        //     yFollowingTailKnot += 1;                    
                        } else { 
                            log(`fn movefRopeTailOnRopeBridgeOneStepAtATimeForEachInstructionFromInputFile: case D: else-statement:`)
                            log(`fn movefRopeTailOnRopeBridgeOneStepAtATimeForEachInstructionFromInputFile: case D: `)
                            log(`x,y head: ${xLeadingKnot}, ${xFollowingTailKnot} `);
                            log(`x,y tail:  ${yLeadingKnot} , ${yFollowingTailKnot}  `); 
                            /*
                                Backlog: put following scenario in its own else-if-statement: 
                                e.g. 
                                x,y head: 73, 121
                                x,y tail:  73 , 122

                                now ends up in else-statement. This is a situation of 'head and tail adjacent, so tail not moving.
                                (so it does not really matter, that it ends up in the else-statement.)

                                Same situation in the other else-statements inside the other case-statements below of this switch-statemnt.

                                I can make a separate else-if-statement for this. But I leave it for now. (date: 230113)
                            */
                            };
                            log(`D: xFollowingTailKnot: (updated): ${xFollowingTailKnot}`);
                            log(`D: yFollowingTailKnot: (updated): ${yFollowingTailKnot}`); 
                        return [xFollowingTailKnot, yFollowingTailKnot]
                    }

                    const calculateNewXAndYCoordinateOfTailKnot9WithVisitedGridCellCountInCaseD = (xLeadingKnot, yLeadingKnot, xFollowingTailKnot, yFollowingTailKnot) => {   
                        // the coordinates of LeadingKnot stay the same.


                        
                        //each comparison has following format: "leadingKnot operator followingKnot"
                        // xLeadingKnot (e.g. rope-knot 4)
                        // xFollowingTailKnot (e.g. rope-knot 5) (always the one after the leading rope-knot)
                        log(`D: fn: calculateNewXAndYCoordinateOfTailKnot9WithVisitedGridCellCountInCaseD: `)
                        log(`D: for-loop: i: ${i}`);
                        log(`D: for-loop: nrOfRopeHeadStepsOnRopeBridge: ${nrOfRopeHeadStepsOnRopeBridge}`);
                        log(`D: xLeadingKnot: ${xLeadingKnot}`);
                        log(`D: yLeadingKnot: ${yLeadingKnot}`);
                        log(`D: xFollowingTailKnot: ${xFollowingTailKnot}`);
                        log(`D: yFollowingTailKnot: ${yFollowingTailKnot}`); 
                        if(xLeadingKnot - xFollowingTailKnot == 0 && 
                           yLeadingKnot - yFollowingTailKnot == 0)
                        {
                            log('right: head on top of tail')
                        // } else if (
                        //     yLeadingKnot - yFollowingTailKnot ==  1 ) {
                        //     log('right: head and tail adjacent, so tail not moving.')
                        // } else if (xLeadingKnot - xFollowingTailKnot == 0 && 
                        //     (Math.abs(yLeadingKnot - yFollowingTailKnot)) == 1 ) {
                        //     log('right: head and tail adjacent, so tail not moving.')
                        } else if (xLeadingKnot - xFollowingTailKnot == 2 && 
                            yLeadingKnot - yFollowingTailKnot == 0 ) {
                            log(`tail goes South: `)
                            xFollowingTailKnot += 1;
                            this.gridToPlotPositionOf9TailsWithForEachGridCellABooleanIsVisited[xFollowingTailKnot][yFollowingTailKnot] = 'tru';
                            globalCounterSetTailNineToTrue +=1;
                            log(`globalCounterSetTailNineToTrue:${globalCounterSetTailNineToTrue} `)
                        } else if (xLeadingKnot - xFollowingTailKnot == 2 && 
                            yLeadingKnot - yFollowingTailKnot == 1 ) {
                            log(`D: tail goes South-South-East: `)
                            xFollowingTailKnot += 1;
                            yFollowingTailKnot += 1;
                            this.gridToPlotPositionOf9TailsWithForEachGridCellABooleanIsVisited[xFollowingTailKnot][yFollowingTailKnot] = 'tru';
                            globalCounterSetTailNineToTrue +=1;
                            log(`globalCounterSetTailNineToTrue:${globalCounterSetTailNineToTrue} `)
                        } else if (xLeadingKnot - xFollowingTailKnot == 2 && 
                            yLeadingKnot - yFollowingTailKnot == 2 ) {
                            log(`D: tail goes South-East: `)
                            xFollowingTailKnot += 1;
                            yFollowingTailKnot += 1;   
                            this.gridToPlotPositionOf9TailsWithForEachGridCellABooleanIsVisited[xFollowingTailKnot][yFollowingTailKnot] = 'tru';
                            globalCounterSetTailNineToTrue +=1;
                            log(`globalCounterSetTailNineToTrue:${globalCounterSetTailNineToTrue} `)
                        } else if (xLeadingKnot - xFollowingTailKnot == 2 && 
                            yLeadingKnot - yFollowingTailKnot == - 2 ) {
                            log(`D: tail goes South-West: `)
                            xFollowingTailKnot += 1;
                            yFollowingTailKnot -= 1;    
                            this.gridToPlotPositionOf9TailsWithForEachGridCellABooleanIsVisited[xFollowingTailKnot][yFollowingTailKnot] = 'tru';   
                            globalCounterSetTailNineToTrue +=1;
                            log(`globalCounterSetTailNineToTrue:${globalCounterSetTailNineToTrue} `)               
                        } else if (xLeadingKnot - xFollowingTailKnot == 2 && 
                            yLeadingKnot - yFollowingTailKnot == -1 ) {
                            log(`D: tail goes South-South-West: `)
                            xFollowingTailKnot += 1;
                            yFollowingTailKnot -= 1;
                            this.gridToPlotPositionOf9TailsWithForEachGridCellABooleanIsVisited[xFollowingTailKnot][yFollowingTailKnot] = 'tru';
                            globalCounterSetTailNineToTrue +=1;
                            log(`globalCounterSetTailNineToTrue:${globalCounterSetTailNineToTrue} `)
                        } else if (xLeadingKnot - xFollowingTailKnot == 1 && // scope: only rope-tail 2-10. out-of-scope: rope-tail 1.
                            yLeadingKnot - yFollowingTailKnot == 2 ) {
                            log(`D: tail goes south-east-south: `)
                            xFollowingTailKnot += 1;
                            yFollowingTailKnot += 1;
                            this.gridToPlotPositionOf9TailsWithForEachGridCellABooleanIsVisited[xFollowingTailKnot][yFollowingTailKnot] = 'tru';
                            globalCounterSetTailNineToTrue +=1;
                            log(`globalCounterSetTailNineToTrue:${globalCounterSetTailNineToTrue} `)
                        } else if (xLeadingKnot - xFollowingTailKnot == 1 && // scope: only rope-tail 2-10. out-of-scope: rope-tail 1.
                            yLeadingKnot - yFollowingTailKnot == - 2 ) {
                            log(`D: tail goes south-west-south: `)
                            xFollowingTailKnot += 1;
                            yFollowingTailKnot -= 1;
                            this.gridToPlotPositionOf9TailsWithForEachGridCellABooleanIsVisited[xFollowingTailKnot][yFollowingTailKnot] = 'tru';  
                            globalCounterSetTailNineToTrue +=1;
                            log(`globalCounterSetTailNineToTrue:${globalCounterSetTailNineToTrue} `)   
                        // } else if (xLeadingKnot - xFollowingTailKnot == 0 && 
                        //     yLeadingKnot - yFollowingTailKnot == -2 ) {
                        //     log(`D: tail goes West: `)
                        //     yFollowingTailKnot -= 1;
                        //     this.gridToPlotPositionOf9TailsWithForEachGridCellABooleanIsVisited[xFollowingTailKnot][yFollowingTailKnot] = 'tru'; 
                        //     globalCounterSetTailNineToTrue +=1;
                        //     log(`globalCounterSetTailNineToTrue:${globalCounterSetTailNineToTrue} `)   
                        // } else if (xLeadingKnot - xFollowingTailKnot ==  0 && 
                        //     yLeadingKnot - yFollowingTailKnot == 2 ) {
                        //     log(`D: tail goes East: `)
                        //     yFollowingTailKnot += 1;
                        //     this.gridToPlotPositionOf9TailsWithForEachGridCellABooleanIsVisited[xFollowingTailKnot][yFollowingTailKnot] = 'tru'; 
                        //     globalCounterSetTailNineToTrue +=1;
                        //     log(`globalCounterSetTailNineToTrue:${globalCounterSetTailNineToTrue} `)                      
                        } else { 
                            log(`D: fn movefRopeTailOnRopeBridgeOneStepAtATimeForEachInstructionFromInputFile: case D: else-statement:`)
                            log(`D: fn movefRopeTailOnRopeBridgeOneStepAtATimeForEachInstructionFromInputFile: case D: `)
                            log(`D: x,y head: ${xLeadingKnot}, ${xFollowingTailKnot} `);
                            log(`D: x,y tail:  ${yLeadingKnot} , ${yFollowingTailKnot}  `); 
                            /*
                                Backlog: put following scenario in its own else-if-statement: 
                                e.g. 
                                x,y head: 73, 121
                                x,y tail:  73 , 122

                                now ends up in else-statement. This is a situation of 'head and tail adjacent, so tail not moving.
                                (so it does not really matter, that it ends up in the else-statement.)

                                Same situation in the other else-statements inside the other case-statements below of this switch-statemnt.

                                I can make a separate else-if-statement for this. But I leave it for now. (date: 230113)
                            */
                            };
                            log(`D: xFollowingTailKnot: (updated): ${xFollowingTailKnot}`);
                            log(`D: yFollowingTailKnot: (updated): ${yFollowingTailKnot}`); 
                        return [xFollowingTailKnot, yFollowingTailKnot]
                    }


                    log(`----------------------------------------------------------------------------------------------------`);
                    log(`D: move rope-tail NUMBER 1:`)
                    let newCoordinatesOfRopeTail1inD = this.calculateXAndYCoordinatesOfTail(this.xCoordinateOfHeadInGrid, this.yCoordinateOfHeadInGrid, this.xCoordinateOfTail1InGrid, this.yCoordinateOfTail1InGrid)

                    /*
                        goal: update rope-tail-coordinates so it can be reused for:
                        a) remainder of this instruction (e.g. R 4 in input1.txt):
                        b) the next instruction (e.g. U4, in input1.txt):
                    */
                    this.xCoordinateOfTail1InGrid =  newCoordinatesOfRopeTail1inD[0];
                    this.yCoordinateOfTail1InGrid =  newCoordinatesOfRopeTail1inD[1];
                
                    log(`---------------------------------------------------------------------------------------------------`);
                    log(`D: move rope-tail NUMBER 2:`)
                    let newCoordinatesOfRopeTail2inD = this.calculateXAndYCoordinatesOfTail(this.xCoordinateOfTail1InGrid, this.yCoordinateOfTail1InGrid, this.xCoordinateOfTail2InGrid, this.yCoordinateOfTail2InGrid)
                    // /*
                    //     goal: update rope-tail-coordinates so it can be reused for:
                    //     a) the next instruction (e.g. R 4 in input1.txt):
                    // */
                    this.xCoordinateOfTail2InGrid =  newCoordinatesOfRopeTail2inD[0];
                    this.yCoordinateOfTail2InGrid =  newCoordinatesOfRopeTail2inD[1];
                    // log(`this.xCoordinateOfTail2InGrid: ${this.xCoordinateOfTail2InGrid}`);
                    // log(`this.yCoordinateOfTail2InGrid: ${this.yCoordinateOfTail2InGrid}`);

                    // 2do: check if this line of code is needed:
                    // this.gridToPlotPositionOf9TailsWithForEachGridCellABooleanIsVisited[this.xCoordinateOfTail2InGrid][this.yCoordinateOfTail2InGrid ] = 'tru';
                    log(`---------------------------------------------------------------------------------------------------`);
                    log(`D: move rope-tail NUMBER 3: :`)
                    let newCoordinatesOfRopeTail3inD = this.calculateXAndYCoordinatesOfTail(this.xCoordinateOfTail2InGrid, this.yCoordinateOfTail2InGrid, this.xCoordinateOfTail3InGrid, this.yCoordinateOfTail3InGrid)
                    this.xCoordinateOfTail3InGrid =  newCoordinatesOfRopeTail3inD[0];
                    this.yCoordinateOfTail3InGrid =  newCoordinatesOfRopeTail3inD[1];
                    // log(`this.xCoordinateOfTail3InGrid: ${this.xCoordinateOfTail3InGrid}`);
                    // log(`this.yCoordinateOfTail3InGrid: ${this.yCoordinateOfTail3InGrid}`);

                    log(`--------------------------------------------------------------------------------------------------`);
                    log(`D: move rope-tail NUMBER 4: :`)
                    let newCoordinatesOfRopeTail4inD = this.calculateXAndYCoordinatesOfTail(this.xCoordinateOfTail3InGrid, this.yCoordinateOfTail3InGrid, this.xCoordinateOfTail4InGrid, this.yCoordinateOfTail4InGrid)
                    this.xCoordinateOfTail4InGrid =  newCoordinatesOfRopeTail4inD[0];
                    this.yCoordinateOfTail4InGrid =  newCoordinatesOfRopeTail4inD[1];
                    // log(`this.xCoordinateOfTail4InGrid: ${this.xCoordinateOfTail4InGrid}`);
                    // log(`this.yCoordinateOfTail4InGrid: ${this.yCoordinateOfTail4InGrid}`);

                    log(`----------------------------------------------------------------------------------------------------`);
                    log(`D: move rope-tail NUMBER 5: :`)
                    let newCoordinatesOfRopeTail5inD = this.calculateXAndYCoordinatesOfTail(this.xCoordinateOfTail4InGrid, this.yCoordinateOfTail4InGrid, this.xCoordinateOfTail5InGrid, this.yCoordinateOfTail5InGrid)
                    this.xCoordinateOfTail5InGrid =  newCoordinatesOfRopeTail5inD[0];
                    this.yCoordinateOfTail5InGrid =  newCoordinatesOfRopeTail5inD[1];
                    // log(`this.xCoordinateOfTail5InGrid: ${this.xCoordinateOfTail5InGrid}`);
                    // log(`this.yCoordinateOfTail5InGrid: ${this.yCoordinateOfTail5InGrid}`);
                    log(`----------------------------------------------------------------------------------------------------`);
                    log(`D: move rope-tail NUMBER 6: :`)
                    let newCoordinatesOfRopeTail6inD = this.calculateXAndYCoordinatesOfTail(this.xCoordinateOfTail5InGrid, this.yCoordinateOfTail5InGrid, this.xCoordinateOfTail6InGrid, this.yCoordinateOfTail6InGrid)
                    this.xCoordinateOfTail6InGrid =  newCoordinatesOfRopeTail6inD[0];
                    this.yCoordinateOfTail6InGrid =  newCoordinatesOfRopeTail6inD[1];
                    // log(`this.xCoordinateOfTail6InGrid: ${this.xCoordinateOfTail6InGrid}`);
                    // log(`this.yCoordinateOfTail6InGrid: ${this.yCoordinateOfTail6InGrid}`);

                    log(`----------------------------------------------------------------------------------------------------`);
                    log(`D: move rope-tail NUMBER 7: :`)
                    let newCoordinatesOfRopeTail7inD = this.calculateXAndYCoordinatesOfTail(this.xCoordinateOfTail6InGrid, this.yCoordinateOfTail6InGrid, this.xCoordinateOfTail7InGrid, this.yCoordinateOfTail7InGrid)
                    this.xCoordinateOfTail7InGrid =  newCoordinatesOfRopeTail7inD[0];
                    this.yCoordinateOfTail7InGrid =  newCoordinatesOfRopeTail7inD[1];
                    // log(`this.xCoordinateOfTail7InGrid: ${this.xCoordinateOfTail7InGrid}`);
                    // log(`this.yCoordinateOfTail7InGrid: ${this.yCoordinateOfTail7InGrid}`);

                    log(`----------------------------------------------------------------------------------------------------`);
                    log(`D: move rope-tail NUMBER 8: :`)
                    let newCoordinatesOfRopeTail8inD = this.calculateXAndYCoordinatesOfTail(this.xCoordinateOfTail7InGrid, this.yCoordinateOfTail7InGrid, this.xCoordinateOfTail8InGrid, this.yCoordinateOfTail8InGrid)
                    this.xCoordinateOfTail8InGrid =  newCoordinatesOfRopeTail8inD[0];
                    this.yCoordinateOfTail8InGrid =  newCoordinatesOfRopeTail8inD[1];
                    // log(`this.xCoordinateOfTail8InGrid: ${this.xCoordinateOfTail8InGrid}`);
                    // log(`this.yCoordinateOfTail8InGrid: ${this.yCoordinateOfTail8InGrid}`);

                    log(`----------------------------------------------------------------------------------------------------`);
                    log(`D: move rope-tail NUMBER 9: :`)
                    let newCoordinatesOfRopeTail9inD = this.calculateXAndYCoordinatesOfTailNine(this.xCoordinateOfTail8InGrid, this.yCoordinateOfTail8InGrid, this.xCoordinateOfTail9InGrid, this.yCoordinateOfTail9InGrid)
                    this.xCoordinateOfTail9InGrid =  newCoordinatesOfRopeTail9inD[0];
                    this.yCoordinateOfTail9InGrid =  newCoordinatesOfRopeTail9inD[1];
                    // log(`this.xCoordinateOfTail9InGrid: ${this.xCoordinateOfTail9InGrid}`);
                    // log(`this.yCoordinateOfTail9InGrid: ${this.yCoordinateOfTail9InGrid}`);

                }
                // log(this.gridToPlotPositionOf9TailsWithForEachGridCellABooleanIsVisited);
                break;
            case 'L':
                log(`---------------------------------------------------------`);
                log(' case L-L-L-L-L-L:');
                for (let i = 0; i < nrOfRopeHeadStepsOnRopeBridge; i++) {
                    log(`------------------next cell in loop of instruction-----------------------------------------------------------------------------------`);
                    log(`L: for-loop: i: ${i}`);
                    log(`L: for-loop: nrOfRopeHeadStepsOnRopeBridge: ${nrOfRopeHeadStepsOnRopeBridge}`);
                    log(`L: output of previous instruction:`)
                    log(`L: x,y rope-head (not updated): ${this.xCoordinateOfHeadInGrid}, ${this.yCoordinateOfHeadInGrid} `);              
                    this.yCoordinateOfHeadInGrid -= 1;
                    log(`L: x,y rope-head (updated:.....:      ${this.xCoordinateOfHeadInGrid}, ${this.yCoordinateOfHeadInGrid} `);
                    log(`L: x,y rope-tail1 (not updated):  ${this.xCoordinateOfTail1InGrid} , ${this.yCoordinateOfTail1InGrid}  `); 
                    log('L: lets update the tails 1-9:')

                    const calculateNewXAndYCoordinateOfFollowingTailKnotInCaseL = (xLeadingKnot, yLeadingKnot, xFollowingTailKnot, yFollowingTailKnot) => {   
                        // the coordinates of LeadingKnot stay the same.
                        
                        //each comparison has following format: "leadingKnot operator followingKnot"
                        // xLeadingKnot (e.g. rope-knot 4)
                        // xFollowingTailKnot (e.g. rope-knot 5) (always the one after the leading rope-knot)
                        log(`L: fn: calculateNewXAndYCoordinateOfFollowingTailKnotInCaseL: `)
                        log(`L: for-loop: i: ${i}`);
                        log(`L: for-loop: nrOfRopeHeadStepsOnRopeBridge: ${nrOfRopeHeadStepsOnRopeBridge}`);
                        log(`L: xLeadingKnot: ${xLeadingKnot}`);
                        log(`L: yLeadingKnot: ${yLeadingKnot}`);
                        log(`L: xFollowingTailKnot: ${xFollowingTailKnot}`);
                        log(`L: yFollowingTailKnot: ${yFollowingTailKnot}`);   
                        if(xLeadingKnot - xFollowingTailKnot == 0 && 
                           yLeadingKnot - yFollowingTailKnot == 0)
                        {
                            log('L: head on top of tail')
                        // } else if (
                        //     yLeadingKnot - yFollowingTailKnot == - 1 ) {
                        //     log('right: head and tail adjacent, so tail not moving.')
                        
                        } else if (xLeadingKnot - xFollowingTailKnot == 2 && // scope: only rope-tail 2-10. out-of-scope: rope-tail 1.
                            yLeadingKnot - yFollowingTailKnot == -1 ) {
                            log(`L: tail goes south-south-west: `)
                            xFollowingTailKnot += 1;
                            yFollowingTailKnot -= 1;    

                        } else if (xLeadingKnot - xFollowingTailKnot == 2 && 
                            yLeadingKnot - yFollowingTailKnot == - 2 ) {
                            log(`L: tail goes South-West: `)
                            xFollowingTailKnot += 1;
                            yFollowingTailKnot -= 1;                  
                        } else if (xLeadingKnot - xFollowingTailKnot == 1 && 
                            yLeadingKnot - yFollowingTailKnot == -2 ) {
                            log(`L: going west-south-west: `)
                            xFollowingTailKnot += 1;
                            yFollowingTailKnot -= 1;                    
                    
                       } else if (xLeadingKnot - xFollowingTailKnot == 0 && 
                            yLeadingKnot - yFollowingTailKnot == -2 ) {
                            log(`L: going west: `)
                            yFollowingTailKnot -= 1;
                            
                        } else if (xLeadingKnot - xFollowingTailKnot == -1 && 
                            yLeadingKnot - yFollowingTailKnot == -2 ) {
                            log(`L: going west-north-west: `)
                            xFollowingTailKnot -= 1;
                            yFollowingTailKnot -= 1;
                            
  
                        } else if (xLeadingKnot - xFollowingTailKnot == - 2 && 
                            yLeadingKnot - yFollowingTailKnot == - 2 ) {
                            log(`L: tail goes North-West: `)
                            xFollowingTailKnot -= 1;
                            yFollowingTailKnot -= 1;   
              

                        } else if (xLeadingKnot - xFollowingTailKnot == -2 && // scope: only rope-tail 2-10. out-of-scope: rope-tail 1.
                            yLeadingKnot - yFollowingTailKnot == -1 ) {
                            log(`L: tail goes north-north-west: `)
                            xFollowingTailKnot -= 1;
                            yFollowingTailKnot -= 1;
                        // } else if (xLeadingKnot - xFollowingTailKnot == - 2 && // experimental
                        //     yLeadingKnot - yFollowingTailKnot == 0 ) {
                        //     log(`D: tail goes North-West: `)
                        //     xFollowingTailKnot -= 1;                               
                        //     yFollowingTailKnot -= 1;       
                        // } else if (xLeadingKnot - xFollowingTailKnot ==  2 && // experimental
                        //     yLeadingKnot - yFollowingTailKnot == 0 ) {
                        //     log(`D: tail goes South-West: `)
                        //     xFollowingTailKnot += 1;                               
                        //     yFollowingTailKnot -= 1;                     


                        // } else if (xLeadingKnot - xFollowingTailKnot == - 2 && // experimental
                        //     yLeadingKnot - yFollowingTailKnot == 0 ) {
                        //     log(`D: tail goes North-West: `)
                        //     xFollowingTailKnot -= 1;                               
                        //     yFollowingTailKnot -= 1; 

                        // } else if (xLeadingKnot - xFollowingTailKnot == - 2 && 
                        //     yLeadingKnot - yFollowingTailKnot == 0 ) {
                        //     log(`D: tail goes North: `)
                        //     xFollowingTailKnot -= 1;
                        // } else if (xLeadingKnot - xFollowingTailKnot ==  2 && 
                        //     yLeadingKnot - yFollowingTailKnot == 0 ) {
                        //     log(`D: tail goes South: `)
                        //     xFollowingTailKnot += 1;                                                 
                        } else { 
                            log(`L: fn movefRopeTailOnRopeBridgeOneStepAtATimeForEachInstructionFromInputFile: case L`)
                        };
                        log(`L: xFollowingTailKnot: (updated): ${xFollowingTailKnot}`);
                        log(`L: yFollowingTailKnot: (updated): ${yFollowingTailKnot}`);     
                        return [xFollowingTailKnot, yFollowingTailKnot]
                    }

                    const calculateNewXAndYCoordinateOfTailKnot9WithVisitedGridCellCountInCaseL = (xLeadingKnot, yLeadingKnot, xFollowingTailKnot, yFollowingTailKnot) => {   
                        
                        
                        // the coordinates of LeadingKnot stay the same.
                        
                        //each comparison has following format: "leadingKnot operator followingKnot"
                        // xLeadingKnot (e.g. rope-knot 4)
                        // xFollowingTailKnot (e.g. rope-knot 5) (always the one after the leading rope-knot)
                        log(`L: fn: calculateNewXAndYCoordinateOfTailKnot9WithVisitedGridCellCountInCaseL: `)
                        log(`L: for-loop: i: ${i}`);
                        log(`L: for-loop: nrOfRopeHeadStepsOnRopeBridge: ${nrOfRopeHeadStepsOnRopeBridge}`);
                        log(`L: xLeadingKnot: ${xLeadingKnot}`);
                        log(`L: yLeadingKnot: ${yLeadingKnot}`);
                        log(`L: xFollowingTailKnot: ${xFollowingTailKnot}`);
                        log(`L: yFollowingTailKnot: ${yFollowingTailKnot}`);   
                        if(xLeadingKnot - xFollowingTailKnot == 0 && 
                           yLeadingKnot - yFollowingTailKnot == 0)
                        {
                            log('L: head on top of tail')
                        // } else if (
                        //     yLeadingKnot - yFollowingTailKnot == - 1 ) {
                        //     log('right: head and tail adjacent, so tail not moving.')
                        } else if (xLeadingKnot - xFollowingTailKnot == 0 && 
                            yLeadingKnot - yFollowingTailKnot == -2 ) {
                            log(`L: going west: `)
                            yFollowingTailKnot -= 1;
                            this.gridToPlotPositionOf9TailsWithForEachGridCellABooleanIsVisited[xFollowingTailKnot][yFollowingTailKnot] = 'tru';
                            globalCounterSetTailNineToTrue +=1;
                            log(`globalCounterSetTailNineToTrue:${globalCounterSetTailNineToTrue} `)
                        } else if (xLeadingKnot - xFollowingTailKnot == -1 && 
                            yLeadingKnot - yFollowingTailKnot == -2 ) {
                            log(`L: going west-north-west: `)
                            xFollowingTailKnot -= 1;
                            yFollowingTailKnot -= 1;
                            this.gridToPlotPositionOf9TailsWithForEachGridCellABooleanIsVisited[xFollowingTailKnot][yFollowingTailKnot] = 'tru';
                            globalCounterSetTailNineToTrue +=1;
                            log(`globalCounterSetTailNineToTrue:${globalCounterSetTailNineToTrue} `)
                        } else if (xLeadingKnot - xFollowingTailKnot == 2 && 
                            yLeadingKnot - yFollowingTailKnot == - 2 ) {
                            log(`L: tail goes South-West: `)
                            xFollowingTailKnot += 1;
                            yFollowingTailKnot -= 1;  
                            this.gridToPlotPositionOf9TailsWithForEachGridCellABooleanIsVisited[xFollowingTailKnot][yFollowingTailKnot] = 'tru'; 
                            globalCounterSetTailNineToTrue +=1;
                            log(`globalCounterSetTailNineToTrue:${globalCounterSetTailNineToTrue} `)
                        } else if (xLeadingKnot - xFollowingTailKnot == - 2 && 
                            yLeadingKnot - yFollowingTailKnot == - 2 ) {
                            log(`L: tail goes North-West: `)
                            xFollowingTailKnot -= 1;
                            yFollowingTailKnot -= 1;   
                            this.gridToPlotPositionOf9TailsWithForEachGridCellABooleanIsVisited[xFollowingTailKnot][yFollowingTailKnot] = 'tru';
                            globalCounterSetTailNineToTrue +=1;
                            log(`globalCounterSetTailNineToTrue:${globalCounterSetTailNineToTrue} `)
                        } else if (xLeadingKnot - xFollowingTailKnot == 1 && 
                            yLeadingKnot - yFollowingTailKnot == -2 ) {
                            log(`L: going west-south-west: `)
                            xFollowingTailKnot += 1;
                            yFollowingTailKnot -= 1;
                            this.gridToPlotPositionOf9TailsWithForEachGridCellABooleanIsVisited[xFollowingTailKnot][yFollowingTailKnot] = 'tru';
                            globalCounterSetTailNineToTrue +=1;
                            log(`globalCounterSetTailNineToTrue:${globalCounterSetTailNineToTrue} `)
                        } else if (xLeadingKnot - xFollowingTailKnot == -2 && // scope: only rope-tail 2-10. out-of-scope: rope-tail 1.
                            yLeadingKnot - yFollowingTailKnot == -1 ) {
                            log(`L: tail goes north-north-west: `)
                            xFollowingTailKnot -= 1;
                            yFollowingTailKnot -= 1;
                            this.gridToPlotPositionOf9TailsWithForEachGridCellABooleanIsVisited[xFollowingTailKnot][yFollowingTailKnot] = 'tru';
                            globalCounterSetTailNineToTrue +=1;
                            log(`globalCounterSetTailNineToTrue:${globalCounterSetTailNineToTrue} `)
                        } else if (xLeadingKnot - xFollowingTailKnot == 2 && // scope: only rope-tail 2-10. out-of-scope: rope-tail 1.
                            yLeadingKnot - yFollowingTailKnot == -1 ) {
                            log(`L: tail goes south-south-west: `)
                            xFollowingTailKnot += 1;
                            yFollowingTailKnot -= 1;
                            this.gridToPlotPositionOf9TailsWithForEachGridCellABooleanIsVisited[xFollowingTailKnot][yFollowingTailKnot] = 'tru'; 
                            globalCounterSetTailNineToTrue +=1;
                            log(`globalCounterSetTailNineToTrue:${globalCounterSetTailNineToTrue} `) 

                        // } else if (xLeadingKnot - xFollowingTailKnot ==  2 && // experimental
                        //     yLeadingKnot - yFollowingTailKnot == 0 ) {
                        //     log(`D: tail goes South-West: `)
                        //     xFollowingTailKnot += 1;                               
                        //     yFollowingTailKnot -= 1;                                 
                        //     this.gridToPlotPositionOf9TailsWithForEachGridCellABooleanIsVisited[xFollowingTailKnot][yFollowingTailKnot] = 'tru'; 
                        //     globalCounterSetTailNineToTrue +=1;
                        //     log(`globalCounterSetTailNineToTrue:${globalCounterSetTailNineToTrue} `)                              

                        // } else if (xLeadingKnot - xFollowingTailKnot == - 2 && // experimental
                        //     yLeadingKnot - yFollowingTailKnot == 0 ) {
                        //     log(`D: tail goes North-West: `)
                        //     xFollowingTailKnot -= 1;                               
                        //     yFollowingTailKnot -= 1;                         
                        //     this.gridToPlotPositionOf9TailsWithForEachGridCellABooleanIsVisited[xFollowingTailKnot][yFollowingTailKnot] = 'tru'; 
                        //     globalCounterSetTailNineToTrue +=1;
                        //     log(`globalCounterSetTailNineToTrue:${globalCounterSetTailNineToTrue} `)  

                        // } else if (xLeadingKnot - xFollowingTailKnot == - 2 && 
                        //     yLeadingKnot - yFollowingTailKnot == 0 ) {
                        //     log(`L: tail goes North: `)
                        //     xFollowingTailKnot -= 1;
                        //     this.gridToPlotPositionOf9TailsWithForEachGridCellABooleanIsVisited[xFollowingTailKnot][yFollowingTailKnot] = 'tru'; 
                        //     globalCounterSetTailNineToTrue +=1;
                        //     log(`globalCounterSetTailNineToTrue:${globalCounterSetTailNineToTrue} `)   
                        // } else if (xLeadingKnot - xFollowingTailKnot ==  2 && 
                        //     yLeadingKnot - yFollowingTailKnot == 0 ) {
                        //     log(`L: tail goes South: `)
                        //     xFollowingTailKnot += 1;
                        //     this.gridToPlotPositionOf9TailsWithForEachGridCellABooleanIsVisited[xFollowingTailKnot][yFollowingTailKnot] = 'tru'; 
                        //     globalCounterSetTailNineToTrue +=1;
                        //     log(`globalCounterSetTailNineToTrue:${globalCounterSetTailNineToTrue} `)                         
                        } else { 
                            log(`L: fn movefRopeTailOnRopeBridgeOneStepAtATimeForEachInstructionFromInputFile: case L`)
                        };
                            log(`L: xFollowingTailKnot: (updated): ${xFollowingTailKnot}`);
                            log(`L: yFollowingTailKnot: (updated): ${yFollowingTailKnot}`);     
                        return [xFollowingTailKnot, yFollowingTailKnot]
                    }
                    log(`----------------------------------------------------------------------------------------------------`);
                    log(`L: move rope-tail NUMBER 1:`)
                    let newCoordinatesOfRopeTail1inL = this.calculateXAndYCoordinatesOfTail(this.xCoordinateOfHeadInGrid, this.yCoordinateOfHeadInGrid, this.xCoordinateOfTail1InGrid, this.yCoordinateOfTail1InGrid)
                    /*
                        goal: update rope-tail-coordinates so it can be reused for:
                        a) remainder of this instruction (e.g. R 4 in input1.txt):
                        b) the next instruction (e.g. U4, in input1.txt):
                    */
                    this.xCoordinateOfTail1InGrid =  newCoordinatesOfRopeTail1inL[0];
                    this.yCoordinateOfTail1InGrid =  newCoordinatesOfRopeTail1inL[1];
                    log(`----------------------------------------------------------------------------------------------------`);
                    log(`L: move rope-tail NUMBER 2:`)
                    let newCoordinatesOfRopeTail2inL = this.calculateXAndYCoordinatesOfTail(this.xCoordinateOfTail1InGrid, this.yCoordinateOfTail1InGrid, this.xCoordinateOfTail2InGrid, this.yCoordinateOfTail2InGrid)
                    // /*
                    //     goal: update rope-tail-coordinates so it can be reused for:
                    //     a) the next instruction (e.g. R 4 in input1.txt):
                    // */
                    this.xCoordinateOfTail2InGrid =  newCoordinatesOfRopeTail2inL[0];
                    this.yCoordinateOfTail2InGrid =  newCoordinatesOfRopeTail2inL[1];
                    log(`this.xCoordinateOfTail2InGrid: ${this.xCoordinateOfTail2InGrid}`);
                    log(`this.yCoordinateOfTail2InGrid: ${this.yCoordinateOfTail2InGrid}`);
                    log(`----------------------------------------------------------------------------------------------------`);
                    log(`L: move rope-tail NUMBER 3: :`)
                    let newCoordinatesOfRopeTail3inL = this.calculateXAndYCoordinatesOfTail(this.xCoordinateOfTail2InGrid, this.yCoordinateOfTail2InGrid, this.xCoordinateOfTail3InGrid, this.yCoordinateOfTail3InGrid)
                    this.xCoordinateOfTail3InGrid =  newCoordinatesOfRopeTail3inL[0];
                    this.yCoordinateOfTail3InGrid =  newCoordinatesOfRopeTail3inL[1];
                    // log(`this.xCoordinateOfTail3InGrid: ${this.xCoordinateOfTail3InGrid}`);
                    // log(`this.yCoordinateOfTail3InGrid: ${this.yCoordinateOfTail3InGrid}`);
                    
                    log(`----------------------------------------------------------------------------------------------------`);
                    log(`L: move rope-tail NUMBER 4: :`)
                    let newCoordinatesOfRopeTail4inL = this.calculateXAndYCoordinatesOfTail(this.xCoordinateOfTail3InGrid, this.yCoordinateOfTail3InGrid, this.xCoordinateOfTail4InGrid, this.yCoordinateOfTail4InGrid)
                    this.xCoordinateOfTail4InGrid =  newCoordinatesOfRopeTail4inL[0];
                    this.yCoordinateOfTail4InGrid =  newCoordinatesOfRopeTail4inL[1];
                    // log(`this.xCoordinateOfTail4InGrid: ${this.xCoordinateOfTail4InGrid}`);
                    // log(`this.yCoordinateOfTail4InGrid: ${this.yCoordinateOfTail4InGrid}`);
                    
                    log(`----------------------------------------------------------------------------------------------------`);
                    log(`L: move rope-tail NUMBER 5: :`)
                    let newCoordinatesOfRopeTail5inL = this.calculateXAndYCoordinatesOfTail(this.xCoordinateOfTail4InGrid, this.yCoordinateOfTail4InGrid, this.xCoordinateOfTail5InGrid, this.yCoordinateOfTail5InGrid)
                    this.xCoordinateOfTail5InGrid =  newCoordinatesOfRopeTail5inL[0];
                    this.yCoordinateOfTail5InGrid =  newCoordinatesOfRopeTail5inL[1];
                    // log(`this.xCoordinateOfTail5InGrid: ${this.xCoordinateOfTail5InGrid}`);
                    // log(`this.yCoordinateOfTail5InGrid: ${this.yCoordinateOfTail5InGrid}`);
                    log(`----------------------------------------------------------------------------------------------------`);
                    log(`L: move rope-tail NUMBER 6: :`)
                    let newCoordinatesOfRopeTail6inL = this.calculateXAndYCoordinatesOfTail(this.xCoordinateOfTail5InGrid, this.yCoordinateOfTail5InGrid, this.xCoordinateOfTail6InGrid, this.yCoordinateOfTail6InGrid)
                    this.xCoordinateOfTail6InGrid =  newCoordinatesOfRopeTail6inL[0];
                    this.yCoordinateOfTail6InGrid =  newCoordinatesOfRopeTail6inL[1];
                    // log(`this.xCoordinateOfTail6InGrid: ${this.xCoordinateOfTail6InGrid}`);
                    // log(`this.yCoordinateOfTail6InGrid: ${this.yCoordinateOfTail6InGrid}`);
                    
                    log(`----------------------------------------------------------------------------------------------------`);
                    log(`L: move rope-tail NUMBER 7: :`)
                    let newCoordinatesOfRopeTail7inL = this.calculateXAndYCoordinatesOfTail(this.xCoordinateOfTail6InGrid, this.yCoordinateOfTail6InGrid, this.xCoordinateOfTail7InGrid, this.yCoordinateOfTail7InGrid)
                    this.xCoordinateOfTail7InGrid =  newCoordinatesOfRopeTail7inL[0];
                    this.yCoordinateOfTail7InGrid =  newCoordinatesOfRopeTail7inL[1];
                    // log(`this.xCoordinateOfTail7InGrid: ${this.xCoordinateOfTail7InGrid}`);
                    // log(`this.yCoordinateOfTail7InGrid: ${this.yCoordinateOfTail7InGrid}`);
                    
                    log(`----------------------------------------------------------------------------------------------------`);
                    log(`L: move rope-tail NUMBER 8: :`)
                    let newCoordinatesOfRopeTail8inL = this.calculateXAndYCoordinatesOfTail(this.xCoordinateOfTail7InGrid, this.yCoordinateOfTail7InGrid, this.xCoordinateOfTail8InGrid, this.yCoordinateOfTail8InGrid)
                    this.xCoordinateOfTail8InGrid =  newCoordinatesOfRopeTail8inL[0];
                    this.yCoordinateOfTail8InGrid =  newCoordinatesOfRopeTail8inL[1];
                    // log(`this.xCoordinateOfTail8InGrid: ${this.xCoordinateOfTail8InGrid}`);
                    // log(`this.yCoordinateOfTail8InGrid: ${this.yCoordinateOfTail8InGrid}`);
                    
                    log(`----------------------------------------------------------------------------------------------------`);
                    log(`L: move rope-tail NUMBER 9: :`)
                    let newCoordinatesOfRopeTail9inL = this.calculateXAndYCoordinatesOfTailNine(this.xCoordinateOfTail8InGrid, this.yCoordinateOfTail8InGrid, this.xCoordinateOfTail9InGrid, this.yCoordinateOfTail9InGrid)
                    this.xCoordinateOfTail9InGrid =  newCoordinatesOfRopeTail9inL[0];
                    this.yCoordinateOfTail9InGrid =  newCoordinatesOfRopeTail9inL[1];
                    // log(`this.xCoordinateOfTail9InGrid: ${this.xCoordinateOfTail9InGrid}`);
                    // log(`this.yCoordinateOfTail9InGrid: ${this.yCoordinateOfTail9InGrid}`);



                }
                // log(this.gridToPlotPositionOf9TailsWithForEachGridCellABooleanIsVisited);
                break;            
            case 'R':
                log(`---------------start of case R-------------------------------------------------------------------------------------------------------------------`);
                log(' case R-R-R-R-R-R:')
                for (let i = 0; i < nrOfRopeHeadStepsOnRopeBridge; i++) {
                    log(`------------------next cell in loop of instruction-----------------------------------------------------------------------------------`);
                    log(`R: for-loop: i: ${i}`);
                    log(`R: for-loop: nrOfRopeHeadStepsOnRopeBridge: ${nrOfRopeHeadStepsOnRopeBridge}`);
                    log(`R: output of previous instruction:`)
                    log(`R: x,y rope-head (not updated): ${this.xCoordinateOfHeadInGrid}, ${this.yCoordinateOfHeadInGrid} `);              
                    this.yCoordinateOfHeadInGrid += 1;
                    log(`R: x,y rope-head (updated:.....:      ${this.xCoordinateOfHeadInGrid}, ${this.yCoordinateOfHeadInGrid} `);
                    log(`R: x,y rope-tail1 (not updated):  ${this.xCoordinateOfTail1InGrid} , ${this.yCoordinateOfTail1InGrid}  `); 
                    log('R: lets update the tails 1-9:')

                const calculateNewXAndYCoordinateOfFollowingTailKnotInCaseR = (xLeadingKnot, yLeadingKnot, xFollowingTailKnot, yFollowingTailKnot) => {   
                    // the coordinates of LeadingKnot stay the same.
                    
                    //each comparison has following format: "leadingKnot operator followingKnot"
                    // xLeadingKnot (e.g. rope-knot 4)
                    // xFollowingTailKnot (e.g. rope-knot 5) (always the one after the leading rope-knot)
                    log(`R: fn: calculateNewXAndYCoordinateOfFollowingTailKnotInCaseR: `)
                    log(`R: for-loop: i: ${i}`);
                    log(`R: for-loop: nrOfRopeHeadStepsOnRopeBridge: ${nrOfRopeHeadStepsOnRopeBridge}`);
                    log(`R: xLeadingKnot: ${xLeadingKnot}`);
                    log(`R: yLeadingKnot: ${yLeadingKnot}`);
                    log(`R: xFollowingTailKnot: ${xFollowingTailKnot}`);
                    log(`R: yFollowingTailKnot: ${yFollowingTailKnot}`);
                    if(xLeadingKnot - xFollowingTailKnot == 0 && 
                       yLeadingKnot - yFollowingTailKnot == 0)
                    {
                        log('R: head on top of tail')
                    // } else if (
                    //     yLeadingKnot - yFollowingTailKnot == 1 ) {
                    //     //tail should not move.
                    //     log('right: head and tail adjacent, so tail not moving.')
                    } else if (xLeadingKnot - xFollowingTailKnot == 0 && 
                        yLeadingKnot - yFollowingTailKnot == 2 ) {
                        log(`R: going east: `)
                        // xFollowingTailKnot = xFollowingTailKnot ;
                        yFollowingTailKnot += 1;
                        
                    } else if (xLeadingKnot - xFollowingTailKnot == -1 && 
                        yLeadingKnot - yFollowingTailKnot == 2 ) {
                        log(`R: tail goes East-North-East:`)
                        xFollowingTailKnot += -1;
                        yFollowingTailKnot += 1;
                        
                    } else if (xLeadingKnot - xFollowingTailKnot == 2 && 
                        yLeadingKnot - yFollowingTailKnot == 2 ) {
                        log(`R: tail goes South-East: `)
                        xFollowingTailKnot += 1;
                        yFollowingTailKnot += 1;   
                    } else if (xLeadingKnot - xFollowingTailKnot == - 2 && 
                        yLeadingKnot - yFollowingTailKnot ==  2 ) {
                        log(`R: tail goes North-East: `)
                        xFollowingTailKnot -= 1;
                        yFollowingTailKnot += 1;   
                    } else if (xLeadingKnot - xFollowingTailKnot == 1 && 
                        yLeadingKnot - yFollowingTailKnot == 2 ) {
                        log(`R: going east-south-east: `)
                        xFollowingTailKnot += 1;
                        yFollowingTailKnot += 1;
                        
                    } else if (xLeadingKnot - xFollowingTailKnot == -2 && // scope: only rope-tail 2-10. out-of-scope: rope-tail 1.
                        yLeadingKnot - yFollowingTailKnot == 1 ) {
                        log(`R: tail goes north-north-east: `)
                        xFollowingTailKnot -= 1;
                        yFollowingTailKnot += 1;
                        
                    } else if (xLeadingKnot - xFollowingTailKnot == 2 && // scope: only rope-tail 2-10. out-of-scope: rope-tail 1.
                        yLeadingKnot - yFollowingTailKnot == 1 ) {
                        log(`R: tail goes south-south-east: `)
                        xFollowingTailKnot += 1;
                        yFollowingTailKnot += 1;
                          
                    // } else if (xLeadingKnot - xFollowingTailKnot == - 2 && 
                    //     yLeadingKnot - yFollowingTailKnot == 0 ) {
                    //     log(`R: tail goes North: `)
                    //     xFollowingTailKnot -= 1; 
                    // } else if (xLeadingKnot - xFollowingTailKnot ==  2 && 
                    //     yLeadingKnot - yFollowingTailKnot == 0 ) {
                    //     log(`R: tail goes South: `)
                    //     xFollowingTailKnot += 1;
                    } else { 
                        log(`R: fn movefRopeTailOnRopeBridgeOneStepAtATimeForEachInstructionFromInputFile: case R`)
                    };
                        log(`R: xFollowingTailKnot: (updated): ${xFollowingTailKnot}`);
                        log(`R: yFollowingTailKnot: (updated): ${yFollowingTailKnot}`); 
                    return [xFollowingTailKnot, yFollowingTailKnot]
                }


                const calculateNewXAndYCoordinateOfTailKnot9WithVisitedGridCellCountInCaseR = (xLeadingKnot, yLeadingKnot, xFollowingTailKnot, yFollowingTailKnot) => {   
                    // the coordinates of LeadingKnot stay the same.
                    
                    //each comparison has following format: "leadingKnot operator followingKnot"
                    // xLeadingKnot (e.g. rope-knot 4)
                    // xFollowingTailKnot (e.g. rope-knot 5) (always the one after the leading rope-knot)
                    log(`R: fn: calculateNewXAndYCoordinateOfTailKnot9WithVisitedGridCellCountInCaseR: `)
                    log(`R: for-loop: i: ${i}`);
                    log(`R: for-loop: nrOfRopeHeadStepsOnRopeBridge: ${nrOfRopeHeadStepsOnRopeBridge}`);
                    log(`R: xLeadingKnot: ${xLeadingKnot}`);
                    log(`R: yLeadingKnot: ${yLeadingKnot}`);
                    log(`R: xFollowingTailKnot: ${xFollowingTailKnot}`);
                    log(`R: yFollowingTailKnot: ${yFollowingTailKnot}`);
                    if(xLeadingKnot - xFollowingTailKnot == 0 && 
                       yLeadingKnot - yFollowingTailKnot == 0)
                    {
                        log('R: head on top of tail')
                    // } else if (
                    //     yLeadingKnot - yFollowingTailKnot == 1 ) {
                    //     //tail should not move.
                    //     log('right: head and tail adjacent, so tail not moving.')
                    } else if (xLeadingKnot - xFollowingTailKnot == 0 && 
                        yLeadingKnot - yFollowingTailKnot == 2 ) {
                        // tail goes East:
                        log(`R: going east: `)
                        // xFollowingTailKnot = xFollowingTailKnot ;
                        yFollowingTailKnot += 1;
                        this.gridToPlotPositionOf9TailsWithForEachGridCellABooleanIsVisited[xFollowingTailKnot][yFollowingTailKnot] = 'tru';
                        globalCounterSetTailNineToTrue +=1;
                        log(`globalCounterSetTailNineToTrue:${globalCounterSetTailNineToTrue} `)
                    } else if (xLeadingKnot - xFollowingTailKnot == -1 && 
                        yLeadingKnot - yFollowingTailKnot == 2 ) {
                        log(`R: tail goes East-North-East:`);
                        xFollowingTailKnot += -1;
                        yFollowingTailKnot += 1;
                        this.gridToPlotPositionOf9TailsWithForEachGridCellABooleanIsVisited[xFollowingTailKnot][yFollowingTailKnot] = 'tru';
                        globalCounterSetTailNineToTrue +=1;
                        log(`globalCounterSetTailNineToTrue:${globalCounterSetTailNineToTrue} `)
                    } else if (xLeadingKnot - xFollowingTailKnot == 2 && 
                        yLeadingKnot - yFollowingTailKnot == 2 ) {
                        log(`R: tail goes South-East: `)
                        xFollowingTailKnot += 1;
                        yFollowingTailKnot += 1;   
                        this.gridToPlotPositionOf9TailsWithForEachGridCellABooleanIsVisited[xFollowingTailKnot][yFollowingTailKnot] = 'tru';
                        globalCounterSetTailNineToTrue +=1;
                        log(`globalCounterSetTailNineToTrue:${globalCounterSetTailNineToTrue} `)
                    } else if (xLeadingKnot - xFollowingTailKnot == - 2 && 
                        yLeadingKnot - yFollowingTailKnot ==  2 ) {
                        log(`R: tail goes North-East: `)
                        xFollowingTailKnot -= 1;
                        yFollowingTailKnot += 1;  
                        this.gridToPlotPositionOf9TailsWithForEachGridCellABooleanIsVisited[xFollowingTailKnot][yFollowingTailKnot] = 'tru'; 
                        globalCounterSetTailNineToTrue +=1;
                        log(`globalCounterSetTailNineToTrue:${globalCounterSetTailNineToTrue} `)
                    } else if (xLeadingKnot - xFollowingTailKnot == 1 && 
                        yLeadingKnot - yFollowingTailKnot == 2 ) {
                        log(`R: going east-south-east: `)
                        xFollowingTailKnot += 1;
                        yFollowingTailKnot += 1;
                        this.gridToPlotPositionOf9TailsWithForEachGridCellABooleanIsVisited[xFollowingTailKnot][yFollowingTailKnot] = 'tru';
                        globalCounterSetTailNineToTrue +=1;
                        log(`globalCounterSetTailNineToTrue:${globalCounterSetTailNineToTrue} `)
                    } else if (xLeadingKnot - xFollowingTailKnot == -2 && // scope: only rope-tail 2-10. out-of-scope: rope-tail 1.
                        yLeadingKnot - yFollowingTailKnot == 1 ) {
                        log(`R: tail goes north-north-east: `)
                        xFollowingTailKnot -= 1;
                        yFollowingTailKnot += 1;
                        this.gridToPlotPositionOf9TailsWithForEachGridCellABooleanIsVisited[xFollowingTailKnot][yFollowingTailKnot] = 'tru';
                        globalCounterSetTailNineToTrue +=1;
                        log(`globalCounterSetTailNineToTrue:${globalCounterSetTailNineToTrue} `)
                    } else if (xLeadingKnot - xFollowingTailKnot == 2 && // scope: only rope-tail 2-10. out-of-scope: rope-tail 1.
                        yLeadingKnot - yFollowingTailKnot == 1 ) {
                        log(`R: tail goes south-south-east: `)
                        xFollowingTailKnot += 1;
                        yFollowingTailKnot += 1;
                        this.gridToPlotPositionOf9TailsWithForEachGridCellABooleanIsVisited[xFollowingTailKnot][yFollowingTailKnot] = 'tru';  
                        globalCounterSetTailNineToTrue +=1;
                        log(`globalCounterSetTailNineToTrue:${globalCounterSetTailNineToTrue} `) 
                    // } else if (xLeadingKnot - xFollowingTailKnot == - 2 && 
                    //     yLeadingKnot - yFollowingTailKnot == 0 ) {
                    //     log(`R: tail goes North: `)
                    //     xFollowingTailKnot -= 1;
                    //     this.gridToPlotPositionOf9TailsWithForEachGridCellABooleanIsVisited[xFollowingTailKnot][yFollowingTailKnot] = 'tru'; 
                    //     globalCounterSetTailNineToTrue +=1;
                    //     log(`globalCounterSetTailNineToTrue:${globalCounterSetTailNineToTrue} `)   
                    // } else if (xLeadingKnot - xFollowingTailKnot ==  2 && 
                    //     yLeadingKnot - yFollowingTailKnot == 0 ) {
                    //     log(`R: tail goes South: `)
                    //     xFollowingTailKnot += 1;
                    //     this.gridToPlotPositionOf9TailsWithForEachGridCellABooleanIsVisited[xFollowingTailKnot][yFollowingTailKnot] = 'tru'; 
                    //     globalCounterSetTailNineToTrue +=1;
                    //     log(`globalCounterSetTailNineToTrue:${globalCounterSetTailNineToTrue} `)  
                    } else { 
                        log(`R: fn movefRopeTailOnRopeBridgeOneStepAtATimeForEachInstructionFromInputFile: case R`)
                    };
                        log(`R: xFollowingTailKnot: (updated): ${xFollowingTailKnot}`);
                        log(`R: yFollowingTailKnot: (updated): ${yFollowingTailKnot}`); 
                    return [xFollowingTailKnot, yFollowingTailKnot]
                }

                log(`----------------------------------------------------------------------------------------------------`);
                log(`R: move rope-tail NUMBER 1:`)
                let newCoordinatesOfRopeTail1inR = this.calculateXAndYCoordinatesOfTail(this.xCoordinateOfHeadInGrid, this.yCoordinateOfHeadInGrid, this.xCoordinateOfTail1InGrid, this.yCoordinateOfTail1InGrid)
                /*
                    goal: update rope-tail-coordinates so it can be reused for:
                    a) remainder of this instruction (e.g. R 4 in input1.txt):
                    b) the next instruction (e.g. U4, in input1.txt):
                */
                this.xCoordinateOfTail1InGrid =  newCoordinatesOfRopeTail1inR[0];
                this.yCoordinateOfTail1InGrid =  newCoordinatesOfRopeTail1inR[1];
                log(`----------------------------------------------------------------------------------------------------`);
                log(`R: move rope-tail NUMBER 2:`)
                let newCoordinatesOfRopeTail2inR = this.calculateXAndYCoordinatesOfTail(this.xCoordinateOfTail1InGrid, this.yCoordinateOfTail1InGrid, this.xCoordinateOfTail2InGrid, this.yCoordinateOfTail2InGrid)
                // /*
                //     goal: update rope-tail-coordinates so it can be reused for:
                //     a) the next instruction (e.g. R 4 in input1.txt):
                // */
                this.xCoordinateOfTail2InGrid =  newCoordinatesOfRopeTail2inR[0];
                this.yCoordinateOfTail2InGrid =  newCoordinatesOfRopeTail2inR[1];
                log(`this.xCoordinateOfTail2InGrid: ${this.xCoordinateOfTail2InGrid}`);
                log(`this.yCoordinateOfTail2InGrid: ${this.yCoordinateOfTail2InGrid}`);
                log(`----------------------------------------------------------------------------------------------------`);
                log(`R: move rope-tail NUMBER 3: :`)
                let newCoordinatesOfRopeTail3inR = this.calculateXAndYCoordinatesOfTail(this.xCoordinateOfTail2InGrid, this.yCoordinateOfTail2InGrid, this.xCoordinateOfTail3InGrid, this.yCoordinateOfTail3InGrid)
                this.xCoordinateOfTail3InGrid =  newCoordinatesOfRopeTail3inR[0];
                this.yCoordinateOfTail3InGrid =  newCoordinatesOfRopeTail3inR[1];
                // log(`this.xCoordinateOfTail3InGrid: ${this.xCoordinateOfTail3InGrid}`);
                // log(`this.yCoordinateOfTail3InGrid: ${this.yCoordinateOfTail3InGrid}`);
                
                log(`----------------------------------------------------------------------------------------------------`);
                log(`R: move rope-tail NUMBER 4: :`)
                let newCoordinatesOfRopeTail4inR = this.calculateXAndYCoordinatesOfTail(this.xCoordinateOfTail3InGrid, this.yCoordinateOfTail3InGrid, this.xCoordinateOfTail4InGrid, this.yCoordinateOfTail4InGrid)
                this.xCoordinateOfTail4InGrid =  newCoordinatesOfRopeTail4inR[0];
                this.yCoordinateOfTail4InGrid =  newCoordinatesOfRopeTail4inR[1];
                // log(`this.xCoordinateOfTail4InGrid: ${this.xCoordinateOfTail4InGrid}`);
                // log(`this.yCoordinateOfTail4InGrid: ${this.yCoordinateOfTail4InGrid}`);
                
                log(`----------------------------------------------------------------------------------------------------`);
                log(`R: move rope-tail NUMBER 5: :`)
                let newCoordinatesOfRopeTail5inR = this.calculateXAndYCoordinatesOfTail(this.xCoordinateOfTail4InGrid, this.yCoordinateOfTail4InGrid, this.xCoordinateOfTail5InGrid, this.yCoordinateOfTail5InGrid)
                this.xCoordinateOfTail5InGrid =  newCoordinatesOfRopeTail5inR[0];
                this.yCoordinateOfTail5InGrid =  newCoordinatesOfRopeTail5inR[1];
                // log(`this.xCoordinateOfTail5InGrid: ${this.xCoordinateOfTail5InGrid}`);
                // log(`this.yCoordinateOfTail5InGrid: ${this.yCoordinateOfTail5InGrid}`);
                log(`----------------------------------------------------------------------------------------------------`);
                log(`R: move rope-tail NUMBER 6: :`)
                let newCoordinatesOfRopeTail6inR = this.calculateXAndYCoordinatesOfTail(this.xCoordinateOfTail5InGrid, this.yCoordinateOfTail5InGrid, this.xCoordinateOfTail6InGrid, this.yCoordinateOfTail6InGrid)
                this.xCoordinateOfTail6InGrid =  newCoordinatesOfRopeTail6inR[0];
                this.yCoordinateOfTail6InGrid =  newCoordinatesOfRopeTail6inR[1];
                // log(`this.xCoordinateOfTail6InGrid: ${this.xCoordinateOfTail6InGrid}`);
                // log(`this.yCoordinateOfTail6InGrid: ${this.yCoordinateOfTail6InGrid}`);
                
                log(`----------------------------------------------------------------------------------------------------`);
                log(`R: move rope-tail NUMBER 7: :`)
                let newCoordinatesOfRopeTail7inR = this.calculateXAndYCoordinatesOfTail(this.xCoordinateOfTail6InGrid, this.yCoordinateOfTail6InGrid, this.xCoordinateOfTail7InGrid, this.yCoordinateOfTail7InGrid)
                this.xCoordinateOfTail7InGrid =  newCoordinatesOfRopeTail7inR[0];
                this.yCoordinateOfTail7InGrid =  newCoordinatesOfRopeTail7inR[1];
                // log(`this.xCoordinateOfTail7InGrid: ${this.xCoordinateOfTail7InGrid}`);
                // log(`this.yCoordinateOfTail7InGrid: ${this.yCoordinateOfTail7InGrid}`);
                
                log(`----------------------------------------------------------------------------------------------------`);
                log(`R: move rope-tail NUMBER 8: :`)
                let newCoordinatesOfRopeTail8inR = this.calculateXAndYCoordinatesOfTail(this.xCoordinateOfTail7InGrid, this.yCoordinateOfTail7InGrid, this.xCoordinateOfTail8InGrid, this.yCoordinateOfTail8InGrid)
                this.xCoordinateOfTail8InGrid =  newCoordinatesOfRopeTail8inR[0];
                this.yCoordinateOfTail8InGrid =  newCoordinatesOfRopeTail8inR[1];
                // log(`this.xCoordinateOfTail8InGrid: ${this.xCoordinateOfTail8InGrid}`);
                // log(`this.yCoordinateOfTail8InGrid: ${this.yCoordinateOfTail8InGrid}`);
                
                log(`----------------------------------------------------------------------------------------------------`);
                log(`R: move rope-tail NUMBER 9: :`)
                let newCoordinatesOfRopeTail9inR = this.calculateXAndYCoordinatesOfTailNine(this.xCoordinateOfTail8InGrid, this.yCoordinateOfTail8InGrid, this.xCoordinateOfTail9InGrid, this.yCoordinateOfTail9InGrid)
                this.xCoordinateOfTail9InGrid =  newCoordinatesOfRopeTail9inR[0];
                this.yCoordinateOfTail9InGrid =  newCoordinatesOfRopeTail9inR[1];
                // log(`this.xCoordinateOfTail9InGrid: ${this.xCoordinateOfTail9InGrid}`);
                // log(`this.yCoordinateOfTail9InGrid: ${this.yCoordinateOfTail9InGrid}`);



            }
                // log(this.gridToPlotPositionOf9TailsWithForEachGridCellABooleanIsVisited);
                break;
            case 'U':
                log(`---------------------------------------------------------------------------------------------------------------------------------------------------------`);
                log(' case U-U-U-U-U-U:');
                for (let i = 0; i < nrOfRopeHeadStepsOnRopeBridge; i++) {
                    log(`------------------next cell in loop of instruction-----------------------------------------------------------------------------------`);
                    log(`U: for-loop: i: ${i}`);
                    log(`U: for-loop: nrOfRopeHeadStepsOnRopeBridge: ${nrOfRopeHeadStepsOnRopeBridge}`);
                    log(`U: output of previous instruction:`)
                    log(`U: x,y rope-head (not updated): ${this.xCoordinateOfHeadInGrid}, ${this.yCoordinateOfHeadInGrid} `);              
                    this.xCoordinateOfHeadInGrid -= 1;
                    log(`U: x,y rope-head (updated:.....:      ${this.xCoordinateOfHeadInGrid}, ${this.yCoordinateOfHeadInGrid} `);
                    log(`U: x,y rope-tail1 (not updated):  ${this.xCoordinateOfTail1InGrid} , ${this.yCoordinateOfTail1InGrid}  `); 
                    log('U: lets update the tails 1-9:')


        
                    const calculateNewXAndYCoordinateOfFollowingTailKnotInCaseU = (xLeadingKnot, yLeadingKnot, xFollowingTailKnot, yFollowingTailKnot) => {   
                        // the coordinates of LeadingKnot stay the same.
                        
                        //each comparison has following format: "leadingKnot operator followingKnot"
                        // xLeadingKnot (e.g. rope-knot 4)
                        // xFollowingTailKnot (e.g. rope-knot 5) (always the one after the leading rope-knot)
                        log(`U: fn: calculateNewXAndYCoordinateOfFollowingTailKnotInCaseU: `)
                        log(`U: for-loop: i: ${i}`);
                        log(`U: for-loop: nrOfRopeHeadStepsOnRopeBridge: ${nrOfRopeHeadStepsOnRopeBridge}`);
                        log(`U: xLeadingKnot: ${xLeadingKnot}`);
                        log(`U: yLeadingKnot: ${yLeadingKnot}`);
                        log(`U: xFollowingTailKnot: ${xFollowingTailKnot}`);
                        log(`U: yFollowingTailKnot: ${yFollowingTailKnot}`);
                        if(xLeadingKnot - xFollowingTailKnot == 0 && 
                           yLeadingKnot - yFollowingTailKnot == 0)
                        {
                            log('U: head on top of tail')
                        // } else if (
                        //     yLeadingKnot - yFollowingTailKnot == - 1 ) {
                        //     //tail should not move.
                        //     log('right: head and tail adjacent, so tail not moving.')
                        } else if (xLeadingKnot - xFollowingTailKnot == -2 && 
                            yLeadingKnot - yFollowingTailKnot == 0 ) {
                            log(`U: going north: `)
                            xFollowingTailKnot -= 1;
                        } else if (xLeadingKnot - xFollowingTailKnot == -2 && 
                            yLeadingKnot - yFollowingTailKnot == 1 ) {
                            log(`U: tail goes north-north-east: `)
                            xFollowingTailKnot -= 1;
                            yFollowingTailKnot += 1;
                        } else if (xLeadingKnot - xFollowingTailKnot == - 2 && 
                            yLeadingKnot - yFollowingTailKnot == - 2 ) {
                            log(`U: tail goes North-West: `)
                            xFollowingTailKnot -= 1;
                            yFollowingTailKnot -= 1;   
                        } else if (xLeadingKnot - xFollowingTailKnot == - 2 && 
                            yLeadingKnot - yFollowingTailKnot ==  2 ) {
                            log(`U: tail goes North-East: `)
                            xFollowingTailKnot -= 1;
                            yFollowingTailKnot += 1;   
                        } else if (xLeadingKnot - xFollowingTailKnot == -2 && 
                            yLeadingKnot - yFollowingTailKnot == -1 ) {
                            log(`U: tail goes north-north-west: `)
                            xFollowingTailKnot -= 1;
                            yFollowingTailKnot -= 1;
                        } else if (xLeadingKnot - xFollowingTailKnot == -1 && // scope: only rope-tail 2-10. out-of-scope: rope-tail 1.
                            yLeadingKnot - yFollowingTailKnot == 2 ) {
                            log(`U: tail goes north-east-north: `)
                            xFollowingTailKnot -= 1;
                            yFollowingTailKnot += 1;
                        } else if (xLeadingKnot - xFollowingTailKnot == -1 && // scope: only rope-tail 2-10. out-of-scope: rope-tail 1.
                            yLeadingKnot - yFollowingTailKnot == - 2 ) {
                            log(`U: tail goes north-west-north: `)
                            xFollowingTailKnot -= 1;
                            yFollowingTailKnot -= 1;
                        // } else if (xLeadingKnot - xFollowingTailKnot == 0 && 
                        //     yLeadingKnot - yFollowingTailKnot == -2 ) {
                        //     log(`U: tail goes West: `)
                        //     yFollowingTailKnot -= 1; 
                        // } else if (xLeadingKnot - xFollowingTailKnot ==  0 && 
                        //     yLeadingKnot - yFollowingTailKnot == 2 ) {
                        //     log(`U: tail goes East: `)
                        //     yFollowingTailKnot += 1;                    
                        } else { 
                            log(`U: fn movefRopeTailOnRopeBridgeOneStepAtATimeForEachInstructionFromInputFile: case U`)
                        };
                            log(`U: xFollowingTailKnot: (updated): ${xFollowingTailKnot}`);
                            log(`U: yFollowingTailKnot: (updated): ${yFollowingTailKnot}`); 
                        return [xFollowingTailKnot, yFollowingTailKnot]
                    }


                    const calculateNewXAndYCoordinateOfTailKnot9WithVisitedGridCellCountInCaseU = (xLeadingKnot, yLeadingKnot, xFollowingTailKnot, yFollowingTailKnot) => {   
                        // the coordinates of LeadingKnot stay the same.
                        
                        //each comparison has following format: "leadingKnot operator followingKnot"
                        // xLeadingKnot (e.g. rope-knot 4)
                        // xFollowingTailKnot (e.g. rope-knot 5) (always the one after the leading rope-knot)
                        log(`U: fn: calculateNewXAndYCoordinateOfTailKnot9WithVisitedGridCellCountInCaseU: `)
                        log(`U: for-loop: i: ${i}`);
                        log(`U: for-loop: nrOfRopeHeadStepsOnRopeBridge: ${nrOfRopeHeadStepsOnRopeBridge}`);
                        log(`U: xLeadingKnot: ${xLeadingKnot}`);
                        log(`U: yLeadingKnot: ${yLeadingKnot}`);
                        log(`U: xFollowingTailKnot: ${xFollowingTailKnot}`);
                        log(`U: yFollowingTailKnot: ${yFollowingTailKnot}`);
                        if(xLeadingKnot - xFollowingTailKnot == 0 && 
                           yLeadingKnot - yFollowingTailKnot == 0)
                        {
                            log('U: head on top of tail')
                        // } else if (
                        //     yLeadingKnot - yFollowingTailKnot == - 1 ) {
                        //     //tail should not move.
                        //     log('right: head and tail adjacent, so tail not moving.')
                        } else if (xLeadingKnot - xFollowingTailKnot == -2 && 
                            yLeadingKnot - yFollowingTailKnot == 0 ) {
                            // tail goes East:
                            log(`U: going north: `)
                            xFollowingTailKnot -= 1;
                            this.gridToPlotPositionOf9TailsWithForEachGridCellABooleanIsVisited[xFollowingTailKnot][yFollowingTailKnot] = 'tru';
                            globalCounterSetTailNineToTrue +=1;
                            log(`globalCounterSetTailNineToTrue:${globalCounterSetTailNineToTrue} `)
                        } else if (xLeadingKnot - xFollowingTailKnot == -2 && 
                            yLeadingKnot - yFollowingTailKnot == 1 ) {
                            log(`U: tail goes north-north-east: `)
                            xFollowingTailKnot -= 1;
                            yFollowingTailKnot += 1;
                            this.gridToPlotPositionOf9TailsWithForEachGridCellABooleanIsVisited[xFollowingTailKnot][yFollowingTailKnot] = 'tru';
                            globalCounterSetTailNineToTrue +=1;
                            log(`globalCounterSetTailNineToTrue:${globalCounterSetTailNineToTrue} `)
                        } else if (xLeadingKnot - xFollowingTailKnot == 2 && 
                            yLeadingKnot - yFollowingTailKnot == 2 ) {
                            log(`U: tail goes South-East: `)
                            xFollowingTailKnot += 1;
                            yFollowingTailKnot += 1;   
                            this.gridToPlotPositionOf9TailsWithForEachGridCellABooleanIsVisited[xFollowingTailKnot][yFollowingTailKnot] = 'tru';
                            globalCounterSetTailNineToTrue +=1;
                            log(`globalCounterSetTailNineToTrue:${globalCounterSetTailNineToTrue} `)
                        } else if (xLeadingKnot - xFollowingTailKnot == - 2 && 
                            yLeadingKnot - yFollowingTailKnot ==  2 ) {
                            log(`U: tail goes North-East: `)
                            xFollowingTailKnot -= 1;
                            yFollowingTailKnot += 1;   
                            this.gridToPlotPositionOf9TailsWithForEachGridCellABooleanIsVisited[xFollowingTailKnot][yFollowingTailKnot] = 'tru';
                            globalCounterSetTailNineToTrue +=1;
                            log(`globalCounterSetTailNineToTrue:${globalCounterSetTailNineToTrue} `)
                        } else if (xLeadingKnot - xFollowingTailKnot == -2 && 
                            yLeadingKnot - yFollowingTailKnot == -1 ) {
                            log(`U: tail goes north-north-west: `)
                            xFollowingTailKnot -= 1;
                            yFollowingTailKnot -= 1;
                            this.gridToPlotPositionOf9TailsWithForEachGridCellABooleanIsVisited[xFollowingTailKnot][yFollowingTailKnot] = 'tru';
                            globalCounterSetTailNineToTrue +=1;
                            log(`globalCounterSetTailNineToTrue:${globalCounterSetTailNineToTrue} `)
                        } else if (xLeadingKnot - xFollowingTailKnot == -1 && // scope: only rope-tail 2-10. out-of-scope: rope-tail 1.
                            yLeadingKnot - yFollowingTailKnot == 2 ) {
                            log(`U: tail goes north-east-north: `)
                            xFollowingTailKnot -= 1;
                            yFollowingTailKnot += 1;
                            this.gridToPlotPositionOf9TailsWithForEachGridCellABooleanIsVisited[xFollowingTailKnot][yFollowingTailKnot] = 'tru';
                            globalCounterSetTailNineToTrue +=1;
                            log(`globalCounterSetTailNineToTrue:${globalCounterSetTailNineToTrue} `)
                        } else if (xLeadingKnot - xFollowingTailKnot == -1 && // scope: only rope-tail 2-10. out-of-scope: rope-tail 1.
                            yLeadingKnot - yFollowingTailKnot == - 2 ) {
                            log(`U: tail goes north-west-north: `)
                            xFollowingTailKnot -= 1;
                            yFollowingTailKnot -= 1;
                            this.gridToPlotPositionOf9TailsWithForEachGridCellABooleanIsVisited[xFollowingTailKnot][yFollowingTailKnot] = 'tru';  
                            globalCounterSetTailNineToTrue +=1;
                            log(`globalCounterSetTailNineToTrue:${globalCounterSetTailNineToTrue} `)   
                        // } else if (xLeadingKnot - xFollowingTailKnot == 0 && 
                        //     yLeadingKnot - yFollowingTailKnot == -2 ) {
                        //     log(`U: tail goes West: `)
                        //     yFollowingTailKnot -= 1;
                        //     this.gridToPlotPositionOf9TailsWithForEachGridCellABooleanIsVisited[xFollowingTailKnot][yFollowingTailKnot] = 'tru'; 
                        //     globalCounterSetTailNineToTrue +=1;
                        //     log(`globalCounterSetTailNineToTrue:${globalCounterSetTailNineToTrue} `)   
                        // } else if (xLeadingKnot - xFollowingTailKnot ==  0 && 
                        //     yLeadingKnot - yFollowingTailKnot == 2 ) {
                        //     log(`U: tail goes East: `)
                        //     yFollowingTailKnot += 1;
                        //     this.gridToPlotPositionOf9TailsWithForEachGridCellABooleanIsVisited[xFollowingTailKnot][yFollowingTailKnot] = 'tru'; 
                        //     globalCounterSetTailNineToTrue +=1;
                        //     log(`globalCounterSetTailNineToTrue:${globalCounterSetTailNineToTrue} `)                    
                        } else { 
                            log(`U: fn movefRopeTailOnRopeBridgeOneStepAtATimeForEachInstructionFromInputFile: case U`)
                        };
                            log(`U: xFollowingTailKnot: (updated): ${xFollowingTailKnot}`);
                            log(`U: yFollowingTailKnot: (updated): ${yFollowingTailKnot}`);     
                        return [xFollowingTailKnot, yFollowingTailKnot]
                    }


                    log(`----------------------------------------------------------------------------------------------------`);
                    log(`U: move rope-tail NUMBER 1:`)
                    let newCoordinatesOfRopeTail1inU = this.calculateXAndYCoordinatesOfTail(this.xCoordinateOfHeadInGrid, this.yCoordinateOfHeadInGrid, this.xCoordinateOfTail1InGrid, this.yCoordinateOfTail1InGrid)
                    /*
                        goal: update rope-tail-coordinates so it can be reused for:
                        a) remainder of this instruction (e.g. R 4 in input1.txt):
                        b) the next instruction (e.g. U4, in input1.txt):
                    */
                    this.xCoordinateOfTail1InGrid =  newCoordinatesOfRopeTail1inU[0];
                    this.yCoordinateOfTail1InGrid =  newCoordinatesOfRopeTail1inU[1];
                    log(`----------------------------------------------------------------------------------------------------`);
                    log(`U: move rope-tail NUMBER 2:`)
                    let newCoordinatesOfRopeTail2inU = this.calculateXAndYCoordinatesOfTail(this.xCoordinateOfTail1InGrid, this.yCoordinateOfTail1InGrid, this.xCoordinateOfTail2InGrid, this.yCoordinateOfTail2InGrid)
                    // /*
                    //     goal: update rope-tail-coordinates so it can be reused for:
                    //     a) the next instruction (e.g. R 4 in input1.txt):
                    // */
                    this.xCoordinateOfTail2InGrid =  newCoordinatesOfRopeTail2inU[0];
                    this.yCoordinateOfTail2InGrid =  newCoordinatesOfRopeTail2inU[1];
                    // log(`this.xCoordinateOfTail2InGrid: ${this.xCoordinateOfTail2InGrid}`);
                    // log(`this.yCoordinateOfTail2InGrid: ${this.yCoordinateOfTail2InGrid}`);
                    log(`----------------------------------------------------------------------------------------------------`);
                    log(`U: move rope-tail NUMBER 3: :`)
                    let newCoordinatesOfRopeTail3inU = this.calculateXAndYCoordinatesOfTail(this.xCoordinateOfTail2InGrid, this.yCoordinateOfTail2InGrid, this.xCoordinateOfTail3InGrid, this.yCoordinateOfTail3InGrid)
                    this.xCoordinateOfTail3InGrid =  newCoordinatesOfRopeTail3inU[0];
                    this.yCoordinateOfTail3InGrid =  newCoordinatesOfRopeTail3inU[1];
                    // log(`this.xCoordinateOfTail3InGrid: ${this.xCoordinateOfTail3InGrid}`);
                    // log(`this.yCoordinateOfTail3InGrid: ${this.yCoordinateOfTail3InGrid}`);
                    
                    log(`----------------------------------------------------------------------------------------------------`);
                    log(`U: move rope-tail NUMBER 4: :`)
                    let newCoordinatesOfRopeTail4inU = this.calculateXAndYCoordinatesOfTail(this.xCoordinateOfTail3InGrid, this.yCoordinateOfTail3InGrid, this.xCoordinateOfTail4InGrid, this.yCoordinateOfTail4InGrid)
                    this.xCoordinateOfTail4InGrid =  newCoordinatesOfRopeTail4inU[0];
                    this.yCoordinateOfTail4InGrid =  newCoordinatesOfRopeTail4inU[1];
                    // log(`this.xCoordinateOfTail4InGrid: ${this.xCoordinateOfTail4InGrid}`);
                    // log(`this.yCoordinateOfTail4InGrid: ${this.yCoordinateOfTail4InGrid}`);
                    
                    log(`----------------------------------------------------------------------------------------------------`);
                    log(`U: move rope-tail NUMBER 5: :`)
                    let newCoordinatesOfRopeTail5inU = this.calculateXAndYCoordinatesOfTail(this.xCoordinateOfTail4InGrid, this.yCoordinateOfTail4InGrid, this.xCoordinateOfTail5InGrid, this.yCoordinateOfTail5InGrid)
                    this.xCoordinateOfTail5InGrid =  newCoordinatesOfRopeTail5inU[0];
                    this.yCoordinateOfTail5InGrid =  newCoordinatesOfRopeTail5inU[1];
                    // log(`this.xCoordinateOfTail5InGrid: ${this.xCoordinateOfTail5InGrid}`);
                    // log(`this.yCoordinateOfTail5InGrid: ${this.yCoordinateOfTail5InGrid}`);
                    log(`----------------------------------------------------------------------------------------------------`);
                    log(`U: move rope-tail NUMBER 6: :`)
                    let newCoordinatesOfRopeTail6inU = this.calculateXAndYCoordinatesOfTail(this.xCoordinateOfTail5InGrid, this.yCoordinateOfTail5InGrid, this.xCoordinateOfTail6InGrid, this.yCoordinateOfTail6InGrid)
                    this.xCoordinateOfTail6InGrid =  newCoordinatesOfRopeTail6inU[0];
                    this.yCoordinateOfTail6InGrid =  newCoordinatesOfRopeTail6inU[1];
                    // log(`this.xCoordinateOfTail6InGrid: ${this.xCoordinateOfTail6InGrid}`);
                    // log(`this.yCoordinateOfTail6InGrid: ${this.yCoordinateOfTail6InGrid}`);
                    
                    log(`----------------------------------------------------------------------------------------------------`);
                    log(`U: move rope-tail NUMBER 7: :`)
                    let newCoordinatesOfRopeTail7inU = this.calculateXAndYCoordinatesOfTail(this.xCoordinateOfTail6InGrid, this.yCoordinateOfTail6InGrid, this.xCoordinateOfTail7InGrid, this.yCoordinateOfTail7InGrid)
                    this.xCoordinateOfTail7InGrid =  newCoordinatesOfRopeTail7inU[0];
                    this.yCoordinateOfTail7InGrid =  newCoordinatesOfRopeTail7inU[1];
                    // log(`this.xCoordinateOfTail7InGrid: ${this.xCoordinateOfTail7InGrid}`);
                    // log(`this.yCoordinateOfTail7InGrid: ${this.yCoordinateOfTail7InGrid}`);
                    
                    log(`----------------------------------------------------------------------------------------------------`);
                    log(`U: move rope-tail NUMBER 8: :`)
                    let newCoordinatesOfRopeTail8inU = this.calculateXAndYCoordinatesOfTail(this.xCoordinateOfTail7InGrid, this.yCoordinateOfTail7InGrid, this.xCoordinateOfTail8InGrid, this.yCoordinateOfTail8InGrid)
                    this.xCoordinateOfTail8InGrid =  newCoordinatesOfRopeTail8inU[0];
                    this.yCoordinateOfTail8InGrid =  newCoordinatesOfRopeTail8inU[1];
                    // log(`this.xCoordinateOfTail8InGrid: ${this.xCoordinateOfTail8InGrid}`);
                    // log(`this.yCoordinateOfTail8InGrid: ${this.yCoordinateOfTail8InGrid}`);
                    
                    log(`----------------------------------------------------------------------------------------------------`);
                    log(`U: move rope-tail NUMBER 9: :`)
                    let newCoordinatesOfRopeTail9inU = this.calculateXAndYCoordinatesOfTailNine(this.xCoordinateOfTail8InGrid, this.yCoordinateOfTail8InGrid, this.xCoordinateOfTail9InGrid, this.yCoordinateOfTail9InGrid)
                    this.xCoordinateOfTail9InGrid =  newCoordinatesOfRopeTail9inU[0];
                    this.yCoordinateOfTail9InGrid =  newCoordinatesOfRopeTail9inU[1];
                    // log(`this.xCoordinateOfTail9InGrid: ${this.xCoordinateOfTail9InGrid}`);
                    // log(`this.yCoordinateOfTail9InGrid: ${this.yCoordinateOfTail9InGrid}`);

           
                } 
                // log(this.gridToPlotPositionOf9TailsWithForEachGridCellABooleanIsVisited);
                break; 





        // log(`head coordinates: x: ${this.xCoordinateOfHeadInGrid}, y:${this.yCoordinateOfHeadInGrid} `)
        // log`method moveOnRopeBridge: after each elf step another boolean false is added to gridRopeBridge:`
        
        // this.gridToPlotPositionOf9TailsWithForEachGridCellABooleanIsVisited[this.xCoordinateOfHeadInGrid][this.yCoordinateOfHeadInGrid] = 'tru';
        // log(this.gridToPlotPositionOf9TailsWithForEachGridCellABooleanIsVisited);
        //pitfall: the starting position in the grid is NOT set to 'tru'. So off-by-one error. This is corrected above the switch-statement.
        /*
            output:
                head coordinates: x: 4, y:4  --> startingPoint [4,0] "plus" the first instruction from input1.txt "R 4": 4 elf steps to the right.
                head coordinates: x: 0, y:4  --> 2nd instruction from input1.txt "U 4": 4 elf steps down.
                head coordinates: x: 0, y:1
                head coordinates: x: 1, y:1
                head coordinates: x: 1, y:5
                head coordinates: x: 2, y:5
                head coordinates: x: 2, y:0
                head coordinates: x: 2, y:2

            analysis: I end in [2,2]. Because I make at the start a correction of [4,0]:
            a) all elf steps lie within the created grid, so all tail positions visited at least once, are now also inside the grid. 
            b) I can use [0,0] as the grid origin. This helps me to visualize what is going on in the 
            grid (just like reading the instructions of how to traverse a chess board with a list of chess steps ). Now I have all the building 
            blocks / ingredients to track the location of the rope-tail.
        */

        } // end of switch statement
    } // end of method movefRopeHeadOnRopeBridgeOneStepAtATime
} // end of class MachineToModelKnotsPositionsInGrid


let object1MachineToModelKnotsPositionsInGrid = new MachineToModelKnotsPositionsInGrid();
// log(object1MachineToModelKnotsPositionsInGrid)
/*
    analysis: the object object1MachineToModelKnotsPositionsInGrid is needed to create gridToPlotPositionOf9TailsWithForEachGridCellABooleanIsVisited. 
    (pitfall) so you cannot instanciate this object with this grid as an argument that will go into the constructor.
*/



// calculate width and height of gridToPlotPositionOfTail
motionsOfRopeHeadOfRopeBridge.forEach((motionOfRopeHeadOfRopeBridge) => {
    // take 1 (elf) step at a time.
    object1MachineToModelKnotsPositionsInGrid.createArrayWithDataThatIsNeededInOtherCodeAsInputToCalculateNrOfRowsAndColsInGrid(motionOfRopeHeadOfRopeBridge);
})

let calculateNrOfRequiredRowsInGrid = (object1MachineToModelKnotsPositionsInGrid) => {
    // starting point to calculate nr of rows in grid is [0,0]
    let xCoordinateHighestDistanceFromStartPoint = Math.max(...object1MachineToModelKnotsPositionsInGrid.xCoordinateLowestAndHighestDistanceFromStartPoint);
    // log(xCoordinateHighestDistanceFromStartPoint);
    // input1.txt: -2

    let xCoordinateLowestDistanceFromStartPoint = Math.min(...object1MachineToModelKnotsPositionsInGrid.xCoordinateLowestAndHighestDistanceFromStartPoint);
    // log(xCoordinateLowestDistanceFromStartPoint);
    // input1.txt: -4
    // pitfall: Math.min (that suggest a "minimum") actually provides the highest distance from ficticious starting point [0,0] here.
    // Which one provides the lowest and highest nr depends on the dataset. 

    if (xCoordinateHighestDistanceFromStartPoint < 0) xCoordinateHighestDistanceFromStartPoint = 0;
    if (xCoordinateLowestDistanceFromStartPoint > 0) xCoordinateLowestDistanceFromStartPoint = 0;

    let nrOfRequiredRowsInGrid = xCoordinateHighestDistanceFromStartPoint - xCoordinateLowestDistanceFromStartPoint;
    // in order 2 take e.g. to steps down in the grid, you need 3 rows, so to avoid off-by-one error:
    nrOfRequiredRowsInGrid +=1;
    // log(nrOfRequiredRowsInGrid);
    return nrOfRequiredRowsInGrid;
}
let nrOfRequiredRowsInGrid = calculateNrOfRequiredRowsInGrid(object1MachineToModelKnotsPositionsInGrid);
log(`nrOfRequiredRowsInGrid: ${nrOfRequiredRowsInGrid}  (1-based numbering)`);
// set to 400 rows "hard-coded":
nrOfRequiredRowsInGrid = nrOfRequiredRowsInGridHardCoded;
object1MachineToModelKnotsPositionsInGrid.gridNrOfRows = nrOfRequiredRowsInGrid;



let calculateNrOfRequiredColsInGrid = (object1MachineToModelKnotsPositionsInGrid) => {
    // starting point to calculate nr of cols in grid is [0,0]
    // pitfall: read pitfall in fn calculateNrOfRequiredRowsInGrid. 
    let yCoordinateHighestDistanceFromStartPoint = Math.max(...object1MachineToModelKnotsPositionsInGrid.yCoordinateLowestAndHighestDistanceFromStartPoint);
    // log(yCoordinateHighestDistanceFromStartPoint);

    let yCoordinateLowestDistanceFromStartPoint = Math.min(...object1MachineToModelKnotsPositionsInGrid.yCoordinateLowestAndHighestDistanceFromStartPoint);
    // log(yCoordinateLowestDistanceFromStartPoint);

    if (yCoordinateHighestDistanceFromStartPoint < 0) yCoordinateHighestDistanceFromStartPoint = 0;
    if (yCoordinateLowestDistanceFromStartPoint > 0) yCoordinateLowestDistanceFromStartPoint = 0;

    let nrOfRequiredColsInGrid = yCoordinateHighestDistanceFromStartPoint - yCoordinateLowestDistanceFromStartPoint;
    // in order 2 take e.g. to steps to the right in the grid, you need 3 cols, so to avoid off-by-one error:
    nrOfRequiredColsInGrid +=1;
    // log(nrOfRequiredColsInGrid);
    return nrOfRequiredColsInGrid;
}
let nrOfRequiredColsInGrid = calculateNrOfRequiredColsInGrid(object1MachineToModelKnotsPositionsInGrid);
log(`nrOfRequiredColsInGrid: ${nrOfRequiredColsInGrid}  (1-based numbering)`);

// set to 400 cols "hard-coded":
nrOfRequiredColsInGrid = nrOfRequiredColsInGridHardCoded;
object1MachineToModelKnotsPositionsInGrid.gridNrOfCols = nrOfRequiredColsInGrid;





const createGridWithBooleans = (row, col) => {
    // Grid is needed to plot which grid cells have been visited.
    let gridToPlotPositionOf9TailsWithForEachGridCellABooleanIsVisited = Array.from(Array(row), ()=> Array(col).fill(false));
    return gridToPlotPositionOf9TailsWithForEachGridCellABooleanIsVisited;
}
let gridToPlotPositionOf9TailsWithForEachGridCellABooleanIsVisited = createGridWithBooleans(nrOfRequiredRowsInGrid, nrOfRequiredColsInGrid );
// log(`gridToPlotPositionOf9TailsWithForEachGridCellABooleanIsVisited: `)
// log(gridToPlotPositionOf9TailsWithForEachGridCellABooleanIsVisited);
object1MachineToModelKnotsPositionsInGrid.gridToPlotPositionOf9TailsWithForEachGridCellABooleanIsVisited = gridToPlotPositionOf9TailsWithForEachGridCellABooleanIsVisited;
// log(object1MachineToModelKnotsPositionsInGrid.gridToPlotPositionOf9TailsWithForEachGridCellABooleanIsVisited);

const calculateCellXAndYCoordinatesOfStartingPointInGrid = () => {
    // in input1.txt (=== example in the assignment https://adventofcode.com/2022/day/9 ) the starting cell is [4, 0] (zero-based counting)
    /*
        if you start at e.g. [0,0] or [3,2], then you will be traversing outside of the grid, so the number of tails that have been visited will
        be wrong.
        That is why you must start at the correct starting cell. 
    */
    
    let xCoordinateHighestDistanceFromStartPoint = Math.max(...object1MachineToModelKnotsPositionsInGrid.xCoordinateLowestAndHighestDistanceFromStartPoint);
    // log(xCoordinateHighestDistanceFromStartPoint);
    // input1.txt: result: -2

    let xCoordinateLowestDistanceFromStartPoint = Math.min(...object1MachineToModelKnotsPositionsInGrid.xCoordinateLowestAndHighestDistanceFromStartPoint);
    // log(xCoordinateLowestDistanceFromStartPoint);
    // input1.txt: result: -4
    // pitfall: Math.min (that suggest a "minimum") actually provides the highest distance from ficticious starting point [0,0].
    
    
    let yCoordinateHighestDistanceFromStartPoint = Math.max(...object1MachineToModelKnotsPositionsInGrid.yCoordinateLowestAndHighestDistanceFromStartPoint);
    // log(yCoordinateHighestDistanceFromStartPoint);
    // input1.txt: result: 5

    let yCoordinateLowestDistanceFromStartPoint = Math.min(...object1MachineToModelKnotsPositionsInGrid.yCoordinateLowestAndHighestDistanceFromStartPoint);
    // log(yCoordinateLowestDistanceFromStartPoint);
    // input1.txt: result: 0

    let xCoordinateOfStartPointInGrid = 0;
    if (xCoordinateHighestDistanceFromStartPoint > xCoordinateLowestDistanceFromStartPoint) {
        xCoordinateOfStartPointInGrid -= xCoordinateLowestDistanceFromStartPoint 
    } else {
        xCoordinateOfStartPointInGrid -= xCoordinateHighestDistanceFromStartPoint 
    }

    let yCoordinateOfStartPointInGrid = 0;
    if (yCoordinateHighestDistanceFromStartPoint > yCoordinateLowestDistanceFromStartPoint) {
        yCoordinateOfStartPointInGrid -= yCoordinateLowestDistanceFromStartPoint 
    } else {
        yCoordinateOfStartPointInGrid -= yCoordinateHighestDistanceFromStartPoint 
    }

    return [xCoordinateOfStartPointInGrid, yCoordinateOfStartPointInGrid ];
    // expected result in input1.txt: [4,0]. actual result: [4,0] (ok)
}
let cellXAndYCoordinatesOfStartPointInGrid = calculateCellXAndYCoordinatesOfStartingPointInGrid();
log(`cellXAndYCoordinatesOfStartPointInGrid: [${cellXAndYCoordinatesOfStartPointInGrid}] (0-based numbering)`);
// set starting point"hard-coded":
cellXAndYCoordinatesOfStartPointInGrid = cellXAndYCoordinatesOfStartPointInGridHardCoded;


object1MachineToModelKnotsPositionsInGrid.xCoordinateStartingPointInGrid = cellXAndYCoordinatesOfStartPointInGrid[0];
// log(object1MachineToModelKnotsPositionsInGrid.xCoordinateStartingPointInGrid);
object1MachineToModelKnotsPositionsInGrid.yCoordinateStartingPointInGrid = cellXAndYCoordinatesOfStartPointInGrid[1];
// log(object1MachineToModelKnotsPositionsInGrid.yCoordinateStartingPointInGrid);



// initialize the startingPoint of the rope-head in the grid: (there is only 1 correct value, see comment in fn
// calculateCellXAndYCoordinatesOfStartingPointInGrid. 
object1MachineToModelKnotsPositionsInGrid.xCoordinateOfHeadInGrid = object1MachineToModelKnotsPositionsInGrid.xCoordinateStartingPointInGrid; 
//when run with input1.txt: 4 (=== example in the assignment https://adventofcode.com/2022/day/9 )
object1MachineToModelKnotsPositionsInGrid.yCoordinateOfHeadInGrid = object1MachineToModelKnotsPositionsInGrid.yCoordinateStartingPointInGrid; 
//when run with input1.txt: 0 (=== example in the assignment https://adventofcode.com/2022/day/9 )

/*
    Also initialize the starting point of the rope-tail in the grid.
    Reason: rope-head and rope-tail must start at the same location in the grid (=== requirement). 
*/
// object1MachineToModelKnotsPositionsInGrid.xCoordinateOfTailInGrid = object1MachineToModelKnotsPositionsInGrid.xCoordinateStartingPointInGrid; 
//when run with input1.txt: 4 (=== example in the assignment https://adventofcode.com/2022/day/9 )
// object1MachineToModelKnotsPositionsInGrid.yCoordinateOfTailInGrid = object1MachineToModelKnotsPositionsInGrid.yCoordinateStartingPointInGrid; 
//when run with input1.txt: 0 (=== example in the assignment https://adventofcode.com/2022/day/9 )

/*
    day 9, part 2:
    initialize the starting point of all 9 rope-tail-knots in the grid:
    pitfall: do not use xCoordinateOfTailInGrid nor yCoordinateOfTailInGrid for part 2 (contrary to part 1 where they were useful)
*/

object1MachineToModelKnotsPositionsInGrid.xCoordinateOfTail1InGrid = object1MachineToModelKnotsPositionsInGrid.xCoordinateStartingPointInGrid;  
object1MachineToModelKnotsPositionsInGrid.yCoordinateOfTail1InGrid = object1MachineToModelKnotsPositionsInGrid.yCoordinateStartingPointInGrid;  
object1MachineToModelKnotsPositionsInGrid.xCoordinateOfTail2InGrid = object1MachineToModelKnotsPositionsInGrid.xCoordinateStartingPointInGrid;  
object1MachineToModelKnotsPositionsInGrid.yCoordinateOfTail2InGrid = object1MachineToModelKnotsPositionsInGrid.yCoordinateStartingPointInGrid; 
object1MachineToModelKnotsPositionsInGrid.xCoordinateOfTail3InGrid = object1MachineToModelKnotsPositionsInGrid.xCoordinateStartingPointInGrid;  
object1MachineToModelKnotsPositionsInGrid.yCoordinateOfTail3InGrid = object1MachineToModelKnotsPositionsInGrid.yCoordinateStartingPointInGrid;  
object1MachineToModelKnotsPositionsInGrid.xCoordinateOfTail4InGrid = object1MachineToModelKnotsPositionsInGrid.xCoordinateStartingPointInGrid;  
object1MachineToModelKnotsPositionsInGrid.yCoordinateOfTail4InGrid = object1MachineToModelKnotsPositionsInGrid.yCoordinateStartingPointInGrid;   
object1MachineToModelKnotsPositionsInGrid.xCoordinateOfTail5InGrid = object1MachineToModelKnotsPositionsInGrid.xCoordinateStartingPointInGrid;  
object1MachineToModelKnotsPositionsInGrid.yCoordinateOfTail5InGrid = object1MachineToModelKnotsPositionsInGrid.yCoordinateStartingPointInGrid;  
object1MachineToModelKnotsPositionsInGrid.xCoordinateOfTail6InGrid = object1MachineToModelKnotsPositionsInGrid.xCoordinateStartingPointInGrid;  
object1MachineToModelKnotsPositionsInGrid.yCoordinateOfTail6InGrid = object1MachineToModelKnotsPositionsInGrid.yCoordinateStartingPointInGrid;   
object1MachineToModelKnotsPositionsInGrid.xCoordinateOfTail7InGrid = object1MachineToModelKnotsPositionsInGrid.xCoordinateStartingPointInGrid;  
object1MachineToModelKnotsPositionsInGrid.yCoordinateOfTail7InGrid = object1MachineToModelKnotsPositionsInGrid.yCoordinateStartingPointInGrid;  
object1MachineToModelKnotsPositionsInGrid.xCoordinateOfTail8InGrid = object1MachineToModelKnotsPositionsInGrid.xCoordinateStartingPointInGrid;  
object1MachineToModelKnotsPositionsInGrid.yCoordinateOfTail8InGrid = object1MachineToModelKnotsPositionsInGrid.yCoordinateStartingPointInGrid;    
object1MachineToModelKnotsPositionsInGrid.xCoordinateOfTail9InGrid = object1MachineToModelKnotsPositionsInGrid.xCoordinateStartingPointInGrid;  
object1MachineToModelKnotsPositionsInGrid.yCoordinateOfTail9InGrid = object1MachineToModelKnotsPositionsInGrid.yCoordinateStartingPointInGrid;   



// set starting point of rope-tail 9 to 'tru', indicating that it has visited this cell: 
object1MachineToModelKnotsPositionsInGrid.gridToPlotPositionOf9TailsWithForEachGridCellABooleanIsVisited[object1MachineToModelKnotsPositionsInGrid.xCoordinateStartingPointInGrid][object1MachineToModelKnotsPositionsInGrid.yCoordinateStartingPointInGrid] = 'tru';


motionsOfRopeHeadOfRopeBridge.forEach((motionOfRopeHeadOfRopeBridge) => {
    
    // object1MachineToModelKnotsPositionsInGrid.moveRopeHeadOnRopeBridgeByJumpingToDestinationCell(motionOfRopeHeadOfRopeBridge); (status: works)
    // take 1 elf step at a time: e.g. "D 4" consists of 4 steps that should each be taken separately.
    // object1MachineToModelKnotsPositionsInGrid.movefRopeHeadOnRopeBridgeOneStepAtATime(motionOfRopeHeadOfRopeBridge); (status: works)

    object1MachineToModelKnotsPositionsInGrid.movefRopeTailOnRopeBridgeOneStepAtATimeForEachInstructionFromInputFile(motionOfRopeHeadOfRopeBridge);
    /*
        in input1.txt (=== example in the assignment https://adventofcode.com/2022/day/9 ) the destination
        cell of the head is [2,2] (zero-based counting)  
    */
})


log(`gridToPlotPositionOf9TailsWithForEachGridCellABooleanIsVisited:`);
console.table(object1MachineToModelKnotsPositionsInGrid.gridToPlotPositionOf9TailsWithForEachGridCellABooleanIsVisited);


log(`xCoordinateOfHeadInGrid : destination: ${object1MachineToModelKnotsPositionsInGrid.xCoordinateOfHeadInGrid}`);
log(`yCoordinateOfHeadInGrid: destination: ${object1MachineToModelKnotsPositionsInGrid.yCoordinateOfHeadInGrid}`)


const countUpAllOfThePositionsRopeTail9VisitedAtLeastOnce = (object1MachineToModelKnotsPositionsInGrid) => {
    let array = object1MachineToModelKnotsPositionsInGrid.gridToPlotPositionOf9TailsWithForEachGridCellABooleanIsVisited;
    let hasRopeHeadTouchedThisGridCell = (arrayElement) => arrayElement == 'tru';
    let arrayWithAllCellsThatHaveBeenVisitedByRopeHead = array.map( subarray => subarray.filter( hasRopeHeadTouchedThisGridCell ));
    let flatArrayWithAllCellsThatHaveBeenVisitedByRopeHead = arrayWithAllCellsThatHaveBeenVisitedByRopeHead.flat()
    return flatArrayWithAllCellsThatHaveBeenVisitedByRopeHead.length;
}
let countOfAllOfThePositionsRopeTail9VisitedAtLeastOnce = countUpAllOfThePositionsRopeTail9VisitedAtLeastOnce(object1MachineToModelKnotsPositionsInGrid);
log(`countOfAllOfThePositionsTheHeadVisitedAtLeastOnce: ${countOfAllOfThePositionsRopeTail9VisitedAtLeastOnce}.`);

log(`globalCounterSetTailNineToTrueInMethodnmovefRopeTailOnRopeBridgeOneStepAtATimeForEachInstructionFromInputFile:
    ${globalCounterSetTailNineToTrue} `) 
    // the first 'tru1' is not set by this method, so:
// countOfAllOfThePositionsTheHeadVisitedAtLeastOnce - globalCounterSetTailNineToTrue == 1 (expected result)