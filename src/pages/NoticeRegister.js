import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const NoticeInsert = ({ closeModal }) => {  // closeModal prop 추가
    const [notice, setNotice] = useState({
        noticeTitle: "",
        noticeCategory: "가정통신문", // 기본값 설정
        noticeContent: "",
        noticeImg: null,
        noticeFile: null,
    });
    const classId = "1";
    const navigate = useNavigate();

    const categories = ["가정통신문", "알림장", "학교생활"];

    // 폼에서 입력값을 처리
    const handleChange = (e) => {
        const { name, value } = e.target;
        setNotice((prevNotice) => ({
            ...prevNotice,
            [name]: value,
        }));
    };

    // 파일 입력 처리
    const handleFileChange = (e) => {
        const { name, files } = e.target;
        setNotice((prevNotice) => ({
            ...prevNotice,
            [name]: files[0],
        }));
    };

    // 이미지 미리보기
    const handleImagePreview = (e) => {
        const file = e.target.files[0];
        if (file) {
            setNotice((prevNotice) => ({
                ...prevNotice,
                noticeImg: file,  // 이미지 파일 객체로 저장
            }));
        }
    };

    // submit 처리
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!notice.noticeTitle.trim()) {
            alert("제목을 입력해주세요.");
            return;
        }
        if (!notice.noticeCategory.trim()) {
            alert("카테고리를 선택해주세요.");
            return;
        }
        if (!notice.noticeContent.trim()) {
            alert("내용을 입력해주세요.");
            return;
        }

        const formData = new FormData();
        formData.append("noticeTitle", notice.noticeTitle);
        formData.append("noticeCategory", notice.noticeCategory);
        formData.append("noticeContent", notice.noticeContent);
        formData.append("classId", classId);

        // 이미지와 파일이 선택된 경우만 추가
        if (notice.noticeImg) {
            formData.append("noticeImg", notice.noticeImg);  // 파일 객체로 전송
        }
        if (notice.noticeFile) {
            formData.append("noticeFile", notice.noticeFile);
        }

        try {
            await axios.post(
                `http://localhost:3013/api/notice/insert`,
                formData,
                {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                }
            );
            alert("공지사항이 등록되었습니다.");
            closeModal();  // Modal close after successful submission
        } catch (error) {
            console.error("등록 오류:", error);
            alert("등록에 실패했습니다.");
        }
    };

    return (
        <div>
            <h1>공지사항 작성</h1>
            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="noticeTitle">제목:</label>
                    <input
                        type="text"
                        id="noticeTitle"
                        name="noticeTitle"
                        value={notice.noticeTitle}
                        onChange={handleChange}
                    />
                </div>
                <div>
                    <label htmlFor="noticeCategory">카테고리:</label>
                    <select
                        id="noticeCategory"
                        name="noticeCategory"
                        value={notice.noticeCategory}
                        onChange={handleChange}
                    >
                        {categories.map((category, index) => (
                            <option key={index} value={category}>
                                {category}
                            </option>
                        ))}
                    </select>
                </div>
                <div>
                    <label htmlFor="noticeContent">내용:</label>
                    <textarea
                        id="noticeContent"
                        name="noticeContent"
                        value={notice.noticeContent}
                        onChange={handleChange}
                    />
                    {notice.noticeImg && (
                        <div>
                            <img
                                src={URL.createObjectURL(notice.noticeImg)}
                                alt="미리보기"
                                style={{ maxWidth: "100%", marginTop: "10px" }}
                            />
                        </div>
                    )}
                </div>
                <div>
                    <label htmlFor="noticeImg">이미지:</label>
                    <input
                        type="file"
                        id="noticeImg"
                        name="noticeImg"
                        onChange={handleImagePreview}
                    />
                </div>
                <div>
                    <label htmlFor="noticeFile">파일:</label>
                    <input
                        type="file"
                        id="noticeFile"
                        name="noticeFile"
                        onChange={handleFileChange}
                    />
                </div>
                <button type="submit">등록하기</button>
                {/* 닫기 버튼 추가 */}
                <button type="button" onClick={closeModal} style={{ marginLeft: "10px" }}>
                    닫기
                </button>
            </form>
        </div>
    );
};

export default NoticeInsert;