
/*
    first read comment (about design) at the start of adVentOfCode2022Day09_part1_try01.js    

    goal: work on method moveOnRopeBridge, to first track 
    location of rope-head and then of rope-tail.

    status: tracking location of rope-head in grid works correctly.
    next: track location of rope-tail.
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
        this.xCoordinateOfHeadInGridToPlotPositionOfTail // = 0; // will be adjusted with xCoordinateStartingPointInGrid.
        this.yCoordinateOfHeadInGridToPlotPositionOfTail // = 0; // will be adjusted with yCoordinateStartingPointInGrid.
        this.xCoordinateStartingPointInGrid;
        this.yCoordinateStartingPointInGrid;
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
        log(`head coordinates: x: ${this.xPreviousCoordinateOfHead}, y:${this.yPreviousCoordinateOfHead} `)
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
            This works correctly
        */
    }


    moveOnRopeBridge(motionOfElvesOnRopeBridge) {
        let directionOfMovement, nrOfElvesStepsOnRopeBridge;
        let arrayWithSplittedMotionOfElvesOnRopeBridge = motionOfElvesOnRopeBridge.split(" ");
        directionOfMovement = arrayWithSplittedMotionOfElvesOnRopeBridge[0];
        nrOfElvesStepsOnRopeBridge = parseInt(arrayWithSplittedMotionOfElvesOnRopeBridge[1]);       
        // log(directionOfMovement, nrOfElvesStepsOnRopeBridge); // e.g. R 4  or U 4 or L 3 etc.




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


let calculateCellXAndYCoordinatesOfStartingPointInGrid = () => {
    // in input1.txt (=== example in the assignment https://adventofcode.com/2022/day/9 ) the starting cell is [4, 0] (zero-based counting)
    /*
        if you start at e.g. [0,0] or [3,2], then you will be traversing outside of the grid, so the number of tails that have been visited will
        be wrong.
        That is why you must start at the correct starting cell. 
    */
    
    
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
let cellXAndYCoordinatesOfStartPointInGrid = calculateCellXAndYCoordinatesOfStartingPointInGrid();
log(`cellXAndYCoordinatesOfStartPointInGrid: [${cellXAndYCoordinatesOfStartPointInGrid}] (0-based numbering)`);
machineToModelKnotsPositionsInGrid.xCoordinateStartingPointInGrid = cellXAndYCoordinatesOfStartPointInGrid[0];
// log(machineToModelKnotsPositionsInGrid.xCoordinateStartingPointInGrid);
machineToModelKnotsPositionsInGrid.yCoordinateStartingPointInGrid = cellXAndYCoordinatesOfStartPointInGrid[1];
// log(machineToModelKnotsPositionsInGrid.yCoordinateStartingPointInGrid);



// initialize the starting point of the rope-head in the grid: (there is only 1 correct value, see comment in fn
// calculateCellXAndYCoordinatesOfStartingPointInGrid. 
machineToModelKnotsPositionsInGrid.xCoordinateOfHeadInGridToPlotPositionOfTail = machineToModelKnotsPositionsInGrid.xCoordinateStartingPointInGrid; 
//when run with input1.txt: 4 (=== example in the assignment https://adventofcode.com/2022/day/9 )
machineToModelKnotsPositionsInGrid.yCoordinateOfHeadInGridToPlotPositionOfTail = machineToModelKnotsPositionsInGrid.yCoordinateStartingPointInGrid; 
//when run with input1.txt: 0 (=== example in the assignment https://adventofcode.com/2022/day/9 )




motionsOfElvesOnRopeBridge.forEach((motionOfElvesOnRopeBridge) => {
    // take 1 step at a time.
    machineToModelKnotsPositionsInGrid.moveOnRopeBridge(motionOfElvesOnRopeBridge);
    /*
        in input1.txt (=== example in the assignment https://adventofcode.com/2022/day/9 ) the destination
        cell of the head is [2,2] (zero-based counting)
        
    */
})

log(`xCoordinateOfHeadInGridToPlotPositionOfTail:`)
log(machineToModelKnotsPositionsInGrid.xCoordinateOfHeadInGridToPlotPositionOfTail);
log(`yCoordinateOfHeadInGridToPlotPositionOfTail:`)
log(machineToModelKnotsPositionsInGrid.yCoordinateOfHeadInGridToPlotPositionOfTail);


// log(machineToModelKnotsPositionsInGrid)


// let result = machineToModelKnotsPositionsInGrid.getConcatenationOfHighestCrateOnEachStack();
// log(result);


