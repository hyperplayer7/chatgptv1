const { Configuration, OpenAIApi } = require("openai");
const express = require('express');
const dotenv = require("dotenv");
dotenv.config();
const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);
const app = express();
const model = "text-davinci-003";

// const runPrompt  = async () => {
//     const prompt = "Tell me a joke about a cat"
//     const response = await openai.createCompletion({
//         model: "text-davinci-003",
//         prompt: prompt,
//         temperature: 1,
//         max_tokens: 2048,
//     });
//     console.log(response.data)
// }
// runPrompt();
//above is working


// Serve the form HTML page
app.get('/', (req, res) => {
    res.send(`
      <html>
        <head>
          <style>
            .loader {
              border: 10px solid #f3f3f3;
              border-top: 10px solid #3498db;
              border-radius: 50%;
              width: 50px;
              height: 50px;
              animation: spin 2s linear infinite;
            }
  
            @keyframes spin {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }
          </style>
        </head>
        <body>
          <h1>Ask a Question</h1>
          <form id="question-form" action="/answer" method="post">
            <label for="question">Question:</label>
            <input type="text" name="question" id="question">
            <button type="submit" id="submit-button">Ask</button>
          </form>
          <div id="loader" class="loader" style="display:none;"></div>
          <script>
            document.querySelector('#question-form').addEventListener('submit', function(event) {
              // Show the loader when the form is submitted
              document.querySelector('#submit-button').style.display = 'none';
              document.querySelector('#loader').style.display = 'block';
            });
          </script>
        </body>
      </html>
    `);
  });
// Handle form submissions and get the answer from the OpenAI API
app.post('/answer', express.urlencoded({ extended: true }), async (req, res) => {
  const { question } = req.body;

  try {
    const response = await openai.createCompletion({
        model: model,
        prompt: question,
        temperature: 1,
        max_tokens: 2048,
    });
    // Send the answer back to the client
    const answer = response.data.choices[0].text.split('\n').join('\n<br>\n').trim();
    res.send(`
      <html>
        <body>
          <h1>Answer</h1>
          <p>${answer}</p>
          <a href="/">Ask another question</a>
        </body>
      </html>
    `);
  } catch (err) {
    console.error(err);
    res.status(500).send('An error occurred while getting the answer from the OpenAI API.');
  }
});

// Start the server
app.listen(3000, () => {
  console.log('Server listening on port 3000');
});
