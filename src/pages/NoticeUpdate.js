import React, { useState, useEffect } from "react";
import axios from "axios";
import {  useNavigate } from "react-router-dom";
import "../asset/css/NoticeUpdate.css"; // CSS 파일 임포트

const NoticeUpdate = ({ closeModal, id, setNotices }) => {
  const navigate = useNavigate();

  const [updateNotice, setUpdateNotice] = useState({
    noticeTitle: "",
    noticeCategory: "가정통신문",
    noticeContent: "",
    noticeImg: null,
    noticeFile: null,
    noticeImgName: "", 
    noticeFileName: "",
  });

  const categories = ["가정통신문", "알림장", "학교생활"];

  useEffect(() => {
    axios.get(`http://localhost:3013/api/notice/detail/${id}`)
      .then(response => {
        const { noticeTitle, noticeCategory, noticeContent, noticeImg, noticeFile } = response.data[0];
        setUpdateNotice({
          noticeTitle,
          noticeCategory,
          noticeContent,
          noticeImg,
          noticeFile,
          noticeImgName: extractFileName(noticeImg), 
          noticeFileName: extractFileName(noticeFile),
        });
      })
      .catch(error => {
        console.error("Error fetching notice:", error);
      });
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUpdateNotice((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    setUpdateNotice((prevState) => ({
      ...prevState,
      [name]: files[0],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!updateNotice.noticeTitle.trim()) {
      alert("제목을 입력해주세요.");
      return;
    }
    if (!updateNotice.noticeCategory.trim()) {
      alert("카테고리를 선택해주세요.");
      return;
    }
    if (!updateNotice.noticeContent.trim()) {
      alert("내용을 입력해주세요.");
      return;
    }

    const formData = new FormData();
    formData.append("noticeTitle", updateNotice.noticeTitle);
    formData.append("noticeCategory", updateNotice.noticeCategory);
    formData.append("noticeContent", updateNotice.noticeContent);
    formData.append("noticeImg", updateNotice.noticeImg);
    formData.append("noticeFile", updateNotice.noticeFile);

    try {
      await axios.post(`http://localhost:3013/api/notice/update/${id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      alert("공지사항이 수정되었습니다.");
      setNotices((prevState) =>
        prevState.map((notice) =>
          notice.noticeId === id ? { ...notice, ...updateNotice } : notice
        )
      );
      closeModal(); 
      navigate(`/notice/${id}`); 
    } catch (error) {
      console.error("Error updating notice:", error);
      alert("수정에 실패했습니다.");
    }
  };

  const extractFileName = (filePath) => {
    return filePath?.substring(filePath.lastIndexOf('_') + 1) || "없음";
  };

  return (
    <div className="notice-update-container">
      <h1>공지사항 수정</h1>
      <form onSubmit={handleSubmit} className="notice-update-form">
        <div className="form-group">
          <label htmlFor="noticeTitle" >제목</label>
          <input
            type="text"
            id="noticeTitle"
            name="noticeTitle"
            value={updateNotice.noticeTitle}
            onChange={handleChange}
            className="form-input"
            style={{textAlign : "left"}}
          />
        </div>
        <div className="form-group">
          <label htmlFor="noticeCategory">카테고리</label>
          <select
            id="noticeCategory"
            name="noticeCategory"
            value={updateNotice.noticeCategory}
            onChange={handleChange}
            className="form-select"
          >
            {categories.map((category, index) => (
              <option key={index} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="noticeContent">내용</label>
          <textarea
            id="noticeContent"
            name="noticeContent"
            value={updateNotice.noticeContent}
            onChange={handleChange}
            className="form-textarea"
          />
        </div>
        <div className="form-group">
          <label htmlFor="noticeImg">이미지</label>
          <input
            type="file"
            id="noticeImg"
            name="noticeImg"
            onChange={handleFileChange}
            className="form-input"
          ></input>
            {updateNotice.noticeImgName && (
    <p className="existing-file">수정전 이미지: {updateNotice.noticeImgName}</p>
  )}
        </div>
        <div className="form-group">
          <label htmlFor="noticeFile">파일</label>
          <input
            type="file"
            id="noticeFile"
            name="noticeFile"
            onChange={handleFileChange}
            className="form-input"
          />
                    {updateNotice.noticeImgName && (<p className="existing-file">수정전 파일: {updateNotice.noticeFileName}</p>)}
        </div>
        <div className="button-group">
          <button type="submit" className="button-primary">수정하기</button>
          <button type="button" className="button-secondary" onClick={() => { closeModal(); navigate(`/notice/${id}`); }}>
            취소
          </button>
        </div>
      </form>
    </div>
  );
};

export default NoticeUpdate;