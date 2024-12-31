import React, { useState } from "react";
import axios from "axios";


const NoticeInsert = ({ closeModal }) => {
  const [notice, setNotice] = useState({
    noticeTitle: "",
    noticeCategory: "가정통신문",
    noticeContent: "",
    noticeImg: null,
    noticeFile: null,
  });

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

    const formData = new FormData();
    formData.append("noticeTitle", notice.noticeTitle);
    formData.append("noticeCategory", notice.noticeCategory);
    formData.append("noticeContent", notice.noticeContent);
    formData.append("classId", classId);

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
    <div style={styles.container}>
      <h1 style={styles.title}>공지사항 작성</h1>
      <form onSubmit={handleSubmit} style={styles.form}>
        <div style={styles.formGroup}>
          <label htmlFor="noticeTitle">제목:</label>
          <input
            type="text"
            id="noticeTitle"
            name="noticeTitle"
            value={notice.noticeTitle}
            onChange={handleChange}
            style={styles.input}
          />
        </div>
        <div style={styles.formGroup}>
          <label htmlFor="noticeCategory">카테고리:</label>
          <select
            id="noticeCategory"
            name="noticeCategory"
            value={notice.noticeCategory}
            onChange={handleChange}
            style={styles.select}
          >
            {categories.map((category, index) => (
              <option key={index} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>
        <div style={styles.formGroup}>
          <label htmlFor="noticeContent">내용:</label>
          <textarea
            id="noticeContent"
            name="noticeContent"
            value={notice.noticeContent}
            onChange={handleChange}
            style={styles.textarea}
          />
        </div>
        <div style={styles.formGroup}>
          <label htmlFor="noticeImg">이미지:</label>
          <input
            type="file"
            id="noticeImg"
            name="noticeImg"
            onChange={handleFileChange}
            style={styles.input}
          />
        </div>
        <div style={styles.formGroup}>
          <label htmlFor="noticeFile">파일:</label>
          <input
            type="file"
            id="noticeFile"
            name="noticeFile"
            onChange={handleFileChange}
            style={styles.input}
          />
        </div>
        <div style={styles.buttonGroup}>
                    <button type="submit" style={styles.buttonPrimary}>
                        등록하기
                    </button>
                    <button type="button" style={styles.buttonSecondary} onClick={closeModal}>
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
  buttonPrimary: {
    backgroundColor: "#4CAF50",
    color: "white",
    border: "none",
    borderRadius: "4px",
    padding: "10px 20px",
    cursor: "pointer",
  },
  buttonSecondary: {
    backgroundColor: "#f44336",
    color: "white",
    border: "none",
    borderRadius: "4px",
    padding: "10px 20px",
    cursor: "pointer",
  },
};

export default NoticeInsert;