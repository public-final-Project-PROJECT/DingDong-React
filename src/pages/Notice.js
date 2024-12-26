
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FaPlus } from "react-icons/fa";

const Notice = () => {
    const [notices, setNotices] = useState([]);
    const [currentPage, setCurrentPage] = useState(0);
    const [noticesPerPage] = useState(8); // 페이지당 표시할 게시물 수

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
        navigate("/notice/register");
    };

    return (
        <div>
            <h1>공지사항 페이지</h1>
            <button onClick={Register}>
                <FaPlus /> 작성하기
            </button>
            {currentNotices.length === 0 ? (
                <p>공지사항이 없습니다.</p>
            ) : (
                <ul>
                    {currentNotices.map((notice) => (
                        <li
                            key={notice.noticeId}
                            onClick={() => noticeDetail(notice.noticeId)}
                        >
                            <p>{notice.noticeId}</p>
                            <small>{notice.noticeCategory}</small>
                            <h2>{notice.noticeTitle}</h2>
                            <p>{notice.noticeContent}</p>
                            <small>
                                {new Date(notice.updatedAt || notice.createdAt).toLocaleString()}
                            </small>
                        </li>
                    ))}
                </ul>
            )}
            <div>
                <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 0}
                >
                    이전
                </button>
                <span>
                    {currentPage + 1} / {Math.ceil(notices.length / noticesPerPage)}
                </span>
                <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === Math.ceil(notices.length / noticesPerPage) - 1}
                >
                    다음
                </button>
            </div>
        </div>
    );
};


export default Notice;