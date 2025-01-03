import { useState, useEffect, useMemo } from "react";
import { fetchFromAPI } from "../utils/api";
import { clearProfileFromStorage, getStoredProfile } from "../utils/localStorage";
import { useNavigate } from "react-router-dom";
import { googleLogout } from "@react-oauth/google";

export const useUserData = () => 
{
    const [profile, setProfile] = useState(getStoredProfile);
    const [teacherId, setTeacherId] = useState(0);
    const [schoolName, setSchoolName] = useState("");
    const [isSchoolNameEditable, setIsSchoolNameEditable] = useState(true);
    const [classCount, setClassCount] = useState(0);
    const [classList, setClassList] = useState([]);
    const [selectedClassId, setSelectedClassId] = useState(() => 
    {
        const storedId = localStorage.getItem("selectedClassId");
        return storedId ? Number(storedId) : null;
    });
    const email = useMemo(() => profile?.email, [profile]);
    const navigate = useNavigate();

    useEffect(() => 
    {
        if (profile?.email) 
        {
            fetchUserData(profile.email);
        }
    }, [profile]);

    useEffect(() => 
    {
        if (teacherId > 0) 
        {
            fetchClassCount();
            fetchClassList();
            fetchClassId();
        }
    }, [teacherId]);

    const fetchUserData = async (email) => 
    {
        try {
            await fetchTeacherId(email);
            await fetchSchoolName(email);
        } catch (error) {
            console.error("Error fetching user data:", error);
        }
    };

    // 선생님 테이블 pk 가져오기
    const fetchTeacherId = async (email) => 
    {
        try {
            const response = await fetchFromAPI(`/user/${email}`);
            setTeacherId(response);
        } catch (error) {
            console.error("Error fetching teacher ID:", error);
        }
    };

    // 선생님 테이블 school_name column 가져오기
    const fetchSchoolName = async (email) => 
    {
        try {
            const response = await fetchFromAPI(`/user/get/school/${email}`, 
            {
                method: "GET",
                headers: { "Content-Type": "application/json" },
            });
            if (response.status === 404) 
            {
                setSchoolName("");
                setIsSchoolNameEditable(true);
            } else if (response?.schoolName) 
            {
                setSchoolName(response.schoolName);
                setIsSchoolNameEditable(false);
            }
        } catch (error) {
            console.error("Error fetching school name:", error);
        }
    };

    const fetchClassCount = async () => 
    {
        try {
            const response = await fetchFromAPI(`/class/count/${teacherId}`, 
            {
                method: "GET",
                headers: { "Content-Type": "application/json" },
            });
            setClassCount(response > 0 ? response : 0);
        } catch (error) {
            console.error("Error fetching class count:", error);
        }
    };

    const fetchClassList = async () => 
    {
        try {
            const response = await fetchFromAPI(`/class/teacher/${teacherId}`);
            setClassList(response);
        } catch (error) {
            console.error("Error fetching class list:", error);
        }
    };

    const fetchClassId = async () => 
    {
        try {
            const response = await fetchFromAPI(`/user/get/class/${email}`);
            setSelectedClassId(response.latestClassId);
        } catch (error) {
            console.error("Error fetching class id:", error);
        }
    };    

    // 로그아웃
    const Logout = () => 
    {
        googleLogout();
        clearProfileFromStorage();
        localStorage.removeItem("selectedClassId");
        navigate("/login");
    };

    return {
        profile,
        setProfile,
        email,
        fetchUserData,
        teacherId,
        schoolName,
        setSchoolName,
        isSchoolNameEditable,
        classCount,
        classList,
        fetchClassCount,
        selectedClassId,
        setSelectedClassId,
        fetchClassId,
        Logout,
    };
};
