import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUserData } from "../hooks/useUserData";
import { InputField } from "../component/InputField";
import { DropdownField } from "../component/DropdownField";
import { SchoolNameDisplay } from "../component/SchoolNameDisplay";
import { fetchFromAPI } from "../utils/api";
import { useAuth } from "../contexts/AuthContext";
import { googleLogout } from "@react-oauth/google";
import { clearProfileFromStorage } from "../utils/localStorage";
import '../asset/css/ClassMaker.css';
import { fetchSchoolInfo } from "../utils/fetchSchoolInfo";

const ClassMaker = () => 
{
    const 
    {
        teacherId,
        schoolName,
        classCount,
        isSchoolNameEditable,
        setSchoolName,
        setSelectedClassId,
    } = useUserData();
    const { profile, setProfile } = useAuth();

    const [grade, setGrade] = useState("");
    const [classNo, setClassNo] = useState("");
    const [classNickname, setClassNickname] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async () => 
    {
        if (!validateInputs()) return;
        
        const schoolData = await fetchSchoolInfo(schoolName);
        if (!schoolData) 
        {
            alert("학교 정보를 가져올 수 없습니다.");
            return;
        }

        try {
            const nicknameToSubmit =
                classNickname.trim() || "학급 이름을 설정하지 않았습니다.";

            const newClassData = 
            {
                email: profile.email,
                schoolName,
                grade,
                classNo,
                classNickname: nicknameToSubmit,
            };

            await createClass(newClassData);
            const newClassId = await fetchLatestClassId(grade, classNo, teacherId);

            if (newClassId) 
            {
                if (classCount === 1) 
                {
                    const confirmSetDefault = window.confirm("생성된 학급을 기본 학급으로 설정하시겠습니까?");
                    if (confirmSetDefault) 
                    {
                        await updateLatestClassId(profile.email, newClassId);
                        setSelectedClassId(newClassId);
                    }
                } 
                else 
                {
                    await updateLatestClassId(profile.email, newClassId);
                    setSelectedClassId(newClassId);
                }
            }
            navigate("/");
        } catch (error) {
            alert("학급 생성에 실패했습니다.");
        }
    };
    const validateInputs = () => 
    {
        const isNumeric = /^\d+$/;
        if (!isNumeric.test(grade) || grade < 1 || grade > 6) 
        {
            alert("학년을 선택해주세요.");
            return false;
        }
        if (!isNumeric.test(classNo) || classNo < 1 || classNo > 20) 
        {
            alert("반을 선택해주세요.");
            return false;
        }
        return true;
    };

    const createClass = async (data) => 
    {
        await fetchFromAPI("/class/create", 
        {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
        });
        alert("학급이 생성되었습니다.");
    };

    const fetchLatestClassId = async (grade, classNo, teacherId) => 
    {
        const response = await fetchFromAPI(
            `/class/grade/${grade}/class/${classNo}/teacher/${teacherId}`,
            {
                method: "GET",
                headers: { "Content-Type": "application/json" },
            }
        );

        if (Array.isArray(response) && response.length > 0) 
        {
            return response[0].classId;
        }
        return null;
    };

    const updateLatestClassId = async (email, classId) => 
    {
        await fetchFromAPI("/user/add/class", 
        {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, latestClassId: classId }),
        });
    };

    const submitConfirm = () => 
    {
        const confirmationMessage = 
`학급은 최대 2개까지 생성하실 수 있으며,
생성일자로부터 2년 후의 3월 1일에 자동으로 삭제됩니다.

학교, 학년, 반은 생성 후 변경할 수 없습니다.
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
            localStorage.removeItem("selectedClassId");
            setProfile(null);
            navigate("/login");
        }
    };

    return (
        <div className="classMaker">
            <h2>학급 생성</h2>
            {!classCount && <p>입력하신 정보로 학급을 생성합니다.</p>}
            <form className="classMaker-form" onSubmit={(e) => e.preventDefault()}>
                <SchoolNameDisplay
                    isEditable={isSchoolNameEditable}
                    schoolName={schoolName}
                    onChange={(e) => setSchoolName(e.target.value)}
                    className="schoolNameDisplay"
                />
                <div className="grade">
                    <DropdownField
                        id="grade"
                        label="학년"
                        value={grade}
                        options={[1, 2, 3, 4, 5, 6]}
                        onChange={(e) => setGrade(e.target.value)}
                />
                </div>

                <di className="classNo"v>
                        <DropdownField
                        id="classNo"
                        label="반"
                        value={classNo}
                        options={Array.from({ length: 20 }, (_, i) => i + 1)}
                        onChange={(e) => setClassNo(e.target.value)}
                />
                </di>
                <InputField
                    id="classNickname"
                    label="학급 이름(선택)"
                    type="text"
                    value={classNickname}
                    onChange={(e) => setClassNickname(e.target.value)}
                    className="classNickname"
                />

                <div className="classMakerButton">
                <button onClick={submitConfirm}>학급 생성</button>
                {!classCount && <button onClick={handleLogout}>로그아웃</button>}
                </div>

            </form>
        </div>
    );
};

export default ClassMaker;
