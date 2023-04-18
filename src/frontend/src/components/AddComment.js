import { useState } from 'react';
import { useForm } from 'react-hook-form';

import './AddComment.css';

const AddComment = () => 
{
    const [apiError, setApiError] = useState();

    const {
        register, handleSubmit, formState: { errors }
    } = useForm();

    const addComment = () =>
    {
        // ADD COMMENTw
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
                        {...register('search', { required: '*Some text required for comment'})}
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
