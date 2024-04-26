const OpenAI = require('openai');

// Replace 'YOUR_API_KEY' with your OpenAI API key

// Function to generate a random number between min and max (inclusive)
function getRandomNumber(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

// Function to initialize the game
async function startGame() {
  console.log("Welcome to the Number Guessing Game!");
  console.log("Think of a number between 1 and 100.");
  
  
  await delay(5000); // 5 seconds delay before the first guess
  let min = 1;
  let max = 100;
  let attempts = 0;
  
  while (true) {
    attempts++;
    const guess = getRandomNumber(min, max);
    
    console.log(`Is your number ${guess}?`);
    const response = await getResponse();
    
    if (response === "correct") {
      console.log(`I guessed it in ${attempts} attempts!`);
      break;
    } else if (response === "higher") {
      min = guess + 1;
    } else if (response === "lower") {
      max = guess - 1;
    } else {
      console.log("Please respond with 'higher', 'lower', or 'correct'.");
    }

    // Delay before AI's next guess
    await delay(5000); // 5 seconds delay
  }
}

// Function to create a delay
function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Function to get response from the user or AI
async function getResponse() {
  const readline = require('readline').createInterface({
    input: process.stdin,
    output: process.stdout
  });
  
  return new Promise(resolve => {
    readline.question('Is the number higher, lower, or correct? ', async (answer) => {
      if (answer === 'correct' || answer === 'higher' || answer === 'lower') {
        resolve(answer);
      } else {
        const aiResponse = await askAI(answer);
        console.log(aiResponse);
        resolve(await getResponse());
      }
      readline.close();
    });
  });
}

// Function to ask AI for response
async function askAI(prompt) {
  try {
    const response = await openai.complete({
      engine: 'text-davinci-003',
      prompt: prompt + "\nAI:",
      maxTokens: 50
    });
    return response.data.choices[0].text.trim();
  } catch (error) {
    console.error('Failed to get AI response:', error);
    return "I'm sorry, I couldn't understand that.";
  }
}

// Start the game
startGame();
