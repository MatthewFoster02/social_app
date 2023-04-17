import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

import './UpdateProfile.css';
import usersAPI from '../apiHandlers/users.js';
import useAuth from '../hooks/useAuth.js';

const UpdateProfile = () => 
{
    const { auth, setAuth } = useAuth();
    const [apiError, setApiError] = useState();
    const [username, setUsername] = useState(auth.username);
    const [bio, setBio] = useState(auth.bio);
    const [picture, setPicture] = useState(null);
    let navigate = useNavigate();

    const handleSubmit = async (e) =>
    {
        e.preventDefault();
        const formData = new FormData();

        formData.append('profile_picture', picture);
        formData.append('username', username);
        formData.append('bio', bio);

        for (const [key, value] of formData.entries())
        {
            console.log(`${key}: ${value}`);
        }
        // send the form data using Axios
        const updated_user = await usersAPI.update(auth.id, formData, auth.token);
        console.log(updated_user);
    }

    return (
        <div className='wrapperLogin'>
            <div>
                <h2 className='titleLogin'>
                    Update Profile:
                </h2>
                <form onSubmit={handleSubmit}>
                    <div className='inputs'>
                        <div className='input'>
                            <label htmlFor='username'>Username:</label>
                            <input
                                type='text'
                                placeholder='username'
                                className='input-style'
                                name='username'
                                autoComplete='off'
                                value={username}
                                id='username'
                                onChange={(e) => setUsername(e.target.value)}
                                />
                        </div>
                        <div className='input'>
                            <label htmlFor='bio'>Bio:</label>
                            <input
                                type='text'
                                placeholder='Your Bio...'
                                className='input-style'
                                name='bio'
                                autoComplete='off'
                                value={bio}
                                id='bio'
                                onChange={(e) => setBio(e.target.value)}
                                />
                        </div>
                        <div className='input'>
                            <label htmlFor='profile-pic'>Profile picture:</label>
                            <input
                                type='file'
                                className='input-style'
                                name='profile-pic'
                                id='profile-pic'
                                onChange={(e) => setPicture(e.target.files[0])}
                            />
                        </div>
                        <button className='submit-btn'>
                            Update
                        </button>
                    </div>
                </form>
                {
                    apiError && (
                        <div className='error-alert'>
                                <span>{apiError}</span>
                        </div>
                    )
                }
            </div>
        </div>
    );
}
export default UpdateProfile;
