const readline = require("readline");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  prompt: "Enter your first message: ",
});

rl.prompt(); // Show initial prompt

// First input
rl.on("line", (input1) => {
  rl.setPrompt(`You entered "${input1}". \nNow enter your second message: `);
  rl.prompt();

  // Second input
  rl.once("line", (input2) => {
    rl.setPrompt(`You entered "${input2}".\nNow enter your third message: `);
    rl.setPrompt(`Your messages were: \n1: ${input1} \n2: ${input2}`);
    rl.prompt();
    rl.close();
  });
});
