import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Students = () => {

    const classId = 1; 
    const [students , setStudents] = useState([]);

    const navigate = useNavigate();

        
    useEffect(() => {
        axios
            .get("http://localhost:3013/api/students/view", {
                params: { classId },
            })
            .then((response) => {
                console.log(response.data)
                setStudents(response.data);
            })
            .catch((error) => {
                console.error("Error fetching students:", error);
            });
    }, []);


    const studentDetail = (studentId) =>{
        console.log(studentId)
        navigate(`./${studentId}`)
    }


    return (
    <>
         <h1>학생 인적사항</h1>
        {students.length === 0 ? (
            <p>학생이 없습니다.</p>
            ) : (
                <ul>
                    {students.map((student) =>(
                        <li key={student.studentId                        }
                        onClick={() => studentDetail(student.studentId)}>
                        <p>{student.studentName}</p>

                        </li>
                    ))}
                </ul>
            )}
         
    </>
    )
}
export default Students;