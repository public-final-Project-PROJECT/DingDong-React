import axios from "axios";
import { useEffect, useState } from "react";

function AttendanceRegister() {
    const classId = 1; // 클래스 ID
    const [students, setStudents] = useState([]);
    const [attendanceDate, setAttendanceDate] = useState(""); // 전체 날짜 상태

    useEffect(() => {
        axios
            .get("http://localhost:3013/api/students/view", {
                params: { classId },
            })
            .then((response) => {
                console.log(response.data);
                setStudents(
                    response.data.map((student) => ({
                        ...student,
                        attendanceState: "",
                        attendanceEtc: "", 
                    }))
                );
            })
            .catch((error) => {
                console.error("Error fetching students:", error);
            });
    }, []);

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

    const handleSubmit = () => {
        const dataToSend = students.map((student) => ({
            studentId: student.studentId,
            attendanceDate,
            attendanceState: student.attendanceState,
            attendanceEtc: student.attendanceEtc,
            classId, // 클래스 ID 포함
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
                                <td>{index + 1}</td> {/* 번호 */}
                                <td>{student.studentName || ""}</td> {/* 학생 이름 */}
                                <td>
                                    <input
                                        type="date"
                                        value={attendanceDate} // 전체 날짜 상태를 표시
                                        readOnly // 개별 필드는 수정 불가
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
                                                onChange={() =>
                                                    handleAttendanceChange(student.studentId, "출석")
                                                }
                                            />
                                            출석
                                        </label>
                                        <label>
                                            <input
                                                type="radio"
                                                name={`attendance-${student.studentId}`}
                                                value="결석"
                                                checked={student.attendanceState === "결석"}
                                                onChange={() =>
                                                    handleAttendanceChange(student.studentId, "결석")
                                                }
                                            />
                                            결석
                                        </label>
                                        <label>
                                            <input
                                                type="radio"
                                                name={`attendance-${student.studentId}`}
                                                value="지각"
                                                checked={student.attendanceState === "지각"}
                                                onChange={() =>
                                                    handleAttendanceChange(student.studentId, "지각")
                                                }
                                            />
                                            지각
                                        </label>
                                        <label>
                                            <input
                                                type="radio"
                                                name={`attendance-${student.studentId}`}
                                                value="조퇴"
                                                checked={student.attendanceState === "조퇴"}
                                                onChange={() =>
                                                    handleAttendanceChange(student.studentId, "조퇴")
                                                }
                                            />
                                            조퇴
                                        </label>
                                    </div>
                                </td>
                                <td>{student.attendanceState || "상태 없음"}</td> {/* 상태 표시 */}
                                <td>
                                    <input
                                        type="text"
                                        value={student.attendanceEtc || ""}
                                        onChange={(e) =>
                                            handleEtcChange(student.studentId, e.target.value)
                                        }
                                        placeholder="사유 입력"
                                    />
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="6" style={{ textAlign: "center" }}>
                                데이터를 가져오는 중입니다...
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
            <button onClick={handleSubmit} style={{ marginTop: "20px" }}>
                제출
            </button>
        </div>
    );
}

export default AttendanceRegister;