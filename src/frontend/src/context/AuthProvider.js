import { createContext, useState, useEffect } from "react";
import Cookies from 'js-cookie';

import usersAPI from "../apiHandlers/users.js";

const AuthContext = createContext({});
export const AuthProvider = ({children}) => 
{
    const [auth, setAuth] = useState({});

    useEffect(() => {
        async function checkUser()
        {
            const token = Cookies.get('jwtToken');

            if (token) {
                const userData = await usersAPI.checkDetails(token);
                if(userData['statusText'] === 'OK')
                {
                    const userInfo = await userData['data'];
                    userInfo['token'] = token;
                    setAuth(userInfo);
                }
            }
        }
        checkUser();
    }, []);

    return (
        <AuthContext.Provider value={{auth, setAuth}} >
            {children}
        </AuthContext.Provider>
    );
}
export default AuthContext;
