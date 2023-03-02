var express = require('express');
var router = express.Router();

const { Configuration, OpenAIApi } = require("openai");
const { API_KEY } = require('../config/config');

const configuration = new Configuration({
  apiKey: API_KEY,
});
const openai = new OpenAIApi(configuration);

/* chat. */
router.post('/prompt', async (req, res, next) => {
  const { config, prompt } = req.body;
  const params = {
    ...config,
    prompt
  }
  try {
    const completion = await openai.createCompletion(params);
    res.status(200).json({ result: completion.data.choices[0].text });
  } catch (error) {
    // Consider adjusting the error handling logic for your use case
    if (error.response) {
      console.error(error.response.status, error.response.data);
      res.status(error.response.status).json(error.response.data);
    } else {
      console.error(`Error with OpenAI API request: ${error.message}`);
      res.status(500).json({
        error: {
          message: 'An error occurred during your request.',
        }
      });
    }
  }
});

module.exports = router;
