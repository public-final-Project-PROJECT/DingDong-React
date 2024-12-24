import { GoogleOAuthProvider } from "@react-oauth/google";
import GoogleLoginButton from "../component/GoogleLoginButton";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../asset/css/Login.css";

const Login = () => {
    const clientId = process.env.REACT_APP_OAUTH2_GOOGLE_CLIENT_ID;
    const savedProfile = localStorage.getItem("googleProfile");
    const navigate = useNavigate();

    useEffect(() => {
        if (savedProfile) {
            navigate("/");
        }
    }, [savedProfile, navigate]);

    return (
        <div>
            <h1 className="logo">대충 이 쯤에<br/>로고가 있으면<br/>좋을 것 같다.<br/>아님 말고</h1>
            <div className="Login">
            <GoogleOAuthProvider clientId={clientId}>
                <GoogleLoginButton />
            </GoogleOAuthProvider>
            </div>
        </div>
    );
};

export default Login;
