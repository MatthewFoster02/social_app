import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";

import './ShowPost.css';
import like from '../images/like-white.png';
import comment from '../images/comment-white.png';
import postsAPI from '../apiHandlers/posts.js';
import AddComment from '../components/AddComment.js';
import Comments from '../components/Comments.js';

const ShowPost = () => 
{
    const { id } = useParams();
    const [post, setPost] = useState({});
    const [isPending, setIsPending] = useState(true);
    const [apiError, setApiError] = useState();
    const [datePosted, setDatePosted] = useState('');

    useEffect(() =>
    {
        async function fetchPost()
        {
            const post_res = await postsAPI.getPostByID(id);
            if(post_res['statusText'] === 'OK')
            {
                const postData = await post_res['data'];
                const dateMillisecs = postData.date_posted;
                const date = new Date(dateMillisecs);
                const day = date.getDate();
                const month = date.getMonth() + 1;
                const year = date.getFullYear();
                setDatePosted(`${day}/${month}/${year}`);

                setPost(postData);
                setIsPending(false);
                setApiError(null);
            }
            else
            {
                const errors = await post_res['data'];
                console.log(errors);
                setApiError(errors['detail']);
                setIsPending(false);
            }
        }
        fetchPost();
    }, []);

    return (
        <div className='wrapperSP'>
            {
                isPending && <div>
                    <h2>Loading Profile...</h2>
                </div>
            }
            <h2 className="postUsername">
                {post.author_username}
            </h2>
            <div className="post-container">
                <div className="post-main">
                    <img src={post.author_profile_pic} className="post-profile-picture" alt="" />
                    <p className="post-content">{post.content}</p>
                </div>
                <div className="post-stats">
                    <div className="post-stats-left">
                        <div className="likes"> 
                            <img src={like} className="like-img" />
                            <p>{post.likes}</p>
                        </div>
                        <div className="comments">
                            <img src={comment} className="comment-img" />
                            <p>{
                                post.comments ? post.comments.length : 0
                            }</p>
                        </div>
                    </div>
                    <div className="date-posted">
                        {datePosted}
                    </div>
                </div>
                {
                    apiError && (
                        <div className='error-alert'>
                                <span>{apiError}</span>
                        </div>
                    )
                }
            </div>
            <AddComment />
            <Comments />
        </div>
    );
}
export default ShowPost;
