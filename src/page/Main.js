import React, { useState } from 'react';

const Main = () => {
    // 컴포넌트 최상단에서 상태 정의
    const [responseData, setResponseData] = useState(null);
    const [error, setError] = useState(null);

    const LoadLunch = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch(
                "https://open.neis.go.kr/hub/mealServiceDietInfo?ATPT_OFCDC_SC_CODE=T10&SD_SCHUL_CODE=9290083",
                {
                    method: "GET",
                    headers: { "Content-Type": "application/json" },
                }
            );

            // JSON 데이터 추출
            const data = await response.json();
            setResponseData(data); // 응답 데이터 상태에 저장
            setError(null); // 에러 초기화
            console.log("Response:", data);
        } catch (err) {
            setError(err.message); // 에러 메시지 저장
            console.error("Error fetching data:", err);
        }
    };

    return (
        <>
            <form onSubmit={LoadLunch}>
                <label htmlFor="testInput">Test Input:</label>
                <button type="submit">Submit</button>
            </form>

            
            {responseData && <pre>{JSON.stringify(responseData, null, 2)}</pre>}
            {error && <p style={{ color: "red" }}>Error: {error}</p>}
        </>
    );
};

export default Main;
