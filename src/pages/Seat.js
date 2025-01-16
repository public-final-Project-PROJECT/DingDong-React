import React, { useState, useRef, useEffect } from 'react';
import ReactModal from "react-modal";
import '../asset/css/Seat.css'; 
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUserGroup, faDownload, faPrint,faRepeat, faCircleExclamation} from "@fortawesome/free-solid-svg-icons";
import { useReactToPrint } from 'react-to-print';
import axios from 'axios';
import html2canvas from 'html2canvas';
import { useUserData } from "../hooks/useUserData";


const SeatArrangement = () => {
    const { selectedClassId } = useUserData();
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
    const [studentsTableData, setStudentsTableData] = useState(); // studentsTable 에서 가지고 온 data
    const [lastStudentsSeatList, setLastStudentsSeatList] = useState([]);
    const [newSeatPlusRandomState, setNewSeatPlusRandomState] = useState(false); 
    const [changedSeats, setChangedSeats] = useState([]); // 수정한 학생 좌석 담음
    const [createdSeat, setCreatedSeat] = useState(false); 
    const [isSpinning, setIsSpinning] = useState(false); 
    const [isModified, setIsModified] = useState(false);
    const [creSeatRandomChange, setCreSeatRandomChange] = useState(1);
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
      setCreSeatRandomChange(2);
        saveStudentsAPI();
        setButtonsDisabled(false);
        setShowSaveButton(false);
        alert("좌석이 저장되었습니다 !");
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
          console.log(firstSeat);
          console.log(secondSeat);
  
          const updatedLoadedSeats = [...loadedSeats];
          const updatedCreatedSeats = [...createdSeats];
  
      
          const firstLoadedSeatIndex = updatedLoadedSeats.findIndex(s => s.seatId === firstSeat.seatId);
          const secondLoadedSeatIndex = updatedLoadedSeats.findIndex(s => s.seatId === secondSeat.seatId);
  
          const firstCreatedSeatIndex = updatedCreatedSeats.findIndex(s => s.id === firstSeat.id);
          const secondCreatedSeatIndex = updatedCreatedSeats.findIndex(s => s.id === secondSeat.id);
  
          if (firstLoadedSeatIndex !== -1 && secondLoadedSeatIndex !== -1) {
              const tempStudentName = updatedLoadedSeats[firstLoadedSeatIndex].studentName;
              updatedLoadedSeats[firstLoadedSeatIndex].studentName = updatedLoadedSeats[secondLoadedSeatIndex].studentName;
              updatedLoadedSeats[secondLoadedSeatIndex].studentName = tempStudentName;
  
              const tempRowId = updatedLoadedSeats[firstLoadedSeatIndex].rowId;
              const tempColumnId = updatedLoadedSeats[firstLoadedSeatIndex].columnId;
              updatedLoadedSeats[firstLoadedSeatIndex].rowId = updatedLoadedSeats[secondLoadedSeatIndex].rowId;
              updatedLoadedSeats[firstLoadedSeatIndex].columnId = updatedLoadedSeats[secondLoadedSeatIndex].columnId;
              updatedLoadedSeats[secondLoadedSeatIndex].rowId = tempRowId;
              updatedLoadedSeats[secondLoadedSeatIndex].columnId = tempColumnId;
  
              setLoadedSeats(updatedLoadedSeats);
          }
  
          if (firstCreatedSeatIndex !== -1 && secondCreatedSeatIndex !== -1) {
            const tempStudentName = updatedCreatedSeats[firstCreatedSeatIndex].studentName;
            updatedCreatedSeats[firstCreatedSeatIndex].studentName = updatedCreatedSeats[secondCreatedSeatIndex].studentName;
            updatedCreatedSeats[secondCreatedSeatIndex].studentName = tempStudentName;
        }
          setFirstSeat(null);
          setSecondSeat(null);
  
          console.log('Updated Loaded Seats:', updatedLoadedSeats);
          console.log('Updated Created Seats:', updatedCreatedSeats);
      }
  }, [firstSeat, secondSeat, loadedSeats, createdSeats, creSeatRandomChange]);
  
  
  

    const seatTable = async () => {
        try {
          console.log(selectedClassId);
            const response = await axios.post('http://localhost:3013/api/seat/findAllSeat', { classId: selectedClassId });
            setLoadedSeats(response.data);

        } catch (error) {
            // findByStudents();
            console.error("기존 좌석 불러오는 API error:", error);
        }
    };


    const studentNameAPI = async () => {
        try {
            const response = await axios.post('http://localhost:3013/api/seat/findName', { classId: selectedClassId });
            setNameList(response.data.sort((a, b) => a.studentId - b.studentId));
        } catch (error) {
            console.error("학생 이름 조회 중 error:", error);
        }
    };


    const saveStudentsAPI = async () => {

      setCreSeatRandomChange(2);
      setCreSeatRandomChange(3);

      console.log(randomedSeat);
        try {
          lastStudentsSeatList = 
            await axios.post('http://localhost:3013/api/seat/saveSeat', { studentList: randomedSeat});
            alert("좌석이 저장되었습니다 !");
        } catch (error) {
            console.error("저장 API 요청 중 error:", error);
        }
    };

    

    // 저장 handler
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


    // 랜덤돌리기 handler
    const randomSeatHandler = () => {
      setIsSpinning(true);
      const seatsToShuffle = createdSeats.length > 0 ? createdSeats : loadedSeats;
      console.log(seatsToShuffle);
  
      if (seatsToShuffle.length === 0) {
          return;
      }
  
      const studentIds = seatsToShuffle.map(seat => seat.studentId).filter(id => id !== null);
      const shuffledStudentIds = [...studentIds];
  
  
      for (let i = shuffledStudentIds.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [shuffledStudentIds[i], shuffledStudentIds[j]] = [shuffledStudentIds[j], shuffledStudentIds[i]];
      }
      setIsSpinning(false);

  
      const updatedSeats = seatsToShuffle.map((seat, index) => {
          const shuffledStudentId = shuffledStudentIds[index];
          const student = nameList.find(stud => stud.studentId === shuffledStudentId);
  
          return {
              ...seat,
              studentId: shuffledStudentId,
              studentName: student ? student.studentName : null,
              classId : selectedClassId
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
     
      
      console.log("Updated Seats:");
      updatedSeats.forEach(seat => {
          console.log(`Row: ${seat.rowId}, Column: ${seat.columnId}, StudentId : ${seat.studentId}`);
      });
  };
  

    const handlePrint = useReactToPrint({ contentRef });

      // 좌석을 변경하고 저장하는 로직을 수정
      const modifyHandler = () => {
        if (!modifyState) {
            // 수정 모드 시작
            setModifyState(true);
            setModifyButtonShow(true);
            setCreatedSeat(true);
            setIsModified(true); // Seat has bee
            return;
        }
    
        if (firstSeat && secondSeat) {
            let updatedSeats;
    
            if (firstSeat.isCreatedSeat && secondSeat.isCreatedSeat) {
                // createdSeats 수정
                updatedSeats = [...createdSeats];
                const firstIndex = updatedSeats.findIndex(seat => seat.id === firstSeat.id);
                const secondIndex = updatedSeats.findIndex(seat => seat.id === secondSeat.id);
    
                if (firstIndex !== -1 && secondIndex !== -1) {
                    const temp = { ...updatedSeats[firstIndex] };
                    updatedSeats[firstIndex] = updatedSeats[secondIndex];
                    updatedSeats[secondIndex] = temp;
                }
    
                setCreatedSeats(updatedSeats);
            } else if (!firstSeat.isCreatedSeat && !secondSeat.isCreatedSeat) {
                // loadedSeats 수정
                updatedSeats = [...loadedSeats];
                const firstIndex = updatedSeats.findIndex(seat => seat.seatId === firstSeat.seatId);
                const secondIndex = updatedSeats.findIndex(seat => seat.seatId === secondSeat.seatId);
    
                if (firstIndex !== -1 && secondIndex !== -1) {
                    const temp = { ...updatedSeats[firstIndex] };
                    updatedSeats[firstIndex] = updatedSeats[secondIndex];
                    updatedSeats[secondIndex] = temp;
                }
    
                setLoadedSeats(updatedSeats);
            }
    
            // 변경된 데이터를 saveStudentsAPI2에 전달
            saveStudentsAPI2(updatedSeats);
    
            setFirstSeat(null);
            setSecondSeat(null);
            setModifyState(false);
            setModifyButtonShow(false);
        } else {
            // 수정 모드 활성화
            setModifyState(true);
            setModifyButtonShow(true);
        }
    };
    

    const saveStudentsAPI2 = async (updatedSeats) => {
 
        if (!updatedSeats || !Array.isArray(updatedSeats)) {
            console.error("saveStudentsAPI2: updatedSeats가 유효하지 않습니다.", updatedSeats);
            return;
        }
    
        try {
            const dataToSave = updatedSeats.map(seat => ({
                studentId: seat.studentId,
                rowId: seat.rowId,
                columnId: seat.columnId,
                classId: selectedClassId, // 기본값 설정
            }));
                console.log(dataToSave);
            await axios.post('http://localhost:3013/api/seat/saveSeat', { studentList: dataToSave });
    
            console.log("저장된 데이터:", dataToSave);
            alert("좌석이 저장되었습니다!");
        } catch (error) {
            console.error("저장 API 요청 중 error:", error);
        }
    };
    
      const handleSeatClick = (seat, index, isCreatedSeat = false) => {
        if (modifyState) {
          if (!firstSeat) {
            console.log(modifyState);
            console.log(secondSeat);
            setFirstSeat({ ...seat, isCreatedSeat });
          } else if (!secondSeat) {
            console.log(firstSeat);
            setSecondSeat({ ...seat, isCreatedSeat });
          }
        }
      };


    // 모달 close handler
    const closeModal = () => {
        setModalShow(false);
        setSeats(Array(60).fill(false));
    }

      // 그리드 스타일 동적 계산
      const calculateGridStyle = () => {
        const gridSize = Math.ceil(Math.sqrt(createdSeats.length)); // 정사각형 그리드 계산
        return {
            gridTemplateColumns: `repeat(${gridSize}, 1fr)`,
            gridTemplateRows: `repeat(${gridSize}, 1fr)`,
        };
    };

    return (
        <>
          <ReactModal 
          isOpen={modalShow} 
          closeModal={closeModal}
          contentLabel="새 좌석 만들기" 
          className="new_seat_modal"
         >
              <div  className="square-grid" onMouseUp={() => setIsDragging(false)}>
                {seats.map((selected, index) => (
                  <div
                    key={index}
                    className={`seat ${selected ? 'selected' : 'created-seatsda'}`}
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
              <button className='new_seat_button' onClick={closeModal}>닫기</button>
              </div>
          </ReactModal>
      
          
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
                // 랜덤돌리기로 저장한 좌석 저장
                <button className="register-button red-button" onClick={saveSeatHandler}>저장</button>
              )}
             
               <button className='modify_button' onClick={modifyHandler}  disabled={createdSeat || isSpinning} >
              <FontAwesomeIcon icon={faUserGroup} />   <FontAwesomeIcon icon={faRepeat} />
              </button>
              
              {modifyButtonShow && 
                <>
                {/* 클릭으로 변경한 좌석 저장 */}
                
                <h8 className="seatChange-modify"  style={{color:"grey"}}> <FontAwesomeIcon icon={faCircleExclamation} style={{color:"grey"}}/> 자리를 클릭하여 좌석을 변경하세요</h8>
                {createdSeat  && isSpinning &&
                  <button className='modify-handler-button' disabled={isSpinning} onClick={() => saveStudentsAPI2([...loadedSeats])}>
                      저장
                  </button>

                }
              
                <button className='modify-handler-button' disabled={isSpinning} onClick={() => setModifyButtonShow(false)}>취소</button>
                </>
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

                        {studentsTableData && studentsTableData.map((student, index) => {
                          const columnId = (index % 4) + 1; // 열  1-10
                          const rowId = Math.floor(index / 4) + 1; // 행  1, 2 점점

                          return (
                            <div
                              key={`students-${student.studentId}`}
                              className={`seat created ${modifyState ? 'modifiable' : ''}`}
                              style={{
                                gridColumnStart: columnId,
                                gridRowStart: rowId,
                                border: modifyState && (firstSeat?.studentId === student.studentId || secondSeat?.studentId === student.studentId) ? "2px solid red" : "none",
                              }}
                              onClick={() => handleSeatClick(student, index)}
                            >
                              <h4>{student.studentName || '학생 없음'}</h4>
                            </div>
                          );
                        })}


                    <div className="created-seats" style={calculateGridStyle()}>
                      {createdSeats.map((seat, index) => (
                          <div
                              key={`created-${seat.id}`}
                              className={`seat created ${modifyState ? 'modifiable' : ''}`}
                              style={{
                                  gridColumnStart: seat.columnId,
                                  gridRowStart: seat.rowId,
                                  border: modifyState && (firstSeat?.id === seat.id || secondSeat?.id === seat.id) ? "2px solid red" : "none",
                              }}
                              onClick={() => handleSeatClick(seat, index)}
                          >
                              <h4 className="table-seat-student-name">
                                  {seat.studentName || ''}
                              </h4>
                          </div>
                      ))}
                  </div>
              </div>
            </div>
          </div>
        </>
      );
      
};

export default SeatArrangement;
