import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { googleLogout } from "@react-oauth/google";
import { useUserData } from "../hooks/useUserData";
import { clearProfileFromStorage } from "../utils/localStorage";
import { InputField } from "../component/InputField";
import { DropdownField } from "../component/DropdownField";
import { SchoolNameDisplay } from "../component/SchoolNameDisplay";
import { fetchFromAPI } from "../utils/api";

const ClassMaker = () => 
{
    const { email, schoolName, classCount, isSchoolNameEditable, setSchoolName, fetchClassCount } = useUserData();
    const navigate = useNavigate();

    const [grade, setGrade] = useState("");
    const [classNo, setClassNo] = useState("");
    const [classNickname, setClassNickname] = useState("");

    const handleSubmit = async () => 
    {
        if (classCount >= 2) 
        {
            alert("학급은 최대 2개까지 생성할 수 있습니다.");
            return;
        }

        const isNumeric = /^[1-9]+$/;
        if (!isNumeric.test(grade) || !isNumeric.test(classNo)) 
        {
            alert("학년과 반을 정확히 선택해주세요.");
            return;
        }

        const data = { email, schoolName, grade, classNo, classNickname };
        try {
            await fetchFromAPI("/class/create", 
            {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            });

            fetchClassCount();
            alert("학급이 생성되었습니다.");
            navigate("/profile");
        } catch (error) {
            alert("학급 생성에 실패했습니다.");
        }
    };

    const submitWarn = () => 
    {
        const confirmationMessage = `
            학급은 최대 2개까지 생성하실 수 있으며,
            생성일자로부터 2년 후의 3월 1일에 자동으로 삭제됩니다.

            예시)
            1) 2023년 2월 15일 생성 → 2025년 3월 1일 자동 삭제
            2) 2024년 8월 15일 생성 → 2026년 3월 1일 자동 삭제

            삭제된 이후의 학급은 확인할 수 없으며, 복구할 수 없습니다.
            학급을 생성하시겠습니까?`;
        if (window.confirm(confirmationMessage)) 
        {
            handleSubmit();
        }
    };

    const handleLogout = () => 
    {
        if (window.confirm("로그아웃 하시겠습니까?")) 
        {
            googleLogout();
            clearProfileFromStorage();
            navigate("/login");
        }
    };

    return (
        <div>
            <h2>학급 생성</h2>
            {!classCount && (
                <div>
                    <h5>학급 생성 후 이용하실 수 있습니다.</h5>
                </div>
            )}
            <form onSubmit={(e) => e.preventDefault()}>
                <SchoolNameDisplay
                    isEditable={isSchoolNameEditable}
                    schoolName={schoolName}
                    onChange={(e) => setSchoolName(e.target.value)}
                />
                <DropdownField
                    id="grade"
                    label="학년:"
                    value={grade}
                    options={[1, 2, 3, 4, 5, 6]}
                    onChange={(e) => setGrade(e.target.value)}
                />
                <DropdownField
                    id="classNo"
                    label="반:"
                    value={classNo}
                    options={Array.from({ length: 20 }, (_, i) => i + 1)}
                    onChange={(e) => setClassNo(e.target.value)}
                />
                <InputField
                    id="classNickname"
                    label="별명:"
                    type="text"
                    value={classNickname}
                    onChange={(e) => setClassNickname(e.target.value)}
                />
                <button onClick={submitWarn}>학급 생성</button>
                <button onClick={() => navigate(-1)}>뒤로가기</button>
                {!classCount && <button onClick={handleLogout}>로그아웃</button>}
            </form>
        </div>
    );
};

export default ClassMaker;
