import React, { useEffect, useRef, useState } from "react";
import { useUserData } from "../hooks/useUserData";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faPencilAlt, faTimes } from "@fortawesome/free-solid-svg-icons";
import { fetchFromAPI } from "../utils/api";
import { useNavigate } from "react-router-dom";
import "../asset/css/ClassList.css";
import ClassMaker from "./ClassMaker";
import QRCodeGenerator from "./QRCodeGenerator";
import { useAuth } from "../contexts/AuthContext";

const ClassListTable = ({ classList, selectedRow, onRowClick, onEditClick, editIndex, newNickname, setNewNickname, handleUpdate, handleQRCode, switchClassId, handleDelete }) => 
{
    return (
        <table className="classListTable">
            <thead>
                <tr className="classListTable-th">
                    <th>#</th>
                    <th>학년도</th>
                    <th>학교 이름</th>
                    <th>학년</th>
                    <th>반</th>
                    <th>학급 이름</th>
                    <th>선생님</th>
                    <th>개설일</th>
                    <th>삭제 예정일</th>
                </tr>
            </thead>
            <tbody>
                {classList.map((classItem, index) => (
                    <React.Fragment key={classItem.classId}>
                        <tr className="classListRow"
                            onClick={() => onRowClick(index)}
                            style={{
                                backgroundColor: selectedRow === index ? "#fff" : "#f9f9f9",
                                paddingBottom: "30px",
                            }}
                            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#e8e8e8")}
                            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = selectedRow === index ? "#f8f8f8" : "#fff")}
                        >
                            <td>{index + 1}</td>
                            <td>{new Date(classItem.classCreated).getFullYear()}</td>
                            <td>{classItem.schoolName}</td>
                            <td>{classItem.grade}</td>
                            <td>{classItem.classNo}</td>
                            <td className="cell">
                                {editIndex === index ? (
                                    <EditNicknameCell
                                        newNickname={newNickname}
                                        setNewNickname={setNewNickname}
                                        handleUpdate={() => handleUpdate(classItem)}
                                        onCancel={() => onEditClick(null, "")}
                                    />
                                ) : (
                                    <DisplayNicknameCell
                                        nickname={classItem.classNickname}
                                        onEdit={() => onEditClick(index, classItem.classNickname)}
                                    />
                                )}
                            </td>
                            <td>{classItem.id.name}</td>
                            <td>{new Date(classItem.classCreated).toLocaleDateString()}</td>
                            <td>{new Date(classItem.classExpire).toLocaleDateString()}</td>
                        </tr>
                        {selectedRow === index && (
                            <ExpandedRowActions
                                classItem={classItem}
                                onQRCode={(classItem) => handleQRCode(classItem)}
                                onClassSwitch={() => switchClassId(classItem)}
                                onDelete={() => handleDelete(classItem)}
                            />
                        )}
                    </React.Fragment>
                ))}
            </tbody>
        </table>
    );
};

const EditNicknameCell = ({ newNickname, setNewNickname, handleUpdate, onCancel }) => 
{
    const [inputWidth, setInputWidth] = useState(``);
    const spanRef = useRef(null);

    useEffect(() => 
    {
        if (spanRef.current) 
        {
            const calculatedWidth = spanRef.current.offsetWidth;
            setInputWidth(`${calculatedWidth}px`);
        }
    }, [newNickname]);

    return (
        <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
            <span
                ref={spanRef}
                style={{
                    visibility: "hidden",
                    position: "absolute",
                    whiteSpace: "nowrap",
                    pointerEvents: "none",
                }}
            >
                {newNickname || " "}
            </span>
            <div>
                <input
                    type="text"
                    value={newNickname}
                    onChange={(e) => setNewNickname(e.target.value)}
                    onClick={(e) => e.stopPropagation()}
                    className="input-nickname"
                    style={{ 
                        minWidth: "36px",
                        width: inputWidth 
                    }}
                />
                <button
                    className="button button-save-icon"
                    onClick={(e) => 
                    {
                        e.stopPropagation();
                        handleUpdate();
                    }}
                >
                    <FontAwesomeIcon icon={faCheck} />
                </button>
                <button
                    className="button button-cancel-icon"
                    onClick={(e) => 
                    {
                        e.stopPropagation();
                        onCancel();
                    }}
                >
                    <FontAwesomeIcon icon={faTimes} />
                </button>
            </div>
        </div>
    );
};

const DisplayNicknameCell = ({ nickname, onEdit }) => (
    <div>
        <span>{nickname}</span>
        <button
            className="button-edit"
            onClick={(e) => 
            {
                e.stopPropagation();
                onEdit();
            }}
        >
            <FontAwesomeIcon icon={faPencilAlt} />
        </button>
    </div>
);

const ExpandedRowActions = ({ classItem, onQRCode, onClassSwitch, onDelete }) => (
    <tr>
        <td colSpan="9" className="expandedRowActions">
            <button className="createQRcode"
                onClick={(e) => 
                {
                    e.stopPropagation(); 
                    onQRCode(classItem);
                }}
            >
                QR 코드 생성
            </button>
            <button className="classSetting"
                onClick={(e) => 
                {
                    e.stopPropagation();
                    onClassSwitch();
                }}
            >
                기본 학급으로 설정
            </button>
            <button className="classDelete-button"
                onClick={(e) => 
                {
                    e.stopPropagation();
                    onDelete();
                }}
            >
                학급 삭제
            </button>
        </td>
    </tr>
);

const ClassList = () => 
{
    const { classList, teacherId, classCount, setSelectedClassId } = useUserData();
    const { profile } = useAuth();
    const [selectedRow, setSelectedRow] = useState(null);
    const [editIndex, setEditIndex] = useState(null);
    const [newNickname, setNewNickname] = useState("");
    const [selectedClassItem, setSelectedClassItem] = useState(null);
    const [openMaker, setOpenMaker] = useState(false);
    const [openCode, setOpenCode] = useState(false);
    const navigate = useNavigate();
    const scrollRef = useRef();

    useEffect(() => 
    {
        scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [openCode, openMaker]);

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
        if(classItem.classNickname === newNickname)
        {
            setEditIndex(null);
            setNewNickname("");
            return;
        }

        // 일부러 왼쪽으로 붙인 것
        const confirmationMessage =
`학급 이름을 변경하시겠습니까?
변경 전: ${classItem.classNickname}
변경 후: ${newNickname}`

        if (window.confirm(confirmationMessage) && newNickname.trim() !== "") 
        {
            try {
                await fetchFromAPI(`/class/update/${teacherId}/${classItem.classId}`, 
                {
                    method: "PATCH",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ classNickname: newNickname })
                });
                alert("학급 이름이 변경되었습니다.");
                navigate(0);
            } catch (err) {
                alert("변경되지 않았습니다.");
            } finally {
                setEditIndex(null);
                setNewNickname("");
            }
        }
    };

    const handleDelete = async (classItem) => 
    {
        // 일부러 왼쪽으로 붙인 것
        const confirmationMessage = 
`선택한 학급을 삭제합니다.
개설 년도: ${new Date(classItem.classCreated).getFullYear()}
학급 정보: ${classItem.schoolName} ${classItem.grade}학년 ${classItem.classNo}반
학급 별명: ${classItem.classNickname}
삭제된 이후의 학급은 확인할 수 없으며, 복구할 수 없습니다.
정말 선택한 학급을 삭제하시겠습니까?`;

        if (window.confirm(confirmationMessage)) 
        {
            try {
                await fetchFromAPI(`/class/delete/${teacherId}/${classItem.classId}`, 
                {
                    method: "DELETE",
                    headers: { "Content-Type": "application/json" }
                });
                setSelectedClassId(0);                
                alert("학급이 삭제되었습니다.");
                navigate(0);
            } catch (err) {
                alert("삭제되지 않았습니다.");
            }
        }
    };

    const handleQRCode = (classItem) => 
    {
        setOpenMaker(false);
        setOpenCode(true);
        setSelectedClassItem(classItem);
    };

    const switchClassId = async (classItem) => 
    {
        try {
            await fetchFromAPI("/user/add/class", 
            {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email: profile.email, latestClassId: classItem.classId })
            });
            setSelectedClassId(classItem.classId);
            alert(`${classItem.classNickname}을(를) 기본 학급으로 설정합니다.`);
            navigate(`/`);
        } catch (error) {
            console.error("Error fetching class id:", error);
        }
    };

    const handleMake = () =>
    {
        if(classCount === 2)
        {
            alert("학급은 최대 2개까지 생성할 수 있습니다.");
            return;
        }
        else
        {
            setOpenCode(false);
            setOpenMaker(true);
        }
    }

    return (
        <div className="class-list-container">
            {classList.length > 0 ? (
                <>
                    <br/>
                    <p>학급 목록 (생성된 학급 수: {classCount}/2)</p>
                    <button className="button-create" onClick={handleMake}>
                        학급 생성
                    </button>
                    <ClassListTable
                        classList={classList}
                        selectedRow={selectedRow}
                        onRowClick={handleRowClick}
                        onEditClick={handleEditClick}
                        editIndex={editIndex}
                        newNickname={newNickname}
                        setNewNickname={setNewNickname}
                        handleUpdate={handleUpdate}
                        handleQRCode={handleQRCode}
                        switchClassId={switchClassId}
                        handleDelete={handleDelete}
                    />
                    <br/>
                    {openMaker && (
                        <div className="class-maker-container" ref={scrollRef}>
                            <button
                                className="button button-cancel-icon"
                                onClick={() => setOpenMaker(false)}
                            >
                                <FontAwesomeIcon icon={faTimes} />
                            </button>
                            <ClassMaker />
                        </div>
                    )}
                    {openCode && (
                        <div className="class-qrcode-container" ref={scrollRef}>
                            <button
                                className="button button-cancel-icon"
                                onClick={() => setOpenCode(false)}
                            >
                                <FontAwesomeIcon icon={faTimes} />
                            </button>
                            <QRCodeGenerator classData={selectedClassItem} />
                        </div>
                    )}
                </>
            ) : (
                <div className="no-classes">
                    <ClassMaker />
                </div>
            )}
        </div>
    );
};

export default ClassList;
