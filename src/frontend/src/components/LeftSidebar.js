import React from "react";
import { Link, useNavigate } from "react-router-dom";

import useAuth from "../hooks/useAuth.js";
import './LeftSidebar.css';


const LeftSidebar = () => 
{
    const { auth, setAuth } = useAuth();
    let navigate = useNavigate();

    const logout = () =>
    {
        setAuth({});
        navigate('/login', {replace: true});
    }

    return (
        <div className="wrapper">
            <div className="links">
                <Link className="link-txt" to='/'>Home</Link>
                <Link className="link-txt" to='/user:id'>Profile</Link>
            </div>
            {
                !auth?.username ? (
                    <div className="logged-out">
                        <Link className="link-log" to='/login'>Login</Link>
                        <Link className="link-log" to='/register'>Register</Link>
                    </div>
                ) : (
                    <div className="logged-in">
                        <button className="btn-log" onClick={logout}>
                            Logout
                        </button>
                    </div>
                )
            }
        </div>
    );
}
export default LeftSidebar;
