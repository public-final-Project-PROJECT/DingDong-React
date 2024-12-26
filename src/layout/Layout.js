import { Outlet } from "react-router-dom";
import TopHeader from "../component/TopHeader";
import SmallTimer from '../pages/SmallTimer';
import { TimerProvider } from '../pages/TimerContext';

const Layout = () => {
    return (
        <TimerProvider>
            <TopHeader/>
            <Outlet/>
            <SmallTimer/>
        </TimerProvider>
    )
}

export default Layout;