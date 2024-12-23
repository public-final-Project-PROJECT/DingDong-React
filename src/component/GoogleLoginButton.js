import { GoogleLogin } from "@react-oauth/google";
import { useState } from "react";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";
import { fetchFromAPI } from "../utils/api";
import { getStoredProfile, saveProfileToStorage } from "../utils/localStorage";

const GoogleLoginButton = () => 
{
    const navigate = useNavigate();
    const [profile, setProfile] = useState(getStoredProfile);

    const handleLoginSuccess = async (codeResponse) => 
    {
        try {
            const decoded = jwtDecode(codeResponse.credential);
            setProfile(decoded);
            saveProfileToStorage(decoded);

            await fetchFromAPI("/user/login", 
            {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    name: decoded.name,
                    email: decoded.email,
                    picture: decoded.picture,
                }),
            });

            navigate("/");
        } catch (err) {
            console.error("Error during login:", err);
        }
    };

    return (
        <div>
            {!profile ? (
                <GoogleLogin
                    onSuccess={handleLoginSuccess}
                    onError={(error) => console.error("Login Failed:", error)}
                />
            ) : (
                <div>
                    <button onClick={() => navigate("/profile")}>
                        <img src={profile.picture} alt="profile" />
                    </button>
                </div>
            )}
        </div>
    );
};

export default GoogleLoginButton;
