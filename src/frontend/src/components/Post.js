import { Link } from "react-router-dom";
import { useState } from "react";

import whiteHeart from '../images/like-white.png';
import redHeartHollow from '../images/like-red-hollow.png';
import redHeartFilled from '../images/like-red-filled.png';
import comment from '../images/comment-white.png';
import postsAPI from '../apiHandlers/posts.js';
import './Post.css';
import useAuth from "../hooks/useAuth.js";

const Post = ({post}) => 
{
    const { auth, setAuth } = useAuth();
    const { author, comments, content, date_posted, likes, _id, author_profile_pic, author_username, likers } = post;
    const [likeVal, setLikeVal] = useState(likes);
    const [postLiked, setPostLiked] = useState(likers.includes(auth.id));
    const [heartImage, setHeartImage] = useState(whiteHeart);

    const addLike = (e) =>
    {
        e.preventDefault();
        if(auth.id)
        {
            postsAPI.like(_id, {'userID': auth.id});
            setLikeVal(likeVal + 1);
            setPostLiked(true);
        }
    }

    const removeLike = (e) =>
    {
        e.preventDefault();
        if(auth.id)
        {
            postsAPI.unlike(_id, {'userID': auth.id});
            setLikeVal(likeVal - 1);
            setPostLiked(false);
        }
    }

    return (
        <Link to={`/post/${_id}`} className="post-layout">
            <div className="profile-info">
                <Link to={`/profile/${author}`}><img src={author_profile_pic} className="profile-pic" /></Link>
                <Link to={`/profile/${author}`} className="profile-name">{author_username}</Link>
            </div>
            <p className="post-content">
                {content}
            </p>
            <div className="statistics">
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
                    <img src={comment} className="comment-img" />
                    <p>{
                        comments ? comments.length : 0    
                    }</p>
                </div>
            </div>
        </Link>
    ); // Add like and comment functionality
}
export default Post;
