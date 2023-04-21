import Search from "./Search.js";
import About from "./About.js";
import '../style/RightSidebar.css';

const RightSidebar = () => 
{
    return (
        <div className="wrapperRS">
            <Search />
            <About />
        </div>
    );
}
export default RightSidebar;
