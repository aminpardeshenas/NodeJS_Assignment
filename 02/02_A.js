import process from 'node:process';

const args = process.argv.slice(2);
const command = args[0];
const input = args.slice(1);

let controllers = [
  {
    name: "sum",
    func: function (input) {
      let a = parseInt(input[0]);
      let b = parseInt(input[1]);
      console.log("Sum is: ", a + b);
    }
  },
  {
    name: "minus",
    func: function (input) {
      let a = parseInt(input[0]);
      let b = parseInt(input[1]);
      console.log("Minus is: ", a - b);
    }
  },
  {
    name: "print",
    func: function (input) {
      let x = {
        name: input[0],
        email: input[1],
        age: parseInt(input[2])
      };

      console.log("the object is :", x);
    }
  }
];

let found = false;
for (let i = 0; i < controllers.length; i++) {
  if (controllers[i].name === command) {
    controllers[i].func(input);
    found = true;
    break;
  }
}

if (!found) {
  console.log("Command was not found");
}