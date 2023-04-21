import { useState } from 'react';
import { useNavigate } from "react-router-dom";
import { useForm } from 'react-hook-form';

import '../style/AddComment.css';
import useAuth from '../hooks/useAuth.js';
import postsAPI from '../apiHandlers/posts.js';

const AddComment = ({id}) => 
{
    const { auth, setAuth } = useAuth();
    const [apiError, setApiError] = useState();
    let navigate = useNavigate();

    const {
        register, handleSubmit, formState: { errors }
    } = useForm();

    const addComment = async (content) =>
    {
        console.log('Comment: '+content.comment);
        if(!auth?.username)
        {
            setApiError('Need to be logged in to add a comment...');
            return;
        }
        const comment_res = await postsAPI.comment(id.id,
        {
            'author': auth.id,
            'content': content.comment,
            'date_posted': Date.now(),
            'likes': 0,
            'author_profile_pic': auth.profile_pic,
            'author_username': auth.username,
            'comment': true
        }, auth.token);
        if(comment_res['statusText'] === 'Created')
        {
            navigate('/', { replace: false });
        }
        else
        {
            let errors = await comment_res['data'];
            console.log(errors);
            setApiError(errors['detail']);
        }
    }

    const onErrors = (errors) => console.error(errors);

    return (
        <div className="wrapperAC">
            <form onSubmit={handleSubmit(addComment, onErrors)}>
                <div className="searchbar">
                    <input
                        type="text"
                        placeholder="Have your say!"
                        className="comment-input"
                        autoComplete="off"
                        name="comment"
                        id="comment"
                        {...register('comment', { required: '*Some text required for comment'})}
                    />
                    <button className="comment-submit">
                        Comment
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
    );
}
export default AddComment;
