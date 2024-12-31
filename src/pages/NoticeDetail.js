import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "../asset/css/NoticeDetail.css"; // CSS 파일 임포트


const NoticeDetail = () => {
  const [notices, setNotices] = useState([]);

  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    axios.get(`http://localhost:3013/api/notice/detail/${id}`)
      .then(response => {
        setNotices(response.data);
      })
      .catch(error => {
        console.error("Error fetching notices:", error);
      });
  }, []);

  // 수정
  const noticeUpdate = async (id) => {
    navigate(`/notice/update/${id}`);
  };

  // 삭제
  const noticeDelete = async (id) => {
    const isConfirmed = window.confirm("정말로 삭제하시겠습니까?");

    if (isConfirmed) {
      try {
        // id를 URL에 포함하여 삭제 요청을 보냄
        await axios.post(`http://localhost:3013/api/notice/delete/${id}`)
          .then(response => {
            // 삭제 성공 시 처리
            alert("공지사항이 삭제되었습니다.");
            navigate("/notice"); // 삭제 후 공지사항 목록으로 이동
          })
          .catch(error => {
            console.error("삭제 오류", error);
            alert("삭제 실패.");
          });
      } catch (error) {
        console.error("삭제 오류", error);
        alert("삭제 실패.");
      }
    } else {
      alert("삭제가 취소되었습니다.");
    }
  };

  return (
    <div className="notice-detail-container">
      <h2 className="notice-title">{id}번 공지사항</h2>
  
      {/* 공지사항 내용 */}
      {notices.map((notice) => (
        <div key={notice.noticeId} className="notice-detail">
          
          {/* 제목 */}
          <h1 className="notice-detail-title">{notice.noticeTitle}</h1>
  
          {/* 메타 정보: 작성일 + 카테고리 */}
          <div className="notice-meta">
            <small>{new Date(notice.createdAt).toLocaleString()}</small>
            <span className="notice-category">{notice.noticeCategory}</span>
          </div>
  
          {/* 본문 내용 */}
          <p className="notice-content">{notice.noticeContent}</p>
  
          {/* 이미지가 있을 경우 */}
          {notice.noticeImg && (
            <div className="notice-image">
              <img
                src={`http://localhost:3013${notice.noticeImg}`} // 서버의 이미지 경로
                alt="공지사항 이미지"
                className="notice-img"
              />
            </div>
          )}
  
          {/* 파일이 있을 경우 */}
          {notice.noticeFile && (
            <div className="notice-file">
              <h3>첨부 파일:</h3>
              <a
                href={`http://localhost:3013${notice.noticeFile}`} // 서버의 파일 경로
                target="_blank"
                rel="noopener noreferrer"
                className="notice-file-link"
              >
                다운로드
              </a>
            </div>
          )}
        </div>
      ))}
  
      {/* 수정 및 삭제 버튼 */}
      <div className="notice-actions">
        <button onClick={() => noticeUpdate(id)} className="notice-update-btn">수정하기</button>
        <button onClick={() => noticeDelete(id)} className="notice-delete-btn">삭제하기</button>
      </div>
    </div>
  );
};

export default NoticeDetail;