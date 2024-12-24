import { useEffect, useState } from "react";
import { fetchFromAPI } from "../utils/api";
import { clearProfileFromStorage, getStoredProfile } from "../utils/localStorage";
import { googleLogout } from "@react-oauth/google";
import { useNavigate } from "react-router-dom";

const InputField = ({ id, label, type, value, onChange, placeholder }) => (
    <div>
        <label htmlFor={id}>
            {label}
            <input
                id={id}
                type={type}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
            />
        </label>
    </div>
);

const DropdownField = ({ id, label, value, options, onChange }) => (
    <div>
        <label htmlFor={id}>
            {label}
            <select id={id} value={value} onChange={onChange}>
                <option value="" disabled>
                    선택해주세요
                </option>
                {options.map((option) => (
                    <option key={option} value={option}>
                        {option}
                    </option>
                ))}
            </select>
        </label>
    </div>
);

const SchoolNameDisplay = ({ isEditable, schoolName, onChange }) => {
    return isEditable ? (
        <div>
            <label htmlFor="schoolName">학교 이름: </label>
            <input
                id="schoolName"
                type="text"
                value={schoolName}
                onChange={onChange}
                placeholder="학교 이름을 입력해주세요."
            />
        </div>
    ) : (
        <div>
            학교 이름: {schoolName}
            <h5 style={{ color: "red" }}>
                재직중인 학교가 설정되어 있습니다. 학교 이름을 수정할 수 없습니다.
            </h5>
        </div>
    );
};

const ClassMaker = () => 
{
    const [profile, setProfile] = useState(getStoredProfile);
    const email = profile?.email;
    const [teacherId, setTeacherId] = useState(0);
    const [schoolName, setSchoolName] = useState("");
    const [isSchoolNameEditable, setIsSchoolNameEditable] = useState(true);
    const [grade, setGrade] = useState("");
    const [classNo, setClassNo] = useState("");
    const [classNickname, setClassNickname] = useState("");
    const [classCount, setClassCount] = useState(0);
    const navigate = useNavigate();

    useEffect(() => 
    {
        const initializeData = async () => 
        {
            await fetchSchoolName();
            await fetchTeacherId();
        };
        initializeData();
    }, []);

    useEffect(() => 
    {
        if (teacherId > 0) 
        {
            fetchClassCount();
        }
    }, [teacherId]);

    const fetchSchoolName = async () => 
    {
        try {
            const response = await fetchFromAPI(`/user/get/school/${email}`, 
            {
                method: "GET",
                headers: { "Content-Type": "application/json" },
            });
            if (response.status === 404) 
            {
                setSchoolName("");
                setIsSchoolNameEditable(true);
            } else if (response?.schoolName) 
            {
                setSchoolName(response.schoolName);
                setIsSchoolNameEditable(false);
            }
        } catch (err) {
            console.error("Error fetching school name: ", err);
        }
    };

    const fetchTeacherId = async () => 
    {
        try {
            const data = await fetchFromAPI(`/user/${email}`, 
            {
                method: "GET",
                headers: { "Content-Type": "application/json" },
            });
            setTeacherId(data);
        } catch (err) {
            console.error("Error fetching teacher ID: ", err);
        }
    };

    const fetchClassCount = async () => 
    {
        try {
            const data = await fetchFromAPI(`/class/count/${teacherId}`, 
            {
                method: "GET",
                headers: { "Content-Type": "application/json" },
            });
            setClassCount(data >= 0 ? data : 0);
        } catch (err) {
            console.error("Error fetching class count: ", err);
        }
    };

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
            navigate("/profile")
        } catch (error) {
            alert("학급 생성에 실패했습니다.");
        }
    };

    const submitWarn = () => 
    {
        const confirmationMessage = 
        `        학급은 최대 2개까지 생성하실 수 있으며,
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
            setProfile(null);
            clearProfileFromStorage();
            navigate("/login");
        }
    };

    return (
        <div>
            <h2>학급 생성</h2>
            {classCount ? (null) : 
            (<div>
                <h5>
                    학급 생성 후 이용하실 수 있습니다.
                </h5>
            </div>)}
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