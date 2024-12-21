import { Outlet } from "react-router-dom";
import TopHeader from "../component/TopHeader";
import SmallTimer from "../pages/SmallTimer";

const Layout = () => {
    return (
        <>
        <TopHeader/>
        <Outlet/>
        {/*<SmallTimer/>*/}
        </>
    )
}

export default Layout;