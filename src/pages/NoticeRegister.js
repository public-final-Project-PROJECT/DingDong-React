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
    noticeImgName: "", 
    noticeFileName: "",
  });

     const {
              schoolName,
              selectedClassId
          } = useUserData();


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
    const file = files[0];
    setNotice((prevNotice) => ({
      ...prevNotice,
      [name]: file,
      [`${name}Name`]: file ? file.name : "", 
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
      const response =  await axios.post(
        "http://localhost:3013/api/notice/insert",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      
    const noticeId = response.data.noticeId;
    alert(`공지사항이 등록되었습니다`);


    const data = {
    "alertCategory":"공지사항",
    "noticeId" : noticeId,
    "classId":selectedClassId
    }
    await axios.post(
      "http://localhost:3013/api/alert/register",
      data,
    );
    
      setNotice({
        noticeTitle: "",
        noticeCategory: "가정통신문",
        noticeContent: "",
        noticeImg: null,
        noticeFile: null,
        noticeImgName: "",
        noticeFileName: "",
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
          <label htmlFor="noticeTitle">제목</label>
          <input
            type="text"
            id="noticeTitle"
            name="noticeTitle"
            placeholder="제목을 입력해주세요"
            value={notice.noticeTitle}
            onChange={handleChange}
          />
        </div>
        <div className="noticeCategory-group">
          <label htmlFor="noticeCategory">카테고리</label>
          <select
            id="noticeCategory"
            name="noticeCategory"
            value={notice.noticeCategory}
            onChange={handleChange}
          >
            {categories.map((category, index) => (
              <option  key={index} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>
        <div className="noticeContent-group">
          <label htmlFor="noticeContent">내용</label>
          <textarea
            id="noticeContent"
            name="noticeContent"
            placeholder="내용을 입력해주세요"
            value={notice.noticeContent}
            onChange={handleChange}
            className="textarea"
          />
        </div>
        <div className="noticeImg-group">
          <input 
          type="text" placeholder="이미지를 선택하세요."
          value={notice.noticeImgName}
          readOnly
          className="image-upload-name"
          />
          <input
            type="file"
            id="noticeImg"
            name="noticeImg"
            onChange={handleFileChange}
            className="image-input"
          />
          <label htmlFor="noticeImg" className="Image-upload-button">
            파일 선택
          </label>
        </div>

          <div className="noticeFile-group">
            <input
              type="text"
              placeholder="파일을 선택하세요"
              value={notice.noticeFileName}
              readOnly
              className="file-upload-name"
            />
            <input
              type="file"
              id="noticeFile"
              name="noticeFile"
              onChange={handleFileChange}
              className="file-input"
            />
            <label htmlFor="noticeFile" className="file-upload-button">
              파일 선택
            </label>
          </div>

        <div className="button-group">
          <button type="submit">
            등록하기
          </button>
          <button type="button" onClick={closeModal}>
            취소
          </button>
        </div>
      </form>
    </div>
  );
  
};


export default NoticeInsert;