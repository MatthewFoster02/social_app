import { Link } from "react-router-dom";
import { useState } from "react";

import whiteHeart from '../images/like-white.png';
import redHeartHollow from '../images/like-red-hollow.png';
import comment from '../images/comment-white.png';
import postsAPI from '../apiHandlers/posts.js';
import './Post.css';

const Post = ({post}) => 
{
    const { author, comments, content, date_posted, likes, _id, author_profile_pic, author_username } = post;
    const [likeVal, setLikeVal] = useState(likes);
    const [heartImage, setHeartImage] = useState(whiteHeart);

    const addLike = (e) =>
    {
        e.preventDefault();
        postsAPI.like(_id);
        setLikeVal(likeVal + 1);
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
                <div className="likes"> 
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
                </div>
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
