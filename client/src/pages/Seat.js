import React, { useState, useRef, useEffect } from 'react';
import ReactModal from "react-modal";
import '../asset/css/Seat.css'; // Ensure your CSS file is included
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUserGroup, faDownload, faPrint,faRepeat } from "@fortawesome/free-solid-svg-icons";
import { useReactToPrint } from 'react-to-print';
import axios from 'axios';
import html2canvas from 'html2canvas';
import useUserData from '../hooks/useUserData';

const SeatArrangement = () => {
    const [modalShow, setModalShow] = useState(false);
    const [seats, setSeats] = useState(Array(60).fill(false));
    const [isDragging, setIsDragging] = useState(false);
    const [createdSeats, setCreatedSeats] = useState([]);
    const [loadedSeats, setLoadedSeats] = useState([]);
    const [nameList, setNameList] = useState([]);
    const [seatState, setSeatState] = useState(false);
    const [modifyState, setModifyState] = useState(false);
    const [firstSeat, setFirstSeat] = useState(null);
    const [secondSeat, setSecondSeat] = useState(null);
    const [countdown, setCountdown] = useState(null);
    const [buttonsDisabled, setButtonsDisabled] = useState(false);
    const [showSaveButton, setShowSaveButton] = useState(false);
    const [randomSpinLabel, setRandomSpinLabel] = useState("start !");
    const [randomedSeat, setRandomedSeat] = useState([]);
    const [modifyButtonShow, setModifyButtonShow] = useState(false);
    const contentRef = useRef();

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
        setRandomSpinLabel("start !");
    };

    const resetRandomSpin = () => {
        setButtonsDisabled(false);
        setShowSaveButton(false);
        setRandomSpinLabel("start!");
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
            setLoadedSeats(response.data);
        } catch (error) {
            console.error("기존 좌석 불러오는 API error:", error);
        }
    };

    const studentNameAPI = async () => {
        try {
            const response = await axios.post('http://localhost:3013/api/seat/findName', { classId: 1 });
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

        if(modifyState){
            setModifyState(false);
        }else{
            setModifyState(true);
        }

        if(modifyButtonShow){
            setModifyButtonShow(false);
        }else{
            setModifyButtonShow(true);
        }
        
       
    };

    const handleSeatClick = (seat, index) => {
        if (modifyState) {
            if (!firstSeat) {
                setFirstSeat(seat);
            } else if (!secondSeat) {
                setSecondSeat(seat);
            }
        }
    };

    // 모달 close handler
    const closeModal = () => {
        setModalShow(false);
        setSeats(Array(60).fill(false));
    }

    return (
        <>
          <ReactModal 
          isOpen={modalShow} 
          closeModal={closeModal}
          contentLabel="새 좌석 만들기" 
          className="new_seat_modal"
         >
            <div className="seat-arrangement">
              <div className="seat-grid" onMouseUp={() => setIsDragging(false)}>
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
              <div className='new_seat_modal_in_button'>
              <button className='new_seat_button' onClick={handleRegister}>자리 만들기</button>
              <button onClick={closeModal}>닫기</button>
              </div>
            </div>
          </ReactModal>
      
          <h1 className="title">자리 바꾸기</h1>
      
          
          <div className="main-container">
            <div className="buttons-container">
                {!showSaveButton && 
                <button className="register-button" onClick={() => setModalShow(true)} disabled={buttonsDisabled}>+ 새배치</button>
                }
              <button
                className="register-button"
                onClick={randomSpinLabel === "다시" ? resetRandomSpin : randomSeatHandlerWithCountdown}
                disabled={randomSpinLabel !== "다시" && buttonsDisabled}
              >
                {countdown !== null ? 
                <h2 style={{color:"red"}}>{countdown}</h2>
                 : 
                randomSpinLabel}
              </button>
              {showSaveButton && (
                <button className="register-button red-button" onClick={saveSeatHandler}>저장</button>
              )}
              <button className='modify_button' onClick={modifyHandler}>
              <FontAwesomeIcon icon={faUserGroup} />   <FontAwesomeIcon icon={faRepeat} />
              </button>
              {modifyButtonShow && 
                <h8 style={{color:"gray", fontSize:"18px"}}>자리를 클릭하여 좌석을 변경하세요</h8>
                }

      
              <div className="icons_div">
                <button className="print_icon" onClick={downloadSeatsAsImage} disabled={buttonsDisabled}>
                  <FontAwesomeIcon icon={faDownload} />
                </button>
                <button className="print_icon" onClick={handlePrint} disabled={buttonsDisabled}>
                  <FontAwesomeIcon icon={faPrint} />
                </button>
              </div>
            </div>
      
            
            <div className="teacher_table_and_students_table_div">
              <div className="teacher_table_div">
                <button className="teacher_table">교탁</button>
              </div>
      
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
               
                  {createdSeats.map((seat, index) => (
                    <div
                      key={`created-${seat.id}`}
                      className={`seat created ${modifyState ? 'modifiable' : ''}`}
                      style={{
                        gridColumnStart: seat.columnId,
                        gridRowStart: seat.rowId,
                        border: modifyState && (firstSeat?.seatId === seat.seatId || secondSeat?.seatId === seat.seatId) ? "2px solid red" : "none",
                      }}
                      onClick={() => handleSeatClick(seat, index)}
                    >
                      <h4>{seat.studentName || ''}</h4>
                    </div>
                  ))}
                
              </div>
            </div>
          </div>
        </>
      );
      
};

export default SeatArrangement;
