import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "../asset/css/StudentDetail.css"; // CSS 파일 임포트
const StudentDetail = () => {
    const classId = 1;
    const [student, setStudent] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false); // 모달 상태 관리
    const [memo, setMemo] = useState(""); // 메모 입력값 관리

    const { id } = useParams();

    useEffect(() => {
        axios
            .get(`http://localhost:3013/api/students/view/${id}`, {
                params: { classId },
            })
            .then((response) => {
                setStudent(response.data[0]);
                console.log(response.data);
            })
            .catch((error) => {
                console.error("Error fetching students:", error);
            });
    }, [id]);

    // 모달 열기/닫기 핸들러
    const handleOpenModal = () => {
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
    };

    const handleKeyDown = (event) => {
        if (event.key === "Enter") {
            event.preventDefault(); // 기본 동작 방지 (줄바꿈 방지)
            handleSaveMemo(); // 저장 핸들러 호출
        }
    };

    const handleSaveMemo = () => {
        axios
        .post(`http://localhost:3013/api/students/updateMemo/${id}`, memo, 
            {
                headers: { "Content-Type": "text/plain" },
            }
        )
        .then((response) => {
            console.log("메모 업데이트 성공:", response.data);
            alert("메모가 성공적으로 저장되었습니다.");
            handleCloseModal(); // 모달 닫기

            axios
            .get(`http://localhost:3013/api/students/view/${id}`, {
                params: { classId },
            })
            .then((response) => {
                setStudent(response.data[0]); // 학생 데이터를 새로 설정
            })
            .catch((error) => {
                console.error("학생 데이터를 갱신하는 중 오류:", error);
            });
        
        handleCloseModal(); // 모달 닫기
    })
    .catch((error) => {
        console.error("메모 업데이트 실패:", error);
        alert("메모 저장에 실패했습니다. 다시 시도해주세요.");

        })
        .catch((error) => {
            console.error("메모 업데이트 실패:", error);
            alert("메모 저장에 실패했습니다. 다시 시도해주세요.");
        });
    };

    return (
        <>
        <h1>학생 정보</h1>
            <p>프로필 : {student.studentImg}</p>
            <p>이름 : {student.studentName}</p>
            <p>생년월일 : {student.studentBirth}</p>
            <p>성 별 : {student.studentGender}</p>
            <p>핸드폰 : {student.studentPhone}</p>
            <p>주소 : {student.studentAddress}</p>
            <p>특이사항 : {student.studentEtc}</p>
            <p>보호자 : {student.parentsName}</p>
            <p>보호자 핸드폰 : {student.parentsPhone}</p>
            <p>
                메모 : {student.memo} <button onClick={handleOpenModal}>메모하기</button>
            </p>

            {/* 모달 */}
            {isModalOpen && (
                <div className="modal-overlay">
                    <div className="modal-container">
                        <h2 className="modal-title">메모 입력</h2>
                        <textarea
                            className="modal-textarea"
                            value={memo}
                            onChange={(e) => setMemo(e.target.value)}
                            onKeyDown={handleKeyDown}
                        />
                        <div className="modal-button-group">
                            <button
                                className="modal-save-button"
                                onClick={handleSaveMemo}
                            >
                                저장
                            </button>
                            <button
                                className="modal-close-button"
                                onClick={handleCloseModal}
                            >
                                닫기
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};


export default StudentDetail;