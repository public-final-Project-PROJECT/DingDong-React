
import Neis from "@my-school.info/neis-api";
import React, { useState, useEffect } from 'react';
import Calendar from "./Calendar";
import "../asset/css/Calendar.css";

const Main = () => {
  const [responseData, setResponseData] = useState(null);
  const [error, setError] = useState(null);
  const [date,setDate] = useState("20241130");
  const [meal,setMeal] = useState([]);

  const API_KEY = process.env.REACT_APP_FETCH_NEIS_KEY;
  

  useEffect(() => {
   
    const neis = new Neis({ 
      KEY: API_KEY, 
      Type: "json" 
    });

    const LoadLunch = async () => {
      try {
        // 해당 함수는 특정 학교 정보 API 호출
        const schoolInfo = await neis.getSchoolInfo({ SCHUL_NM: "한세사이버보안고등학교" });
        const mealInfo = await neis.getMealInfo({ ATPT_OFCDC_SC_CODE: schoolInfo[0].ATPT_OFCDC_SC_CODE,
           SD_SCHUL_CODE: schoolInfo[0].SD_SCHUL_CODE, MLSV_FROM_YMD: date });
        setResponseData(schoolInfo);
        setMeal(mealInfo);
      } catch (err) {
        setError(err.message);
        console.error('Error fetching data:', err);
      }
    };

   
    LoadLunch();

  }, []);

  return (
    <>
      <Calendar/>
      <form onSubmit={(e) => e.preventDefault()}> {/* 버튼 클릭 시 페이지 리로드 방지 */}
        <label htmlFor="testInput">Test Input:</label>
        <button type="submit">Submit</button>
      </form>

      {/* 응답 데이터 출력 */}
      { <pre>{JSON.stringify(meal[0], null, 2)}</pre>}
      {/* 에러 메시지 출력 */}
      {error && <p style={{ color: 'red' }}>Error: {error}</p>}
    </>
  );
};

export default Main;

