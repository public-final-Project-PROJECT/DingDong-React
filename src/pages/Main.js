import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getStoredProfile } from "../utils/localStorage";
import { fetchFromAPI } from "../utils/api";

const Main = () => {
    const savedProfile = localStorage.getItem("googleProfile");
    const navigate = useNavigate();

    useEffect(() => {
        if (!savedProfile) {
            navigate("/login");
        }
    }, [savedProfile, navigate]);

    const [teacherId, setTeacherId] = useState(0);
    const [profile] = useState(getStoredProfile);

    useEffect(() => {
        const fetchTeacherId = async () => {
            try {
                const data = await fetchFromAPI(`/user/${profile.email}`, {
                    method: "GET",
                    headers: { "Content-Type": "application/json" },
                });
                setTeacherId(data);
            } catch (err) {
                console.error(err);
            }
        };

        fetchTeacherId();
    }, [profile.email]);

    useEffect(() => {
        const fetchClassCount = async () => {
            if (teacherId === 0) return;

            try {
                const data = await fetchFromAPI(`/class/count/${teacherId}`, {
                    method: "GET",
                    headers: { "Content-Type": "application/json" },
                });

                if (data === 0) {
                    alert("생성된 학급이 존재하지 않아 학급 생성 페이지로 이동합니다.");
                    navigate("/classmaker");
                }
            } catch (err) {
                console.error("Error fetching class count: ", err);
            }
        };

        fetchClassCount();
    }, [teacherId, navigate]);

    return <p>메인화면</p>;
};

export default Main;
