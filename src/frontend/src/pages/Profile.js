import { useParams } from "react-router-dom";
import './Profile.css';

const Profile = () => 
{
    const { id } = useParams();

    return (
        <div className="wrapper-profile">PROFILE {id}</div>
    );
}
export default Profile;
