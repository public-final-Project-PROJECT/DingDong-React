import React, { useState, useRef } from 'react';
import { QRCodeCanvas } from 'qrcode.react';
import { fetchSchoolInfo } from '../utils/fetchSchoolInfo';
import { encryptData } from '../utils/encryptData';
import { useReactToPrint } from 'react-to-print'; // 프린트 라이브러리
import { getStoredProfile } from '../utils/localStorage';

const QRCodeGenerator = () => 
{
    const [students, setStudents] = useState([{ num: '', name: '' }]);
    const [schoolName, setSchoolName] = useState('');
    const secretKey = process.env.REACT_APP_QRCODE_SECRET_KEY;
    const today = new Date();
    const contentRef = useRef(); // 프린트 변수 선언(변수 명 바뀌면 인식 못함)
    const [profile, setProfile] = useState(getStoredProfile);
    

    const handleGenerate = async () => 
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

        const qrCodes = students.map((student) => 
        {
            if (!student.num || !student.name) 
            {
                alert('빈 칸을 모두 채워야합니다.');
                return { encrypted: '', original: '' };
            }

            const regex = /^[0-9]+$/;
            if (!regex.test(student.num)) 
            {
                alert('번호는 반드시 숫자여야 합니다.');
                return { encrypted: '', original: '' };
            }

            const dataToEncrypt = 
            {
                student: { student_num: student.num, student_name: student.name },
                teacher: { teacher_name: profile.name, teacher_email: profile.email },
                school: schoolData,
                year: today.getFullYear(),
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
        setStudents((prev) => [...prev, { num: '', name: '' }]);
    };

    const removeStudent = (index) => 
    {
        setStudents((prev) => prev.filter((_, i) => i !== index));
    };

    // 프린트 버튼 동작
    const handlePrint = useReactToPrint({ contentRef });

    return (
        <div>
            <h2>학생용 QR 코드 생성</h2>

            <div>
                <label htmlFor="schoolName">학교 이름: </label>
                <input
                    id="schoolName"
                    type="text"
                    value={schoolName}
                    onChange={(e) => setSchoolName(e.target.value)}
                    placeholder="학교 이름을 입력해주세요."
                />
            </div>

            <h3>학생 정보 입력</h3>
            {students.map((student, index) => (
                <div key={index} style={{ marginBottom: '10px' }}>
                    <label>
                        번호:
                        <input
                            type="text"
                            value={student.num}
                            onChange={(e) => handleStudentChange(index, 'num', e.target.value)}
                            placeholder="학생의 번호를 입력해주세요."
                        />
                    </label>
                    <label style={{ marginLeft: '10px' }}>
                        학생 이름:
                        <input
                            type="text"
                            value={student.name}
                            onChange={(e) => handleStudentChange(index, 'name', e.target.value)}
                            placeholder="학생의 이름을 입력해주세요."
                        />
                    </label>
                    <button onClick={() => removeStudent(index)} disabled={students.length === 1}>
                        삭제
                    </button>
                </div>
            ))}
            <button onClick={addStudent}>학생 추가</button>
            <button onClick={handleGenerate}>코드 생성</button>
            <button onClick={handlePrint} disabled={students.every((student) => !student.qrCode)}>코드 인쇄</button>

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
                            <div>
                                <QRCodeCanvas value={student.qrCode} />
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
