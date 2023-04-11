import { useForm } from 'react-hook-form';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import useAuth from '../hooks/useAuth.js';
import usersAPI from '../apiHandlers/users.js';
import './Login.css';

const Login = () =>
{
    const [apiError, setApiError] = useState();
    const { setAuth } = useAuth();
    let navigate = useNavigate();

    const {
        register, handleSubmit, formState: { errors }
    } = useForm();

    const onFormSubmit = async (data) =>
    {
        const res = await usersAPI.login(data);
        console.log(res);
        if(res['statusText'] == 'OK')
        {
            const userDetails = await res['data'];
            let userAuth = {
                'username': userDetails['user']['username'],
                'email': userDetails['user']['email'],
                'token': userDetails['token']
            }
            setAuth(userAuth);
            setApiError(null);
            navigate('/', { replace: true });
        }
        else
        {
            console.log('here');
            let errors = await res['data'];
            console.log(errors);
            setApiError(errors['detail']);
            setAuth(null);
        }
    }

    const onErrors = (errors) => console.error(errors);

    return (
        <div className='wrapperLogin'>
            <div>
                <h2 className='titleLogin'>
                    Login:
                </h2>
                <form onSubmit={handleSubmit(onFormSubmit, onErrors)}>
                    <div className='inputs'>
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
                            Login
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
export default Login;
