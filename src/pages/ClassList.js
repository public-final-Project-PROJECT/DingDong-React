import { useUserData } from "../hooks/useUserData";

const ClassList = () => {
    const {
        schoolName,
        classList,
    } = useUserData();

    return (
        <div>
            <h1>학급 목록</h1>
            {classList.length > 0 ? (
                <table border="1" style={{ width: "100%", textAlign: "left" }}>
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>학교 이름</th>
                            <th>학년</th>
                            <th>반</th>
                            <th>학급 별명</th>
                            <th>선생님</th>
                        </tr>
                    </thead>
                    <tbody>
                        {classList.map((classItem, index) => (
                            <tr key={index}>
                                <td>{index + 1}</td>
                                <td>{classItem.schoolName}</td>
                                <td>{classItem.grade}</td>
                                <td>{classItem.classNo}</td>
                                <td>{classItem.classNickname}</td>
                                <td>{classItem.id.name}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            ) : (
                <p>생성된 학급이 없습니다.</p>
            )}
        </div>
    );
};

export default ClassList;
