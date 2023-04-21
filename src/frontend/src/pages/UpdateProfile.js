import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

import '../style/UpdateProfile.css';
import usersAPI from '../apiHandlers/users.js';
import postsAPI from '../apiHandlers/posts.js';
import useAuth from '../hooks/useAuth.js';

const UpdateProfile = () => 
{
    const { auth, setAuth } = useAuth();
    const birthMillisecs = auth.birthday;
    const date = new Date(birthMillisecs);

    const [apiError, setApiError] = useState();
    const [username, setUsername] = useState(auth.username);
    const [bio, setBio] = useState(auth.bio);
    const [picture, setPicture] = useState(null);
    const [day, setDay] = useState(date.getDate());
    const [month, setMonth] = useState(date.getMonth() + 1);
    const [year, setYear] = useState(date.getFullYear());
    let navigate = useNavigate();

    const handleSubmit = async (e) =>
    {
        e.preventDefault();
        const formData = new FormData();

        if(picture != null)
        {
            formData.append('profile_picture', picture);
        }
        formData.append('username', username);
        formData.append('bio', bio);

        const date = new Date(year, month-1, day);
        const birthday = date.getTime();
        formData.append('birthday', birthday);
        
        const updated_user = await usersAPI.update(auth.id, formData, auth.token);
        if(updated_user['statusText'] === 'OK')
        {
            const userDetails = await updated_user['data'];
            let userAuth = {
                'id': userDetails['_id'],
                'username': userDetails['username'],
                'email': userDetails['email'],
                'profile_pic': userDetails['profile_pic'],
                'bio': userDetails['bio'],
                'birthday': userDetails['birthday'],
                'token': auth.token
            }
            setAuth(userAuth);
            setApiError(null);
            postsAPI.updatePostPictures({
                'authorID': userDetails['_id'],
                'profile_pic_url': userDetails['profile_pic']
            });
            navigate('/', { replace: true });
        }
        else
        {
            let errors = await updated_user['data'];
            console.log(errors);
            setApiError(errors['detail']);
        }
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
                            <label>Birthday: </label>
                            <div className="birthday-inputs">
                                <input
                                    type='number'
                                    placeholder='DD'
                                    className='input-style'
                                    name='day'
                                    autoComplete='off'
                                    id='day'
                                    value={day}
                                    onChange={(e) => setDay(e.target.value)}
                                />
                                <input
                                    type='number'
                                    placeholder='MM'
                                    className='input-style'
                                    name='month'
                                    autoComplete='off'
                                    id='month'
                                    value={month}
                                    onChange={(e) => setMonth(e.target.value)}
                                />
                                <input
                                    type='number'
                                    placeholder='YYYY'
                                    className='input-style'
                                    name='year'
                                    autoComplete='off'
                                    id='year'
                                    value={year}
                                    onChange={(e) => setYear(e.target.value)}
                                />
                            </div>
                        </div>
                        <div className='input'>
                            <label htmlFor='profile-pic'>Profile picture:</label>
                            <input
                                type='file'
                                className='input-style'
                                name='profile-pic'
                                id='profile-pic'
                                onChange={(e) => setPicture(e.target.files[0])}
                                required
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
