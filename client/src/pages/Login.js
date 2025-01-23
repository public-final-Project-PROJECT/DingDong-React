import { GoogleOAuthProvider } from "@react-oauth/google";
import GoogleLoginButton from "../component/GoogleLoginButton";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../asset/css/Login.css";
import { useAuth } from "../contexts/AuthContext";

const Login = () => 
{
    const clientId = process.env.REACT_APP_OAUTH2_GOOGLE_CLIENT_ID;
    const { profile } = useAuth();
    const navigate = useNavigate();

    useEffect(() => 
    {
        if (profile) 
        {
            navigate("/"); 
        }
    }, [profile, navigate]);

    return (
        <div>
            <img src="/logo.png" className="logo" alt="logo" />
            {/* <span className="message">교사와 초등학생을 위한 학급 관리 시스템</span> */}
            <div className="Login">
            <GoogleOAuthProvider clientId={clientId}>
                <GoogleLoginButton />
            </GoogleOAuthProvider>
            </div>
        </div>
    );
};

export default Login;
