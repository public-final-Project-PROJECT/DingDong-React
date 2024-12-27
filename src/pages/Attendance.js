import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Attendance = () => {
    const classId = 1;
    const [attendance, setAttendance] = useState([]);
    const [selectedDate, setSelectedDate] = useState(""); // 선택된 날짜 상태 관리

    // todayDate 함수: 기본 오늘 날짜를 반환
    const getTodayDate = () => {
        const now = new Date();
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, "0"); // 두 자리 수로 맞추기
        const date = String(now.getDate()).padStart(2, "0");
        return `${year}-${month}-${date}`;
    };

    // 날짜 선택 핸들러
    const handleDateChange = (event) => {
        setSelectedDate(event.target.value);
    };

    // 기본적으로 오늘 날짜를 설정
    useEffect(() => {
        if (!selectedDate) {
            setSelectedDate(getTodayDate()); // 날짜 선택이 없으면 오늘 날짜로 설정
        }
    }, [selectedDate]);

    useEffect(() => {
        if (!selectedDate) return; // 선택된 날짜가 없으면 API 요청하지 않음

        // Axios 요청
        axios
            .get(`http://localhost:3013/api/attendance/view/${classId}`, {
                params: { todayDate: selectedDate }, // 선택된 날짜를 전달
            })
            .then((response) => {
                setAttendance(response.data); // 출석 데이터 설정
                console.log(response.data);
            })
            .catch((error) => {
                console.error("Error fetching attendance:", error);
            });
    }, [classId, selectedDate]); // classId 또는 selectedDate가 변경될 때마다 실행

    const navigate = useNavigate();

    const attedanceInsert = ()=>{
         navigate(`./insert`)
    }

    return (
        <div>
            <h2>출석부 페이지</h2>
            
            {/* 날짜 선택 */}
            <div>
                <label htmlFor="date">날짜 선택: </label>
                <input
                    type="date"
                    id="date"
                    value={selectedDate || getTodayDate()} // 선택된 날짜가 없으면 오늘 날짜로 설정
                    onChange={handleDateChange}
                />
            </div>

            {/* 선택된 날짜에 해당하는 출석 데이터 표시 */}
            <table border="1">
                <thead>
                    <tr>
                        <th>학생 ID</th>
                        <th>출석 상태</th>
                        <th>비고</th>
                        <th>출석 날짜</th>
                        <th>수업 ID</th>
                    </tr>
                </thead>
                <tbody>
                    {attendance.length > 0 ? (
                        attendance.map((item, index) => (
                            <tr key={index}>
                                <td>{item.studentId.studentName}</td> {/* 학생 이름 */}
                                <td>{item.attendanceState}</td> {/* 출석 상태 */}
                                <td>{item.attendanceEtc || "-"}</td> {/* 비고 */}
                                <td>{item.attendanceDate}</td> {/* 출석 날짜 */}
                                <td>{item.classId}</td> {/* 수업 ID */}
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="5">출석 데이터가 없습니다.</td>
                        </tr>
                    )}
                </tbody>
            </table>

            <button onClick={attedanceInsert}>출석부르기</button>
        </div>
    );
};

export default Attendance;