import { Link } from "react-router-dom";
import { useEffect, useState } from "react";

import whiteHeart from '../images/like-white.png';
import blackHeart from '../images/like-black.png';
import redHeartHollow from '../images/like-red.png';
import redHeartFilled from '../images/like-red-filled.png';
import whiteComment from '../images/comment-white.png';
import blackComment from '../images/comment-black.png';
import postsAPI from '../apiHandlers/posts.js';
import '../style/Post.css';
import useAuth from "../hooks/useAuth.js";

const Post = ({post}) => 
{
    const { auth } = useAuth();
    const { author, comments, content, likes, _id, author_profile_pic, author_username, likers } = post;
    const [likeVal, setLikeVal] = useState(likes);
    const [postLiked, setPostLiked] = useState(false);
    const [heartImage, setHeartImage] = useState(whiteHeart);
    const [commentImage, setCommentImage] = useState(whiteComment);

    useEffect(() =>
    {
        if(likers != null)
            if(likers.includes(auth.id)) setPostLiked(true);
    }, [auth.id, likers]);

    useEffect(() =>
    {
        const observer = new MutationObserver((mutationsList) =>
        {
            for (const mutation of mutationsList)
            {
                if (mutation.attributeName === 'data-theme')
                {
                    const newTheme = mutation.target.getAttribute('data-theme');
                    if (newTheme === 'dark')
                    {
                        setHeartImage(whiteHeart);
                        setCommentImage(whiteComment);
                    }
                    else
                    {
                        setHeartImage(blackHeart);
                        setCommentImage(blackComment);
                    }
                }
            }
        })

        observer.observe(document.body, { attributes: true });

        return () =>
        {
            observer.disconnect();
        }
    }, [heartImage]);

    useEffect(() =>
    {
        const newTheme = document.querySelector("body").getAttribute('data-theme');
        if (newTheme === 'dark')
        {
            setHeartImage(whiteHeart);
            setCommentImage(whiteComment);
        }
        else
        {
            setHeartImage(blackHeart);
            setCommentImage(blackComment);
        }
    }, []);

    const offHoverHeart = () =>
    {
        const newTheme = document.querySelector("body").getAttribute('data-theme');
        if (newTheme === 'dark')
        {
            setHeartImage(whiteHeart);
            setCommentImage(whiteComment);
        }
        else
        {
            setHeartImage(blackHeart);
            setCommentImage(blackComment);
        }
    }

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
                <Link to={`/profile/${author}`}><img src={author_profile_pic} className="profile-pic" alt="" /></Link>
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
                                onMouseOut={offHoverHeart}
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
                    <img src={commentImage} className="comment-img" alt="" />
                    <p>{
                        comments ? comments.length : 0    
                    }</p>
                </div>
            </div>
        </Link>
    ); // Add like and comment functionality
}
export default Post;
