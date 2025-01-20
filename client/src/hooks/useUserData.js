import { useState, useEffect } from "react";
import { fetchFromAPI } from "../utils/api";
import { useAuth } from "../contexts/AuthContext";

export const useUserData = () => 
{
    const { profile } = useAuth();
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
            await Promise.all([fetchTeacherId(email), fetchSchoolName(email)]);
        } catch (error) {
            console.error("Error fetching user data:", error);
        }
    };

    const fetchTeacherId = async (email) => 
    {
        try {
            const response = await fetchFromAPI(`/user/${email}`);
            setTeacherId(response);
        } catch (error) {
            console.error("Error fetching teacher ID:", error);
        }
    };

    const fetchSchoolName = async (email) => 
    {
        try {
            const response = await fetchFromAPI(`/user/get/school/${email}`, 
            {
                method: "GET",
                headers: { "Content-Type": "application/json" }
            });
            if (response.status === 404) 
            {
                setSchoolName("");
                setIsSchoolNameEditable(true);
            } 
            else if (response?.schoolName) 
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
                headers: { "Content-Type": "application/json" }
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
            const response = await fetchFromAPI(`/user/get/class/${profile?.email}`);
            setSelectedClassId(response);
            localStorage.setItem("selectedClassId", response);
        } catch (error) {
            console.error("Error fetching class id:", error);
        }
    };

    return {
        fetchUserData,
        teacherId,
        schoolName,
        setSchoolName,
        isSchoolNameEditable,
        classCount,
        classList,
        selectedClassId,
        setSelectedClassId,
        fetchClassId
    };
};
