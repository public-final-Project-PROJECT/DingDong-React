import { useEffect, useState } from "react";
import { getStoredProfile } from "../utils/localStorage";
import { fetchFromAPI } from "../utils/api";

const ClassList = () =>
{
    const [profile] = useState(getStoredProfile);
    const [teacherId, setTeacherId] = useState(0);
    const [classCount, setClassCount] = useState(0);
    const [list, setList] = useState([]);

    useEffect(() => 
    {
        const initializeData = async () => 
        {
            await fetchTeacherId();
        };
        initializeData();
    }, []);

    useEffect(() => 
    {
        if (teacherId > 0) 
        {
            fetchClassCount();
            fetchClass();
        }
    }, [teacherId]);

    const fetchTeacherId = async () => 
    {
        try {
            const data = await fetchFromAPI(`/user/${profile.email}`, 
            {
                method: "GET",
                headers: { "Content-Type": "application/json" },
            });
            setTeacherId(data);
        } catch (err) {
            console.error("Error fetching teacher ID: ", err);
        }
    };

    const fetchClassCount = async () => 
    {
        try {
            const data = await fetchFromAPI(`/class/count/${teacherId}`, 
            {
                method: "GET",
                headers: { "Content-Type": "application/json" },
            });
            setClassCount(data >= 0 ? data : 0);
        } catch (err) {
            console.error("Error fetching class count: ", err);
        }
    };

    const fetchClass = async () => 
    {
        try {
            const data = await fetchFromAPI(`/class/teacher/${teacherId}`, 
            {
                method: "GET",
                headers: { "Content-Type": "application/json" },
            });
            setList(data);
            console.log(data);
        } catch (err) {
            console.error("Error fetching class: ", err);
        }
    };

    return (
        <div>
            {/* data 보여주기 */}
        </div>
    );
}

export default ClassList;