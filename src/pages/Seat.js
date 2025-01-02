import React, { useState, useRef, useEffect } from 'react';
import ReactModal from "react-modal";
import '../asset/css/Seat.css';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faDownload, faPrint } from "@fortawesome/free-solid-svg-icons";
import { useReactToPrint } from 'react-to-print';
import axios from 'axios';
import html2canvas from 'html2canvas';

const SeatArrangement = () => {
    const [modalShow, setModalShow] = useState(false); // 좌석 생성 모달 상태
    const [seats, setSeats] = useState(Array(60).fill(false)); // 좌석 상태
    const [isDragging, setIsDragging] = useState(false); // 색칠되는 좌석 - true
    const [createdSeats, setCreatedSeats] = useState([]); // 새로 생성된 좌석 상태
    const [loadedSeats, setLoadedSeats] = useState([]); // 기존 로드된 좌석 상태
    const [nameList, setNameList] = useState([]); // 학생들 이름 list
    const [seatState, setSeatState] = useState(false); // 좌석 상태 변경 모달
    const [modifyState, setModifyState] = useState(false); // 수정 상태
    const [firstSeat, setFirstSeat] = useState(null); // 첫 클릭 학생
    const [secondSeat, setSecondSeat] = useState(null); // 두 번째 클릭 학생
    const [countdown, setCountdown] = useState(null); // 카운트다운 상태
    const [buttonsDisabled, setButtonsDisabled] = useState(false); // 버튼 비활성화 상태
    const [showSaveButton, setShowSaveButton] = useState(false); // 저장 버튼 표시 여부
    const [randomSpinLabel, setRandomSpinLabel] = useState("랜덤 돌리기 !"); // 랜덤 버튼 텍스트
    const [randomedSeat, setRandomedSeat] = useState([]); // 랜덤 결과 좌석 리스트
    const contentRef = useRef(); // 프린트 변수 선언

    const downloadSeatsAsImage = async () => {
        if (contentRef.current) {
            try {
                const canvas = await html2canvas(contentRef.current);
                const image = canvas.toDataURL('image/png');

                const link = document.createElement('a');
                link.href = image;
                link.download = 'seat-arrangement.png';

                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            } catch (error) {
                console.error('Error capturing seating arrangement as image:', error);
            }
        }
    };

    const randomSeatHandlerWithCountdown = () => {
        if (loadedSeats.length === 0 && createdSeats.length === 0) {
            return;
        }

        let count = 3;
        setCountdown(count);
        setButtonsDisabled(true);
        setShowSaveButton(false);

        const interval = setInterval(() => {
            count -= 1;
            setCountdown(count);

            if (count === 0) {
                clearInterval(interval);
                setCountdown(null);
                randomSeatHandler();
                setShowSaveButton(true);
                setRandomSpinLabel("다시");
            }
        }, 1000);
    };

    const saveSeatHandler = () => {
        saveStudentsAPI();
        setButtonsDisabled(false);
        setShowSaveButton(false);
        setRandomSpinLabel("랜덤 돌리기 !");
    };

    const resetRandomSpin = () => {
        setButtonsDisabled(false);
        setShowSaveButton(false);
        setRandomSpinLabel("랜덤 돌리기 !");
    };

    useEffect(() => {
        seatTable(); // 초기 좌석 불러오기
        studentNameAPI(); // 이름 불러오기
    }, []);

    useEffect(() => {
        if (firstSeat && secondSeat) {
            const updatedSeats = [...loadedSeats];
            const firstSeatIndex = updatedSeats.findIndex(s => s.seatId === firstSeat.seatId);
            const secondSeatIndex = updatedSeats.findIndex(s => s.seatId === secondSeat.seatId);

            if (firstSeatIndex !== -1 && secondSeatIndex !== -1) {
                const tempStudentName = updatedSeats[firstSeatIndex].studentName;
                updatedSeats[firstSeatIndex].studentName = updatedSeats[secondSeatIndex].studentName;
                updatedSeats[secondSeatIndex].studentName = tempStudentName;

                const tempRowId = updatedSeats[firstSeatIndex].rowId;
                const tempColumnId = updatedSeats[firstSeatIndex].columnId;
                updatedSeats[firstSeatIndex].rowId = updatedSeats[secondSeatIndex].rowId;
                updatedSeats[firstSeatIndex].columnId = updatedSeats[secondSeatIndex].columnId;
                updatedSeats[secondSeatIndex].rowId = tempRowId;
                updatedSeats[secondSeatIndex].columnId = tempColumnId;

                setLoadedSeats(updatedSeats);
            }
            setFirstSeat(null);
            setSecondSeat(null);
        }
    }, [firstSeat, secondSeat, loadedSeats]);

    const seatTable = async () => {
        try {
            const response = await axios.post('http://localhost:3013/api/seat/findAllSeat', { classId: 1 });
            console.log(response.data);
            setLoadedSeats(response.data);
        } catch (error) {
            console.error("기존 좌석 불러오는 API error:", error);
        }
    };

    const studentNameAPI = async () => {
        try {
            const response = await axios.post('http://localhost:3013/api/seat/findName', { classId: 1 });
            console.log(response.data);
            setNameList(response.data.sort((a, b) => a.studentId - b.studentId));
        } catch (error) {
            console.error("학생 이름 조회 중 error:", error);
        }
    };

    const saveStudentsAPI = async () => {
        try {
            await axios.post('http://localhost:3013/api/seat/saveSeat', { studentList: randomedSeat });
            alert("좌석이 저장되었습니다 !");
        } catch (error) {
            console.error("저장 API 요청 중 error:", error);
        }
    };

    const handleRegister = () => {
        if (!seatState) {
            setSeatState(false);
        }

        const newCreatedSeats = seats
            .map((selected, index) => ({ id: index + 1, selected }))
            .filter(seat => seat.selected)
            .map(seat => ({
                ...seat,
                studentName: null,
                studentId: null,
                rowId: Math.floor((seat.id - 1) / 10) + 1,
                columnId: (seat.id - 1) % 10 + 1,
            }));

        newCreatedSeats.forEach((seat, index) => {
            if (index < nameList.length) {
                seat.studentName = nameList[index].studentName;
                seat.studentId = nameList[index].studentId;
            }
        });

        setLoadedSeats([]);
        setCreatedSeats(newCreatedSeats);
        setSeats(Array(60).fill(false));
        setModalShow(false);
    };

    const randomSeatHandler = () => {
        const seatsToShuffle = createdSeats.length > 0 ? createdSeats : loadedSeats;

        if (seatsToShuffle.length === 0) {
            return;
        }

        const studentIds = seatsToShuffle.map(seat => seat.studentId).filter(id => id !== null);
        const shuffledStudentIds = [...studentIds];

        for (let i = shuffledStudentIds.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffledStudentIds[i], shuffledStudentIds[j]] = [shuffledStudentIds[j], shuffledStudentIds[i]];
        }

        const updatedSeats = seatsToShuffle.map((seat, index) => {
            const shuffledStudentId = shuffledStudentIds[index];
            const student = nameList.find(stud => stud.studentId === shuffledStudentId);

            return {
                ...seat,
                studentId: shuffledStudentId,
                studentName: student ? student.studentName : null,
            };
        });

        if (createdSeats.length > 0) {
            setCreatedSeats(updatedSeats);
        } else {
            setLoadedSeats(updatedSeats);
        }

        setRandomedSeat(updatedSeats);
        setModifyState(true);
        setRandomSpinLabel("다시");
    };

    const handlePrint = useReactToPrint({ contentRef });

    const modifyHandler = () => {
        setModifyState(true);
    };

    const handleSeatClick = (seat, index) => {
        if (modifyState) {
            if (!firstSeat) {
                setFirstSeat(seat);
                console.log("첫번째 선택 자리:", seat);
            } else if (!secondSeat) {
                setSecondSeat(seat);
                console.log("두번째 선택 자리:", seat);
            }
        }
    };

    return (
        <>
            {/* 모달 */}
            <ReactModal
                isOpen={modalShow}
                contentLabel="새 좌석 만들기"
                style={{
                    content: {
                        top: '50%',
                        left: '50%',
                        right: 'auto',
                        bottom: 'auto',
                        marginRight: '-50%',
                        transform: 'translate(-50%, -50%)',
                        width: 500,
                        borderRadius: 0,
                        border: "none",
                        padding: 0,
                    },
                    overlay: {
                        backgroundColor: 'rgba(0, 0, 0, 0.75)',
                    },
                }}
            >
                <div className="seat-arrangement">
                    <div
                        className="seat-grid"
                        onMouseUp={() => setIsDragging(false)}
                    >
                        {seats.map((selected, index) => (
                            <div
                                key={index}
                                className={`seat ${selected ? 'selected' : ''}`}
                                onMouseDown={() => {
                                    setIsDragging(true);
                                    setSeats((prevSeats) => {
                                        const newSeats = [...prevSeats];
                                        newSeats[index] = !newSeats[index];
                                        return newSeats;
                                    });
                                }}
                                onMouseEnter={() => {
                                    if (isDragging) {
                                        setSeats((prevSeats) => {
                                            const newSeats = [...prevSeats];
                                            newSeats[index] = true;
                                            return newSeats;
                                        });
                                    }
                                }}
                            />
                        ))}
                    </div>
                    <button className="register-button" onClick={handleRegister}>
                        자리 만들기
                    </button>
                </div>
            </ReactModal>

            {/* UI */}
            <h1>자리 바꾸기</h1>

            <button onClick={() => setModalShow(true)} disabled={buttonsDisabled}>
                + 새 자리배치
            </button>

            <button
                className="register-button"
                onClick={randomSpinLabel === "다시" ? resetRandomSpin : randomSeatHandlerWithCountdown}
                disabled={randomSpinLabel !== "다시" && buttonsDisabled}
            >
                {countdown !== null ? countdown : randomSpinLabel}
            </button>

            {showSaveButton && (
                <button className="register-button red-button" onClick={saveSeatHandler}>
                    저장
                </button>
            )}

            <button onClick={modifyHandler}>자리 수정</button>

            <button onClick={downloadSeatsAsImage} disabled={buttonsDisabled}>
                <FontAwesomeIcon icon={faDownload} />
            </button>

            <button onClick={handlePrint} disabled={buttonsDisabled}>
                <FontAwesomeIcon icon={faPrint} />
            </button>

            {/* 좌석 렌더링 */}
            <div className="created-seats" ref={contentRef}>
                {loadedSeats.map((seat, index) => {
                    const student = nameList.find(student => student.studentId === seat.studentId);
                    const studentName = student ? student.studentName : '학생 없음';

                    return (
                        <div
                            key={`loaded-${seat.seatId}`}
                            className={`seat created ${modifyState ? 'modifiable' : ''}`}
                            style={{
                                gridColumnStart: seat.columnId,
                                gridRowStart: seat.rowId,
                                border: modifyState && (firstSeat?.seatId === seat.seatId || secondSeat?.seatId === seat.seatId) ? "2px solid red" : "none",
                            }}
                            onClick={() => handleSeatClick(seat, index)}
                        >
                            <h4>{studentName}</h4>
                        </div>
                    );
                })}

                <div className="created-seats">
                    {createdSeats.map((seat, index) => (
                        <div
                            key={`created-${seat.id}`}
                            className="seat created new"
                            style={{
                                gridColumnStart: seat.columnId,
                                gridRowStart: seat.rowId,
                            }}
                            onClick={() => handleSeatClick(seat, index)}
                        >
                            <h4>{seat.studentName || ''}</h4>
                        </div>
                    ))}
                </div>
            </div>
        </>
    );
};

export default SeatArrangement;
