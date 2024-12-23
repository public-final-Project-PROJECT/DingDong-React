import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

const NoticeUpdate = () => {
    const [notice, setNotice] = useState({
        noticeTitle: "",
        noticeCategory: "",
        noticeContent: "",
    });
    const { id } = useParams();
    const navigate = useNavigate();

    // 수정할 공지사항 데이터를 불러옴
    useEffect(() => {
        axios
            .get(`http://localhost:3013/api/notice/detail/${id}`)
            .then((response) => {
                setNotice(response.data);
            })
            .catch((error) => {
                console.error("Error fetching notice:", error);
            });
    }, [id]);

    // 폼에서 입력값을 처리
    const handleChange = (e) => {
        const { name, value } = e.target;
        setNotice((prevNotice) => ({
            ...prevNotice,
            [name]: value,
        }));
    };

    // 수정된 공지사항 저장
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.put(`http://localhost:3013/api/notice/update/${id}`, notice);
            alert("공지사항이 수정되었습니다.");
            navigate(`/notice/${id}`); // 수정 완료 후, 상세 페이지로 돌아감
        } catch (error) {
            console.error("수정 오류:", error);
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
                        value={notice.noticeTitle}
                        onChange={handleChange}
                    />
                </div>
                <div>
                    <label htmlFor="noticeCategory">카테고리:</label>
                    <input
                        type="text"
                        id="noticeCategory"
                        name="noticeCategory"
                        value={notice.noticeCategory}
                        onChange={handleChange}
                    />
                </div>
                <div>
                    <label htmlFor="noticeContent">내용:</label>
                    <textarea
                        id="noticeContent"
                        name="noticeContent"
                        value={notice.noticeContent}
                        onChange={handleChange}
                    />
                </div>
                <button type="submit">수정 완료</button>
            </form>
        </div>
    );
};

export default NoticeUpdate;