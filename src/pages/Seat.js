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
    const [nameList, setNameList] = useState([]); // 학생들 이름 list
    const contentRef = useRef(); // 프린트 변수 선언(변수 명 바뀌면 인식 못함)
    const [seatState, setSeatState] = useState(false); // 좌석 상태 변경 모달
    const [modifyState ,setModifyState] = useState(false); // 수정 변경
    const [firstSeat, setFirstSeat] = useState(null); // 첫 클릭 학생
    const [secondSeat, setSecondSeat] = useState(null); // 두번째 클릭 학생

    useEffect(() => {
        seatTable(); // 초기 좌석 불러오기
        studentNameAPI(); // 이름 불러오기
    }, []);

    // 1. 기존 좌석표 불러오는 API
    const seatTable = async () => {
        try {
            const response = await axios.post(
                'http://localhost:3013/api/seat/findAllSeat',
                { classId: 2 },
            );
            console.log(response.data);
            setLoadedSeats(response.data);
        } catch (error) {
            console.error("기존 좌석 불러오는 API error:", error);
        }
    };

    // 학생들 이름 불러오는 API
    const studentNameAPI = async() => {
        try{
            const response = await axios.post(
                'http://localhost:3013/api/seat/findName',
                {classId : 2},
            );
            console.log(response.data);
            setNameList(response.data.sort((a, b) => a.studentId - b.studentId));
        }catch(error){
            console.error("학생 이름 조회 중 error : ", error)
        }
    }

    const saveStudentsAPI = async() => {
        try{
            const response = await axios.post(
                'http://localhost:3013/api/seat/saveSeat',
                {userId : 1, columnId : 1, rowId: 1, classId: 2 }
            );
            console.log(response.data);
        }catch(error){
            console.error("저장 api 요청")
        }
    }

    // 2. 새 좌석 등록하기 (기존 정보 초기화 후 새로 추가)
    const handleRegister = () => {
        if(!seatState){
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
        console.log(newCreatedSeats);
        setSeats(Array(60).fill(false));
        setModalShow(false); // Close modal
    };

    // 3. 랜덤 돌리기 버튼 동작
    const randomSeatHandler = () => {
        if (loadedSeats.length === 0) {
            console.log("error");
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
        saveStudentsAPI();
    }

    // 프린트 버튼 동작
    const handlePrint = useReactToPrint({ contentRef });

    // 학생 추가 handler
    const addStudent = () => { }

    // 수정하기 handler
    const modifyHandler = () => {
        setModifyState(true); // 수정 상태 on
    }

    // 4. 좌석 클릭 시 처리
    const handleSeatClick = (seat, index) => {
        if (modifyState) {
            if (!firstSeat) {
            
                setFirstSeat(seat);
                console.log("First seat set:", seat);  
            } else if (!secondSeat) {
          
                setSecondSeat(seat);
                console.log("Second seat set:", seat); 
            }
        }
    };

  
    useEffect(() => {
        if (firstSeat && secondSeat) {
            const updatedSeats = [...loadedSeats];

            const firstSeatIndex = updatedSeats.findIndex(s => s.seatId === firstSeat.seatId);
            const secondSeatIndex = updatedSeats.findIndex(s => s.seatId === secondSeat.seatId);

            console.log("First seat index:", firstSeatIndex);
            console.log("Second seat index:", secondSeatIndex);

            if (firstSeatIndex !== -1 && secondSeatIndex !== -1) {
               
                const tempStudentName = updatedSeats[firstSeatIndex].studentName;
                updatedSeats[firstSeatIndex].studentName = updatedSeats[secondSeatIndex].studentName;
                updatedSeats[secondSeatIndex].studentName = tempStudentName;

                setLoadedSeats(updatedSeats);
            }

         
            setFirstSeat(null);
            setSecondSeat(null);
        }
    }, [firstSeat, secondSeat, loadedSeats]); 

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
            <button onClick={addStudent}>학생 추가</button>
            <button onClick={modifyHandler}>수정</button>

            <div className="created-seats" ref={contentRef}>
                {/* 기존 로드된 좌석 */}
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
                            <h4>{index + 1} {studentName}</h4>
                        </div>
                    );
                })}

                {/* 새로 생성된 좌석 */}
                <div className="created-seats">
                    {createdSeats.map((seat, index) => (
                        <div
                            key={`created-${seat.id}`}
                            className="seat created new"
                            style={{
                                gridColumnStart: seat.columnId,
                                gridRowStart: seat.rowId,
                            }}
                        >
                            <h4>{index + 1} {seat.studentName || ''}</h4>
                        </div>
                    ))}
                </div>
            </div>
        </>
    );
};

export default SeatArrangement;
