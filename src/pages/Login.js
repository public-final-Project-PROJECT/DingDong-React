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
        <div className="Login">
            <GoogleOAuthProvider clientId={clientId}>
                <GoogleLoginButton />
            </GoogleOAuthProvider>
        </div>
    );
};

export default Login;
