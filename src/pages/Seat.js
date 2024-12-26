import React, { useState, useRef, useEffect } from 'react';
import ReactModal from "react-modal";
import '../asset/css/Seat.css';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faDownload, faPrint } from "@fortawesome/free-solid-svg-icons";
import { useReactToPrint } from 'react-to-print';
import axios from 'axios';

const SeatArrangement = () => {
    const [modalShow, setModalShow] = useState(false); // 좌석 생성 모달 상태
    const [seats, setSeats] = useState(Array(60).fill(false)); // 좌석 상태
    const [isDragging, setIsDragging] = useState(false); // 색칠되는 좌석 - true
    const [createdSeats, setCreatedSeats] = useState([]); // 새로 생성된 좌석 상태
    const [loadedSeats, setLoadedSeats] = useState([]); // 기존 로드된 좌석 상태
    const contentRef = useRef(); // 프린트 변수 선언(변수 명 바뀌면 인식 못함)

    useEffect(() => {
        seatTable(); // 초기 좌석 불러오기
    }, []);

    // 1. 기존 좌석표 불러오는 API
    const seatTable = async () => {
        try {
            const response = await axios.post('http://localhost:3013/api/seat/findAllSeat', { classId: 1 });
            console.log(response.data); 
            setLoadedSeats(response.data); 
        } catch (error) {
            console.error("기존 좌석 불러오는 API error:", error);
        }
    };

    // 2. 새 좌석 등록하기 (기존 정보 초기화 후 새로 추가)
    const handleRegister = () => {
        const newCreatedSeats = seats
            .map((selected, index) => ({ id: index + 1, selected }))
            .filter(seat => seat.selected)
            .map(seat => ({
                ...seat,
                studentName: null,
                studentId: null,
                rowId: Math.floor((seat.id - 1) / 10) + 1, // 행 계산
                columnId: (seat.id - 1) % 10 + 1,           // 열 계산
            }));

        setLoadedSeats([]); // 기존 로드된 좌석 초기화
        setCreatedSeats(newCreatedSeats); // 새로 생성된 좌석만 저장
        setSeats(Array(60).fill(false)); // 초기화
        setModalShow(false); // 모달 닫기
    };

    // 3. 랜덤 돌리기 버튼 동작
    const randomSeatHandler = () => {
        if (loadedSeats.length === 0) {
            console.log("No loaded seats to randomize.");
            return;
        }

        const studentIds = loadedSeats.map(seat => seat.studentId);

        const shuffledStudentIds = [...studentIds];
        for (let i = shuffledStudentIds.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffledStudentIds[i], shuffledStudentIds[j]] = [shuffledStudentIds[j], shuffledStudentIds[i]];
        }

        const updatedLoadedSeats = loadedSeats.map((seat, index) => ({
            ...seat,
            studentId: shuffledStudentIds[index],
        }));

        setLoadedSeats(updatedLoadedSeats);
    };

    // 저장 handler
    const saveSeatHandler =() => {

    }

     // 프린트 버튼 동작     
     const handlePrint = useReactToPrint({ contentRef });

    return (
        <>
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
                        backgroundColor: 'rgba(0, 0, 0, 0.75)'
                    }
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
                    <button className="register-button" onClick={handleRegister}>자리 만들기</button>
                </div>
            </ReactModal>

            <h1>자리 바꾸기</h1>
            <button className="register-button" onClick={() => setModalShow(true)}>+ 새 자리배치</button>
            <button className="register-button" onClick={randomSeatHandler}>랜덤 돌리기 !</button>
            <button onClick={handlePrint}><FontAwesomeIcon icon={faPrint} /></button>
            <button onClick={saveSeatHandler}>저장</button>
            <button><FontAwesomeIcon icon={faDownload} /></button>

            <div className="created-seats" ref={contentRef}>
                {/* 기존 로드된 좌석 */}
                {loadedSeats.map((seat, index) => (
                    <div
                        key={`loaded-${seat.seatId}`}
                        className="seat created"
                        style={{
                            gridColumnStart: seat.columnId,
                            gridRowStart: seat.rowId,
                        }}
                    >
                        <h4>{seat.seatId}: ID {seat.studentId}</h4>
                    </div>
                ))}

                {/* 새로 생성된 좌석 */}
                <div className="created-seats" ref={contentRef}>
                    {createdSeats.map((seat, index) => (
                        <div
                            key={`created-${seat.id}`}
                            className="seat created new"
                            style={{
                                gridColumnStart: seat.columnId,
                                gridRowStart: seat.rowId,
                            }}
                        >
                            <h4>{seat.id} (New)</h4>
                        </div>
                    ))}
                </div>
            </div>
        </>
    );
};

export default SeatArrangement;
