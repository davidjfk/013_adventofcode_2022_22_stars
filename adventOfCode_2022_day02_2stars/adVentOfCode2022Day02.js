// import input.txt from "./input"


const log = console.log;

const {readFileSync} = require("fs");


const input = readFileSync("input.txt", "utf-8").split('\r\n');
log(input)


const roundScores = input.map((round) => {
    switch (round) {
      // Rock vs rock = draw -> 3 pts. + 1 pt for rock
      case "A X":
        return 3;

      // Rock vs. paper = win -> 6 + 2 pts
      case "A Y":
        return 4;

      // Rock vs. scissors = loss -> 0 + 3
      case "A Z":
        return 8;

      // paper vs rock = loss -> 0 + 1
      case "B X":
        return 1;

      // paper vs paper = draw-> 3 + 2
      case "B Y":
        return 5;

      // paper vs scissors = win -> 6 + 3
      case "B Z":
        return 9;

      // scissor vs rock = win -> 6 + 1
      case "C X":
        return 2;

      // scissor vs paper = loss -> 0 + 2
      case "C Y":
        return 6;

      // scissor vs scissor = draw -> 3 + 3
      case "C Z":
        return 7;
      default:
        return 0;
    }
  });
  const sum = roundScores.reduce((a, b) => a + b);
  console.log(sum);



