import { googleLogout } from "@react-oauth/google";
import { getStoredProfile, clearProfileFromStorage } from "../utils/localStorage";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { fetchFromAPI } from "../utils/api";
import { fetchSchoolInfo } from "../utils/fetchSchoolInfo";

const schoolNames = {};

const Profile = () => 
{
    const [profile, setProfile] = useState(getStoredProfile);
    const [schoolName, setSchoolName] = useState('');
    const navigate = useNavigate();

    useEffect(() => 
    {
        if (profile?.email) 
        {
            setSchoolName(schoolNames[profile.email] || '');
        }
    }, [profile]);

    const handleLogout = () => 
    {
        googleLogout();
        setProfile(null);
        clearProfileFromStorage();
        navigate("/login");
    };

    const withdrawAlert = () => 
    {
        const confirmMessage = window.confirm("정말 탈퇴하시겠습니까?\n탈퇴 후 모든 정보가 삭제되며 복구할 수 없습니다.");
        if (confirmMessage) 
        {
            handleWithdraw();
            alert("회원탈퇴가 완료되었습니다.");
        }
    };

    const handleWithdraw = async () => 
    {
        try {
            await fetchFromAPI(`/user/withdraw/${profile.email}`, 
            {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email: profile.email }),
            });
            handleLogout();
        } catch (err) {
            console.error("Error during withdrawal:", err);
        }
    };

    const saveSchoolName = async () => 
    {
        if (!schoolName.trim()) 
        {
            alert('유효한 학교명을 입력해주세요.');
            return;
        }

        const schoolData = await fetchSchoolInfo(schoolName);
        if (!schoolData) 
        {
            alert('학교 정보를 가져올 수 없습니다.');
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
                schoolNames[profile.email] = schoolName;
                alert("학교 이름이 저장되었습니다.");
            } catch (err) {
                console.error("Error during fetch:", err);
            }
        }
    };

    const resetSchoolName = async () => 
    {
        const confirmMessage = window.confirm("저장된 정보를 초기화합니다.");
        setSchoolName('');
        if (profile?.email && confirmMessage) 
        {
            try {
                await fetchFromAPI("/user/add/school", 
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        email: profile.email,
                        schoolName: null,
                    }),
                });
                
                delete schoolNames[profile.email];
                alert("초기화를 완료했습니다.");
            } catch (err) {
                console.error("Error during login:", err);
            }
        }
    };

    return (
        <div>
            <button onClick={() => navigate("/postmappingtest")}>Fetch 테스트</button>
            <div>
                <h3>이름: {profile?.name}</h3>
                <h3>이메일: {profile?.email}</h3>
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
                    근무중인 학교 설정 시 학급 생성은 선택하신 학교로만 가능함에 유의해주세요.
                </h5>
                <h3>학급 목록</h3>
                <h5>
                    학급은 최대 2개까지 생성하실 수 있으며, 생성일자로부터 2년 후의 3월
                    1일에 자동으로 삭제됩니다.<br/>
                    삭제된 이후의 학급은 확인할 수 없으니 중요한 정보는 미리 백업해주세요.
                </h5>
                {/* DB에서 teacher_id와 일치하는 학급 리스트, 생성 버튼 컴포넌트로 불러오기 */}
                {/* 년도, 학년, 반, 별명, 삭제버튼 순으로 표시 */}
            </div>
            <button onClick={handleLogout}>로그아웃</button>
            <button onClick={withdrawAlert}>회원탈퇴</button>
        </div>
    );
};

export default Profile;
