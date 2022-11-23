const output = "OPENAI DATA";

require("dotenv").config();
const apiKey = process.env.API_KEY;

//OPENAI import and configuration
const { Configuration, OpenAIApi } = require("openai");
const configuration = new Configuration({
  apiKey: apiKey,
});

const openai = new OpenAIApi(configuration);

async function getFromOpenAI() {
  try {
    const completion = await openai.createCompletion({
      model: "text-davinci-002",
      prompt: "Hello world",
    });
    console.log(completion.data);
    return completion.data;
  } catch (error) {
    if (error.response) {
      console.log(error.response.status);
      console.log(error.response.data);
      return error.response.data;
    } else {
      console.log(error.message);
      return error.message;
    }
  }
}