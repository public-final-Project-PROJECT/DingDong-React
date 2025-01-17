import { useState, useRef, useEffect } from 'react';
import { QRCodeCanvas } from 'qrcode.react';
import { fetchSchoolInfo } from '../utils/fetchSchoolInfo';
import { encryptData } from '../utils/encryptData';
import { useUserData } from '../hooks/useUserData'; 
import { SchoolNameDisplay } from '../component/SchoolNameDisplay';
import { useReactToPrint } from 'react-to-print';
import '../asset/css/QRCodeGenerator.css';

const QRCodeGenerator = ({ classData }) => 
{
    const { schoolName, setSchoolName, isSchoolNameEditable } = useUserData();
    const [students, setStudents] = useState([{ no: '', name: '' }]);
    const secretKey = process.env.REACT_APP_QRCODE_SECRET_KEY;
    const scrollRef = useRef();
    const contentRef = useRef();

    const handleGenerate = async () => 
    {
        if (!classData.schoolName.trim()) 
        {
            alert('유효한 학교명을 입력해주세요.');
            return;
        }

        const schoolData = await fetchSchoolInfo(classData.schoolName);
        if (!schoolData) 
        {
            alert('학교 정보를 가져올 수 없습니다.');
            return;
        }

        const qrCodes = students.map((student) => 
        {
            if (!student.no || !student.name) 
            {
                alert('빈 칸을 모두 채워야합니다.');
                return { encrypted: '', original: '' };
            }

            const regex = /^[0-9]+$/;
            if (!regex.test(student.no)) 
            {
                alert('번호는 반드시 숫자여야 합니다.');
                return { encrypted: '', original: '' };
            }

            const dataToEncrypt = 
            {
                studentInfo: { studentNo: parseInt(student.no), studentName: student.name },
                teacherId: parseInt(classData.id.id),
                classId: parseInt(classData.classId),
                year: parseInt(new Date(classData.classCreated).getFullYear())
            };

            return {
                original: JSON.stringify(dataToEncrypt),
                encrypted: encryptData(dataToEncrypt, secretKey),
            };
        });

        setStudents((prev) =>
            prev.map((student, idx) => ({
                ...student,
                qrCode: qrCodes[idx]?.encrypted,
                originalQRCode: qrCodes[idx]?.original,
            }))
        );
    };

    const handleStudentChange = (index, field, value) => 
    {
        setStudents((prev) => 
        {
            const updatedStudents = [...prev];
            updatedStudents[index][field] = value;
            return updatedStudents;
        });
    };

    const addStudent = () => 
    {
        setStudents((prev) => [...prev, { no: '', name: '' }]);
    };

    const removeStudent = (index) => 
    {
        setStudents((prev) => prev.filter((_, i) => i !== index));
    };

    // 프린트 버튼 동작
    const handlePrint = useReactToPrint({ contentRef });

    useEffect(() => 
    {
        scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
    });

    return (
        <div className="studentQRcode">
            <h2>학생용 QR 코드 생성</h2>
            <p>해당 QR 코드를 통해 학생용 어플에 로그인할 수 있습니다.</p>
            {classData ? (
                <div className="ClassData">
                    <p>학급 정보 : {classData.schoolName} {classData.grade}학년 {classData.classNo}반</p>
                    <p>학급 이름 : {classData.classNickname}</p>
                </div>
            ) : (
                <SchoolNameDisplay
                    isEditable={isSchoolNameEditable}
                    schoolName={schoolName}
                    onChange={(e) => setSchoolName(e.target.value)}
                />
            )}             
            <h3>학생 정보 입력</h3>
            {students.map((student, index) => (
                <div className="studentInfoInput" key={index} style={{ marginBottom: '10px' }} ref={scrollRef}>
                    <label className="studentNoInput">
                        번호:
                        <input
                            type="text"
                            value={student.no}
                            onChange={(e) => handleStudentChange(index, 'no', e.target.value)}
                            placeholder="학생의 번호를 입력해주세요."
                        />
                    </label>
                    <label className="studentNameInput" style={{ marginLeft: '10px' }}>
                        학생 이름:
                        <input
                            type="text"
                            value={student.name}
                            onChange={(e) => handleStudentChange(index, 'name', e.target.value)}
                            placeholder="학생의 이름을 입력해주세요."
                        />
                    </label>
                    <button className="deleteBlock" onClick={() => removeStudent(index)} disabled={students.length === 1}>
                        삭제
                    </button>
                </div>
            ))}
            <button onClick={addStudent}>학생 추가</button>
            <button onClick={handleGenerate}>코드 생성</button>
            <button onClick={handlePrint} disabled={students.every((student) => !student.qrCode)}>
                코드 인쇄
            </button>

            <div
                ref={contentRef} // 프린트하고 싶은 div에 추가
                style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
                    gap: '10px',
                    marginTop: '20px',
                }}
            >
                {students.map((student, index) => (
                    <div key={index} style={{ textAlign: 'center', padding: '10px' }}>
                        <h4>{(student.originalQRCode || student.qrCode) && student.name}</h4>

                        {/* 회원가입용 암호화 된 QR 코드 */}
                        {student.qrCode && (
                            <div ref={scrollRef}>
                                <QRCodeCanvas value={student.qrCode}/>
                            </div>
                        )}

                        {/* json 데이터 확인용 암호화되지 않은 QR 코드 */}
                        {/* {student.originalQRCode && (
                            <div>
                                <h5>Original Data QR Code</h5>
                                <QRCodeCanvas value={student.originalQRCode} />
                            </div>
                        )}  */}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default QRCodeGenerator;
