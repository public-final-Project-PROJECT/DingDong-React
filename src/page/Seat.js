import React, { useState } from 'react';
import ReactModal from "react-modal";
import '../assest/css/Seat.css'; 
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {faBars} from "@fortawesome/free-solid-svg-icons";

const SeatArrangement = () => {
    const [modalShow, setModalShow] = useState(false); // 좌석 생성 모달 상태
    const [seats, setSeats] = useState(Array(60).fill(false)); // 좌석 상태
    const [isDragging, setIsDragging] = useState(false);
    const [createdSeats, setCreatedSeats] = useState([]); // 생성된 좌석 상태
    const [detailButtonShow, setDetailButtonShow] = useState(false); // 상세 기능 버튼 상태

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

    const handleRegister = () => {
      const newCreatedSeats = seats
          .map((selected, index) => ({ id: index, selected }))
          .filter(seat => seat.selected);

    
          setCreatedSeats((prevCreatedSeats) => [...prevCreatedSeats, ...newCreatedSeats]); // 기존 좌석에 추가
          setSeats(Array(60).fill(false));
          setModalShow(false);
  };


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

            <h1> 자리 바꾸기 </h1>
            <button className="register-button" onClick={() => setModalShow(true)}>+ 새 자리배치</button>
            <button className="register-button" >랜덤 돌리기 !</button>
            <button onClick={() => detailButtonShow?  
            setDetailButtonShow(false):
            setDetailButtonShow(true)}
            ><FontAwesomeIcon icon={faBars} /></button>

            {detailButtonShow &&
                <>
                <button>이미지 저장</button>
                <button>출력하기</button>
                <button>설정</button>
                </>
            }
           

            <button className='table-button'>교탁</button>
            

            <div className="created-seats">
        
                {createdSeats.map((seat, index) => (

                    <div
                        key={seat.id}
                        className="seat created"
                        style={{
                            gridColumnStart: (seat.id % 10) + 1,
                            gridRowStart: Math.floor(seat.id / 10) + 1
                        }}
                    > {index + 1} </div>
                ))}
            </div>
        </>
    );
};

// db 에 인덱스 번호랑 같이 박아야 함. 
export default SeatArrangement;
