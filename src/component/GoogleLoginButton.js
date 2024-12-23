import { GoogleLogin, googleLogout, useGoogleLogin } from "@react-oauth/google";
import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";

const GoogleLoginButton = () => {
    const [profile, setProfile] = useState(() => {
        const savedProfile = localStorage.getItem("googleProfile");
        return savedProfile ? JSON.parse(savedProfile) : null;
    });

    const onSuccess = (codeResponse) => {
        const decode = jwtDecode(codeResponse.credential);
        setProfile(decode);
        console.log(decode);
        localStorage.setItem("googleProfile", JSON.stringify(decode));
    };

    const logOut = () => {
        googleLogout();
        setProfile(null);
        localStorage.removeItem("googleProfile");
    };

    // const login = useGoogleLogin({
    //     onSuccess: (codeResponse) => setUser(codeResponse),
    //     onError: (error) => console.log('Login Failed:', error)
    // });

    // useEffect(() => {
    //     if (user) {
    //         axios.get(`https://www.googleapis.com/oauth2/v1/userinfo?access_token=${user.access_token}`,
    //             {headers: {Authorization: `Bearer ${user.access_token}`, Accept: 'application/json'}})
    //             .then((res) => {
    //                 setProfile(res.data);
    //             })
    //             .catch((err) => console.log(err));
    //     }
    // },[user]);

    useEffect(() => {
        const savedProfile = localStorage.getItem("googleProfile");
        if (savedProfile) {
            console.log("Loaded profile from storage:", JSON.parse(savedProfile));
        }
    }, []);

    return (
        <div>
            {!profile ? (
                <div>
                    <GoogleLogin onSuccess={onSuccess} onError={(error) => console.log("Login Failed:", error)} />
                    {/* <button onClick={login}></button> */}
                </div>
            ) : (
                <div>
                    <img src={profile.picture} alt="profile" />
                    <p>이름: {profile.name}</p>
                    <p>이메일: {profile.email}</p>
                    <button onClick={logOut}>Log out</button>
                </div>
            )}
        </div>
    );
};

export default GoogleLoginButton;
