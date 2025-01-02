import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FaPlus } from "react-icons/fa";
import NoticeInsert from "./NoticeRegister"; // NoticeInsert 컴포넌트 import
import "../asset/css/NoticeList.css"; // CSS 파일 임포트

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
        navigate(`./${noticeId}`);
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
        <div className="notice-container">
            <div className="notice-header">
                <h1 style={{ textAlign: 'center' }}>공지사항</h1>
                <button
                onClick={Register}
                    style={{ backgroundColor: '#427422', borderRadius: '10px', fontWeight: 'bold',   fontSize: '20px',  color: 'white', padding: '10px 20px' }}>
                     <FaPlus /> 작성하기</button>
            </div>

            {currentNotices.length === 0 ? (
                <p>공지사항이 없습니다.</p>
            ) : (
                <div>
                    <table className="notice-table">
                        <thead>
                            <tr>
                                <th>번호</th>
                                <th>카테고리</th>
                                <th>제목</th>
                                <th>내용</th>
                                <th>작성일/수정일</th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentNotices.map((notice, index) => (
                                <tr key={notice.noticeId} onClick={() => noticeDetail(notice.noticeId)}>
                                    <td>{index + 1 + currentPage * noticesPerPage}</td>
                                    <td>{notice.noticeCategory}</td>
                                    <td className="ellipsis">{notice.noticeTitle}</td>
                                    <td className="ellipsis">
                                        {notice.noticeContent.length > 10
                                            ? `${notice.noticeContent.substring(0, 10)}...`
                                            : notice.noticeContent}
                                    </td>
                                    <td>{new Date(notice.updatedAt || notice.createdAt).toLocaleString()}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

<div className="page-navigation">
    <button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 0}>
        이전
    </button>
    <span>
        {currentPage + 1} / {Math.ceil(notices.length / noticesPerPage)}
    </span>
    <button
        onClick={() => handlePageChange(currentPage + 1)}
        disabled={currentPage >= Math.ceil(notices.length / noticesPerPage) - 1}
    >
        다음
    </button>
</div>

            {/* 모달 */}
            {isModalOpen && (
                <div className="notice-modal">
                    <div className="notice-modal-content">
                        <NoticeInsert closeModal={closeModal} />
                    </div>
                </div>
            )}
        </div>
    );
};

export default Notice;