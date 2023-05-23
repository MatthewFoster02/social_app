import { Outlet } from "react-router-dom";

import LeftSidebar from "./LeftSidebar.js";
import RightSidebar from "./RightSidebar.js";
import "../style/Layout.css";
import HeaderNav from "./Header.js";

const Layout = ({children}) =>
{
    return (
        <div className="wrapperLayout">
            <LeftSidebar />
            <HeaderNav />
            <main>
                <Outlet />
                <div>{children}</div>
            </main>
            <RightSidebar />
        </div>
    );
}
export default Layout;
