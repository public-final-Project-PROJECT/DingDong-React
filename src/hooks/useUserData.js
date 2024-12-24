import { useState, useEffect } from "react";
import { fetchFromAPI } from "../utils/api";
import { getStoredProfile } from "../utils/localStorage";

export const useUserData = () => {
    const [profile, setProfile] = useState(getStoredProfile);
    const [teacherId, setTeacherId] = useState(0);
    const [schoolName, setSchoolName] = useState("");
    const [isSchoolNameEditable, setIsSchoolNameEditable] = useState(true);
    const [classCount, setClassCount] = useState(0);
    const [classList, setClassList] = useState([]);
    const email = profile?.email;

    useEffect(() => {
        if (profile?.email) {
            fetchUserData(profile.email);
        }
    }, [profile]);

    useEffect(() => {
        if (teacherId > 0) {
            fetchClassCount();
            fetchClassList();
        }
    }, [teacherId]);

    const fetchUserData = async (email) => {
        try {
            await fetchTeacherId(email);
            await fetchSchoolName(email);
        } catch (error) {
            console.error("Error fetching user data:", error);
        }
    };

    const fetchTeacherId = async (email) => {
        try {
            const data = await fetchFromAPI(`/user/${email}`);
            setTeacherId(data);
        } catch (error) {
            console.error("Error fetching teacher ID:", error);
        }
    };

    const fetchSchoolName = async (email) => {
        try {
            const response = await fetchFromAPI(`/user/get/school/${email}`, {
                method: "GET",
                headers: { "Content-Type": "application/json" },
            });
            if (response.status === 404) {
                setSchoolName("");
                setIsSchoolNameEditable(true);
            } else if (response?.schoolName) {
                setSchoolName(response.schoolName);
                setIsSchoolNameEditable(false);
            }
        } catch (error) {
            console.error("Error fetching school name:", error);
        }
    };

    const fetchClassCount = async () => {
        try {
            const data = await fetchFromAPI(`/class/count/${teacherId}`, {
                method: "GET",
                headers: { "Content-Type": "application/json" },
            });
            setClassCount(data >= 0 ? data : 0);
        } catch (error) {
            console.error("Error fetching class count:", error);
        }
    };

    const fetchClassList = async () => {
        try {
            const data = await fetchFromAPI(`/class/teacher/${teacherId}`);
            setClassList(data);
        } catch (error) {
            console.error("Error fetching class list:", error);
        }
    };

    return {
        profile,
        setProfile,
        email,
        teacherId,
        schoolName,
        setSchoolName,
        isSchoolNameEditable,
        classCount,
        classList,
        fetchClassCount
    };
};
