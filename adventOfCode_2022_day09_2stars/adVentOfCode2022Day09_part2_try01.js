/*
     first read comment (about design) at the start of adVentOfCode2022Day09_part1_try01.js    (and then try02.js, try03.js, try04_no_logs.js).

    GOAL: create design and rename variables. status: done.
    next (in try2.js): implement STEP1-3.

    definitions:
    head = Object1 = 1st object that traverses gridToPlotPositionOfTail. head takes the input from inputfile (e.g. input1.txt or
         input2.txt) to position itself on the grid.
    tail = objects 2-10 = e.g. object2, object7. A tail-object takes the output from the previous object 
        (head or tail) to position itself on the grid.


    CRUD of variables (compared to day 9 part 1):
    1. gridToPlotPositionOfTail (removed: not being used).         
    2. gridToPlotPositionOfTailWithForEachGridCellABooleanIsVisited --> new name: gridToPlotPositionOf9TailsWithForEachGridCellABooleanIsVisited
    3. object1MachineToModelKnotsPositionsInGrid --> object1MachineToModelKnotsPositionsInGrid 
    4. motionsOfElvesOnRopeBridge --> motionsOfRopeHeadOfRopeBridge (2do: correct this in day 9 part 1 too).
    5. motionOfElvesOnRopeBridge --> motionOfRopeHeadOfRopeBridge (2do: correct this in day 9 part 1 too). 
    6. nrOfElvesStepsOnRopeBridge --> nrOfRopeHeadStepsOnRopeBridge



    design:
    First implement with input1.txt (example data from https://adventofcode.com/2022/day/9 ), then with the real data in input2.txt. 
    STEP1: same forEach loop as in part 1, but now with 10 objects (1st object is head, the other objects are tails): 

    motionsOfRopeHeadOfRopeBridge.forEach((motionOfRopeHeadOfRopeBridge) => {
        object1MachineToModelKnotsPositionsInGrid.movefRopeTailOnRopeBridgeOneStepAtATime(motionOfRopeHeadOfRopeBridge); //fn arg of 1st obj is inputfile.txt !
        object2MachineToModelKnotsPositionsInGrid.movefRopeTailOnRopeBridgeOneStepAtATime(arrayOutputFromObject1);
        (...)
        object10MachineToModelKnotsPositionsInGrid.movefRopeTailOnRopeBridgeOneStepAtATime(arrayOutputFromObject9);
    })

    STEP2: all objects must point to same grid gridToPlotPositionOf9TailsWithForEachGridCellABooleanIsVisited, (so they all update the same grid).
            Try first as object attribute:
            (this.arrayToStoreOutputOfMethodMovefRopeTailOnRopeBridgeOneStepAtATimeSoNextObjectCanUseIt)
            Otherwise a static will  work:
            (static arrayToStoreOutputOfMethodMovefRopeTailOnRopeBridgeOneStepAtATimeSoNextObjectCanUseIt = []; )
            (https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes/static).
   STEP3:  each object (always a tail object) uses the  output of the previous object (head or tail object) as its input. 
            This output (and thus input for the next object) consists of 2 values:
            this.xCoordinateOfTailInGrid; 
            this.yCoordinateOfTailInGrid; 
            This already exists in the code.

            In the forEach loop 10 objects passing the coordinates like this:

                motionsOfRopeHeadOfRopeBridge.forEach((motionOfRopeHeadOfRopeBridge) => {
                    object1MachineToModelKnotsPositionsInGrid.movefRopeTailOnRopeBridgeOneStepAtATime(motionOfRopeHeadOfRopeBridge); //fn arg of 1st obj is inputfile.txt !
                        2do: update starting point of object2 with this.xCoordinateOfTailInGrid and
                        this.yCoordinateOfTailInGrid of object 1.
                    object2MachineToModelKnotsPositionsInGrid.movefRopeTailOnRopeBridgeOneStepAtATime(motionOfRopeHeadOfRopeBridge);
                        2do: update starting point of object3 with this.xCoordinateOfTailInGrid and
                        this.yCoordinateOfTailInGrid of object 2.
                        (...)
                    object10MachineToModelKnotsPositionsInGrid.movefRopeTailOnRopeBridgeOneStepAtATime(motionOfRopeHeadOfRopeBridge);
                })

                The forEach at step 1 above enforces that all 10 objects execute the output of the previous object ("in a chain") (except the head object
                that gets its input (i.e. 1 instruction at a time) from input1.txt or input2.txt). So all 10 objects have processed 1 instruction ("in a chain")
                (or a "derivative" of this instruction in case of object 2-10), before "the next chain of execution" starts instigated by the 
                second instruction from the input file...then same for 3rd instruction, etc.

            problem1: method movefRopeTailOnRopeBridgeOneStepAtATime (from day 9 part 1) has 2 responsibilities:
                1. make rope-head move to another cell based on input from an inputfile.txt
                2. make rope-tail position  itself based on new position on rope-head
                This method only works if you have 1 rope-head-obj and 1 rope-tail-obj...but in part 2 you have...9 rope-tail-objects.
            problem2: with forEach above, I cannot movefRopeTailOnRopeBridgeOneStepAtATime with 9 chained tail-objects.
                reason: the method movefRopeTailOnRopeBridgeOneStepAtATime contains a for-loop for each case-statement.
                But I cannot do without the for-loop inside each case statement.

            solution1 to meet the requirements of day 9 part 2:
                1. rope-head will only have the first responsibility.   New fn: moveRopeHeadInGrid (only for rope-head-obj)
                2. rope-tail will only have the second responsibility.  New fn: moveRopeTailInGrid (for rope-tail-objects 2-10)
                In other words: fn movefRopeTailOnRopeBridgeOneStepAtATime must split into 2 new fns.

            problem of solution1: the rope-head must move ONE step at a time (R 4 === take 4 steps of 1.) After EACH step,
            the rope-tail-object must reposition itself...but this is not possible with the 2 separate fns of solution1.

            solution2 to meet requirements of day 9 part 2:
            Inside the method movefRopeTailOnRopeBridgeOneStepAtATime reposition (not just 1 tail object as in day 9 part 1 but)
            ALL 9 rope-tail-objects forEach step of the rope-head-object.
            How to do this: Code of day 9 part 1 is starting point. I add 1 tail to this code: 1 head --> tail 1 --> tail 2.
            Then I add another tail: head --> tail 1--> tail 2 --> tail 3.
            Then  I add the remaining 6 tails as well.

*/

const log = console.log;

const {readFileSync} = require("fs");
const { toNamespacedPath } = require("path");


const motionsOfRopeHeadOfRopeBridge = readFileSync("input1.txt", "utf-8").split('\r\n');
// log('01_input-from-file: ')
// log(input)

// const motionsOfRopeHeadOfRopeBridge = [
//     'R 4', 'U 4',
//     'L 3', 'D 1',
//     'R 4', 'D 1',
//     'L 5', 'R 2'
//   ];


class MachineToModelKnotsPositionsInGrid {
    constructor() {
        this.xPreviousCoordinateOfHead = 0;
        this.yPreviousCoordinateOfHead = 0;
        this.xPreviousCoordinateOfTail = 0;
        this.yPreviousCoordinateOfTail = 0;
        this.xCoordinateLowestAndHighestDistanceFromStartPoint = []; 
        this.yCoordinateLowestAndHighestDistanceFromStartPoint = [];
        this.gridNrOfRows = 0;
        this.gridNrOfCols = 0;
        this.xCoordinateOfHeadInGrid; // remark: head object will be adjusted with xCoordinateStartingPointInGrid, to put the instructions on top of the grid.
        this.yCoordinateOfHeadInGrid; // remark: head object will be adjusted with yCoordinateStartingPointInGrid, to put the instructions on top of the grid.
        this.xCoordinateOfTailInGrid; 
        this.yCoordinateOfTailInGrid;    
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


    moveRopeHeadOnRopeBridgeByJumpingToDestinationCell(motionOfRopeHeadOfRopeBridge) {
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
        this.gridToPlotPositionOf9TailsWithForEachGridCellABooleanIsVisited[this.xCoordinateOfHeadInGrid][this.yCoordinateOfHeadInGrid] = true;
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
        this.gridToPlotPositionOf9TailsWithForEachGridCellABooleanIsVisited[this.xCoordinateOfHeadInGrid][this.yCoordinateOfHeadInGrid] = true;
        log(this.gridToPlotPositionOf9TailsWithForEachGridCellABooleanIsVisited);
        //pitfall: the starting position in the grid is NOT set to true. So off-by-one error. This is corrected above the switch-statement.
    }


    movefRopeHeadOnRopeBridgeOneStepAtATime(motionOfRopeHeadOfRopeBridge) {
        //first read comment in fn moveOnRopeBridgeByJumpingToDestinationCell.
        let directionOfMovement, nrOfRopeHeadStepsOnRopeBridge;
        let arrayWithSplittedMotionOfElvesOnRopeBridge = motionOfRopeHeadOfRopeBridge.split(" ");
        directionOfMovement = arrayWithSplittedMotionOfElvesOnRopeBridge[0];
        nrOfRopeHeadStepsOnRopeBridge = parseInt(arrayWithSplittedMotionOfElvesOnRopeBridge[1]);       
        // log(directionOfMovement, nrOfRopeHeadStepsOnRopeBridge); // e.g. R 4  or U 4 or L 3 etc.

        //set starting position (on the rope bridge) where the elves start to walk: 
        this.gridToPlotPositionOf9TailsWithForEachGridCellABooleanIsVisited[this.xCoordinateOfHeadInGrid][this.yCoordinateOfHeadInGrid] = true;
        // log(this.gridToPlotPositionOf9TailsWithForEachGridCellABooleanIsVisited);
        log('hi')
        switch(directionOfMovement){
            case 'D':
                for (let i = 0; i < nrOfRopeHeadStepsOnRopeBridge; i++) {
                    this.xCoordinateOfHeadInGrid += 1;             
                    this.gridToPlotPositionOf9TailsWithForEachGridCellABooleanIsVisited[this.xCoordinateOfHeadInGrid][this.yCoordinateOfHeadInGrid] = true;
                }
                break;
            case 'L':
                for (let i = 0; i < nrOfRopeHeadStepsOnRopeBridge; i++) {
                    this.yCoordinateOfHeadInGrid -= 1;
                    this.gridToPlotPositionOf9TailsWithForEachGridCellABooleanIsVisited[this.xCoordinateOfHeadInGrid][this.yCoordinateOfHeadInGrid] = true;
                }
                break;            
            case 'R':
                for (let i = 0; i < nrOfRopeHeadStepsOnRopeBridge; i++) {
                    this.yCoordinateOfHeadInGrid += 1;
                    log(this.yCoordinateOfHeadInGrid)
                    this.gridToPlotPositionOf9TailsWithForEachGridCellABooleanIsVisited[this.xCoordinateOfHeadInGrid][this.yCoordinateOfHeadInGrid] = true;
                }
                break;
            case 'U':
                for (let i = 0; i < nrOfRopeHeadStepsOnRopeBridge; i++) {
                    this.xCoordinateOfHeadInGrid -= 1;
                    this.gridToPlotPositionOf9TailsWithForEachGridCellABooleanIsVisited[this.xCoordinateOfHeadInGrid][this.yCoordinateOfHeadInGrid] = true;
                }
                break;            
        }
            log(`head coordinates: x: ${this.xCoordinateOfHeadInGrid}, y:${this.yCoordinateOfHeadInGrid} `)
            // log`method moveOnRopeBridge: after each elf step another boolean false is added to gridRopeBridge:`
            
            // this.gridToPlotPositionOf9TailsWithForEachGridCellABooleanIsVisited[this.xCoordinateOfHeadInGrid][this.yCoordinateOfHeadInGrid] = true;
            log(this.gridToPlotPositionOf9TailsWithForEachGridCellABooleanIsVisited);
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

    movefRopeTailOnRopeBridgeOneStepAtATime(motionOfRopeHeadOfRopeBridge) {
        //first read comment in fn moveOnRopeBridgeByJumpingToDestinationCell.
        let directionOfMovement, nrOfRopeHeadStepsOnRopeBridge;
        let arrayWithSplittedMotionOfElvesOnRopeBridge = motionOfRopeHeadOfRopeBridge.split(" ");
        directionOfMovement = arrayWithSplittedMotionOfElvesOnRopeBridge[0];
        nrOfRopeHeadStepsOnRopeBridge = parseInt(arrayWithSplittedMotionOfElvesOnRopeBridge[1]);       
        // log(directionOfMovement, nrOfRopeHeadStepsOnRopeBridge); // e.g. R 4  or U 4 or L 3 etc.

        //set starting position (on the rope bridge) where the elves start to walk: 
        this.gridToPlotPositionOf9TailsWithForEachGridCellABooleanIsVisited[this.xCoordinateOfTailInGrid][this.yCoordinateOfTailInGrid] = true;
        // log(this.gridToPlotPositionOf9TailsWithForEachGridCellABooleanIsVisited);
        log('in fn: movefRopeTailOnRopeBridgeOneStepAtATime:')
        switch(directionOfMovement){
            case 'D':
                log(' case D')
                for (let i = 0; i < nrOfRopeHeadStepsOnRopeBridge; i++) {
                    // this.xCoordinateOfTailInGrid = this.xCoordinateOfHeadInGrid;
                    // this.yCoordinateOfTailInGrid = this.yCoordinateOfHeadInGrid;   
                    log(`D: output of previous instruction:`)
                    log(`x,y head: ${this.xCoordinateOfHeadInGrid}, ${this.yCoordinateOfHeadInGrid} `);
                    log(`x,y tail:  ${this.xCoordinateOfTailInGrid} , ${this.yCoordinateOfTailInGrid}  `);                  
                    this.xCoordinateOfHeadInGrid += 1;
                    log(`D: with updated xCoordinateOfHeadInGrid:`)
                    log(`x,y head: ${this.xCoordinateOfHeadInGrid}, ${this.yCoordinateOfHeadInGrid} `);
                    log(`x,y tail:  ${this.xCoordinateOfTailInGrid} , ${this.yCoordinateOfTailInGrid}  `);   
                    /*
                        In all case statements:
                        1. set position of newTail equal to New head. 
                        2. call fn calculateRopeTailNewCoordinates(ropeHeadNewCoordinates, ropeTailOldCoordinates) that calculates the exact coordinates of the new tail.
                        3. set in gridToPlotPositionOfTail position of the new tail to boolean true. 
                    */

                        if(this.xCoordinateOfHeadInGrid - this.xCoordinateOfTailInGrid == 0 && 
                        this.yCoordinateOfHeadInGrid - this.yCoordinateOfTailInGrid == 0)
                        {
                            log('right: head on top of tail')
                        } else if (this.xCoordinateOfHeadInGrid - this.xCoordinateOfTailInGrid == 1) 
                            // &&
                            // (Math.abs(this.yCoordinateOfHeadInGrid - this.yCoordinateOfTailInGrid) == 1 )
                            {
                            //tail should not move.
                            log('down:  head and tail adjacent, so tail not moving.')
                        } else if (this.xCoordinateOfHeadInGrid - this.xCoordinateOfTailInGrid == 2 && 
                            this.yCoordinateOfHeadInGrid - this.yCoordinateOfTailInGrid == 0 ) {
                            // tail goes South:
                            this.xCoordinateOfTailInGrid += 1;
                            this.gridToPlotPositionOf9TailsWithForEachGridCellABooleanIsVisited[this.xCoordinateOfTailInGrid][this.yCoordinateOfTailInGrid] = true;
                        } else if (this.xCoordinateOfHeadInGrid - this.xCoordinateOfTailInGrid == 2 && 
                            this.yCoordinateOfHeadInGrid - this.yCoordinateOfTailInGrid == 1 ) {
                            // tail goes South-South-East:
                            this.xCoordinateOfTailInGrid += 1;
                            this.yCoordinateOfTailInGrid += 1;
                            this.gridToPlotPositionOf9TailsWithForEachGridCellABooleanIsVisited[this.xCoordinateOfTailInGrid][this.yCoordinateOfTailInGrid] = true;
                        } else if (this.xCoordinateOfHeadInGrid - this.xCoordinateOfTailInGrid == 2 && 
                            this.yCoordinateOfHeadInGrid - this.yCoordinateOfTailInGrid == -1 ) {
                         // tail goes South-South-West:
                            this.xCoordinateOfTailInGrid += 1;
                            this.yCoordinateOfTailInGrid -= 1;
                            this.gridToPlotPositionOf9TailsWithForEachGridCellABooleanIsVisited[this.xCoordinateOfTailInGrid][this.yCoordinateOfTailInGrid] = true;
                        
                        } else { console.warn(`fn movefRopeTailOnRopeBridgeOneStepAtATime: case D`)
                        
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

                                I can make a separate else-if-statement for this. But I leave it for now. (date: 230113)
                            */
                        };

                }
                log(this.gridToPlotPositionOf9TailsWithForEachGridCellABooleanIsVisited);
                break;
            case 'L':
                log(' case L');
                for (let i = 0; i < nrOfRopeHeadStepsOnRopeBridge; i++) {
                    // this.xCoordinateOfTailInGrid = this.xCoordinateOfHeadInGrid;
                    // this.yCoordinateOfTailInGrid = this.yCoordinateOfHeadInGrid;  
                    log(`L: output of previous instruction:`)
                    log(`x,y head: ${this.xCoordinateOfHeadInGrid}, ${this.yCoordinateOfHeadInGrid} `);
                    log(`x,y tail:  ${this.xCoordinateOfTailInGrid} , ${this.yCoordinateOfTailInGrid}  `);                
                    this.yCoordinateOfHeadInGrid -= 1;
                    log(`L: with updated yCoordinateOfHeadInGrid:`)
                    log(`x,y head: ${this.xCoordinateOfHeadInGrid}, ${this.yCoordinateOfHeadInGrid} `);
                    log(`x,y tail:  ${this.xCoordinateOfTailInGrid} , ${this.yCoordinateOfTailInGrid}  `);   

                    if(this.xCoordinateOfHeadInGrid - this.xCoordinateOfTailInGrid == 0 && 
                        this.yCoordinateOfHeadInGrid - this.yCoordinateOfTailInGrid == 0)
                    {
                        log('right: head on top of tail')
                    } else if (
                            // (Math.abs(this.xCoordinateOfHeadInGrid - this.xCoordinateOfTailInGrid) == 1) 
                            // && 
                            this.yCoordinateOfHeadInGrid - this.yCoordinateOfTailInGrid == 1 ) {
                            //tail should not move.
                            log('left:  head and tail adjacent, so tail not moving.')
                    } else if (this.xCoordinateOfHeadInGrid - this.xCoordinateOfTailInGrid == 0 && 
                        this.yCoordinateOfHeadInGrid - this.yCoordinateOfTailInGrid == -2 ) {
                        // tail goes West:
                        log(`going west: `)
                        this.yCoordinateOfTailInGrid -= 1;
                        this.gridToPlotPositionOf9TailsWithForEachGridCellABooleanIsVisited[this.xCoordinateOfTailInGrid][this.yCoordinateOfTailInGrid] = true;
                    } else if (this.xCoordinateOfHeadInGrid - this.xCoordinateOfTailInGrid == -1 && 
                        this.yCoordinateOfHeadInGrid - this.yCoordinateOfTailInGrid == -2 ) {
                        // tail goes West-North-West:
                        log(`going west-north-west: `)
                        this.xCoordinateOfTailInGrid -= 1;
                        this.yCoordinateOfTailInGrid -= 1;
                        this.gridToPlotPositionOf9TailsWithForEachGridCellABooleanIsVisited[this.xCoordinateOfTailInGrid][this.yCoordinateOfTailInGrid] = true;
                    } else if (this.xCoordinateOfHeadInGrid - this.xCoordinateOfTailInGrid == 1 && 
                        this.yCoordinateOfHeadInGrid - this.yCoordinateOfTailInGrid == -2 ) {
                     // tail goes West-South-West:
                     log(`going west-south-west: `)
                        this.xCoordinateOfTailInGrid += 1;
                        this.yCoordinateOfTailInGrid -= 1;
                        this.gridToPlotPositionOf9TailsWithForEachGridCellABooleanIsVisited[this.xCoordinateOfTailInGrid][this.yCoordinateOfTailInGrid] = true;
                    
                    } else { console.warn(`fn movefRopeTailOnRopeBridgeOneStepAtATime: case L`)
                    };
                }
                log(this.gridToPlotPositionOf9TailsWithForEachGridCellABooleanIsVisited);
                break;            
            case 'R':
                log(' case R')
                for (let i = 0; i < nrOfRopeHeadStepsOnRopeBridge; i++) {
                   
                    // this.xCoordinateOfTailInGrid = this.xCoordinateOfHeadInGrid;
                    // this.yCoordinateOfTailInGrid = this.yCoordinateOfHeadInGrid;
                    log(`R: output of previous instruction:`)
                    log(`x,y head: ${this.xCoordinateOfHeadInGrid}, ${this.yCoordinateOfHeadInGrid} `);
                    log(`x,y tail:  ${this.xCoordinateOfTailInGrid} , ${this.yCoordinateOfTailInGrid}  `);   
                    this.yCoordinateOfHeadInGrid += 1;
                    log(`R: with updated yCoordinateOfHeadInGrid:`)
                    log(`x,y head: ${this.xCoordinateOfHeadInGrid}, ${this.yCoordinateOfHeadInGrid} `);
                    log(`x,y tail:  ${this.xCoordinateOfTailInGrid} , ${this.yCoordinateOfTailInGrid}  `);   

                    if(this.xCoordinateOfHeadInGrid - this.xCoordinateOfTailInGrid == 0 && 
                       this.yCoordinateOfHeadInGrid - this.yCoordinateOfTailInGrid == 0)
                    {
                            log('right: head on top of tail')
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
                        log('right: head and tail adjacent, so tail not moving.')
                    } else if (this.xCoordinateOfHeadInGrid - this.xCoordinateOfTailInGrid == 0 && 
                        this.yCoordinateOfHeadInGrid - this.yCoordinateOfTailInGrid == 2 ) {
                        // tail goes East:
                        log(`going east: `)
                        // this.xCoordinateOfTailInGrid = this.xCoordinateOfTailInGrid ;
                        this.yCoordinateOfTailInGrid += 1;
                        this.gridToPlotPositionOf9TailsWithForEachGridCellABooleanIsVisited[this.xCoordinateOfTailInGrid][this.yCoordinateOfTailInGrid] = true;
                    } else if (this.xCoordinateOfHeadInGrid - this.xCoordinateOfTailInGrid == -1 && 
                        this.yCoordinateOfHeadInGrid - this.yCoordinateOfTailInGrid == 2 ) {
                        // tail goes East-North-East:
                        this.xCoordinateOfTailInGrid += -1;
                        this.yCoordinateOfTailInGrid += 1;
                        this.gridToPlotPositionOf9TailsWithForEachGridCellABooleanIsVisited[this.xCoordinateOfTailInGrid][this.yCoordinateOfTailInGrid] = true;
                    } else if (this.xCoordinateOfHeadInGrid - this.xCoordinateOfTailInGrid == 1 && 
                        this.yCoordinateOfHeadInGrid - this.yCoordinateOfTailInGrid == 2 ) {
                     // tail goes East-South-East:
                        log(`going east-south-east: `)
                        this.xCoordinateOfTailInGrid += 1;
                        this.yCoordinateOfTailInGrid += 1;
                        this.gridToPlotPositionOf9TailsWithForEachGridCellABooleanIsVisited[this.xCoordinateOfTailInGrid][this.yCoordinateOfTailInGrid] = true;
                    
                    } else { console.warn(`fn movefRopeTailOnRopeBridgeOneStepAtATime: case R`)
                    };
                }
                log(this.gridToPlotPositionOf9TailsWithForEachGridCellABooleanIsVisited);
                break;
            case 'U':
                log(' case U');
                for (let i = 0; i < nrOfRopeHeadStepsOnRopeBridge; i++) {
                    // this.xCoordinateOfTailInGrid = this.xCoordinateOfHeadInGrid;
                    // this.yCoordinateOfTailInGrid = this.yCoordinateOfHeadInGrid;
                    log(i)
                    log(nrOfRopeHeadStepsOnRopeBridge)
                    log(`U: output of previous instruction:`)
                    log(`x,y head: ${this.xCoordinateOfHeadInGrid}, ${this.yCoordinateOfHeadInGrid} `);
                    log(`x,y tail:  ${this.xCoordinateOfTailInGrid} , ${this.yCoordinateOfTailInGrid}  `);   
                    this.xCoordinateOfHeadInGrid -= 1;
                    log(`U: with updated xCoordinateOfHeadInGrid:`)
                    log(`x,y head: ${this.xCoordinateOfHeadInGrid}, ${this.yCoordinateOfHeadInGrid} `);
                    log(`x,y tail:  ${this.xCoordinateOfTailInGrid} , ${this.yCoordinateOfTailInGrid}  `);   
                    log('here:')
                    if(this.xCoordinateOfHeadInGrid - this.xCoordinateOfTailInGrid == 0 && 
                        this.yCoordinateOfHeadInGrid - this.yCoordinateOfTailInGrid == 0)
                    {
                             log('right: head on top of tail')
                    } else if (
                        this.xCoordinateOfHeadInGrid - this.xCoordinateOfTailInGrid == -1) {
                        // && 
                        // (Math.abs(this.yCoordinateOfHeadInGrid - this.yCoordinateOfTailInGrid) == 1 )) {
                        //tail should not move.
                        log('up:  head and tail adjacent, so tail not moving.')
                    } else if (this.xCoordinateOfHeadInGrid - this.xCoordinateOfTailInGrid == -2 && 
                        this.yCoordinateOfHeadInGrid - this.yCoordinateOfTailInGrid == 0 ) {
                        // tail goes North:
                        this.xCoordinateOfTailInGrid -= 1;
                        this.gridToPlotPositionOf9TailsWithForEachGridCellABooleanIsVisited[this.xCoordinateOfTailInGrid][this.yCoordinateOfTailInGrid] = true;
                    } else if (this.xCoordinateOfHeadInGrid - this.xCoordinateOfTailInGrid == -2 && 
                        this.yCoordinateOfHeadInGrid - this.yCoordinateOfTailInGrid == 1 ) {
                        // tail goes North-North-East:
                        log(`U: north-north-east: `)
                        this.xCoordinateOfTailInGrid -= 1;
                        this.yCoordinateOfTailInGrid += 1;
                        this.gridToPlotPositionOf9TailsWithForEachGridCellABooleanIsVisited[this.xCoordinateOfTailInGrid][this.yCoordinateOfTailInGrid] = true;
                    } else if (this.xCoordinateOfHeadInGrid - this.xCoordinateOfTailInGrid == -2 && 
                        this.yCoordinateOfHeadInGrid - this.yCoordinateOfTailInGrid == -1 ) {
                     // tail goes North-North-West:
                        this.xCoordinateOfTailInGrid -= 1;
                        this.yCoordinateOfTailInGrid -= 1;
                        this.gridToPlotPositionOf9TailsWithForEachGridCellABooleanIsVisited[this.xCoordinateOfTailInGrid][this.yCoordinateOfTailInGrid] = true;
                    
                    } else { 
                        console.warn(`fn movefRopeTailOnRopeBridgeOneStepAtATime: case U`)
                    }               
                } 
                log(this.gridToPlotPositionOf9TailsWithForEachGridCellABooleanIsVisited);
                break; 


        // log(`head coordinates: x: ${this.xCoordinateOfHeadInGrid}, y:${this.yCoordinateOfHeadInGrid} `)
        // log`method moveOnRopeBridge: after each elf step another boolean false is added to gridRopeBridge:`
        
        // this.gridToPlotPositionOf9TailsWithForEachGridCellABooleanIsVisited[this.xCoordinateOfHeadInGrid][this.yCoordinateOfHeadInGrid] = true;
        // log(this.gridToPlotPositionOf9TailsWithForEachGridCellABooleanIsVisited);
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
object1MachineToModelKnotsPositionsInGrid.xCoordinateOfTailInGrid = object1MachineToModelKnotsPositionsInGrid.xCoordinateStartingPointInGrid; 
//when run with input1.txt: 4 (=== example in the assignment https://adventofcode.com/2022/day/9 )
object1MachineToModelKnotsPositionsInGrid.yCoordinateOfTailInGrid = object1MachineToModelKnotsPositionsInGrid.yCoordinateStartingPointInGrid; 
//when run with input1.txt: 0 (=== example in the assignment https://adventofcode.com/2022/day/9 )




motionsOfRopeHeadOfRopeBridge.forEach((motionOfRopeHeadOfRopeBridge) => {
    
    // object1MachineToModelKnotsPositionsInGrid.moveRopeHeadOnRopeBridgeByJumpingToDestinationCell(motionOfRopeHeadOfRopeBridge); (status: works)
    // take 1 elf step at a time: e.g. "D 4" consists of 4 steps that should each be taken separately.
    // object1MachineToModelKnotsPositionsInGrid.movefRopeHeadOnRopeBridgeOneStepAtATime(motionOfRopeHeadOfRopeBridge); (status: works)
    object1MachineToModelKnotsPositionsInGrid.movefRopeTailOnRopeBridgeOneStepAtATime(motionOfRopeHeadOfRopeBridge);
    /*
        in input1.txt (=== example in the assignment https://adventofcode.com/2022/day/9 ) the destination
        cell of the head is [2,2] (zero-based counting)  
    */
})

log(`xCoordinateOfHeadInGrid: ${object1MachineToModelKnotsPositionsInGrid.xCoordinateOfHeadInGrid}`);
log(`yCoordinateOfHeadInGrid: ${object1MachineToModelKnotsPositionsInGrid.yCoordinateOfHeadInGrid}`)


const countUpAllOfThePositionsTheHeadVisitedAtLeastOnce = (object1MachineToModelKnotsPositionsInGrid) => {
    let array = object1MachineToModelKnotsPositionsInGrid.gridToPlotPositionOf9TailsWithForEachGridCellABooleanIsVisited;
    let hasRopeHeadTouchedThisGridCell = (arrayElement) => arrayElement == true;
    let arrayWithAllCellsThatHaveBeenVisitedByRopeHead = array.map( subarray => subarray.filter( hasRopeHeadTouchedThisGridCell ));
    let flatArrayWithAllCellsThatHaveBeenVisitedByRopeHead = arrayWithAllCellsThatHaveBeenVisitedByRopeHead.flat()
    return flatArrayWithAllCellsThatHaveBeenVisitedByRopeHead.length;
}
let countOfAllOfThePositionsTheHeadVisitedAtLeastOnce = countUpAllOfThePositionsTheHeadVisitedAtLeastOnce(object1MachineToModelKnotsPositionsInGrid);
log(`countOfAllOfThePositionsTheHeadVisitedAtLeastOnce: ${countOfAllOfThePositionsTheHeadVisitedAtLeastOnce}.`);


