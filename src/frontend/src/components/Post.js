import { Link } from "react-router-dom";

const Post = ({post}) => 
{
    const { author, comments, content, date_posted, likes, _id, author_profile_pic, author_username } = post;

    return (
        <div className="post-layout">
            <div className="profile-info">
                <img src={author_profile_pic} className="profile-pic" />
                <Link to={`/posts/${_id}`}>{author_username}</Link>
            </div>
            <p className="post-content">
                {content}
            </p>
            <div className="statistics">
                <div className="likes">
                    <img src="../images/like-white.png" className="like-img" />
                    <p>{likes}</p>
                </div>
                <div className="comments">
                    <img src="../images/like-white.png" className="like-img" />
                    <p>{
                        comments ? comments.length : 0    
                    }</p>
                </div>
            </div>
        </div>
    );
}
export default Post;
