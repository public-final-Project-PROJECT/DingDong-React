import { Outlet } from "react-router-dom";
import TopHeader from "../component/TopHeader";

const Layout = () => {
    return (
        <>
        <TopHeader/>
        <Outlet/>
        </>
    )
}

export default Layout;