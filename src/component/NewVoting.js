import React, { useRef, useState } from "react";
import ReactModal from "react-modal";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {faXmark,faClockRotateLeft,faCalendar,faUser,faLock, faCheckDouble} from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import html2canvas from "html2canvas";

const Voting = ({newVotingModal,setNewVotingModal}) => {

  const [dateShow, setDateShow] = useState(false); // 날짜 입력 창 show
  const nextID = useRef(1);

  const [title, setTitle] = useState(""); // 투표 제목
  const [detail, setDetail] = useState(""); // 투표 설명
  const [selectedOption, setSelectedOption] = useState(null); // 투표 옵션
  const [anonymousVote, setAnonymousVote] = useState(false); // 비밀투표 여부
  const [doubleVote, setDoubleVote] = useState(false); // 중복투표 가능 여부 
  const [votingEnd, setVotingEnd] = useState();// 입력받을 마감일
  const [inputItems, setInputItems] = useState([{ id: 0, voteOption: "" }]); // 투표 항목
  const [classId, setClassId] = useState();  // 학급 id
  let arr = [];


  // 투표 항목 추가
  const addInput = () => {
    const input = { id: nextID.current, voteOption: "" };
    setInputItems([...inputItems, input]);
    nextID.current += 1;
  };

  // 투표 항목 삭제
  const deleteInput = (index) => {
    setInputItems(inputItems.filter((item) => item.id !== index));
  };

  // 투표 항목 수정
  const handleChange = (e, index) => {
    const updatedItems = [...inputItems];
    updatedItems[index].voteOption = e.target.value;
    setInputItems(updatedItems);
  };

  // 모달 초기화
  const resetModalState = () => {
    setTitle("");
    setDetail("");
    setInputItems([{ id: 0, voteOption: "" }]);
    nextID.current = 1;
    setSelectedOption(null);
    setDateShow(false);
  };

  // 투표 생성 API
  const send = async () => {

    try {
      const response = await axios.post(
        `/api/voting/newvoting`,
        {
          classId: classId,  // 학급 id
          votingName: title, // 제목
          detail: detail, // 설명
          votingEnd:votingEnd? votingEnd : null, // 마감일자
          contents: arr, // 투표 항목들 
          anonymousVote: anonymousVote,  // 비밀 투표 여부
          doubleVote: doubleVote // 중복 투표 가능 여부 
        },
 
      );
      return response;
      
    } catch (error) {
      console.error("투표 생성 api error:", error.response || error.message);
    }
  };

  // 투표 생성 처리
  const handleSubmit = async (e) => {
    e.preventDefault();
    setNewVotingModal(false);
    arr = inputItems.map((item) => item.voteOption);
   
    try {
      await send(); // API 호출
      resetModalState(); // 상태 초기화
      // setModalShow(false); // 모달 닫기
      alert("투표가 생성되었습니다!");
    } catch (error) {
      console.error("투표 생성 중 error:", error);
    }
  };

  // 모달 취소 처리
  const cancelHandler = () => {
    resetModalState();
    setNewVotingModal(false);
  };

  function RadioGroup({lable, children}){
    return (
      <fieldset>
        <legend>{lable}</legend>
        {children}
      </fieldset>
    )
  }

  const Radio = ({ name, value, children, ...props }) => (
    <label>
      <input type="radio" name={name} value={value} {...props} />
      {children}
    </label>
  );

  const onClickDownloadButton = () => {
    const target = document.getElementById("download");
    if (!target) {
      return alert("사진 저장에 실패했습니다.");
    }
    html2canvas(target).then((canvas) => {
      const link = document.createElement("a");
      document.body.appendChild(link);
      link.href = canvas.toDataURL("image/png");
      link.download = "Haru4cut.png"; // 다운로드 이미지 파일 이름
      link.click();
      document.body.removeChild(link);
    });
  };
  

  return (
    <>
      <ReactModal
        isOpen={newVotingModal}
        closeModal={cancelHandler}
        contentLabel="새 투표 생성 모달"
        appElement={document.getElementById("root")}
        style={{
          content: {
            top: "50%",
            left: "50%",
            right: "auto",
            bottom: "auto",
            marginRight: "-50%",
            transform: "translate(-50%, -50%)",
            width: 600,
            borderRadius: 0,
            border: "none",
            padding: "42px",
          
          },
          overlay: {
            backgroundColor: "rgba(0, 0, 0, 0.75)",
          },
        }}
      >
         <button
        onClick={cancelHandler}
        style={{
          position: "absolute",
          top: "10px", 
          right: "10px",
          fontSize: "2rem", 
          fontWeight: "bold", 
          background: "none",
          border: "none",
          cursor: "pointer",
        }}
      >
        <FontAwesomeIcon icon={faXmark} />
      </button>
        <form onSubmit={handleSubmit}>
          <input
            placeholder="제목을 입력하세요."
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
          <br/>
          <br/>
          <input
            placeholder="투표에 관한 설명 입력 (옵션)"
            value={detail}
            onChange={(e) => setDetail(e.target.value)}
            required
          />
          <br />
          <br />
          {inputItems.map((item, index) => (
            <div key={index}>
              <label>
                항목 {index + 1}
                <input
                  type="text"
                  value={item.voteOption}
                  onChange={(e) => handleChange(e, index)}
                />
                {index === 0 && inputItems.length < 30 && (
                  <button type="button" onClick={addInput}>
                    +
                  </button>
                )}
                {index > 0 && (
                  <button type="button" onClick={() => deleteInput(item.id)}>
                    -
                  </button>
                )}
              </label>
            </div>
          ))}
          <div className="radio-group" >
            <br/>
            <br/>
            <label><FontAwesomeIcon icon={faClockRotateLeft} />   투표 마감일</label>
            <div>
            <br/>

              <RadioGroup>
                <br/>
                <Radio name="endDate" value="true">
                <FontAwesomeIcon icon={faCalendar} />  날짜 지정
                <h5 style={{color:"gray"}}>   지정한 마감일에 자동으로 투표가 종료됩니다.</h5>
                {dateShow && (
                    <input
                      type="date"
                      value={votingEnd}
                      onChange={(e) => setVotingEnd(e.target.value)}
                      min={new Date().toISOString().split("T")[0]} 
                    />)}
                </Radio>
                <br/>
                <Radio name="endDate" value="false" defaultChecked>
                <FontAwesomeIcon icon={faUser} /> 사용자 별도 지정
                <h5 style={{color:"gray"}}>  선생님이 종료버튼을 눌러야 종료됩니다.</h5>
                </Radio>
              </RadioGroup>
              <br/>
            

                <label><FontAwesomeIcon icon={faLock} /> 비밀투표 여부</label>

                <RadioGroup>
                  <Radio name="anonymousVote" value="true" defaultChecked>
                    
                    공개투표
                  </Radio>
                  <Radio name="anonymousVote" value="false">
                    비밀투표
                  </Radio>
                </RadioGroup>

                <br/>
                <label><FontAwesomeIcon icon={faCheckDouble} /> 중복투표 여부</label>
                <RadioGroup>
                  <Radio name="doubleVoting" value="true" defaultChecked>
                    단독투표
                  </Radio>
                  <Radio name="doubleVoting" value="false">
                    중복투표
                  </Radio>
                </RadioGroup>
                  </div>

                </div>
                <br />
                <br />
                <button type="submit">저장</button>
              </form>
      </ReactModal>
    </>
  );
};

export default Voting;