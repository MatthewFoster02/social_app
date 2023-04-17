import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

import './UpdateProfile.css';
import usersAPI from '../apiHandlers/users.js';
import useAuth from '../hooks/useAuth.js';

const UpdateProfile = () => 
{
    const { auth, setAuth } = useAuth();
    const [apiError, setApiError] = useState();
    let navigate = useNavigate();

    const {
        register, handleSubmit, formState: { errors }
    } = useForm();

    const onFormSubmit = async () =>
    {
        // get the file input element from the form
        const imageFile = document.getElementById('profile-pic').files[0];

        // create a new FormData object
        const formData = new FormData();

        // append the image file to the FormData object
        formData.append('profile-picture', imageFile);

        // append other form data fields as needed
        formData.append('username', 'JohnDoe');
        formData.append('bio', 'Hello, I am John Doe!');

        // send the form data using Axios
        const updated_user = await usersAPI.update(auth.id, formData, auth.token);
    }

    const onErrors = (errors) => console.error(errors);

    return (
        <div className='wrapperLogin'>
            <div>
                <h2 className='titleLogin'>
                    Update Profile:
                </h2>
                <form onSubmit={handleSubmit(onFormSubmit, onErrors)}>
                    <div className='inputs'>
                        <div className='input'>
                            <label htmlFor='username'>Username:</label>
                            <input
                                type='text'
                                placeholder='username'
                                className='input-style'
                                name='username'
                                autoComplete='off'
                                value={auth.username}
                                id='username'
                                {...register('username', { required: '*Your username is required'})}
                            />
                            <span className="err">
                                {
                                    errors?.username && errors.username.message
                                }
                            </span>
                        </div>
                        <div className='input'>
                            <label htmlFor='bio'>Bio:</label>
                            <input
                                type='text'
                                placeholder='Your Bio...'
                                className='input-style'
                                name='bio'
                                autoComplete='off'
                                value={auth.bio}
                                id='bio'
                                {...register('bio', { required: '*Your bio is required'})}
                            />
                            <span className="err">
                                {
                                    errors?.bio && errors.bio.message
                                }
                            </span>
                        </div>
                        <div className='input'>
                            <label htmlFor='profile-pic'>Profile picture:</label>
                            <input
                                type='file'
                                className='input-style'
                                name='profile-pic'
                                id='profile-pic'
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
