// const util = require('node:util');
// util.inspect.defaultOptions.maxArrayLength = null;

const log = console.log;
// const dir = console.dir(myArry, {'maxArrayLength': null});

const {readFileSync} = require("fs");
const { toNamespacedPath } = require("path");


const inputFromFile = readFileSync("input.txt", "utf-8").split('\r\n');
log('01_input-from-file: ')
log(inputFromFile);


/*
design:

key idea: create 1 object with file system as state (=== object attribute) and methods to create, traverse and read 
from file system as its methods. In short: 1 object with state and methods that belong to each other, because 
they form a semantic unity.

Outermost directory === "/" === (implemented as) an object (A).
Each subdirectory is (implemented as) a nested object (B).

Each (B) must be able to do 6 tasks:
1. goto (A)  (cd /)
2. goto parent object.  (cd ..)
3. create child directory (implemnted as nested object) if it does not exist yet (e.g. dir 'foo')
4. add (immutable copy of !!) working directory (implemented as e.g. obj1.obj3.obj6.obj10) of child directory 
    (here: obj10) to a  'separate array with all child-directories (implemented as nested objects)' (M)
5. goto child directory (implemented as nested object).  (e.g. cd 'foo')
6. create child file (implemented as attribute of current obj) if it does not exist yet (e.g. 8033020 d.log)

trick-of-the-trade 1: current workin directory is dynamic and are (if  needed) updted by each  line of terminal output
from the puzzle input. I will use helper variable 'currentWorkingDirectory' for this purpose. 
trick-of-the-trade 2: each child directory (implemented as nested object) is created with a constructor function that 
creates the first 4 (out of 6) aforementioned tasks.


Just like in adventOfCode day 5 I will loop over each line from file input.txt to perform a task. Here I do this
on the file system (implemented as object) with the up-to-date variable currentWorkingDirectory telling me exactly 
where to perform the required task. 


problem: 221229: not possible to create a file tree structure as nested objects. I do not know why. 
root cause: I miss out on fundamental building blocks. 
2do later (I leave it for now): try to build a conventional js-tree structure  instead.
*/


class FileSystem {
    constructor(root, currentWorkingDirectory, arrayWithWorkingDirectoryOfEachChildDirectory, temp1) {
        this.root = root;
        this.currentWorkingDirectory = currentWorkingDirectory;
        this.arrayWithWorkingDirectoryOfEachChildDirectory = arrayWithWorkingDirectoryOfEachChildDirectory; //pitfall: must be immutable copy. 
        this.temp1 = temp1;
    }


    // initRoot() {
    //     this.root = {};
    //     // log(this.root)

    // }

    initCurrentWorkingDirectory() {
        this.currentWorkingDirectory = this.root;
        this.temp1 = "";

    }

    // commented code works (but gives wrong results)

    // updateCurrentWorkingDirectory(nestedProperty, directoryToNest) {
    //     this.currentWorkingDirectory[nestedProperty] = directoryToNest
    //     this.temp1 = this.currentWorkingDirectory[nestedProperty];
    //    return this.currentWorkingDirectory[nestedProperty] 

    // }

    // updateCurrentWorkingDirectory2(nestedProperty, directoryToNest) {

    //    return this.temp1[nestedProperty] = directoryToNest
    // }

 // commented code works (but gives wrong results)
    updateCurrentWorkingDirectory(nestedProperty, directoryToNest) {
        // this.currentWorkingDirectory = this.temp1;
        this.currentWorkingDirectory[nestedProperty] = directoryToNest
        this.temp1 = this.currentWorkingDirectory[nestedProperty];
       return this.temp1[nestedProperty] 

    }

    updateCurrentWorkingDirectory2(nestedProperty, directoryToNest) {
        this.currentWorkingDirectory = this.temp1;
        this.currentWorkingDirectory[nestedProperty] = directoryToNest;
        this.temp1 = this.currentWorkingDirectory[nestedProperty];
       return this.temp1[nestedProperty] = directoryToNest
    }


    gotoRoot() {
        // this.currentWorkingDirectory = this.root;

    }

    gotoParentDirectory() {

    }

    createChildDirectory() {

    }
}

log(this)
const fileSystem = new FileSystem(
    {}, {}, [], {}
    // 'root', 'cwd', []
);

fileSystem.initCurrentWorkingDirectory();
fileSystem.updateCurrentWorkingDirectory('nestedProperty01', {'aaa':'01'})
console.log(fileSystem.currentWorkingDirectory)
fileSystem.updateCurrentWorkingDirectory2('nestedProperty02', {'bbb':'02'})
console.log(fileSystem.currentWorkingDirectory)
fileSystem.updateCurrentWorkingDirectory2('nestedProperty03', {'ccc':'03'})
console.log(fileSystem.currentWorkingDirectory)
// Object.assign(fileSystem.currentWorkingDirectory.foo.nrOfBytes, {'bar':{'nrOfBytes':[10]}}) ;
// fileSystem.updateCurrentWorkingDirectory({'bar':{'nrOfBytes':[10]}})
// console.log(fileSystem.currentWorkingDirectory)

log('before:')
// console.log(fileSystem)



inputFromFile.forEach((fileSystemCreationStep) => {

    //parse each command from file input.txt.

    // in a switch statement execute the parsed command

    let cliCommand = 'Papayas'; //2do: dynamically replace with fileSystemCreationStep
    switch (cliCommand) {
        case 'Oranges':
            console.log('Oranges are $0.59 a pound.');
            break;
        case 'Mangoes':
        case 'Papayas':
            // console.log('Mangoes and papayas are $2.79 a pound.');
            // expected output: "Mangoes and papayas are $2.79 a pound."
            break;
        default:
        console.error(`Sorry, I do not recognize cliCommand ${cliCommand}.`);
    }
    // fileSystem.gotoRoot(fileSystemCreationStep);
})


log('after:')
console.log(fileSystem)






/*
// code snippet under construction



let currentWorkingDirectory;
let previousWorkingDirectory; // updated after each "cd into a folder"
previousWorkingDirectory = obj.subObj3; // go up with a trim fn :). 

let obj = {
        subObj1: {
            "foo": "2"
        },
        subObj2: {
            "foo": "1"
        },
        gotoParentObj: function(){
            
        },       
        subObj3: {
            nested1 : {
                gotoParentObj: function(){
                    currentWorkingDirectory = previousWorkingDirectory;
                }, 
            }
        }
    };


    currentWorkingDirectory = obj;

// log(steppingStone)

currentWorkingDirectory = obj.subObj2;

log(currentWorkingDirectory);



obj.subObj3.nested1.gotoParentObj();
log(currentWorkingDirectory);

// steppingStone.subobj2

// steppingStone.func4()

// log(steppingStone)

// log(obj)
// obj.subobj3.func4();
*/