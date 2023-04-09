import { Outlet } from "react-router-dom";

import LeftSidebar from "./LeftSidebar.js";
import RightSidebar from "./RightSidebar.js";
import "./Layout.css";

const Layout = ({children}) =>
{
    return (
        <div className="layout">
            <LeftSidebar />
            <main>
                <Outlet />
                <div>{children}</div>
            </main>
            <RightSidebar />
        </div>
    );
}
export default Layout;
