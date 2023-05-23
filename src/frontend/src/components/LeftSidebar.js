import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Cookies from 'js-cookie';

import useAuth from "../hooks/useAuth.js";
import '../style/LeftSidebar.css';
import whiteHomeImg from '../images/home-white.png';
import whiteProfileImg from '../images/account-white.png';
import blackHomeImg from '../images/home-black.png';
import blackProfileImg from '../images/account-black.png';


const LeftSidebar = () => 
{
    const { auth, setAuth } = useAuth();
    const [homeImg, setHomeImg] = useState(whiteHomeImg);
    const [profileImg, setProfileImg] = useState(whiteProfileImg);
    let navigate = useNavigate();

    useEffect(() =>
    {
        const observer = new MutationObserver((mutationsList) =>
        {
            for (const mutation of mutationsList)
            {
                if (mutation.attributeName === 'data-theme')
                {
                    const newTheme = mutation.target.getAttribute('data-theme');
                    if (newTheme === 'dark')
                    {
                        setHomeImg(whiteHomeImg);
                        setProfileImg(whiteProfileImg);
                    }
                    else
                    {
                        setHomeImg(blackHomeImg);
                        setProfileImg(blackProfileImg);
                    }
                }
            }
        })

        observer.observe(document.body, { attributes: true });

        return () =>
        {
            observer.disconnect();
        }
    }, []);

    const logout = () =>
    {
        Cookies.remove('jwtToken');
        setAuth({});
        navigate('/login', {replace: true});
    }

    const setLightTheme = () =>
    {
        document.querySelector("body").setAttribute("data-theme", "light");
    }

    const setDarkTheme = () =>
    {
        document.querySelector("body").setAttribute("data-theme", "dark");
    }

    const toggleTheme = (e) =>
    {
        if(e.target.checked) setLightTheme();
        else setDarkTheme();
    }

    return (
        <div className="wrapper">
            <div className="links">
                <Link className="link-txt" to='/'>
                    <img src={homeImg} className="profile-img" alt="" />
                    Home
                </Link>
                {
                    auth?.id ? <Link className="link-txt" to={`/profile/${auth.id}`}>
                        <img src={profileImg} className="profile-img" alt="" />
                        Profile
                    </Link> : <Link className="link-txt" to={'/login'}>
                        <img src={profileImg} className="profile-img" alt="" />
                        Profile
                    </Link>
                }
                <label class="toggle-switch">
                    <input type="checkbox" onChange={toggleTheme} />
                    <span class="slider"></span>
                    <div className="mode">Light Mode</div>
                </label>
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
