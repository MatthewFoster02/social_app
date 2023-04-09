import posts from "./src/apiHandlers/posts.js";

const body = {
    "author": "6408c06a8fde09a588c963ce",
    "content": "Great Post",
    "date_posted": 4448,
    "likes": 3
}

console.log(await posts.delete("643350218931d5af79c0a361", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE2ODExNzA2OTksImlhdCI6MTY4MTA4NDI5OSwic3ViIjoiNjQwOGMwNmE4ZmRlMDlhNTg4Yzk2M2NlIn0.ChX5jD9o8zXT_QvrFnAaD1S4VWsLt5_nfS3FZ3gIqBQ", "True"));