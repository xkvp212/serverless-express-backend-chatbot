const { OpenAI } = require("openai");
require("dotenv").config();
const express = require("express");

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

const app = express();
app.use(express.json());

async function ask(event) {
  // get prompt question from request
  const prompt = event.body.prompt;

  try {
    if (prompt == null) {
      throw new Error("No prompt provided");
    }

    // triggers OpenAI completion
    const response = await openai.completions.create({
      model: "text-davinci-003",
      prompt,
      max_tokens: 70,
    });

    // retreives the completion text from the response
    const completion = response.choices[0].text;

    // return result
    return {
      statusCode: 200,
      body: JSON.stringify({
        success: true,
        message: completion,
      }),
    };
  } catch (error) {
    console.log(error.message);

    return {
      statusCode: 500,
      body: JSON.stringify({
        success: false,
        message: error.message,
      }),
    };
  }
}

exports.ask = ask;