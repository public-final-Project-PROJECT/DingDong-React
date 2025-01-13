import React, { useState } from "react";
import axios from "axios";
import { useUserData } from "../hooks/useUserData";
import '../asset/css/NoticeRegister.css';


const NoticeInsert = ({ closeModal }) => {
  const [notice, setNotice] = useState({
    noticeTitle: "",
    noticeCategory: "가정통신문",
    noticeContent: "",
    noticeImg: null,
    noticeFile: null,
  });

     const {
              schoolName,
              selectedClassId
          } = useUserData();

  const classId = "1";

  const categories = ["가정통신문", "알림장", "학교생활"];



  const handleChange = (e) => {
    const { name, value } = e.target;
    setNotice((prevNotice) => ({
      ...prevNotice,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    setNotice((prevNotice) => ({
      ...prevNotice,
      [name]: files[0],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!notice.noticeTitle.trim()) {
      alert("제목을 입력해주세요.");
      return;
    }

    if (!notice.noticeContent.trim()) {
        alert("내용을 입력해 주세요.");
        return;
      }

    const formData = new FormData();
    formData.append("noticeTitle", notice.noticeTitle);
    formData.append("noticeCategory", notice.noticeCategory);
    formData.append("noticeContent", notice.noticeContent);
    formData.append("classId", selectedClassId);

    if (notice.noticeImg) {
      formData.append("noticeImg", notice.noticeImg);
    }
    if (notice.noticeFile) {
      formData.append("noticeFile", notice.noticeFile);
    }

    try {
      await axios.post(
        "http://localhost:3013/api/notice/insert",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      alert("공지사항이 등록되었습니다.");
      setNotice({
        noticeTitle: "",
        noticeCategory: "가정통신문",
        noticeContent: "",
        noticeImg: null,
        noticeFile: null,
      });
      closeModal();
    } catch (error) {
      console.error("등록 오류:", error);
      alert("등록에 실패했습니다.");
    }
  };

  return (
    <div className="container">
      <h1 className="title">공지사항 작성</h1>
      <form onSubmit={handleSubmit} className="form">
        <div className="form-group">
          <label htmlFor="noticeTitle">제목 :</label>
          <input
            type="text"
            id="noticeTitle"
            name="noticeTitle"
            value={notice.noticeTitle}
            onChange={handleChange}
            // className="input"
          />
        </div>
        <div className="noticeCategory-group">
          <label htmlFor="noticeCategory">카테고리 :</label>
          <select
            id="noticeCategory"
            name="noticeCategory"
            value={notice.noticeCategory}
            onChange={handleChange}
            // className="select"
          >
            {categories.map((category, index) => (
              <option  key={index} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>
        <div className="noticeContent-group">
          <label htmlFor="noticeContent">내용 :</label>
          <textarea
            id="noticeContent"
            name="noticeContent"
            value={notice.noticeContent}
            onChange={handleChange}
            className="textarea"
          />
        </div>
        <div className="noticeImg-group">
          <label htmlFor="noticeImg">이미지:</label>
          <input
            type="file"
            id="noticeImg"
            name="noticeImg"
            onChange={handleFileChange}
            // className="image-input"
          />
        </div>
        <div className="noticeFile-group">
          <label htmlFor="noticeFile">파일 :</label>
          <input
            type="file"
            id="noticeFile"
            name="noticeFile"
            onChange={handleFileChange}
            // className="file-input"
          />
        </div>
        <div className="button-group">
          <button type="submit" className="button-primary">
            등록하기
          </button>
          <button type="button" className="button-secondary" onClick={closeModal}>
            취소
          </button>
        </div>
      </form>
    </div>
  );
  
};

const styles = {
  container: {
    maxWidth: "600px",
    margin: "0 auto",
    padding: "20px",
    backgroundColor: "#f9f9f9",
    borderRadius: "8px",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
  },
  title: {
    fontSize: "24px",
    textAlign: "center",
    marginBottom: "20px",
    color: "#333",
  },
  form: {
    display: "flex",
    flexDirection: "column",
  },
  formGroup: {
    marginBottom: "15px",
  },
  input: {
    width: "100%",
    padding: "10px",
    border: "1px solid #ccc",
    borderRadius: "4px",
    fontSize: "16px",
  },
  select: {
    width: "100%",
    padding: "10px",
    border: "1px solid #ccc",
    borderRadius: "4px",
    fontSize: "16px",
  },
  textarea: {
    width: "100%",
    padding: "10px",
    border: "1px solid #ccc",
    borderRadius: "4px",
    fontSize: "16px",
    minHeight: "100px",
  },
  buttonGroup: {
    display: "flex",
    justifyContent: "flex-end",
    gap: "10px",
  },

  // 등록하기
  buttonPrimary: {
    backgroundColor: "#4CAF50",
    color: "white",
    border: "none",
    borderRadius: "4px",
    padding: "10px 20px",
    cursor: "pointer",
  },

  // 취소
  buttonSecondary: {
    backgroundColor: "white",
    color: "#4CAF50",
    border: "2px soild #4CAF50",
    borderRadius: "4px",
    padding: "10px 20px",
    cursor: "pointer",
  },
};

export default NoticeInsert;