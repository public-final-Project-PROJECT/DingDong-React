
import React, { useEffect, useState } from "react";
import axios from "axios";

const Notice = () => {
    const [notices, setNotices] = useState([]);  

    useEffect(() => {
        axios.get("/notice/view")  
            .then(response => {
                setNotices(response.data);
            })
            .catch(error => {
                console.error("Error fetching notices:", error);
            });
    }, []);  

    return (
        <div>
            <h1>공지사항 페이지</h1>
            {notices.length === 0 ? (
                <p>공지사항이 없습니다.</p>
            ) : (
                <ul>
                    {notices.map((notice) => (
                        <li key={notice.id}>
                            <h2>{notice.noticeTitle}</h2>
                            <p>{notice.noticeContent}</p>
                            <small>{new Date(notice.createdAt).toLocaleString()}</small>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};


export default Notice;