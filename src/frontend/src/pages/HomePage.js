import HomeHeader from "../components/HomeHeader.js";
import DisplayPosts from "../components/DisplayPosts.js";
import "./HomePage.css";

const HomePage = () => 
{
    return (
        <div className="wrapperHP">
            <HomeHeader />
            <DisplayPosts />
        </div>
    );
}
export default HomePage;
