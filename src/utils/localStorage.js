export const getStoredProfile = () => 
{
    const savedProfile = localStorage.getItem("googleProfile");
    return savedProfile ? JSON.parse(savedProfile) : null;
};

export const saveProfileToStorage = (profile) => 
{
    localStorage.setItem("googleProfile", JSON.stringify(profile));
};

export const clearProfileFromStorage = () => 
{
    localStorage.removeItem("googleProfile");
};
