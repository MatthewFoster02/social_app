import { Link } from "react-router-dom";

import './ProfilePreview.css';

const ProfilePreview = ({profile}) => 
{
    const { profile_pic, username } = profile;
    return (
        <Link className="profile-preview">
            <img src={profile_pic} className="profile-pic-search" alt="" />
            <p className="username-search">{username}</p>
        </Link>
    );
}
export default ProfilePreview;
