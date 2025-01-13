import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUserData } from "../hooks/useUserData";
import { fetchFromAPI } from "../utils/api";
import { fetchSchoolInfo } from "../utils/fetchSchoolInfo";
import ClassList from "./ClassList";
import { useAuth } from "../contexts/AuthContext";
import { googleLogout } from "@react-oauth/google";
import { clearProfileFromStorage } from "../utils/localStorage";
import "../asset/css/Profile.css";

const Profile = () => 
{
    const { schoolName, setSchoolName, teacherId } = useUserData();
    const { profile, setProfile } = useAuth();
    const [fetched, setFetched] = useState(false);
    const navigate = useNavigate();

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
            clearProfileFromStorage();
            localStorage.removeItem("selectedClassId");
            setProfile(null);
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
    };

    const resetSchoolName = async () => 
    {
        if (!window.confirm("저장된 정보를 초기화합니다.")) return;

        setSchoolName("");
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
    };

    return (
        <div>
            선생님 프로필<br/>
            <div className="teacher_profile">
                <div className="google_profile">
                    <img src={profile?.picture} alt="profile_img" className="profile_img"/><br/>
                    {profile?.name} 선생님<br/>
                    {profile?.email}<br/>
                </div>
                <div className="school">
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
                <p>
                    {fetched ? null : "재직중인 학교 설정 시 학급 생성은 선택하신 학교로만 가능함에 유의해주세요."}
                </p>
                <button onClick={handleLogout}>로그아웃</button>
                <button onClick={withdrawAlert}>회원탈퇴</button>
            </div>
            <ClassList />
        </div>
    );
};

export default Profile;
