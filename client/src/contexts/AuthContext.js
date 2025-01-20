import { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => 
{
    const [profile, setProfile] = useState(() => 
    {
        const storedProfile = localStorage.getItem("googleProfile");
        return storedProfile ? JSON.parse(storedProfile) : null;
    });
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => 
    {
        if (profile?.email)
        {
            setLoading(false);
        } 
        else
        {
            navigate("/login");
        }
    }, [profile, navigate]);

    const login = (profileData) => 
    {
        localStorage.setItem("googleProfile", JSON.stringify(profileData));
        setProfile(profileData);
    };

    return (
        <AuthContext.Provider value={{ profile, setProfile, login, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
