import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FaPlus } from "react-icons/fa";
import NoticeInsert from "./NoticeRegister"; 
import "../asset/css/NoticeList.css"; 
import { useUserData } from "../hooks/useUserData";

const Notice = () => {
    const [notices, setNotices] = useState([]);
    const [currentPage, setCurrentPage] = useState(0);
    const [noticesPerPage] = useState(8); 
    const [isModalOpen, setIsModalOpen] = useState(false); 

    const navigate = useNavigate();
   

        const {
            schoolName,
            selectedClassId
        } = useUserData();

    useEffect(() => {
        axios
            .get("http://localhost:3013/api/notice/view", {
                params: { classId : selectedClassId},
            })
            .then((response) => {
                setNotices(response.data);
            })
            .catch((error) => {
                console.error("Error fetching notices:", error);
            });
    }, []);


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
  
        axios
            .get("http://localhost:3013/api/notice/view", {
                params: { classId : selectedClassId},
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
                <h1>공지사항</h1>
                <button
                onClick={Register}>
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
                        <tbody className="notice-tbody">
                            {currentNotices.map((notice, index) => (
                                <tr key={notice.noticeId} onClick={() => noticeDetail(notice.noticeId)}>
                                    <td>{index + 1 + currentPage * noticesPerPage}</td>
                                    <td>{notice.noticeCategory}</td>
                                    <td className="noticeTitle">{notice.noticeTitle}</td>
                                    <td className="noticeContent">
                                        {notice.noticeContent.length > 15
                                            ? `${notice.noticeContent.substring(0, 30)}...`
                                            : notice.noticeContent}
                                    </td>
                                    <td className="notice-content-date">{new Date(notice.updatedAt || notice.createdAt).toLocaleString()}</td>
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

            {isModalOpen && (
    <div className="notice-modal"onClick={closeModal} >
        <div
            className="notice-modal-content"
            onClick={(e) => e.stopPropagation()} >
            <NoticeInsert closeModal={closeModal} />
        </div>
    </div>
)}
        </div>
    );
};

export default Notice;