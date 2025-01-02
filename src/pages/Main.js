import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUserData } from "../hooks/useUserData";
import Neis from "@my-school.info/neis-api";
import Calendar from "./Calendar";
import "../asset/css/Calendar.css";

const Main = () => 
{
    const { profile, teacherId, classCount, schoolName } = useUserData();
    const navigate = useNavigate();

    const [responseData, setResponseData] = useState(null);
    const [error, setError] = useState(null);
    const [date, setDate] = useState("20241130");
    const [meal, setMeal] = useState([]);

    const API_KEY = process.env.REACT_APP_FETCH_NEIS_KEY;

    useEffect(() => 
    {
        const delayCheck = setTimeout(() =>
        {
            if (profile) 
            {
                if (teacherId > 0) 
                {
                    if (classCount === 0) 
                    {
                        alert("학급 정보가 존재하지 않아 생성 페이지로 이동합니다.");
                        navigate("/classmaker");
                    }
                }
            } else {
                navigate("/login");
            }
        }, 70);
    
        return () => clearTimeout(delayCheck);
    }, [profile, teacherId, classCount, navigate]);

    useEffect(() => {
        const neis = new Neis({
            KEY: API_KEY,
            Type: "json",
        });






        const loadLunch = async () => {
            try {
                const schoolInfo = await neis.getSchoolInfo({ SCHUL_NM: schoolName });
                console.log(schoolName);
                console.log(classCount);
                const mealInfo = await neis.getMealInfo({
                    ATPT_OFCDC_SC_CODE: schoolInfo[0].ATPT_OFCDC_SC_CODE,
                    SD_SCHUL_CODE: schoolInfo[0].SD_SCHUL_CODE,
                    MLSV_FROM_YMD: date,
                });
                setResponseData(schoolInfo);
                setMeal(mealInfo);
            } catch (err) {
                setError(err.message);
                console.error("Error fetching meal data:", err);
            }
        };

        loadLunch();
    }, [date, API_KEY]);

    return (
        <>
            <Calendar />
            <form onSubmit={(e) => e.preventDefault()}>
                <label htmlFor="testInput">Test Input:</label>
                <button type="submit">Submit</button>
            </form>

            {meal.length > 0 && <pre>{JSON.stringify(meal[0], null, 2)}</pre>}
            {error && <p style={{ color: "red" }}>Error: {error}</p>}
        </>
    );
};

export default Main;
    