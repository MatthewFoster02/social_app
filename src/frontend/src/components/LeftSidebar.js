import React from "react";
import { Link, useNavigate } from "react-router-dom";
import Cookies from 'js-cookie';

import useAuth from "../hooks/useAuth.js";
import '../style/LeftSidebar.css';
import homeImg from '../images/home-white.svg';
import profileImg from '../images/account-white.png';


const LeftSidebar = () => 
{
    const { auth, setAuth } = useAuth();
    let navigate = useNavigate();

    const logout = () =>
    {
        Cookies.remove('jwtToken');
        setAuth({});
        navigate('/login', {replace: true});
    }

    return (
        <div className="wrapper">
            <div className="links">
                <Link className="link-txt" to='/'>
                    <img src={homeImg} className="home-img" />
                    Home
                </Link>
                {
                    auth?.id ? <Link className="link-txt" to={`/profile/${auth.id}`}>
                        <img src={profileImg} className="profile-img" />
                        Profile
                    </Link> : <Link className="link-txt" to={'/login'}>
                        <img src={profileImg} className="profile-img" />
                        Profile
                    </Link>
                }
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
