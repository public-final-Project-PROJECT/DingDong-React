import axios from "axios";
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

const NoticeUpdate = () => {
    const { id } = useParams();  // URL에서 동적으로 id를 받음
    const navigate = useNavigate();

    const [updateNotice, setUpdateNotice] = useState({
        noticeTitle: "",
        noticeCategory: "가정통신문", // 기본값 설정
        noticeContent: "",
        noticeImg: null,  // 이미지 상태 추가
        noticeFile: null, // 파일 상태 추가
    });

    const categories = ["가정통신문", "알림장", "학교생활"];
    
    useEffect(() => {
        // 공지사항 데이터를 불러옴
        axios.get(`http://localhost:3013/api/notice/detail/${id}`)
            .then(response => {
                const { noticeTitle, noticeCategory, noticeContent, noticeImg, noticeFile } = response.data[0]; 
                setUpdateNotice({
                    noticeTitle,
                    noticeCategory,
                    noticeContent,
                    noticeImg,
                    noticeFile
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
            // 수정된 공지사항 데이터를 서버에 PUT 요청으로 전송
            await axios.post(`http://localhost:3013/api/notice/update/${id}`, formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });
            alert("공지사항이 수정되었습니다.");
            navigate(`/${id}`);  // 수정 후 상세 페이지로 이동
        } catch (error) {
            console.error("Error updating notice:", error);
            alert("수정에 실패했습니다.");
        }
    };

    return (
        <div>
            <h1>공지사항 수정</h1>
            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="noticeTitle">제목:</label>
                    
                    <input
                        type="text"
                        id="noticeTitle"
                        name="noticeTitle"
                        value={updateNotice.noticeTitle}
                        onChange={handleChange}
                    />
                </div>
                <div>
                    <label htmlFor="noticeCategory">카테고리:</label>
                    <select
                        id="noticeCategory"
                        name="noticeCategory"
                        value={updateNotice.noticeCategory}
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
                        value={updateNotice.noticeContent}
                        onChange={handleChange}
                    />
                </div>
                <div>
                    <label htmlFor="noticeImg">이미지:</label>
                    <input
                        type="file"
                        id="noticeImg"
                        name="noticeImg"
                        onChange={handleFileChange}
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
                <button type="submit">수정하기</button>
            </form>
        </div>
    );
};

export default NoticeUpdate;