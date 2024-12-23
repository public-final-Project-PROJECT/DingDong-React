import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

const NoticeDetail = ()=>{
    const [notices,setNotices] = useState([]);

    const navigate = useNavigate();

    const{id}= useParams();

    useEffect(()=>{
        axios.get(`http://localhost:3013/api/notice/detail/${id}`)
            .then(response=>{
                setNotices(response.data);
            })
            .catch(error => {
                console.error("Error fetching notices:", error);
            });
    },[]);


    //수정
    const noticeUpdate = async (id)=>{

        alert("수정모드로 가기~");
    }

    //삭제
    const noticeDelete = async (id)=>{
        const isConfirmed = window.confirm("정말로 삭제하시겠습니까?")

        if(isConfirmed){
          try {
            alert("공지사항이 삭제 되었습니다");
            
          } catch (error) {
            console.error("삭제 오류",error)
            alert("삭제 실패.");
            
          }
        }else{
            alert("삭제가 취소 되었습니다.")
        }


    }

    return(
        <>
        <p>{id}번 공지사항</p>
        {notices.map((notice) => (
            <div key={notice.noticeId}> 
                <h1>{notice.noticeTitle}</h1>
                <small>{new Date(notice.createdAt).toLocaleString()}</small><br/>
                <small>{notice.noticeCategory}</small>
                <p>{notice.noticeContent}</p>
            </div>
        ))}
        <button onClick={()=>noticeUpdate(id)}>수정하기</button>
        <button onClick={()=>noticeDelete(id)}>삭제하기</button>


    </>
    );


}
export default NoticeDetail;