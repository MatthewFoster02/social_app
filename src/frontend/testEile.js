import users from "./src/apiHandlers/users.js";

const body = {
    "email": "mattfoster02@outlook.com",
    "password": "Shercock"
}

console.log(users.login(body));