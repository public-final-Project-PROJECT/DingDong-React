import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "../asset/css/NoticeDetail.css"; // CSS 파일 임포트
import { FaDownload } from "react-icons/fa";
import NoticeUpdate from "./NoticeUpdate";

const NoticeDetail = () => {
  const [notices, setNotices] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);  // 모달 상태
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
  }, [id]);

  // 수정
  const noticeUpdate = () => {
    setIsModalOpen(true); // 모달 열기
  };

  // 삭제
  const noticeDelete = async (id) => {
    const isConfirmed = window.confirm("정말로 삭제하시겠습니까?");
    if (isConfirmed) {
      try {
        await axios.post(`http://localhost:3013/api/notice/delete/${id}`)
          .then(response => {
            alert("공지사항이 삭제되었습니다.");
            navigate("/notice");
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

  // 모달 닫기
  const closeModal = () => setIsModalOpen(false);

  return (
    <>
      <h1 className="notice-title">공지 사항</h1>
      <div className="notice-detail-container">
        {/* 공지사항 내용 */}
        {notices.map((notice) => (
          <div key={notice.noticeId} className="notice-detail">
            <h1 className="notice-detail-title">{notice.noticeTitle}</h1>
            <div className="notice-meta">
              <small>{new Date(notice.createdAt).toLocaleString()}</small>
              <span className="notice-category">{notice.noticeCategory}</span>
            </div>
            <p className="notice-content">{notice.noticeContent}</p>
            {notice.noticeImg && (
              <div className="notice-image">
                <img
                  src={`http://localhost:3013${notice.noticeImg}`}
                  alt="공지사항 이미지"
                  className="notice-img"
                />
              </div>
            )}
            {notice.noticeFile && (
              <div className="notice-file">
                <p>
                  첨부 파일{" "}
                  <a
                    href={`http://localhost:3013${notice.noticeFile}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="notice-file-link"
                  >
                    <FaDownload /> 다운로드
                  </a>
                </p>
              </div>
            )}
          </div>
        ))}

        {/* 수정 및 삭제 버튼 */}
        <div className="notice-actions">
          <button onClick={noticeUpdate} className="notice-update-btn">
            수정하기
          </button>
          <button onClick={() => noticeDelete(id)} className="notice-delete-btn">
            삭제하기
          </button>
        </div>

        {/* 수정 모달 */}
        {isModalOpen && (
          <div className="notice-modal">
            <div className="notice-modal-content">
              <NoticeUpdate closeModal={closeModal} id={id} setNotices={setNotices} />
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default NoticeDetail;