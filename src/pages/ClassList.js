import { useState } from "react";
import { useUserData } from "../hooks/useUserData";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPencilAlt } from "@fortawesome/free-solid-svg-icons";

const ClassList = () => 
{
    const { classList } = useUserData();
    const [selectedRow, setSelectedRow] = useState(null);

    const handleRowClick = (index) => 
    {
        setSelectedRow(index === selectedRow ? null : index);
    };

    const handleUpdate = (classItem) => 
    {
        const newNickname = prompt("Enter a new nickname:", classItem.classNickname);
        if (newNickname) 
        {
            console.log(`Updating classNickname to: ${newNickname}`);
            // API
        }
    };

    const handleDelete = (classItem) => 
    {
        if (window.confirm(`Are you sure you want to delete ${classItem.classNickname}?`)) {
            console.log(`Deleting class: ${classItem.classNickname}`);
            // API
        }
    };

    const handleGoToClass = (classItem) => 
    {
        console.log(`Navigating to class: ${classItem.classNickname}`);
        // 구현 예정
    };

    return (
        <div>
            <h4>학급 목록</h4>
            {classList.length > 0 ? (
                <table border="1" style={{ cursor: "pointer", width: "100%", textAlign: "left" }}>
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>개설 년도</th>
                            <th>학교 이름</th>
                            <th>학년</th>
                            <th>반</th>
                            <th>학급 별명</th>
                            <th>선생님</th>
                        </tr>
                    </thead>
                    <tbody>
                        {classList.map((classItem, index) => (
                            <>
                                <tr
                                    key={`row-${index}`}
                                    onClick={() => handleRowClick(index)}
                                    style={{
                                        backgroundColor: selectedRow === index ? "#d1e7dd" : "#f9f9f9",
                                    }}
                                    onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#e8e8e8")}
                                    onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = selectedRow === index ? "#d1e7dd" : "#f9f9f9")}
                                >
                                    <td>{index + 1}</td>
                                    <td>{new Date(classItem.classCreated).getFullYear()}</td>
                                    <td>{classItem.schoolName}</td>
                                    <td>{classItem.grade}</td>
                                    <td>{classItem.classNo}</td>
                                    <td style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                                        <span>{classItem.classNickname}</span>
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleUpdate(classItem);
                                            }}
                                            style={{
                                                backgroundColor: "transparent",
                                                border: "none",
                                                cursor: "pointer",
                                                padding: "0",
                                                display: "flex",
                                                alignItems: "center",
                                                fontSize: "14px",
                                                height: "20px",
                                                width: "20px",
                                            }}
                                            title="Edit Nickname"
                                        >
                                            <FontAwesomeIcon icon={faPencilAlt} />
                                        </button>
                                    </td>
                                    <td>{classItem.id.name}</td>
                                </tr>
                                {selectedRow === index && (
                                    <tr key={`buttons-${index}`}>
                                        <td colSpan="7" style={{ backgroundColor: "#f1f1f1", textAlign: "center" }}>
                                            <button
                                                onClick={() => handleGoToClass(classItem)}
                                                style={{
                                                    marginRight: "10px",
                                                    backgroundColor: "#007bff",
                                                    color: "#fff",
                                                    border: "none",
                                                    padding: "5px 10px",
                                                    cursor: "pointer",
                                                }}
                                            >
                                                학급 이동
                                            </button>
                                            <button
                                                onClick={() => handleDelete(classItem)}
                                                style={{
                                                    color: "red",
                                                    backgroundColor: "transparent",
                                                    border: "1px solid red",
                                                    padding: "5px 10px",
                                                    cursor: "pointer",
                                                }}
                                            >
                                                학급 삭제
                                            </button>
                                        </td>
                                    </tr>
                                )}
                            </>
                        ))}
                    </tbody>
                </table>
            ) : (
                <p>서버에 연결 중입니다...</p>
            )}
        </div>
    );
};

export default ClassList;
