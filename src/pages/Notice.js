import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FaRegSmile } from 'react-icons/fa'; 
import { FaPlus } from 'react-icons/fa'; 


const Notice = () => {
    const [notices, setNotices] = useState([]);
    
    const navigate = useNavigate();

    useEffect(() => {
        axios.get("http://localhost:3013/api/notice/view")  
            .then(response => {
                setNotices(response.data);
            })


            .catch(error => {
                console.error("Error fetching notices:", error);
            });
    }, []); 

    const noticeDetail = (noticeId)=>{
        console.log(noticeId);
        navigate(`/${noticeId}`)
    }
   
    return (
        <div>

            <h1>공지사항 페이지</h1>  <button ><FaPlus/> 작성하기</button>
            {notices.length === 0 ? (
                <p>공지사항이 없습니다.</p>
            ) : (
                <ul>
                    {notices.map((notice) => (
                        <li key={notice.noticeId} onClick={()=>noticeDetail(notice.noticeId)}>
                            <p>{notice.noticeId}</p>
                            <small>{notice.noticeCategory}</small>
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