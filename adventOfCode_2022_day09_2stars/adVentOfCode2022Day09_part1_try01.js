
/*
    design:
    create grid 'gridToPlotPositionOfTail':
    a) calculate gridToPlotPositionOfTail width (first with input1.txt, then input2.txt)
    b) calculate gridToPlotPositionOfTail height (first with input1.txt, then input2.txt)
    c) (now) create gridToPlotPositionOfTail and fill  each cell with boolean false.
       (just a plain false, or {isGridCellVisited: false})

    create class with:
    a) attribute 'gridToPlotPositionOfTail' --> instanciate obj with created gridToPlotPositionOfTail.
    b) methods to traverse grid (up, down, left, right)
    c) set each grid cell to true that is visited by obj of class MachineToModelKnotsPositionsInGrid.

    The approach is very much like adventOfCode2022Day5_part1: with forEach iterate through array input1.txt
    (and then input2.txt). 

    Neuigkeit / challenges:
    1. instead of stacks of crates, a 2-d grid must be used.
    2. calculate grid with and height, based on input1.txt. Then with input2.txt. Two valid options
        a) take a grid that is way to big, e.g. 100000 rows * 100000 cols and start at cell [5000, 5000].
        b) calculate the minimum size of the grid that is still big enough to be traversed with the steps in file input2.txt.
        For the fun of it, I choose the hard way: option b. 

            goal 1: I need nr of rows and cols to create a grid <in the  story: rope bridge/> 
                that can be traversed by te Elves. 
            goal 2: calculate the starting point of the Elves on the rope bridge.
                Explanation: if elves start at a ficticious cell [0,0] and move a max of 30 cells down 
                compared to this start cell, so [30,0], 10 up [-10,0], 5 to the right [0,5], and 10 
                to the left [0, -20], then grid nr of rows === 40 and nr of columns 15.
                The starting point inside this grid (for the grid traversal from the input file to fit 
                inside the grid) is [10, 20].

    3. set each visited cell in the grid to value 'true'. Do this first for the head (input1.txt, then input2.txt)
    4. Now implement  business logic to determine position of the tail (input1.txt, then input2.txt).
    5. set each cell visited by the  tail to boolean 'true'. (visiting once or many times all lead to boolean 'true'.)



    status: code  can calculate:
        nrOfRequiredRowsInGrid: 367  (1-based numbering)
        nrOfRequiredColsInGrid: 292  (1-based numbering)
        cellXAndYCoordinatesOfStartPointInGrid: 269,284 (0-based numbering)    
    
    A little start has been made with object method moveOnRopeBridge. In next file I continue with this method to first track 
    position of rope-head and then of rope-tail.
*/

const log = console.log;

const {readFileSync} = require("fs");
const { toNamespacedPath } = require("path");


const motionsOfElvesOnRopeBridge = readFileSync("input2.txt", "utf-8").split('\r\n');
// log('01_input-from-file: ')
// log(input)

// const motionsOfElvesOnRopeBridge = [
//     'R 4', 'U 4',
//     'L 3', 'D 1',
//     'R 4', 'D 1',
//     'L 5', 'R 2'
//   ];


class MachineToModelKnotsPositionsInGrid {
    constructor(gridToPlotPositionOfTail) {
        this.gridToPlotPositionOfTail = gridToPlotPositionOfTail;
        this.xPreviousCoordinateOfHead = 0;
        this.yPreviousCoordinateOfHead = 0;
        this.xCoordinateLowestAndHighestDistanceFromStartPoint = []; 
        this.yCoordinateLowestAndHighestDistanceFromStartPoint = [];
        this.gridNrOfRows = 0;
        this.gridNrOfCols = 0;
        this.xCoordinateOfHeadInGridToPlotPositionOfTail;
        this.yCoordinateOfHeadInGridToPlotPositionOfTail;
    }

//calculateRopeBridgeNrOfRowsAndColsAndStartingPoint

    createArrayWithDataThatIsNeededInOtherCodeAsInputToCalculateNrOfRowsAndColsInGrid(motionOfElvesOnRopeBridge){
        let directionOfMovement, nrOfElvesStepsOnRopeBridge;
        let arrayWithSplittedMotionOfElvesOnRopeBridge = motionOfElvesOnRopeBridge.split(" ");
        directionOfMovement = arrayWithSplittedMotionOfElvesOnRopeBridge[0];
        nrOfElvesStepsOnRopeBridge = parseInt(arrayWithSplittedMotionOfElvesOnRopeBridge[1]);
        
        // log(directionOfMovement, nrOfElvesStepsOnRopeBridge); // e.g. R 4  or U 4 or L 3 etc.

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

    }


    moveOnRopeBridge(motionOfElvesOnRopeBridge) {
        let directionOfMovement, nrOfElvesStepsOnRopeBridge;
        let arrayWithSplittedMotionOfElvesOnRopeBridge = motionOfElvesOnRopeBridge.split(" ");
        directionOfMovement = arrayWithSplittedMotionOfElvesOnRopeBridge[0];
        nrOfElvesStepsOnRopeBridge = parseInt(arrayWithSplittedMotionOfElvesOnRopeBridge[1]);
        
        log(directionOfMovement, nrOfElvesStepsOnRopeBridge);
        

        switch(directionOfMovement){
            case 'D':
                this.yCoordinateOfHeadInGridToPlotPositionOfTail += nrOfElvesStepsOnRopeBridge;
                break;
            case 'L':
                this.xCoordinateOfHeadInGridToPlotPositionOfTail -= nrOfElvesStepsOnRopeBridge;
                break;            
            case 'R':
                this.xCoordinateOfHeadInGridToPlotPositionOfTail += nrOfElvesStepsOnRopeBridge;
                break;
            case 'U':
                this.yCoordinateOfHeadInGridToPlotPositionOfTail -= nrOfElvesStepsOnRopeBridge;
                break;            
        }


    }
}
  
const machineToModelKnotsPositionsInGrid = new MachineToModelKnotsPositionsInGrid(motionsOfElvesOnRopeBridge);
// log(machineToModelKnotsPositionsInGrid)

// calculate width and height of gridToPlotPositionOfTail
motionsOfElvesOnRopeBridge.forEach((motionOfElvesOnRopeBridge) => {
    // take 1 (elf) step at a time.
    machineToModelKnotsPositionsInGrid.createArrayWithDataThatIsNeededInOtherCodeAsInputToCalculateNrOfRowsAndColsInGrid(motionOfElvesOnRopeBridge);
})

let calculateNrOfRequiredRowsInGrid = (machineToModelKnotsPositionsInGrid) => {
    // starting point to calculate nr of rows in grid is [0,0]
    let xCoordinateHighestDistanceFromStartPoint = Math.max(...machineToModelKnotsPositionsInGrid.xCoordinateLowestAndHighestDistanceFromStartPoint);
    // log(xCoordinateHighestDistanceFromStartPoint);
    // input1.txt: -2

    let xCoordinateLowestDistanceFromStartPoint = Math.min(...machineToModelKnotsPositionsInGrid.xCoordinateLowestAndHighestDistanceFromStartPoint);
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
let nrOfRequiredRowsInGrid = calculateNrOfRequiredRowsInGrid(machineToModelKnotsPositionsInGrid);
log(`nrOfRequiredRowsInGrid: ${nrOfRequiredRowsInGrid}  (1-based numbering)`);
machineToModelKnotsPositionsInGrid.gridNrOfRows = nrOfRequiredRowsInGrid;

let calculateNrOfRequiredColsInGrid = (machineToModelKnotsPositionsInGrid) => {
    // starting point to calculate nr of cols in grid is [0,0]
    // pitfall: read pitfall in fn calculateNrOfRequiredRowsInGrid. 
    let yCoordinateHighestDistanceFromStartPoint = Math.max(...machineToModelKnotsPositionsInGrid.yCoordinateLowestAndHighestDistanceFromStartPoint);
    // log(yCoordinateHighestDistanceFromStartPoint);

    let yCoordinateLowestDistanceFromStartPoint = Math.min(...machineToModelKnotsPositionsInGrid.yCoordinateLowestAndHighestDistanceFromStartPoint);
    // log(yCoordinateLowestDistanceFromStartPoint);

    if (yCoordinateHighestDistanceFromStartPoint < 0) yCoordinateHighestDistanceFromStartPoint = 0;
    if (yCoordinateLowestDistanceFromStartPoint > 0) yCoordinateLowestDistanceFromStartPoint = 0;

    let nrOfRequiredColsInGrid = yCoordinateHighestDistanceFromStartPoint - yCoordinateLowestDistanceFromStartPoint;
    // in order 2 take e.g. to steps to the right in the grid, you need 3 cols, so to avoid off-by-one error:
    nrOfRequiredColsInGrid +=1;
    // log(nrOfRequiredColsInGrid);
    return nrOfRequiredColsInGrid;
}
let nrOfRequiredColsInGrid = calculateNrOfRequiredColsInGrid(machineToModelKnotsPositionsInGrid);
log(`nrOfRequiredColsInGrid: ${nrOfRequiredColsInGrid}  (1-based numbering)`);
machineToModelKnotsPositionsInGrid.gridNrOfCols = nrOfRequiredColsInGrid;


let calculateCellXAndYCoordinatesOfStartPointInGrid = () => {
    // in input1.txt (=== example in the assignment https://adventofcode.com/2022/day/9 ) the starting cell is [4, 0] (zero-based counting)
    
    
    let xCoordinateHighestDistanceFromStartPoint = Math.max(...machineToModelKnotsPositionsInGrid.xCoordinateLowestAndHighestDistanceFromStartPoint);
    // log(xCoordinateHighestDistanceFromStartPoint);
    // input1.txt: result: -2

    let xCoordinateLowestDistanceFromStartPoint = Math.min(...machineToModelKnotsPositionsInGrid.xCoordinateLowestAndHighestDistanceFromStartPoint);
    // log(xCoordinateLowestDistanceFromStartPoint);
    // input1.txt: result: -4
    // pitfall: Math.min (that suggest a "minimum") actually provides the highest distance from ficticious starting point [0,0].
    
    
    let yCoordinateHighestDistanceFromStartPoint = Math.max(...machineToModelKnotsPositionsInGrid.yCoordinateLowestAndHighestDistanceFromStartPoint);
    // log(yCoordinateHighestDistanceFromStartPoint);
    // input1.txt: result: 5

    let yCoordinateLowestDistanceFromStartPoint = Math.min(...machineToModelKnotsPositionsInGrid.yCoordinateLowestAndHighestDistanceFromStartPoint);
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
let cellXAndYCoordinatesOfStartPointInGrid = calculateCellXAndYCoordinatesOfStartPointInGrid();
log(`cellXAndYCoordinatesOfStartPointInGrid: ${cellXAndYCoordinatesOfStartPointInGrid} (0-based numbering)`);







// motionsOfElvesOnRopeBridge.forEach((motionOfElvesOnRopeBridge) => {
//     // take 1 step at a time.
//     machineToModelKnotsPositionsInGrid.moveOnRopeBridge(motionOfElvesOnRopeBridge);
// })



// log(machineToModelKnotsPositionsInGrid)


// let result = machineToModelKnotsPositionsInGrid.getConcatenationOfHighestCrateOnEachStack();
// log(result);


