import { useEffect, useState } from 'react';

import './Comments.css';
import postsAPI from '../apiHandlers/posts.js';
import Post from './Post.js';

const Comments = ({id}) => 
{
    const [comments, setComments] = useState(null);
    const [noComments, setNoComments] = useState();
    const [isPending, setIsPending] = useState(true);
    const [apiError, setApiError] = useState();

    useEffect(() =>
    {
        async function fetchComments()
        {
            const commentsData = await postsAPI.getComments(id.id);
            if(commentsData['statusText'] === 'OK')
            {
                const commentsList = await commentsData['data'];
                setComments(commentsList);
                setIsPending(false);
                setApiError(null);
                setNoComments(null);
            }
            else if(commentsData['statusText'] === 'Accepted')
            {
                const message = await commentsData['data'];
                console.log(message);
                setNoComments(message['message']);
                setApiError(null);
                setComments(null);
                setIsPending(false);
            }
            else
            {
                const errors = await commentsData['data'];
                console.log(errors);
                setApiError(errors['data']);
                setIsPending(null);
                setComments(null);
                setNoComments(null);
            }
        }
        fetchComments();
    }, []);

    return (
        <div className="wrapperC">
            {
                isPending && <div>
                    <h2>Loading Comments...</h2>
                </div>
            }
            {
                comments && comments.map((el) =>
                {
                    return (
                        <Post key={el._id} post = {el} />
                    )
                }
                )
            }
            {
                noComments && <div className='noComments'>
                    {noComments}
                </div>
            }
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
export default Comments;
