import users from "./src/api/users.js";

const body = {
    "email": "mattfoster02@outlook.com",
    "password": "Shercock"
}

console.log(await users.login(body));