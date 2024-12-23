
import React, { useState, useRef, useEffect } from 'react'; 
import ReactModal from "react-modal"; 
import '../asset/css/Seat.css'; 
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"; 
import { faBars, faDownload, faPrint} from "@fortawesome/free-solid-svg-icons"; 
import { useReactToPrint } from 'react-to-print'; // 프린트 라이브러리 
import axios from 'axios';  

// 컬럼 (index % numberOfColumns) + 1
// 행 Math.floor(index / numberOfColumns) + 1

const SeatArrangement = () => {
    const [modalShow, setModalShow] = useState(false); // 좌석 생성 모달 상태
    const [seats, setSeats] = useState(Array(60).fill(false)); // 좌석 상태
    const [isDragging, setIsDragging] = useState(false); // 색칠되는 좌석 - true
    const [createdSeats, setCreatedSeats] = useState([]); // 생성된 좌석 상태
    const [detailButtonShow, setDetailButtonShow] = useState(false); // 상세 기능 버튼 상태
    const contentRef = useRef(); // 프린트 변수 선언(변수 명 바뀌면 인식 못함)
    const classId = 1;
    
    // 학생 데이터 (학생 ID 추가)
    const [studentsSeat, setStudentsSeat] = useState([
        { index: 1, studentName: "최서연", studentId: 101 },
        { index: 2, studentName: "유재석", studentId: 102 },
        { index: 3, studentName: "정준하", studentId: 103 },
        { index: 4, studentName: "박명수", studentId: 104 },
        { index: 5, studentName: "유재석", studentId: 102 },
        { index: 6, studentName: "박명수", studentId: 104 },
        { index: 7, studentName: "학생이름", studentId: 105 },
        { index: 8, studentName: "이름", studentId: 106 },
        { index: 9, studentName: "정준하", studentId: 103 },
        { index: 10, studentName: "정준하", studentId: 103 },
        { index: 11, studentName: "정준하", studentId: 103 },
        { index: 12, studentName: "정준하", studentId: 103 }
    ]);
    
    const [afterSeat, setAfterSeat] = useState([{ index: "", studentsSeat: "" }]);

   
    useEffect(()=> {
        seatTable();
    })

    // 기존 좌석표 불러오는 API
    function seatTable() {
        try{
             axios.post({
                url: 'http://localhost:3013/api/seat/findAllSeat',
                params: { classId: 1 },
                }).then(function (response){
                    console.log(response);
                    console.log(response.data);
                })
        }catch(e){
            console.log(err => "기존 좌석 불러오는 API error : " + err)
        }
    }

    const handleMouseDown = (index) => {
        setIsDragging(true);
        toggleSeat(index);
    };

    const handleMouseUp = () => {
        setIsDragging(false);
    };

    const handleMouseEnter = (index) => {
        if (isDragging) toggleSeat(index);
    };

    const toggleSeat = (index) => {
        setSeats((prevSeats) => {
            const newSeats = [...prevSeats];
            newSeats[index] = !newSeats[index];
            return newSeats;
        });
    };

    // 새 좌석 등록하기 handler
    const handleRegister = () => {
        const newCreatedSeats = seats
            .map((selected, index) => ({ id: index, selected }))
            .filter(seat => seat.selected);

        const updatedSeats = newCreatedSeats.map((seat, seatIndex) => {
            const student = studentsSeat.find(s => s.index === seatIndex + 1);
            return { ...seat, studentName: student ? student.studentName : null, studentId: student ? student.studentId : null };
        });

        setCreatedSeats((prevCreatedSeats) => [...prevCreatedSeats, ...updatedSeats]);

        setSeats(Array(60).fill(false));
        setModalShow(false);
    };

    // 프린트 버튼 동작
    const handlePrint = useReactToPrint({ contentRef });

    const shuffleArray = (array) => {
        let shuffledArray = [...array];
        for (let i = shuffledArray.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffledArray[i], shuffledArray[j]] = [shuffledArray[j], shuffledArray[i]];
        }
        setAfterSeat(shuffledArray);
        return shuffledArray;
    };

    // 랜덤돌리기 버튼 handler
    const randomSeatHandler = () => {
        const shuffledStudents = shuffleArray(studentsSeat);

        const updatedSeats = createdSeats.map((seat, index) => {
            const student = shuffledStudents[index];
            return { ...seat, studentName: student ? student.studentName : null, studentId: student ? student.studentId : null };
        });
        setCreatedSeats(updatedSeats);
    };

    // 좌석 저장 요청
    const saveSeatHandler = () => {
        const result = saveSeatApi();
    }

    // 좌석 저장 API
    const saveSeatApi = async () => {
        try {
            const numberOfColumns = 10; 
            const savedSeats = createdSeats.map((seat, index) => {
                
                const row = Math.floor(index / numberOfColumns) + 1;
                const column = (index % numberOfColumns) + 1;

                return {
                    // studentId: seat.studentId,
                    row,
                    column,
                };
            });
            console.log(savedSeats);

            const response = await axios.post('api/seat/newseat', {
                body: {
                    indexNameData: savedSeats, // 좌석 정보 (학생ID, 행, 열)
                }
            });

            console.log('Response:', response.data);
            return response.data;
        } catch (error) {
            console.log("좌석 저장 api error : ", error.response || error.message);
        }
    }

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
                        onMouseLeave={handleMouseUp}
                        onMouseUp={handleMouseUp}
                    >
                        {seats.map((selected, index) => (
                            <div
                                key={index}
                                className={`seat ${selected ? 'selected' : ''}`}
                                onMouseDown={() => handleMouseDown(index)}
                                onMouseEnter={() => handleMouseEnter(index)}
                            />
                        ))}
                    </div>
                    <button className="register-button" onClick={handleRegister}>자리 만들기</button>
                </div>
            </ReactModal>

            <h1>자리 바꾸기</h1>
            <button className="register-button" onClick={() => setModalShow(true)}>+ 새 자리배치</button>
            <button className="register-button" onClick={randomSeatHandler}>랜덤 돌리기 !</button>
            <button onClick={() => setDetailButtonShow(prev => !prev)}>
                <FontAwesomeIcon icon={faBars} />
            </button>

            {detailButtonShow && (
                <>
                <button>설정</button>
                </>
            )}

           
            <button onClick={saveSeatHandler}>저장</button>
            <button><FontAwesomeIcon icon={faDownload} /></button>
            <button onClick={handlePrint}><FontAwesomeIcon icon={faPrint} /></button>
            <button className='table-button'>교탁</button>

            <div className="created-seats" ref={contentRef}>
                {createdSeats.map((seat, seatIndex) => (
                    <div
                        key={seat.id}
                        className="seat created"
                        style={{
                            gridColumnStart: (seat.id % 10) + 1,
                            gridRowStart: Math.floor(seat.id / 10) + 1,
                        }}
                    >
                        {seat.studentName ?
                            <> <h4>{seatIndex + 1} {seat.studentName}</h4> </> :
                            <h4>{seatIndex + 1}</h4>
                        }
                    </div>
                ))}
            </div>
        </>
    );
};

export default SeatArrangement;

