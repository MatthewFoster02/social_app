import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";

import '../style/ShowPost.css';
import whiteHeart from '../images/like-white.png';
import redHeartHollow from '../images/like-red-hollow.png';
import redHeartFilled from '../images/like-red-filled.png';
import comment from '../images/comment-white.png';
import postsAPI from '../apiHandlers/posts.js';
import AddComment from '../components/AddComment.js';
import Comments from '../components/Comments.js';
import useAuth from "../hooks/useAuth.js";

const ShowPost = () => 
{
    const { auth } = useAuth();
    const { id } = useParams();
    const [post, setPost] = useState({});
    const [isPending, setIsPending] = useState(true);
    const [apiError, setApiError] = useState();
    const [datePosted, setDatePosted] = useState('');
    const [likeVal, setLikeVal] = useState(0);
    const [postLiked, setPostLiked] = useState(false);
    const navigate = useNavigate();

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
                setLikeVal(postData.likes);
                if(postData.likers == null || postData.likers.length === 0) setPostLiked(false);
                else
                {
                    if(postData.likers.includes(auth.id)) setPostLiked(true);
                    else setPostLiked(false);
                }

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
    }, [id, auth.id]);

    const deletePost = async () =>
    {
        const deleted_result = await postsAPI.delete(id, auth.token, post.comment);
        if(deleted_result['statusText'] === 'No Content')
        {
            setPost(null);
            alert('Post successfully deleted.');
            navigate('/', { replace: true }); 
        }
        else
        {
            const errors = await deleted_result['data'];
            console.log(errors);
            setApiError(errors['detail']);
        }
    }

    const [heartImage, setHeartImage] = useState(whiteHeart);

    const addLike = () =>
    {
        if(auth.id)
        {
            postsAPI.like(id, {'userID': auth.id});
            setLikeVal(likeVal + 1);
            setPostLiked(true);
        }
    }

    const removeLike = () =>
    {
        if(auth.id)
        {
            postsAPI.unlike(id, {'userID': auth.id});
            setLikeVal(likeVal - 1);
            setPostLiked(false);
        }
    }

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
                    <div className="pic-delete">
                        <img src={post.author_profile_pic} className="post-profile-picture" alt="" />
                        {
                            auth.id === post.author && <button className="delete-post" onClick={deletePost}>Delete Post</button>
                        }
                    </div>
                    <p className="post-content">{post.content}</p>
                </div>
                <div className="post-stats">
                    <div className="post-stats-left">
                        {
                            !postLiked ? <div className="likes"> 
                                <button className="like-btn" onClick={addLike}>
                                <img
                                    src={heartImage}
                                    alt="Heart"
                                    width="50"
                                    height="50"
                                    className="like-img"
                                    onMouseOver={() => setHeartImage(redHeartHollow)}
                                    onMouseOut={() => setHeartImage(whiteHeart)}
                                />
                                </button>
                                <p>{likeVal}</p>
                            </div> : <div className="likes"> 
                                <button className="like-btn" onClick={removeLike}>
                                <img
                                    src={redHeartFilled}
                                    alt="Heart"
                                    width="50"
                                    height="50"
                                    className="like-img"
                                />
                                </button>
                                <p>{likeVal}</p>
                            </div>
                        }
                        <div className="comments">
                            <img src={comment} className="comment-img" alt="" />
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
            <AddComment id={{'id': id}} />
            <Comments id={{'id': id}} />
        </div>
    );
}
export default ShowPost;
