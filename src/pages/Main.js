import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Main = () => {
    const savedProfile = localStorage.getItem("googleProfile");
    const navigate = useNavigate();

    useEffect(() => {
        if (!savedProfile) {
            navigate("/login");
        }
    }, [savedProfile, navigate]);

    return (
        <p>메인화면</p>
    );
}
export default Main;