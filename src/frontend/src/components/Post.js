import { Link } from "react-router-dom";

import like from '../images/like-white.png';
import comment from '../images/comment-white.png';
import './Post.css';

const Post = ({post}) => 
{
    const { author, comments, content, date_posted, likes, _id, author_profile_pic, author_username } = post;

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
                    <img src={like} className="like-img" />
                    <p>{likes}</p>
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
