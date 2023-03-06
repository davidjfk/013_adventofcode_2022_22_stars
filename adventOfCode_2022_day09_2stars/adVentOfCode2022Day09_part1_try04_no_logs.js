/*
    first read comment (about design) at the start of adVentOfCode2022Day09_part1_try01.js    (and then try02.js, try03.js).
    Difference between try04 and try03: console.logs have been commented out: otherwise vscode gets really slow while executing the code. 

    status: done. Correct result for adVentOfCode day 9 part 1: 6337.
    (issue: too many console.logs to run code with input2.txt --> run try04_no_logs.js to run code with input2.txt)
    next: (on backlog: see codeline 323 below). 
*/

const log = console.log;

const {readFileSync} = require("fs");
const { toNamespacedPath } = require("path");


const motionsOfElvesOnRopeBridge = readFileSync("input2.txt", "utf-8").split('\r\n');
// //log('01_input-from-file: ')
// //log(input)

// const motionsOfElvesOnRopeBridge = [
//     'R 4', 'U 4',
//     'L 3', 'D 1',
//     'R 4', 'D 1',
//     'L 5', 'R 2'
//   ];


class MachineToModelKnotsPositionsInGrid {
    constructor(gridToPlotPositionOfTail) {
        // this.gridToPlotPositionOfTail = gridToPlotPositionOfTail;
        this.xPreviousCoordinateOfHead = 0;
        this.yPreviousCoordinateOfHead = 0;
        this.xPreviousCoordinateOfTail = 0;
        this.yPreviousCoordinateOfTail = 0;
        this.xCoordinateLowestAndHighestDistanceFromStartPoint = []; 
        this.yCoordinateLowestAndHighestDistanceFromStartPoint = [];
        this.gridNrOfRows = 0;
        this.gridNrOfCols = 0;
        this.xCoordinateOfHeadInGrid; // remark: will be adjusted with xCoordinateStartingPointInGrid, to put the instructions on top of the grid.
        this.yCoordinateOfHeadInGrid; // remark: will be adjusted with yCoordinateStartingPointInGrid, to put the instructions on top of the grid.
        this.xCoordinateOfTailInGrid; 
        this.yCoordinateOfTailInGrid;    
        this.xCoordinateStartingPointInGrid;
        this.yCoordinateStartingPointInGrid;
        this.gridWithForEachGridCellABooleanIsVisited;
    }

//calculateRopeBridgeNrOfRowsAndColsAndStartingPoint

    createArrayWithDataThatIsNeededInOtherCodeAsInputToCalculateNrOfRowsAndColsInGrid(motionOfElvesOnRopeBridge){
        let directionOfMovement, nrOfElvesStepsOnRopeBridge;
        let arrayWithSplittedMotionOfElvesOnRopeBridge = motionOfElvesOnRopeBridge.split(" ");
        directionOfMovement = arrayWithSplittedMotionOfElvesOnRopeBridge[0];
        nrOfElvesStepsOnRopeBridge = parseInt(arrayWithSplittedMotionOfElvesOnRopeBridge[1]);
        
        // //log(directionOfMovement, nrOfElvesStepsOnRopeBridge); // e.g. R 4  or U 4 or L 3 etc.
        switch(directionOfMovement){
            case 'D':
                this.xCoordinateLowestAndHighestDistanceFromStartPoint.push(this.xPreviousCoordinateOfHead + nrOfElvesStepsOnRopeBridge ); 
                this.xPreviousCoordinateOfHead  += nrOfElvesStepsOnRopeBridge;
                break;
            case 'L':
                this.yCoordinateLowestAndHighestDistanceFromStartPoint.push(this.yPreviousCoordinateOfHead - nrOfElvesStepsOnRopeBridge ); 
                this.yPreviousCoordinateOfHead -= nrOfElvesStepsOnRopeBridge;
                break;            
            case 'R':
                this.yCoordinateLowestAndHighestDistanceFromStartPoint.push(this.yPreviousCoordinateOfHead + nrOfElvesStepsOnRopeBridge ); 
                this.yPreviousCoordinateOfHead += nrOfElvesStepsOnRopeBridge;
                break;
            case 'U':
                this.xCoordinateLowestAndHighestDistanceFromStartPoint.push(this.xPreviousCoordinateOfHead - nrOfElvesStepsOnRopeBridge ); 
                this.xPreviousCoordinateOfHead -= nrOfElvesStepsOnRopeBridge;
                break;            
        }
        // //log(`head coordinates: x: ${this.xPreviousCoordinateOfHead}, y:${this.yPreviousCoordinateOfHead} `)
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


    moveRopeHeadOnRopeBridgeByJumpingToDestinationCell(motionOfElvesOnRopeBridge) {
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
        let directionOfMovement, nrOfElvesStepsOnRopeBridge;
        let arrayWithSplittedMotionOfElvesOnRopeBridge = motionOfElvesOnRopeBridge.split(" ");
        directionOfMovement = arrayWithSplittedMotionOfElvesOnRopeBridge[0];
        nrOfElvesStepsOnRopeBridge = parseInt(arrayWithSplittedMotionOfElvesOnRopeBridge[1]);       
        // //log(directionOfMovement, nrOfElvesStepsOnRopeBridge); // e.g. R 4  or U 4 or L 3 etc.

        //set starting position (on the rope bridge) where the elves start to walk: 
        this.gridWithForEachGridCellABooleanIsVisited[this.xCoordinateOfHeadInGrid][this.yCoordinateOfHeadInGrid] = true;
        //log(this.gridWithForEachGridCellABooleanIsVisited);
        
        switch(directionOfMovement){
            case 'D':
                this.xCoordinateOfHeadInGrid += nrOfElvesStepsOnRopeBridge;
                break;
            case 'L':
                this.yCoordinateOfHeadInGrid -= nrOfElvesStepsOnRopeBridge;
                break;            
            case 'R':
                this.yCoordinateOfHeadInGrid += nrOfElvesStepsOnRopeBridge;
                break;
            case 'U':
                this.xCoordinateOfHeadInGrid -= nrOfElvesStepsOnRopeBridge;
                break;            
        }
        //log(`head coordinates: x: ${this.xCoordinateOfHeadInGrid}, y:${this.yCoordinateOfHeadInGrid} `)
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
        
        //log`method moveOnRopeBridge: after each elf step another boolean false is added to gridRopeBridge:`
        this.gridWithForEachGridCellABooleanIsVisited[this.xCoordinateOfHeadInGrid][this.yCoordinateOfHeadInGrid] = true;
        //log(this.gridWithForEachGridCellABooleanIsVisited);
        //pitfall: the starting position in the grid is NOT set to true. So off-by-one error. This is corrected above the switch-statement.
    }


    movefRopeHeadOnRopeBridgeOneStepAtATime(motionOfElvesOnRopeBridge) {
        //first read comment in fn moveOnRopeBridgeByJumpingToDestinationCell.
        let directionOfMovement, nrOfElvesStepsOnRopeBridge;
        let arrayWithSplittedMotionOfElvesOnRopeBridge = motionOfElvesOnRopeBridge.split(" ");
        directionOfMovement = arrayWithSplittedMotionOfElvesOnRopeBridge[0];
        nrOfElvesStepsOnRopeBridge = parseInt(arrayWithSplittedMotionOfElvesOnRopeBridge[1]);       
        // //log(directionOfMovement, nrOfElvesStepsOnRopeBridge); // e.g. R 4  or U 4 or L 3 etc.

        //set starting position (on the rope bridge) where the elves start to walk: 
        this.gridWithForEachGridCellABooleanIsVisited[this.xCoordinateOfHeadInGrid][this.yCoordinateOfHeadInGrid] = true;
        // //log(this.gridWithForEachGridCellABooleanIsVisited);
        //log('hi')
        switch(directionOfMovement){
            case 'D':
                for (let i = 0; i < nrOfElvesStepsOnRopeBridge; i++) {
                    this.xCoordinateOfHeadInGrid += 1;             
                    this.gridWithForEachGridCellABooleanIsVisited[this.xCoordinateOfHeadInGrid][this.yCoordinateOfHeadInGrid] = true;
                }
                break;
            case 'L':
                for (let i = 0; i < nrOfElvesStepsOnRopeBridge; i++) {
                    this.yCoordinateOfHeadInGrid -= 1;
                    this.gridWithForEachGridCellABooleanIsVisited[this.xCoordinateOfHeadInGrid][this.yCoordinateOfHeadInGrid] = true;
                }
                break;            
            case 'R':
                for (let i = 0; i < nrOfElvesStepsOnRopeBridge; i++) {
                    this.yCoordinateOfHeadInGrid += 1;
                    //log(this.yCoordinateOfHeadInGrid)
                    this.gridWithForEachGridCellABooleanIsVisited[this.xCoordinateOfHeadInGrid][this.yCoordinateOfHeadInGrid] = true;
                }
                break;
            case 'U':
                for (let i = 0; i < nrOfElvesStepsOnRopeBridge; i++) {
                    this.xCoordinateOfHeadInGrid -= 1;
                    this.gridWithForEachGridCellABooleanIsVisited[this.xCoordinateOfHeadInGrid][this.yCoordinateOfHeadInGrid] = true;
                }
                break;            
        }
            //log(`head coordinates: x: ${this.xCoordinateOfHeadInGrid}, y:${this.yCoordinateOfHeadInGrid} `)
            // //log`method moveOnRopeBridge: after each elf step another boolean false is added to gridRopeBridge:`
            
            // this.gridWithForEachGridCellABooleanIsVisited[this.xCoordinateOfHeadInGrid][this.yCoordinateOfHeadInGrid] = true;
            //log(this.gridWithForEachGridCellABooleanIsVisited);
            //pitfall: the starting position in the grid is NOT set to true. So off-by-one error. This is corrected above the switch-statement.
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

    movefRopeTailOnRopeBridgeOneStepAtATime(motionOfElvesOnRopeBridge) {
        //first read comment in fn moveOnRopeBridgeByJumpingToDestinationCell.
        let directionOfMovement, nrOfElvesStepsOnRopeBridge;
        let arrayWithSplittedMotionOfElvesOnRopeBridge = motionOfElvesOnRopeBridge.split(" ");
        directionOfMovement = arrayWithSplittedMotionOfElvesOnRopeBridge[0];
        nrOfElvesStepsOnRopeBridge = parseInt(arrayWithSplittedMotionOfElvesOnRopeBridge[1]);       
        // //log(directionOfMovement, nrOfElvesStepsOnRopeBridge); // e.g. R 4  or U 4 or L 3 etc.

        //set starting position (on the rope bridge) where the elves start to walk: 
        this.gridWithForEachGridCellABooleanIsVisited[this.xCoordinateOfTailInGrid][this.yCoordinateOfTailInGrid] = true;
        // //log(this.gridWithForEachGridCellABooleanIsVisited);
        //log('in fn: movefRopeTailOnRopeBridgeOneStepAtATime:')
        switch(directionOfMovement){
            case 'D':
                //log(' case D')
                for (let i = 0; i < nrOfElvesStepsOnRopeBridge; i++) {
                    // this.xCoordinateOfTailInGrid = this.xCoordinateOfHeadInGrid;
                    // this.yCoordinateOfTailInGrid = this.yCoordinateOfHeadInGrid;   
                    //log(`D: output of previous instruction:`)
                    //log(`x,y head: ${this.xCoordinateOfHeadInGrid}, ${this.yCoordinateOfHeadInGrid} `);
                    //log(`x,y tail:  ${this.xCoordinateOfTailInGrid} , ${this.yCoordinateOfTailInGrid}  `);                  
                    this.xCoordinateOfHeadInGrid += 1;
                    //log(`D: with updated xCoordinateOfHeadInGrid:`)
                    //log(`x,y head: ${this.xCoordinateOfHeadInGrid}, ${this.yCoordinateOfHeadInGrid} `);
                    //log(`x,y tail:  ${this.xCoordinateOfTailInGrid} , ${this.yCoordinateOfTailInGrid}  `);   
                    /*
                        In all case statements:
                        1. set position of newTail equal to New head. 
                        2. call fn calculateRopeTailNewCoordinates(ropeHeadNewCoordinates, ropeTailOldCoordinates) that calculates the exact coordinates of the new tail.
                        3. set in gridToPlotPositionOfTail position of the new tail to boolean true. 
                    */

                        if(this.xCoordinateOfHeadInGrid - this.xCoordinateOfTailInGrid == 0 && 
                        this.yCoordinateOfHeadInGrid - this.yCoordinateOfTailInGrid == 0)
                        {
                            //log('right: head on top of tail')
                        } else if (this.xCoordinateOfHeadInGrid - this.xCoordinateOfTailInGrid == 1) 
                            // &&
                            // (Math.abs(this.yCoordinateOfHeadInGrid - this.yCoordinateOfTailInGrid) == 1 )
                            {
                            //tail should not move.
                            //log('down:  head and tail adjacent, so tail not moving.')
                        } else if (this.xCoordinateOfHeadInGrid - this.xCoordinateOfTailInGrid == 0 && 
                            (Math.abs(this.yCoordinateOfHeadInGrid - this.yCoordinateOfTailInGrid)) == 1 ) {
                            // log('right: head and tail adjacent, so tail not moving.')
                      
                        } else if (this.xCoordinateOfHeadInGrid - this.xCoordinateOfTailInGrid == 2 && 
                            this.yCoordinateOfHeadInGrid - this.yCoordinateOfTailInGrid == 0 ) {
                            // tail goes South:
                            this.xCoordinateOfTailInGrid += 1;
                            this.gridWithForEachGridCellABooleanIsVisited[this.xCoordinateOfTailInGrid][this.yCoordinateOfTailInGrid] = true;
                        } else if (this.xCoordinateOfHeadInGrid - this.xCoordinateOfTailInGrid == 2 && 
                            this.yCoordinateOfHeadInGrid - this.yCoordinateOfTailInGrid == 1 ) {
                            // tail goes South-South-East:
                            this.xCoordinateOfTailInGrid += 1;
                            this.yCoordinateOfTailInGrid += 1;
                            this.gridWithForEachGridCellABooleanIsVisited[this.xCoordinateOfTailInGrid][this.yCoordinateOfTailInGrid] = true;
                        } else if (this.xCoordinateOfHeadInGrid - this.xCoordinateOfTailInGrid == 2 && 
                            this.yCoordinateOfHeadInGrid - this.yCoordinateOfTailInGrid == -1 ) {
                         // tail goes South-South-West:
                            this.xCoordinateOfTailInGrid += 1;
                            this.yCoordinateOfTailInGrid -= 1;
                            this.gridWithForEachGridCellABooleanIsVisited[this.xCoordinateOfTailInGrid][this.yCoordinateOfTailInGrid] = true;
                        
                        } else { 
                            console.log(`fn movefRopeTailOnRopeBridgeOneStepAtATime: case D: `)
                            log(`x,y head: ${this.xCoordinateOfHeadInGrid}, ${this.yCoordinateOfHeadInGrid} `);
                            log(`x,y tail:  ${this.xCoordinateOfTailInGrid} , ${this.yCoordinateOfTailInGrid}  `); 
                            /*
                                Backlog: put following scenario in its own else-if-statement: 
                                e.g. 
                                x,y head: 73, 121
                                x,y tail:  73 , 122

                                now ends up in else-statement. This is a situation of 'head and tail adjacent, so tail not moving.
                                (so it does not really matter, that it ends up in the else-statement.)

                                Same situation in the other else-statements inside the other case-statements below of this switch-statemnt.

                                I can make a separate else-if-statement for his. But I leave it for now. (date: 230113)

                                (date: 230117: else if statement has been added to solve this. )
                                
                            */
                        };

                }
                //log(this.gridWithForEachGridCellABooleanIsVisited);
                break;
            case 'L':
                //log(' case L');
                for (let i = 0; i < nrOfElvesStepsOnRopeBridge; i++) {
                    // this.xCoordinateOfTailInGrid = this.xCoordinateOfHeadInGrid;
                    // this.yCoordinateOfTailInGrid = this.yCoordinateOfHeadInGrid;  
                    //log(`L: output of previous instruction:`)
                    //log(`x,y head: ${this.xCoordinateOfHeadInGrid}, ${this.yCoordinateOfHeadInGrid} `);
                    //log(`x,y tail:  ${this.xCoordinateOfTailInGrid} , ${this.yCoordinateOfTailInGrid}  `);                
                    this.yCoordinateOfHeadInGrid -= 1;
                    //log(`L: with updated yCoordinateOfHeadInGrid:`)
                    //log(`x,y head: ${this.xCoordinateOfHeadInGrid}, ${this.yCoordinateOfHeadInGrid} `);
                    //log(`x,y tail:  ${this.xCoordinateOfTailInGrid} , ${this.yCoordinateOfTailInGrid}  `);   

                    if(this.xCoordinateOfHeadInGrid - this.xCoordinateOfTailInGrid == 0 && 
                        this.yCoordinateOfHeadInGrid - this.yCoordinateOfTailInGrid == 0)
                    {
                        //log('right: head on top of tail')
                    } else if (
                            // (Math.abs(this.xCoordinateOfHeadInGrid - this.xCoordinateOfTailInGrid) == 1) 
                            // && 
                            this.yCoordinateOfHeadInGrid - this.yCoordinateOfTailInGrid == - 1 ) {
                            //tail should not move.
                            //log('left:  head and tail adjacent, so tail not moving.')
                    } else if ( (Math.abs(this.xCoordinateOfHeadInGrid - this.xCoordinateOfTailInGrid)) == 1 &&
                        this.yCoordinateOfHeadInGrid - this.yCoordinateOfTailInGrid == 0 )
                    {
                    } else if (this.xCoordinateOfHeadInGrid - this.xCoordinateOfTailInGrid == 0 && 
                        this.yCoordinateOfHeadInGrid - this.yCoordinateOfTailInGrid == -2 ) {
                        // tail goes West:
                        //log(`going west: `)
                        this.yCoordinateOfTailInGrid -= 1;
                        this.gridWithForEachGridCellABooleanIsVisited[this.xCoordinateOfTailInGrid][this.yCoordinateOfTailInGrid] = true;
                    } else if (this.xCoordinateOfHeadInGrid - this.xCoordinateOfTailInGrid == -1 && 
                        this.yCoordinateOfHeadInGrid - this.yCoordinateOfTailInGrid == -2 ) {
                        // tail goes West-North-West:
                        //log(`going west-north-west: `)
                        this.xCoordinateOfTailInGrid -= 1;
                        this.yCoordinateOfTailInGrid -= 1;
                        this.gridWithForEachGridCellABooleanIsVisited[this.xCoordinateOfTailInGrid][this.yCoordinateOfTailInGrid] = true;
                    } else if (this.xCoordinateOfHeadInGrid - this.xCoordinateOfTailInGrid == 1 && 
                        this.yCoordinateOfHeadInGrid - this.yCoordinateOfTailInGrid == -2 ) {
                     // tail goes West-South-West:
                     //log(`going west-south-west: `)
                        this.xCoordinateOfTailInGrid += 1;
                        this.yCoordinateOfTailInGrid -= 1;
                        this.gridWithForEachGridCellABooleanIsVisited[this.xCoordinateOfTailInGrid][this.yCoordinateOfTailInGrid] = true;
                    
                    } else { 
                        console.warn(`fn movefRopeTailOnRopeBridgeOneStepAtATime: case L: `)
                        log(`x,y head: ${this.xCoordinateOfHeadInGrid}, ${this.yCoordinateOfHeadInGrid} `);
                        log(`x,y tail:  ${this.xCoordinateOfTailInGrid} , ${this.yCoordinateOfTailInGrid}  `); 
                    };
                }
                //log(this.gridWithForEachGridCellABooleanIsVisited);
                break;            
            case 'R':
                //log(' case R')
                for (let i = 0; i < nrOfElvesStepsOnRopeBridge; i++) {
                   
                    // this.xCoordinateOfTailInGrid = this.xCoordinateOfHeadInGrid;
                    // this.yCoordinateOfTailInGrid = this.yCoordinateOfHeadInGrid;
                    //log(`R: output of previous instruction:`)
                    //log(`x,y head: ${this.xCoordinateOfHeadInGrid}, ${this.yCoordinateOfHeadInGrid} `);
                    //log(`x,y tail:  ${this.xCoordinateOfTailInGrid} , ${this.yCoordinateOfTailInGrid}  `);   
                    this.yCoordinateOfHeadInGrid += 1;
                    //log(`R: with updated yCoordinateOfHeadInGrid:`)
                    //log(`x,y head: ${this.xCoordinateOfHeadInGrid}, ${this.yCoordinateOfHeadInGrid} `);
                    //log(`x,y tail:  ${this.xCoordinateOfTailInGrid} , ${this.yCoordinateOfTailInGrid}  `);   

                    if(this.xCoordinateOfHeadInGrid - this.xCoordinateOfTailInGrid == 0 && 
                       this.yCoordinateOfHeadInGrid - this.yCoordinateOfTailInGrid == 0)
                    {
                            //log('right: head on top of tail')
                    } else if (
                        // (Math.abs(this.xCoordinateOfHeadInGrid - this.xCoordinateOfTailInGrid) == 1) 
                        // && 
                        /* 
                            pitfall: do NOT check the value of xCoordinateOfHeadInGrid nor this.xCoordinateOfTailInGrid.
                            reason: in the output from the previous instruction from input1.txt or input2.txt, the
                            x-coordinate can be the same, 1 lower or 1 higher.
                        */
                        
                        this.yCoordinateOfHeadInGrid - this.yCoordinateOfTailInGrid == 1 ) {
                        //tail should not move.
                        //log('right: head and tail adjacent, so tail not moving.')
                    } else if ( (Math.abs(this.xCoordinateOfHeadInGrid - this.xCoordinateOfTailInGrid)) == 1 &&
                        this.yCoordinateOfHeadInGrid - this.yCoordinateOfTailInGrid == 0 )
                    {
                        // log('right: head and tail adjacent, so tail not moving.')
                    } else if (this.xCoordinateOfHeadInGrid - this.xCoordinateOfTailInGrid == 0 && 
                        this.yCoordinateOfHeadInGrid - this.yCoordinateOfTailInGrid == 2 ) {
                        // tail goes East:
                        //log(`going east: `)
                        // this.xCoordinateOfTailInGrid = this.xCoordinateOfTailInGrid ;
                        this.yCoordinateOfTailInGrid += 1;
                        this.gridWithForEachGridCellABooleanIsVisited[this.xCoordinateOfTailInGrid][this.yCoordinateOfTailInGrid] = true;
                    } else if (this.xCoordinateOfHeadInGrid - this.xCoordinateOfTailInGrid == -1 && 
                        this.yCoordinateOfHeadInGrid - this.yCoordinateOfTailInGrid == 2 ) {
                        // tail goes East-North-East:
                        this.xCoordinateOfTailInGrid += -1;
                        this.yCoordinateOfTailInGrid += 1;
                        this.gridWithForEachGridCellABooleanIsVisited[this.xCoordinateOfTailInGrid][this.yCoordinateOfTailInGrid] = true;
                    } else if (this.xCoordinateOfHeadInGrid - this.xCoordinateOfTailInGrid == 1 && 
                        this.yCoordinateOfHeadInGrid - this.yCoordinateOfTailInGrid == 2 ) {
                     // tail goes East-South-East:
                        //log(`going east-south-east: `)
                        this.xCoordinateOfTailInGrid += 1;
                        this.yCoordinateOfTailInGrid += 1;
                        this.gridWithForEachGridCellABooleanIsVisited[this.xCoordinateOfTailInGrid][this.yCoordinateOfTailInGrid] = true;
                    
                    } else { 
                        console.warn(`fn movefRopeTailOnRopeBridgeOneStepAtATime: case R: `)
                        log(`x,y head: ${this.xCoordinateOfHeadInGrid}, ${this.yCoordinateOfHeadInGrid} `);
                        log(`x,y tail:  ${this.xCoordinateOfTailInGrid} , ${this.yCoordinateOfTailInGrid}  `); 
                    };
                }
                //log(this.gridWithForEachGridCellABooleanIsVisited);
                break;
            case 'U':
                //log(' case U');
                for (let i = 0; i < nrOfElvesStepsOnRopeBridge; i++) {
                    // this.xCoordinateOfTailInGrid = this.xCoordinateOfHeadInGrid;
                    // this.yCoordinateOfTailInGrid = this.yCoordinateOfHeadInGrid;
                    //log(i)
                    //log(nrOfElvesStepsOnRopeBridge)
                    //log(`U: output of previous instruction:`)
                    //log(`x,y head: ${this.xCoordinateOfHeadInGrid}, ${this.yCoordinateOfHeadInGrid} `);
                    //log(`x,y tail:  ${this.xCoordinateOfTailInGrid} , ${this.yCoordinateOfTailInGrid}  `);   
                    this.xCoordinateOfHeadInGrid -= 1;
                    //log(`U: with updated xCoordinateOfHeadInGrid:`)
                    //log(`x,y head: ${this.xCoordinateOfHeadInGrid}, ${this.yCoordinateOfHeadInGrid} `);
                    //log(`x,y tail:  ${this.xCoordinateOfTailInGrid} , ${this.yCoordinateOfTailInGrid}  `);   
                    //log('here:')
                    if(this.xCoordinateOfHeadInGrid - this.xCoordinateOfTailInGrid == 0 && 
                        this.yCoordinateOfHeadInGrid - this.yCoordinateOfTailInGrid == 0)
                    {
                             //log('right: head on top of tail')
                    } else if (
                        this.xCoordinateOfHeadInGrid - this.xCoordinateOfTailInGrid == -1) {
                        // && 
                        // (Math.abs(this.yCoordinateOfHeadInGrid - this.yCoordinateOfTailInGrid) == 1 )) {
                        //tail should not move.
                        //log('up:  head and tail adjacent, so tail not moving.')
                    } else if (this.xCoordinateOfHeadInGrid - this.xCoordinateOfTailInGrid == 0 && 
                        (Math.abs(this.yCoordinateOfHeadInGrid - this.yCoordinateOfTailInGrid)) == 1 ) {
                        // log('right: head and tail adjacent, so tail not moving.')
                    } else if (this.xCoordinateOfHeadInGrid - this.xCoordinateOfTailInGrid == -2 && 
                        this.yCoordinateOfHeadInGrid - this.yCoordinateOfTailInGrid == 0 ) {
                        // tail goes North:
                        this.xCoordinateOfTailInGrid -= 1;
                        this.gridWithForEachGridCellABooleanIsVisited[this.xCoordinateOfTailInGrid][this.yCoordinateOfTailInGrid] = true;
                    } else if (this.xCoordinateOfHeadInGrid - this.xCoordinateOfTailInGrid == -2 && 
                        this.yCoordinateOfHeadInGrid - this.yCoordinateOfTailInGrid == 1 ) {
                        // tail goes North-North-East:
                        //log(`U: north-north-east: `)
                        this.xCoordinateOfTailInGrid -= 1;
                        this.yCoordinateOfTailInGrid += 1;
                        this.gridWithForEachGridCellABooleanIsVisited[this.xCoordinateOfTailInGrid][this.yCoordinateOfTailInGrid] = true;
                    } else if (this.xCoordinateOfHeadInGrid - this.xCoordinateOfTailInGrid == -2 && 
                        this.yCoordinateOfHeadInGrid - this.yCoordinateOfTailInGrid == -1 ) {
                     // tail goes North-North-West:
                        this.xCoordinateOfTailInGrid -= 1;
                        this.yCoordinateOfTailInGrid -= 1;
                        this.gridWithForEachGridCellABooleanIsVisited[this.xCoordinateOfTailInGrid][this.yCoordinateOfTailInGrid] = true;
                    
                    } else { 
                        console.warn(`fn movefRopeTailOnRopeBridgeOneStepAtATime: case U: `)
                        log(`x,y head: ${this.xCoordinateOfHeadInGrid}, ${this.yCoordinateOfHeadInGrid} `);
                        log(`x,y tail:  ${this.xCoordinateOfTailInGrid} , ${this.yCoordinateOfTailInGrid}  `); 
                    }               
                } 
                //log(this.gridWithForEachGridCellABooleanIsVisited);
                break; 


        // //log(`head coordinates: x: ${this.xCoordinateOfHeadInGrid}, y:${this.yCoordinateOfHeadInGrid} `)
        // //log`method moveOnRopeBridge: after each elf step another boolean false is added to gridRopeBridge:`
        
        // this.gridWithForEachGridCellABooleanIsVisited[this.xCoordinateOfHeadInGrid][this.yCoordinateOfHeadInGrid] = true;
        // //log(this.gridWithForEachGridCellABooleanIsVisited);
        //pitfall: the starting position in the grid is NOT set to true. So off-by-one error. This is corrected above the switch-statement.
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

let machineToModelKnotsPositionsInGrid = new MachineToModelKnotsPositionsInGrid(motionsOfElvesOnRopeBridge);
// //log(machineToModelKnotsPositionsInGrid)

// calculate width and height of gridToPlotPositionOfTail
motionsOfElvesOnRopeBridge.forEach((motionOfElvesOnRopeBridge) => {
    // take 1 (elf) step at a time.
    machineToModelKnotsPositionsInGrid.createArrayWithDataThatIsNeededInOtherCodeAsInputToCalculateNrOfRowsAndColsInGrid(motionOfElvesOnRopeBridge);
})

let calculateNrOfRequiredRowsInGrid = (machineToModelKnotsPositionsInGrid) => {
    // starting point to calculate nr of rows in grid is [0,0]
    let xCoordinateHighestDistanceFromStartPoint = Math.max(...machineToModelKnotsPositionsInGrid.xCoordinateLowestAndHighestDistanceFromStartPoint);
    // //log(xCoordinateHighestDistanceFromStartPoint);
    // input1.txt: -2

    let xCoordinateLowestDistanceFromStartPoint = Math.min(...machineToModelKnotsPositionsInGrid.xCoordinateLowestAndHighestDistanceFromStartPoint);
    // //log(xCoordinateLowestDistanceFromStartPoint);
    // input1.txt: -4
    // pitfall: Math.min (that suggest a "minimum") actually provides the highest distance from ficticious starting point [0,0] here.
    // Which one provides the lowest and highest nr depends on the dataset. 

    if (xCoordinateHighestDistanceFromStartPoint < 0) xCoordinateHighestDistanceFromStartPoint = 0;
    if (xCoordinateLowestDistanceFromStartPoint > 0) xCoordinateLowestDistanceFromStartPoint = 0;

    let nrOfRequiredRowsInGrid = xCoordinateHighestDistanceFromStartPoint - xCoordinateLowestDistanceFromStartPoint;
    // in order 2 take e.g. to steps down in the grid, you need 3 rows, so to avoid off-by-one error:
    nrOfRequiredRowsInGrid +=1;
    // //log(nrOfRequiredRowsInGrid);
    return nrOfRequiredRowsInGrid;
}
let nrOfRequiredRowsInGrid = calculateNrOfRequiredRowsInGrid(machineToModelKnotsPositionsInGrid);
//log(`nrOfRequiredRowsInGrid: ${nrOfRequiredRowsInGrid}  (1-based numbering)`);
machineToModelKnotsPositionsInGrid.gridNrOfRows = nrOfRequiredRowsInGrid;

let calculateNrOfRequiredColsInGrid = (machineToModelKnotsPositionsInGrid) => {
    // starting point to calculate nr of cols in grid is [0,0]
    // pitfall: read pitfall in fn calculateNrOfRequiredRowsInGrid. 
    let yCoordinateHighestDistanceFromStartPoint = Math.max(...machineToModelKnotsPositionsInGrid.yCoordinateLowestAndHighestDistanceFromStartPoint);
    // //log(yCoordinateHighestDistanceFromStartPoint);

    let yCoordinateLowestDistanceFromStartPoint = Math.min(...machineToModelKnotsPositionsInGrid.yCoordinateLowestAndHighestDistanceFromStartPoint);
    // //log(yCoordinateLowestDistanceFromStartPoint);

    if (yCoordinateHighestDistanceFromStartPoint < 0) yCoordinateHighestDistanceFromStartPoint = 0;
    if (yCoordinateLowestDistanceFromStartPoint > 0) yCoordinateLowestDistanceFromStartPoint = 0;

    let nrOfRequiredColsInGrid = yCoordinateHighestDistanceFromStartPoint - yCoordinateLowestDistanceFromStartPoint;
    // in order 2 take e.g. to steps to the right in the grid, you need 3 cols, so to avoid off-by-one error:
    nrOfRequiredColsInGrid +=1;
    // //log(nrOfRequiredColsInGrid);
    return nrOfRequiredColsInGrid;
}
let nrOfRequiredColsInGrid = calculateNrOfRequiredColsInGrid(machineToModelKnotsPositionsInGrid);
//log(`nrOfRequiredColsInGrid: ${nrOfRequiredColsInGrid}  (1-based numbering)`);
machineToModelKnotsPositionsInGrid.gridNrOfCols = nrOfRequiredColsInGrid;


const createGridWithBooleans = (row, col) => {
    // Grid is needed to plot which grid cells have been visited.
    let gridWithForEachGridCellABooleanIsVisited = Array.from(Array(row), ()=> Array(col).fill(false));
    return gridWithForEachGridCellABooleanIsVisited;
}
let gridWithForEachGridCellABooleanIsVisited = createGridWithBooleans(nrOfRequiredRowsInGrid, nrOfRequiredColsInGrid );
// //log(`gridWithForEachGridCellABooleanIsVisited: `)
// //log(gridWithForEachGridCellABooleanIsVisited);
machineToModelKnotsPositionsInGrid.gridWithForEachGridCellABooleanIsVisited = gridWithForEachGridCellABooleanIsVisited;
// //log(machineToModelKnotsPositionsInGrid.gridWithForEachGridCellABooleanIsVisited);

const calculateCellXAndYCoordinatesOfStartingPointInGrid = () => {
    // in input1.txt (=== example in the assignment https://adventofcode.com/2022/day/9 ) the starting cell is [4, 0] (zero-based counting)
    /*
        if you start at e.g. [0,0] or [3,2], then you will be traversing outside of the grid, so the number of tails that have been visited will
        be wrong.
        That is why you must start at the correct starting cell. 
    */
    
    let xCoordinateHighestDistanceFromStartPoint = Math.max(...machineToModelKnotsPositionsInGrid.xCoordinateLowestAndHighestDistanceFromStartPoint);
    // //log(xCoordinateHighestDistanceFromStartPoint);
    // input1.txt: result: -2

    let xCoordinateLowestDistanceFromStartPoint = Math.min(...machineToModelKnotsPositionsInGrid.xCoordinateLowestAndHighestDistanceFromStartPoint);
    // //log(xCoordinateLowestDistanceFromStartPoint);
    // input1.txt: result: -4
    // pitfall: Math.min (that suggest a "minimum") actually provides the highest distance from ficticious starting point [0,0].
    
    
    let yCoordinateHighestDistanceFromStartPoint = Math.max(...machineToModelKnotsPositionsInGrid.yCoordinateLowestAndHighestDistanceFromStartPoint);
    // //log(yCoordinateHighestDistanceFromStartPoint);
    // input1.txt: result: 5

    let yCoordinateLowestDistanceFromStartPoint = Math.min(...machineToModelKnotsPositionsInGrid.yCoordinateLowestAndHighestDistanceFromStartPoint);
    // //log(yCoordinateLowestDistanceFromStartPoint);
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
//log(`cellXAndYCoordinatesOfStartPointInGrid: [${cellXAndYCoordinatesOfStartPointInGrid}] (0-based numbering)`);
machineToModelKnotsPositionsInGrid.xCoordinateStartingPointInGrid = cellXAndYCoordinatesOfStartPointInGrid[0];
// //log(machineToModelKnotsPositionsInGrid.xCoordinateStartingPointInGrid);
machineToModelKnotsPositionsInGrid.yCoordinateStartingPointInGrid = cellXAndYCoordinatesOfStartPointInGrid[1];
// //log(machineToModelKnotsPositionsInGrid.yCoordinateStartingPointInGrid);



// initialize the startingPoint of the rope-head in the grid: (there is only 1 correct value, see comment in fn
// calculateCellXAndYCoordinatesOfStartingPointInGrid. 
machineToModelKnotsPositionsInGrid.xCoordinateOfHeadInGrid = machineToModelKnotsPositionsInGrid.xCoordinateStartingPointInGrid; 
//when run with input1.txt: 4 (=== example in the assignment https://adventofcode.com/2022/day/9 )
machineToModelKnotsPositionsInGrid.yCoordinateOfHeadInGrid = machineToModelKnotsPositionsInGrid.yCoordinateStartingPointInGrid; 
//when run with input1.txt: 0 (=== example in the assignment https://adventofcode.com/2022/day/9 )

/*
    Also initialize the starting point of the rope-tail in the grid.
    Reason: rope-head and rope-tail must start at the same location in the grid (=== requirement). 
*/
machineToModelKnotsPositionsInGrid.xCoordinateOfTailInGrid = machineToModelKnotsPositionsInGrid.xCoordinateStartingPointInGrid; 
//when run with input1.txt: 4 (=== example in the assignment https://adventofcode.com/2022/day/9 )
machineToModelKnotsPositionsInGrid.yCoordinateOfTailInGrid = machineToModelKnotsPositionsInGrid.yCoordinateStartingPointInGrid; 
//when run with input1.txt: 0 (=== example in the assignment https://adventofcode.com/2022/day/9 )


motionsOfElvesOnRopeBridge.forEach((motionOfElvesOnRopeBridge) => {
    
    // machineToModelKnotsPositionsInGrid.moveRopeHeadOnRopeBridgeByJumpingToDestinationCell(motionOfElvesOnRopeBridge); (status: works)
    // take 1 elf step at a time: e.g. "D 4" consists of 4 steps that should each be taken separately.
    // machineToModelKnotsPositionsInGrid.movefRopeHeadOnRopeBridgeOneStepAtATime(motionOfElvesOnRopeBridge); (status: works)
    machineToModelKnotsPositionsInGrid.movefRopeTailOnRopeBridgeOneStepAtATime(motionOfElvesOnRopeBridge);
    /*
        in input1.txt (=== example in the assignment https://adventofcode.com/2022/day/9 ) the destination
        cell of the head is [2,2] (zero-based counting)  
    */
})

//log(`xCoordinateOfHeadInGrid: ${machineToModelKnotsPositionsInGrid.xCoordinateOfHeadInGrid}`);
//log(`yCoordinateOfHeadInGrid: ${machineToModelKnotsPositionsInGrid.yCoordinateOfHeadInGrid}`)


const countUpAllOfThePositionsTheHeadVisitedAtLeastOnce = (machineToModelKnotsPositionsInGrid) => {
    let array = machineToModelKnotsPositionsInGrid.gridWithForEachGridCellABooleanIsVisited;
    let hasRopeHeadTouchedThisGridCell = (arrayElement) => arrayElement == true;
    let arrayWithAllCellsThatHaveBeenVisitedByRopeHead = array.map( subarray => subarray.filter( hasRopeHeadTouchedThisGridCell ));
    let flatArrayWithAllCellsThatHaveBeenVisitedByRopeHead = arrayWithAllCellsThatHaveBeenVisitedByRopeHead.flat()
    return flatArrayWithAllCellsThatHaveBeenVisitedByRopeHead.length;
}
let countOfAllOfThePositionsTheHeadVisitedAtLeastOnce = countUpAllOfThePositionsTheHeadVisitedAtLeastOnce(machineToModelKnotsPositionsInGrid);
log(`countOfAllOfThePositionsTheHeadVisitedAtLeastOnce: ${countOfAllOfThePositionsTheHeadVisitedAtLeastOnce}.`);
// correct answer: 6337. 

