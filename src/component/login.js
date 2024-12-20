import { useState } from "react";
import { useGoogleLogin } from "@react-oauth/google";
import { fetchFromAPI } from "../utils/api";

const Login = () => 
{
    const [user, setUser] = useState(null);

    const googleSocialLogin = useGoogleLogin({
        scope: "email profile",
        onSuccess: async (tokenResponse) => 
        {
            try {
                const data = await fetchFromAPI("/login/oauth2/code/google", 
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ token: tokenResponse.access_token }),
                });
                setUser(data);
                console.log(data);
                localStorage.setItem("userToken", data.token);
            } catch (error) {
                console.error(error);
                alert("Login failed. Please try again.");
            }
        },
        onError: () => 
        { 
            alert("Google login failed. Please try again.");
        },
        flow: "auth-code",
        prompt: "select_account",
    });

    return (
        <div>
            {!user ? (
                <button onClick={googleSocialLogin} style={{ padding: 0, width: 175, height: 40 }}>
                    <img src="web_light_sq_SI.svg" alt="Sign in with Google" />
                </button>
            ) : (
                <div>
                    <img src={user?.teacherImg} alt="Profile" style={{ borderRadius: "50%" }} />
                </div>
            )}
        </div>
    );
};

export default Login;
