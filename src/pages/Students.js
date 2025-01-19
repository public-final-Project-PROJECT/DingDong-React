import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../asset/css/Student.css"; // CSS 파일 임포트
import { useUserData } from "../hooks/useUserData";

const Students = () => {

    
    const [students , setStudents] = useState([]);

    const navigate = useNavigate();

      const {
            selectedClassId
        } = useUserData();

        
    // useEffect(() => {
    //     axios
    //         .get("http://localhost:3013/api/students/view", {
    //             params: { classId },
    //         })
    //         .then((response) => {

    //             setStudents(response.data);
    //         })
    //         .catch((error) => {
    //             console.error("Error fetching students:", error);
    //         });
    // }, []);

         
    useEffect(() => {
        axios
            .get("http://localhost:3013/api/students/viewClass", {
                params: { classId : selectedClassId},
            })
            .then((response) => {
                console.log(response.data)
                setStudents(response.data);
            })
            .catch((error) => {
                console.error("Error fetching students:", error);
            });
    }, [selectedClassId]);


    const studentDetail = (studentId) =>{
        console.log(studentId)
        navigate(`./${studentId}`)
    }

    const grade = students.length > 0 ? students[0].grade : null;
    const classNo = students.length > 0 ? students[0].classNo : null;
    const schoolName = students.length > 0 ? students[0].schoolName : null;



    return (
        <div className="studentCard">
            <h1 className="studentDatail">학생 인적사항</h1>
            {students.length === 0 ? (
                <p>학생이 없습니다.</p>
            ) : (
                <>
                    {/* 학교 정보, 학년/반 */}
                    <div className="class-header">
                        {schoolName && grade && classNo && (
                            <h2>{schoolName} - {grade}학년 {classNo}반</h2>
                        )}
                    </div>

                  
                    {/* 학생 목록 */}
                    <div className="student-list">
                        {students.map((student, index) => (
                            <div 
                                key={student.studentId} 
                                className="student-card" 
                                onClick={() => studentDetail(student.studentId)}
                                >
                                <h3>{index + 1}번 {student.studentName}</h3>
                                <p>{student.grade}학년 {student.classNo}반</p>
                                <p>전화번호: {student.studentPhone}</p>
                            </div>
                        ))}
                    </div>
                </>
            )}
        </div>
    );
};

export default Students;