import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FaPlus } from "react-icons/fa";
import NoticeInsert from "./NoticeRegister";  // NoticeInsert 컴포넌트 import

const Notice = () => {
    const [notices, setNotices] = useState([]);
    const [currentPage, setCurrentPage] = useState(0);
    const [noticesPerPage] = useState(8); // 페이지당 표시할 게시물 수
    const [isModalOpen, setIsModalOpen] = useState(false); // 모달 열기/닫기 상태

    const navigate = useNavigate();
    const classId = 1; // 예시로 설정된 classId

    useEffect(() => {
        axios
            .get("http://localhost:3013/api/notice/view", {
                params: { classId },
            })
            .then((response) => {
                setNotices(response.data);
            })
            .catch((error) => {
                console.error("Error fetching notices:", error);
            });
    }, []);

    // 현재 페이지에 표시할 데이터 계산
    const indexOfLastNotice = (currentPage + 1) * noticesPerPage;
    const indexOfFirstNotice = indexOfLastNotice - noticesPerPage;
    const currentNotices = notices.slice(indexOfFirstNotice, indexOfLastNotice);

    const handlePageChange = (page) => {
        if (page >= 0 && page < Math.ceil(notices.length / noticesPerPage)) {
            setCurrentPage(page);
        }
    };

    const noticeDetail = (noticeId) => {
        navigate(`/${noticeId}`);
    };

    const Register = () => {
        setIsModalOpen(true); // 모달 열기
    };

    const closeModal = () => {
        setIsModalOpen(false); // 모달 닫기
        // Fetch notices again after submission
        axios
            .get("http://localhost:3013/api/notice/view", {
                params: { classId },
            })
            .then((response) => {
                setNotices(response.data);
            })
            .catch((error) => {
                console.error("Error fetching notices:", error);
            });
    };

    return (
        <div>
            <div style={{ width: "90%", margin: "0 auto", marginBottom: "20px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <h1>공지사항 페이지</h1>
                    <button onClick={Register} style={{ marginLeft: "auto" }}>
                        <FaPlus /> 작성하기
                    </button>
                </div>
            </div>

            {currentNotices.length === 0 ? (
                <p>공지사항이 없습니다.</p>
            ) : (
                <div style={{ width: "90%", margin: "0 auto" }}>
                    <table border="1" style={{ width: "100%", borderCollapse: "collapse" }}>
                        <thead style={{ backgroundColor: "#d4edda" }}>
                            <tr>
                                <th style={{ textAlign: "center", width: "10%", borderBottom: "2px solid #ddd" }}>번호</th>
                                <th style={{ textAlign: "center", width: "30%", borderBottom: "2px solid #ddd" }}>제목</th>
                                <th style={{ textAlign: "center", width: "15%", borderBottom: "2px solid #ddd" }}>카테고리</th>
                                <th style={{ textAlign: "center", width: "30%", borderBottom: "2px solid #ddd" }}>내용</th>
                                <th style={{ textAlign: "center", width: "25%", borderBottom: "2px solid #ddd" }}>작성일/수정일</th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentNotices.map((notice, index) => (
                                <tr
                                    key={notice.noticeId}
                                    onClick={() => noticeDetail(notice.noticeId)}
                                    style={{ borderBottom: "1px solid #ddd" }}
                                >
                                    <td style={{ textAlign: "center", borderRight: "1px solid #ddd" }}>
                                        {index + 1 + currentPage * noticesPerPage}
                                    </td>
                                    <td style={{ textAlign: "center" }}>{notice.noticeCategory}</td>
                                    <td style={{ textAlign: "center", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                                        {notice.noticeTitle}
                                    </td>
                                    <td style={{ textAlign: "center", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                                        {notice.noticeContent}
                                    </td>
                                    <td style={{ textAlign: "center" }}>
                                        {new Date(notice.updatedAt || notice.createdAt).toLocaleString()}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            <div style={{ textAlign: "center", marginTop: "20px" }}>
                <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 0}
                    style={{ marginRight: "10px" }}
                >
                    이전
                </button>
                <span>
                    {currentPage + 1} / {Math.ceil(notices.length / noticesPerPage)}
                </span>
                <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === Math.ceil(notices.length / noticesPerPage) - 1}
                    style={{ marginLeft: "10px" }}
                >
                    다음
                </button>
            </div>

            {/* 모달 */}
            {isModalOpen && (
                <div style={{
                    position: "fixed",
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundColor: "rgba(0, 0, 0, 0.5)",
                    zIndex: 1000,
                }}>
                    <div style={{
                        position: "absolute",
                        top: "20%",
                        left: "50%",
                        transform: "translateX(-50%)",
                        backgroundColor: "#fff",
                        padding: "20px",
                        width: "50%",
                        borderRadius: "10px",
                    }}>
                        <NoticeInsert closeModal={closeModal} />
                    </div>
                </div>
            )}
        </div>
    );
};

export default Notice;