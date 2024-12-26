import React, { useState } from "react";
import { useUserData } from "../hooks/useUserData";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faPencilAlt, faTimes } from "@fortawesome/free-solid-svg-icons";
import { fetchFromAPI } from "../utils/api";
import { useNavigate } from "react-router-dom";
import "../asset/css/ClassList.css";

const ClassList = () => 
{
    const { classList, teacherId, classCount } = useUserData();
    const [selectedRow, setSelectedRow] = useState(null);
    const [editIndex, setEditIndex] = useState(null);
    const [newNickname, setNewNickname] = useState("");
    const navigate = useNavigate();

    const handleRowClick = (index) => 
    {
        setSelectedRow(index === selectedRow ? null : index);
    };

    const handleEditClick = (index, currentNickname) => 
    {
        setEditIndex(index);
        setNewNickname(currentNickname);
    };

    const handleUpdate = async (classItem) => 
    {
        if (newNickname.trim() !== "") 
        {
            try {
                await fetchFromAPI(`/class/update/${teacherId}/${classItem.classId}`, {
                    method: "PATCH",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ classNickname: newNickname }),
                });
                navigate(0);
            } catch (err) {
                console.error("Error updating class nickname: ", err);
            } finally {
                setEditIndex(null);
                setNewNickname("");
            }
        }
    };

    const handleDelete = async (classItem) => {
        const confirmationMessage = `
선택한 학급을 삭제합니다.

개설 년도: ${new Date(classItem.classCreated).getFullYear()}
학교 이름: ${classItem.schoolName}
학년: ${classItem.grade}
반: ${classItem.classNo}
학급 별명: ${classItem.classNickname}

삭제된 이후의 학급은 확인할 수 없으며, 복구할 수 없습니다.
정말 선택한 학급을 삭제하시겠습니까?`;

        if (window.confirm(confirmationMessage)) {
            try {
                await fetchFromAPI(`/class/delete/${teacherId}/${classItem.classId}`, {
                    method: "DELETE",
                    headers: { "Content-Type": "application/json" },
                });
                navigate(0);
            } catch (err) {
                console.error("삭제 중 에러 발생: ", err);
            }
        }
    };

    const handleGoToClass = (classItem) => {
        navigate(`/class/${classItem.classId}`);
    };

    const tableStyles = {
        cursor: "pointer",
        width: "100%",
        textAlign: "left",
    };

    const actionButtonStyles = {
        padding: "5px 10px",
        border: "none",
        cursor: "pointer",
    };

    return (
        <div>
            <h4>학급 목록(생성한 학급 수: {classCount}개)</h4>
            {classList.length > 0 ? (
                <table border="1" style={tableStyles}>
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>학년도</th>
                            <th>학교 이름</th>
                            <th>학년</th>
                            <th>반</th>
                            <th>학급 별명</th>
                            <th>선생님</th>
                            <th>개설일</th>
                            <th>삭제 예정일</th>
                        </tr>
                    </thead>
                    <tbody>
                        {classList.map((classItem, index) => (
                            <React.Fragment key={classItem.classId}>
                                <tr
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
                                    <td className="cell">
                                    {editIndex === index ? (
                                        <>
                                            <input
                                                type="text"
                                                value={newNickname}
                                                onChange={(e) => setNewNickname(e.target.value)}
                                                onClick={(e) => e.stopPropagation()}
                                                className="input-nickname"
                                            />
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleUpdate(classItem);
                                                }}
                                                className="button button-save-icon"
                                            >
                                                <FontAwesomeIcon icon={faCheck} />
                                            </button>
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    setEditIndex(null);
                                                    setNewNickname("");
                                                }}
                                                className="button button-cancel-icon"
                                            >
                                                <FontAwesomeIcon icon={faTimes} />
                                            </button>
                                        </>
                                    ) : (
                                        <>
                                            <span>{classItem.classNickname}</span>
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleEditClick(index, classItem.classNickname);
                                                }}
                                                className="button-edit"
                                                title="Edit Nickname"
                                            >
                                                <FontAwesomeIcon icon={faPencilAlt} />
                                            </button>
                                        </>
                                    )}
                                </td>
                                    <td>{classItem.id.name}</td>
                                    <td>{new Date(classItem.classCreated).toLocaleDateString()}</td>
                                    <td>{new Date(classItem.classExpire).toLocaleDateString()}</td>
                                </tr>
                                {selectedRow === index && (
                                    <tr>
                                        <td colSpan="9" style={{ backgroundColor: "#f1f1f1", textAlign: "center" }}>
                                            <button
                                                onClick={() => handleGoToClass(classItem)}
                                                style={{
                                                    ...actionButtonStyles,
                                                    backgroundColor: "#007bff",
                                                    color: "#fff",
                                                    marginRight: "10px",
                                                }}
                                            >
                                                학급 전환
                                            </button>
                                            <button
                                                onClick={() => handleDelete(classItem)}
                                                style={{
                                                    ...actionButtonStyles,
                                                    color: "red",
                                                    border: "1px solid red",
                                                    backgroundColor: "transparent",
                                                }}
                                            >
                                                학급 삭제
                                            </button>
                                        </td>
                                    </tr>
                                )}
                            </React.Fragment>
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
