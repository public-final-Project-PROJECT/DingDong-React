import { googleLogout } from "@react-oauth/google";
import { getStoredProfile, clearProfileFromStorage } from "../utils/localStorage";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { fetchFromAPI } from "../utils/api";
import { fetchSchoolInfo } from "../utils/fetchSchoolInfo";
import ClassMaker from "./ClassMaker";
import ClassList from "./ClassList";

const Profile = () => 
{
    const [profile, setProfile] = useState(getStoredProfile);
    const [schoolName, setSchoolName] = useState('');
    const [fetched, setFetched] = useState(false);
    const navigate = useNavigate();
    const [teacherId, setTeacherId] = useState(0);

    useEffect(() => 
    {
        fetchSchoolName();
        fetchTeacherId();
    }, []);

    const fetchTeacherId = async () => 
    {
        try {
            const data = await fetchFromAPI(`/user/${profile?.email}`, 
            {
                method: "GET",
                headers: { "Content-Type": "application/json" },
            });
            setTeacherId(data);
        } catch (err) {
            console.error("Error fetching teacher ID: ", err);
        }
    };

    const fetchSchoolName = async () => 
    {
        try {
            const data = await fetchFromAPI(`/user/get/school/${profile?.email}`, 
            {
                method: "GET",
                headers: { "Content-Type": "application/json" },
            });
            if (data?.schoolName) 
            {
                setSchoolName(data.schoolName);
                setFetched(true);
            }
        } catch (err) {
            console.error("Error fetching school name:", err);
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

    const withdrawAlert = () => 
    {
        if (window.confirm("정말 탈퇴하시겠습니까?\n탈퇴 후 모든 정보가 삭제되며 복구할 수 없습니다.")) 
        {
            handleWithdraw();
            alert("회원탈퇴가 완료되었습니다.");
        }
    };

    const handleWithdraw = async () => 
    {
        try {
            await fetchFromAPI(`/class/delete/${teacherId}`,
            {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
            });
            await fetchFromAPI(`/user/withdraw/${profile.email}`, 
            {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
            });

            googleLogout();
            setProfile(null);
            clearProfileFromStorage();
            navigate("/login");
        } catch (err) {
            console.error("Error during withdrawal:", err);
        }
    };

    const saveSchoolName = async () => 
    {
        if (!schoolName.trim()) 
        {
            alert("유효한 학교명을 입력해주세요.");
            return;
        }

        const schoolData = await fetchSchoolInfo(schoolName);
        if (!schoolData) 
        {
            alert("학교 정보를 가져올 수 없습니다.");
            return;
        }

        if (profile?.email) 
        {
            try {
                await fetchFromAPI("/user/add/school", 
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        email: profile.email,
                        schoolName: schoolName,
                    }),
                });
                alert("학교 이름이 저장되었습니다.");
                navigate(0);
            } catch (err) {
                console.error("Error during save:", err);
            }
        }
    };

    const resetSchoolName = async () => 
    {
        if (!window.confirm("저장된 정보를 초기화합니다.")) return;

        setSchoolName("");
        if (profile?.email) 
        {
            try {
                await fetchFromAPI("/user/add/school", 
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        email: profile.email,
                        schoolName: "RESET",
                    }),
                });
                setFetched(false);
                alert("초기화를 완료했습니다.");
                navigate(0);
            } catch (err) {
                console.error("Error during reset:", err);
            }
        }
    };

    return (
        <div>
            <div>
                <div>
                    <label htmlFor="schoolName">재직중인 학교: </label>
                    <input
                        id="schoolName"
                        type="text"
                        value={schoolName}
                        onChange={(e) => setSchoolName(e.target.value)}
                        placeholder="학교 이름을 입력해주세요."
                    />
                    <button onClick={saveSchoolName}>저장</button>
                    <button onClick={resetSchoolName}>초기화</button>
                </div>
                <h5>
                    {fetched ? null : "재직중인 학교 설정 시 학급 생성은 선택하신 학교로만 가능함에 유의해주세요."}
                </h5>
                <ClassList/>
                <button onClick={() => navigate("/classmaker")}>학급 생성</button>
                </div>
            <button onClick={handleLogout}>로그아웃</button>
            <button onClick={withdrawAlert}>회원탈퇴</button>
        </div>
    );
};

export default Profile;
