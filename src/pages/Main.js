import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUserData } from "../hooks/useUserData";
import Neis from "@my-school.info/neis-api";
import Calendar from "./Calendar";
import "../asset/css/Calendar.css";
import { useAuth } from "../contexts/AuthContext";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import "../asset/css/Main.css"

const Main = () => {
    const { teacherId, classCount, schoolName } = useUserData();
    const { profile } = useAuth(); 
    const [responseData, setResponseData] = useState(null);
    const [error, setError] = useState(null);
    const [date, setDate] = useState("20241130");
    const [meal, setMeal] = useState([]);
    const navigate = useNavigate();

    const API_KEY = process.env.REACT_APP_FETCH_NEIS_KEY;

    useEffect(() => {
        const delayCheck = setTimeout(() => {
            if (profile) {
                if (teacherId > 0) {
                    if (classCount === 0) {
                        alert("학급 정보가 존재하지 않아 생성 페이지로 이동합니다.");
                        navigate("/classmaker");
                    }
                }
            }
        }, 80);
    
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
    }, [date, API_KEY, schoolName]);

    function cleanMealData(mealData) {
        return mealData.DDISH_NM.replace(/<br\/>/g, ', ').replace(/[^가-힣a-zA-Z, ]/g, '');
      }


    return (
        <>


            <div className="innerMain main-page">

                {/* {meal.length > 0 && <pre>{JSON.stringify(meal[0], null, 4)}</pre>} */}
                <div className="mainlunch">
                    <div id="carouselExample" className="carousel slide" data-bs-ride="true">
                        <div className="carousel-inner">
                            <div className="carousel-item active" width="400" height="200">
                                <img src="https://via.placeholder.com/400x200" className="d-block w-100"
                                     alt="First slide" />
                                <div className="carousel-caption d-none d-md-block">
                                    {meal.length > 0 ? (
                                        <>
                                            <h2>오늘의 급식</h2>
                                            <h5>{meal[0].MLSV_YMD}</h5>
                                            <p>{cleanMealData(meal[0])}</p>
                                            <p>Calories: {meal[0].CAL_INFO}</p>
                                        </>
                                    ) : (
                                        <p>Loading...</p>
                                    )}
                                </div>
                            </div>
                            <div className="carousel-item">
                                <img src="https://via.placeholder.com/400x200" className="d-block w-100"
                                     alt="Second slide" width="400" height="200"/>
                                <div className="carousel-caption d-none d-md-block">
                                    {meal.length > 0 ? (
                                        <>
                                            <h2>내일의 급식</h2>
                                            <h5>{meal[1].MLSV_YMD}</h5>
                                            <p>{cleanMealData(meal[1])}</p>
                                            <p>Calories: {meal[1].CAL_INFO}</p>
                                        </>
                                    ) : (
                                        <p>Loading...</p>
                                    )}
                                </div>
                            </div>
                            <div className="carousel-item">
                                <img src="https://via.placeholder.com/400x200" className="d-block w-100"
                                     alt="Third slide" width="800" height="400"/>
                                <div className="carousel-caption d-none d-md-block">
                                    {meal.length > 0 ? (
                                        <>
                                            <h2>모래의 급식</h2>
                                            <h5>{meal[2].MLSV_YMD}</h5>
                                            <p>{cleanMealData(meal[2])}</p>
                                            <p>Calories: {meal[2].CAL_INFO}</p>
                                        </>
                                    ) : (
                                        <p>Loading...</p>
                                    )}
                                </div>
                            </div>
                        </div>
                        <button className="carousel-control-prev" type="button" data-bs-target="#carouselExample"
                                data-bs-slide="prev">
                            <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                            <span className="visually-hidden">Previous</span>
                        </button>
                        <button className="carousel-control-next" type="button" data-bs-target="#carouselExample"
                                data-bs-slide="next">
                            <span className="carousel-control-next-icon" aria-hidden="true"></span>
                            <span className="visually-hidden">Next</span>
                        </button>
                    </div>




                </div>
                <div className="custom-calendar">
                    <Calendar showControls={false}/>
                </div>

            </div>

        </>
    );
};


export default Main;
