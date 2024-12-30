import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function AttendanceTotal() {
    const classId = 1; // 클래스 ID
    const [students, setStudents] = useState([]); // 학생 목록
    const [attendanceDate, setAttendanceDate] = useState(""); // 전체 날짜 상태

    const nevigate = useNavigate();

    useEffect(() => {
        // 학생 목록 가져오기 (출석 데이터와 별개)
        axios
        .get("http://localhost:3013/api/students/view", {
            params: { classId },
        })
            .then((response) => {
                const studentList = response.data.map((student) => ({
                    ...student,
                    attendanceId: null,
                    attendanceState: "",
                    attendanceEtc: "",
                }));
                setStudents(studentList);
            })
            .catch((error) => {
                console.error("Error fetching student data:", error);
            });
    }, [classId]);

    useEffect(() => {
        if (!attendanceDate) return; // 날짜가 선택되지 않았을 경우 데이터 요청 안 함

        // 선택한 날짜의 출석 정보 가져오기
        axios
            .get(`http://localhost:3013/api/attendance/view/${classId}`, {
                params: { attendanceDate },
            })
            .then((response) => {
                const attendanceData = response.data;

                // 학생 목록과 출석 데이터를 병합
                setStudents((prevStudents) =>
                    prevStudents.map((student) => {
                        const attendance = attendanceData.find(
                            (att) => att.studentId === student.studentId
                        );
                        return {
                            ...student,
                            attendanceId: attendance ? attendance.attendanceId : null,
                            attendanceState: attendance ? attendance.attendanceState : "",
                            attendanceEtc: attendance ? attendance.attendanceEtc : "",
                        };
                    })
                );
            })
            .catch((error) => {
                console.error("Error fetching attendance data:", error);
            });
    }, [attendanceDate, classId]);

    const handleAttendanceChange = (studentId, state) => {
        setStudents((prevStudents) =>
            prevStudents.map((student) =>
                student.studentId === studentId
                    ? { ...student, attendanceState: state }
                    : student
            )
        );
    };

    const handleEtcChange = (studentId, etc) => {
        setStudents((prevStudents) =>
            prevStudents.map((student) =>
                student.studentId === studentId
                    ? { ...student, attendanceEtc: etc }
                    : student
            )
        );
    };

    const handleDateChange = (newDate) => {
        setAttendanceDate(newDate); // 전체 날짜 상태 업데이트
    };

    const studentDetail = (studentId)=>{
        nevigate(`/Students/${studentId}`);
        
    }

    const handleSubmit = () => {
        const dataToSend = students.map((student) => ({
            attendanceId: student.attendanceId,
            studentId: student.studentId,
            attendanceDate,
            attendanceState: student.attendanceState,
            attendanceEtc: student.attendanceEtc,
            classId,
        }));
          
        axios
            .post("http://localhost:3013/api/attendance/register", dataToSend)
            .then((response) => {
                console.log("Data submitted successfully:", response.data);
                alert("출석 정보가 성공적으로 저장되었습니다!");
            })
            .catch((error) => {
                console.error("Error submitting data:", error);
                alert("출석 정보 저장에 실패했습니다.");
            });
    };

    return (
        <div>
            <h2>출석부</h2>
            <table border="1" style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                    <tr>
                        <th>번호</th>
                        <th>이름</th>
                        <th>학번</th>
                        <th>
                            날짜
                            <input
                                type="date"
                                value={attendanceDate}
                                onChange={(e) => handleDateChange(e.target.value)}
                                style={{ marginLeft: "10px" }}
                            />
                        </th>
                        <th>출석 여부</th>
                        <th>출석 상태</th>
                        <th>사유</th>
                    </tr>
                </thead>
                <tbody>
                    {students.length > 0 ? (
                        students.map((student, index) => (
                            <tr key={student.studentId}>
                                <td>{index + 1}</td>
                                <td onClick={()=>studentDetail(student.studentId)}>{student.studentName || ""}</td>
                                <td>{student.studentId}</td>
                                <td>
                                    <input
                                        type="date"
                                        value={attendanceDate}
                                        readOnly
                                        style={{ backgroundColor: "#f5f5f5" }}
                                    />
                                </td>
                                <td>
                                    <div>
                                        <label>
                                            <input
                                                type="radio"
                                                name={`attendance-${student.studentId}`}
                                                value="출석"
                                                checked={student.attendanceState === "출석"}
                                                onChange={() => handleAttendanceChange(student.studentId, "출석")}
                                            />
                                            출석
                                        </label>
                                        <label>
                                            <input
                                                type="radio"
                                                name={`attendance-${student.studentId}`}
                                                value="결석"
                                                checked={student.attendanceState === "결석"}
                                                onChange={() => handleAttendanceChange(student.studentId, "결석")}
                                            />
                                            결석
                                        </label>
                                        <label>
                                            <input
                                                type="radio"
                                                name={`attendance-${student.studentId}`}
                                                value="지각"
                                                checked={student.attendanceState === "지각"}
                                                onChange={() => handleAttendanceChange(student.studentId, "지각")}
                                            />
                                            지각
                                        </label>
                                        <label>
                                            <input
                                                type="radio"
                                                name={`attendance-${student.studentId}`}
                                                value="조퇴"
                                                checked={student.attendanceState === "조퇴"}
                                                onChange={() => handleAttendanceChange(student.studentId, "조퇴")}
                                            />
                                            조퇴
                                        </label>
                                    </div>
                                </td>
                                <td>{student.attendanceState || "상태 없음"}</td>
                                <td>
                                    <input
                                        type="text"
                                        value={student.attendanceEtc || ""}
                                        onChange={(e) => handleEtcChange(student.studentId, e.target.value)}
                                        placeholder="사유 입력"
                                    />
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="7" style={{ textAlign: "center" }}>
                                데이터를 가져오는 중입니다...
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
            <button onClick={handleSubmit} style={{ marginTop: "20px" }}>
                제출/수정
            </button>
        </div>
    );
}

export default AttendanceTotal;