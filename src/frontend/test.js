import { config } from "dotenv";
import { Configuration, OpenAIApi } from "openai";
import readline from "readline";

config();
const openAI = new OpenAIApi(
    new Configuration({
        apiKey: process.env.API_KEY
    })
);

const ui = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

ui.prompt();
ui.on("line", async input => 
{
    const response = await openAI.createChatCompletion({
        model: "gpt-3.5-turbo",
        messages: [{role: 'user', content: input}]
    });
    console.log(response.data.choices[0].message.content);
    ui.prompt();
});
