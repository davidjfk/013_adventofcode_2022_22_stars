 
/*
    Commands start with $-sign.
    Commands: CD, LS
    Not-Commands: dir (e.g. dir d), files (e.g. 29116 f)
    input1.txt (also input2.txt) is anarray with each command on a new line.
    
    design-choices: 
        commands must run separately and sequentially, from start of array to end of array.
        LS stops at CD (CD not included) --> LS is never followed by another LS (..would be redundant)
        LS === create all files and directories that follow (until you reach command CD). 
            pitfall: before creating, first check if file or folder already exists.

            in the adventOfCode-assignment itself no files nor directories are being created...they are just being printed to the screen.
            That means I can check if files or folders have already been created with code:
            this.children.length == 0 --> see code below. 

        CD stops at:
            a) LS
            b) another CD (CD not included). About the CD:
                3 types of CD: 
                    a) CD /
                    b) CD ..
                    c) CD foo (means: go into directory foo)
                CD is followed by 1 or more CD (of type a, b and/or c combined) --> so the "engine"
                must be able to easily go up and  down the  tree 1 or many times.
        First command in input1.txt and input2.txt is "cd /". This command "cd /" to go to root directory, is not used again in the file. In
        other words: no jumping from deeply nested directory straight to the root directory "/". So "cd /" (here) means: start at root object.


        Each directory, including the root "/"is an object. 
        All objects have following methods:
            createDir (=== child object of the current object)   (uc: in LS-command)
            getChildDir(childName)                               (uc: e.g. CD foo)
            gotoParentDir                                        (uc: CD ..)  --> exception:root object does not (by def) have a parent object.
        All objects have following attributes:
            createFile (=== attribute of the current object)     (uc: e.g. 29116 f )

    bottleneck / showstopper: how to go from  child-object to parent-object??? (each directory is implemented as obj)
    answer: https://www.codeproject.com/Questions/5331417/How-to-I-get-parent-of-classs-object (more info in mediator pattern)
    I have used this code as a baseline to create the following functionality: 
    a) from parent goto child, so this-kw goes from parent to child. (i.e. from directory goto nested child directory)
        see fn getChild
    b) vice versa
        see fn getParent
    c) in parent object create a child object (i.e. a directory creating a child directory)
    d) in each object:  add a file (i.e as attribute of the object)
        see fn createChildFile
    e) in each object: add a directory (i.e. as a child object of the object)
        see fn fn createChildDirectory

    what still needs to be done:



    For each arrayItem (from input1.txt or input2.txt) an object needs to do something: not each iteration the same object, but ...the object
    in the tree where the data from input1.txt or input2.txt tells me to perform an action. So the this-keyword must be able to move 
    up and down the tree. The "engine" must implement this. 

    In the "engine" e.g. let parentViaChild = child3.getParent(); must be implemented as
    let helperVariableThatPointsToThisKeywordOfCorrectObject = child3.getParent();
    helperVariableThatPointsToThisKeywordOfCorrectObject will be a global variable. 


    When creating a directory object, push this object to array allDirectories. 
    allDirectories.forEach(2do: calculateSizeOfEachDirectory).
    Create a fn (recursive fn or use while loop) that traverses the directory tree to calculate
    the size of each directory.
    problem1: code below is about parent objects with child objects, but not about 1 object literal with multiple nested objects, 
    as in: https://www.geeksforgeeks.org/flatten-javascript-objects-into-a-single-depth-object/ 

    problem2: directory can contain multiple subdirectories. How do I traverse them all?
    I have no idea (date: 230111) --> 2do: first study theory about tree structures.

    status: crashed and burned (for the moment)
    
*/
    
  
const log = console.log;

const {readFileSync} = require("fs");
const { toNamespacedPath } = require("path");

// config 1of3: select input fiile (input1.txt or input2.txt). 
const inputFromFile = readFileSync("input1.txt", "utf-8").split('\r\n');
//log('01_input-from-file: ')
log(inputFromFile)




class Parent {
    constructor(){
        this.number = 69;
        this.children = []; 
    }

    createChildFile(fileName){
        /*
            2do: parse the filename (e.g. 2557 g) into
            this.d = 2557 
        */
        this.fileName = fileName;

    }

    createChildDirectory(childName){
        let newChild = new Child(childName, this);
        // this.children.push(newChild); 
        /*
          this will add another child.
          So child is automatically added to the parents' array of children.
        */
    }

    getChild(childName){
        const child = this.children.find(child=> child.name === childName);
        if(child){
            return child;
        } else {
            console.log("child not found");
        }
    }
}



class Child {
    constructor(name, parent){
        this.number = 29;
        this.name = name;
        this.parent = parent;
        this.parent.children.push(this);
    }

    getParent(){
        return this.parent;
    }

    getParentsNumber(){
        console.log(this.parent.number)
    }
}



const parent1 = new Parent();
const child1 = new Child("Joey", parent1);


/*
    uc: move this-kw from parent to child, so child is starting point to do stuff (e.g. add type of food): (status: works)
*/
const parent2 = new Parent();
const child2 = new Child("Joey", parent2);
let childViaParent = parent2.getChild("Joey");
log(childViaParent);
childViaParent.food = 'apple';
log(`check if this-kw points to child: `)
log(childViaParent);


/*
    uc: move this-kw from child to parent (status: works)
*/
const parent3 = new Parent();
const child3 = new Child("Sarah", parent3);
child3.getParentsNumber(); //69

let parentViaChild = child3.getParent();
log(parentViaChild);
parentViaChild.hobby = "programming";
log(parentViaChild);


/*
    uc: parent creates child:
*/
const parent4 = new Parent();
parent4.createChildDirectory(`Saskia`);
parent4.createChildDirectory(`Sarah`);
log(parent4);


parent4.createChildFile(`2557 g`);
log(parent4);



// source: https://www.geeksforgeeks.org/flatten-javascript-objects-into-a-single-depth-object/ 
// Declare a flatten function that takes
// object as parameter and returns the
// flatten object
const flattenObj = (ob) => {
 
    // The object which contains the
    // final result
    let result = {};
 
    // loop through the object "ob"
    for (const i in ob) {
 
        // We check the type of the i using
        // typeof() function and recursively
        // call the function again
        if ((typeof ob[i]) === 'object' && !Array.isArray(ob[i])) {
            const temp = flattenObj(ob[i]);
            for (const j in temp) {
 
                // Store temp in result
                result[i + '.' + j] = temp[j];
            }
        }
 
        // Else store ob[i] in result directly
        else {
            result[i] = ob[i];
        }
    }
    return result;
};

log(`flatten the obj: `)
console.log(flattenObj(parent4));
// problem: in the log:

/*
{
  number: 69,
  children: [
    Child { number: 29, name: 'Saskia', parent: [Parent] },
    Child { number: 29, name: 'Sarah', parent: [Parent] }
  ],
  fileName: '2557 g'
}

*/