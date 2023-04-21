import { useForm } from 'react-hook-form';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import usersAPI from '../apiHandlers/users.js';

const Register = () =>
{
    const [apiError, setApiError] = useState();
    let navigate = useNavigate();

    const {
        register, handleSubmit, formState: { errors }
    } = useForm();

    const onFormSubmit = async (data) =>
    {
        const res = await usersAPI.register(data);
        if(res['statusText'] == 'Created')
        {
            const userDetails = await res['data'];
            setApiError(null);
            alert(`Account created for ${userDetails.username}. Proceed to Login.`);
            navigate('/login', { replace: true });
        }
        else
        {
            let errors = await res['data'];
            console.log(errors);
            setApiError(errors['detail']);
        }
    }

    const onErrors = (errors) => console.error(errors);


    return (
        <div className='wrapperLogin'>
            <div>
                <h2 className='titleLogin'>
                    Register:
                </h2>
                <form onSubmit={handleSubmit(onFormSubmit, onErrors)}>
                    <div className='inputs'>
                        <div className='input'>
                            <input
                                type='text'
                                placeholder='firstname'
                                className='input-style'
                                name='firstname'
                                autoComplete='off'
                                {...register('firstname', { required: '*Your firstname is required'})}
                            />
                            <span className="err">
                                {
                                    errors?.firstname && errors.firstname.message
                                }
                            </span>
                        </div>
                        <div className='input'>
                            <input
                                type='text'
                                placeholder='lastname'
                                className='input-style'
                                name='lastname'
                                autoComplete='off'
                                {...register('lastname', { required: '*Your lastname is required'})}
                            />
                            <span className="err">
                                {
                                    errors?.lastname && errors.lastname.message
                                }
                            </span>
                        </div>
                        <div className='input'>
                            <input
                                type='text'
                                placeholder='username'
                                className='input-style'
                                name='username'
                                autoComplete='off'
                                {...register('username', { required: '*Your username is required'})}
                            />
                            <span className="err">
                                {
                                    errors?.username && errors.username.message
                                }
                            </span>
                        </div>
                        <div className='input'>
                            <input
                                type='text'
                                placeholder='youremail@email.com'
                                className='input-style'
                                name='email'
                                autoComplete='off'
                                {...register('email', { required: '*Your email is required'})}
                            />
                            <span className="err">
                                {
                                    errors?.email && errors.email.message
                                }
                            </span>
                        </div>
                        <div className='input'>
                            <input
                                type='password'
                                placeholder='yourpassword'
                                className='input-style'
                                name='password'
                                {...register('password', { required: '*Your password is required'})}
                            />
                            <span className="err">
                                {
                                    errors?.password && errors.password.message
                                }
                            </span>
                        </div>
                        <button className='submit-btn'>
                            Register
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
export default Register;
