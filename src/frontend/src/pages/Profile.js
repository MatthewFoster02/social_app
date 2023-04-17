import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";

import usersAPI from "../apiHandlers/users.js";
import useAuth from "../hooks/useAuth.js";
import './Profile.css';
import DisplayPosts from "../components/DisplayPosts.js";

const Profile = () => 
{
    const { auth, setAuth } = useAuth();
    const { id } = useParams();
    const [user, setUser] = useState({});
    const [isPending, setIsPending] = useState(true);
    const [apiError, setApiError] = useState();
    const [birthday, setBirthday] = useState('');

    useEffect(() =>
    {
        async function fetchUser()
        {
            const userInfo = await usersAPI.getUser(id);

            if(userInfo['statusText'] === 'OK')
            {
                const userData = await userInfo['data'];
                setUser(userData);
                setIsPending(false);
                setApiError(null);
                if(userData.birthday != null)
                {
                    const birthMillisecs = userData.birthday;
                    const date = new Date(birthMillisecs);
                    const day = date.getDate();
                    const month = date.getMonth() + 1;
                    const year = date.getFullYear();

                    setBirthday(`${day}/${month}/${year}`);
                }
                else
                {
                    setBirthday('Unkown');
                }
            }
            else
            {
                const errors = await userInfo['data'];
                console.log(errors);
                setApiError(errors['detail']);
                setIsPending(false);
            }
        }
        fetchUser();

    }, [id]);

    return (
        <div className="contain">
            <div className="wrapper-profile">
                {
                    isPending && <div>
                        <h2>Loading Profile...</h2>
                    </div>
                }
                <h2 className="titleLogin">
                    {user.username}
                </h2>
                <div className="profile-pic-update">
                    <img src={user.profile_pic} className="profile-pic-lg" alt="" />
                    {
                        auth.id === id && <Link to='/profile/update' className='update-profile-btn'>Update Profile</Link>
                    }
                </div>
                <div className="user-info">
                    <p className="bio">{user.bio}</p>
                    <div className="birthday">Birthday: {birthday}</div>
                </div>
                {
                    apiError && (
                        <div className='error-alert'>
                                <span>{apiError}</span>
                        </div>
                    )
                }
            </div>
            <DisplayPosts props={id} />
        </div>
        
    );
}
export default Profile;
