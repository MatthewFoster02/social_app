import HomeHeader from "../components/HomeHeader.js";
import DisplayPosts from "../components/DisplayPosts.js";
import "./HomePage.css";

const HomePage = () => 
{
    const id = {
        id: null
    }
    
    return (
        <div className="wrapperHP">
            <HomeHeader />
            <DisplayPosts props={id} />
        </div>
    );
}
export default HomePage;
