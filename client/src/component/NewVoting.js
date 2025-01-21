import React, { useRef, useState } from "react";
import ReactModal from "react-modal";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {faXmark,faClockRotateLeft,faCalendar,faUser,faLock, faCheckDouble,faMinus,faPlus} from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import  '../asset/css/NewVoting.css';
import html2canvas from "html2canvas";
import { useUserData } from "../hooks/useUserData";
import { useNavigate } from "react-router-dom";

const Voting = ({newVotingModal,setNewVotingModal, newStateValue, setNewStateValue}) => {
  const { selectedClassId } = useUserData();

  const [dateShow, setDateShow] = useState(false);
  const nextID = useRef(1);

  const [title, setTitle] = useState(""); 
  const [detail, setDetail] = useState(""); 
  const [selectedOption, setSelectedOption] = useState(null); 
  const [anonymousVote, setAnonymousVote] = useState(false); 
  const [doubleVote, setDoubleVote] = useState(false); 
  const [votingEnd, setVotingEnd] = useState();
  const [inputItems, setInputItems] = useState([{ id: 0, voteOption: "" }]);
  const navigate = useNavigate();
  let arr = [];


  const addInput = () => {
    const input = { id: nextID.current, voteOption: "" };
    setInputItems([...inputItems, input]);
    nextID.current += 1;
  };


  const deleteInput = (index) => {
    setInputItems(inputItems.filter((item) => item.id !== index));
  };


  const handleChange = (e, index) => {
    const updatedItems = [...inputItems];
    updatedItems[index].voteOption = e.target.value;
    setInputItems(updatedItems);
  };


  const resetModalState = () => {
    setTitle("");
    setDetail("");
    setInputItems([{ id: 0, voteOption: "" }]);
    nextID.current = 1;
    setSelectedOption(null);
    setDateShow(false);
  };


  const send = async () => {

    try {
      const response = await axios.post(
        `http://localhost:3013/api/voting/newvoting`,
        {
          classId: selectedClassId,  
          votingName: title, 
          detail: detail, 
          votingEnd:votingEnd? votingEnd : null, 
          contents: arr, 
          anonymousVote: anonymousVote, 
          doubleVote: doubleVote 
        },
 
      );
      if(newStateValue == true){
            setNewStateValue(false)
      }else{
            setNewStateValue(true)
      }
       
      alert("투표가 생성되었습니다 !");
      return response;
      
    } catch (error) {
      console.error("투표 생성 api error:", error.response || error.message);
    }
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    setNewVotingModal(false);
    arr = inputItems.map((item) => item.voteOption);
   
    try {
      await send(); 
      resetModalState(); 
      navigate("/voting");
      alert("투표가 생성되었습니다!");
    } catch (error) {
      console.error("투표 생성 중 error:", error);
    }
  };


  const cancelHandler = () => {
    resetModalState();
    setNewVotingModal(false);
  };

  const RadioGroup = ({ label, children }) => {
    return (
      <fieldset>
        <legend>{label}</legend>
        {children}
      </fieldset>
    );
  };

  const Radio = ({ name, value, children, onChange, ...props }) => (
    <label>
      <input
        type="radio"
        name={name}
        value={value}
        onChange={onChange}
        {...props}
      />
      {children}
    </label>
  );

  return (
    <>
      <ReactModal
        isOpen={newVotingModal}
        closeModal={cancelHandler}
        contentLabel="새 투표 생성 모달"
        appElement={document.getElementById("root")}
        className='new_voting_modal'
      >
         <button
         className="new-voting-close-button"
        onClick={cancelHandler}
      >
        <FontAwesomeIcon icon={faXmark} />
      </button>
      <div className="new_voting_modal_text">
        <h2 className="new-voting-title">새 투표 만들기</h2>
        <form onSubmit={handleSubmit}>
          <input
            placeholder="제목을 입력하세요."
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="new-voting-first-input"
            required
          />
          <br/>
          <br/>
          <input
            placeholder="투표에 관한 설명 입력 (옵션)"
            value={detail}
            onChange={(e) => setDetail(e.target.value)}
            className="new-voting-second-input"
            required
          />
          <br />
          <br />
          {inputItems.map((item, index) => (
            <div key={index}>
              <label className="VotingCategory-label">
                항목 {index + 1}
                <input
                  type="text"
                  value={item.voteOption}
                  className="VotingCategory-input"
                  onChange={(e) => handleChange(e, index)}
                />
                {index === 0 && inputItems.length < 30 && (
                  <button className="plus_button" type="button" onClick={addInput}>
                   <FontAwesomeIcon icon={faPlus} />
                  </button>
                )}
                {index > 0 && (
                  <button className="minus_button" type="button" onClick={() => deleteInput(item.id)}>
                    <FontAwesomeIcon icon={faMinus} />
                  </button>
                )}
              </label>
            </div>
          ))}
          <div className="radio-group" >
            <br/><hr/>
            <label><FontAwesomeIcon icon={faClockRotateLeft} />   투표 마감일</label>
            <div className="Voteclosing">
              <RadioGroup>
                <Radio 
                name="endDate" 
                value="true"
                onChange={()=> setDateShow(true)}
                >
                <FontAwesomeIcon icon={faCalendar} className="radio-box-text"/>  날짜 지정
                <h5 className="contents_detail">   지정한 마감일에 자동으로 투표가 종료됩니다.</h5>
                {dateShow && (
                    <input
                      type="date"
                      value={votingEnd}
                      onChange={(e) => setVotingEnd(e.target.value)}
                      min={new Date().toISOString().split("T")[0]} 
                    />)}
                </Radio>
                <br/>
                <Radio 
                name="endDate" 
                value="false" 
                onChange={()=> setDateShow(false)}
                >
                <FontAwesomeIcon icon={faUser} className="radio-box-text" /> 사용자 별도 지정
                <h5 className="contents_detail" >  선생님이 종료버튼을 눌러야 종료됩니다.</h5>
                </Radio>
              </RadioGroup>
              <hr/>

                <label><FontAwesomeIcon icon={faLock} /> 비밀투표 여부</label>

                <RadioGroup>
                  <Radio name="anonymousVote" value="true" defaultChecked>&nbsp;공개투표 &emsp;
                  </Radio>
                  <Radio name="anonymousVote" value="false">&nbsp;비밀투표</Radio>
                </RadioGroup>

                <br/>
                  </div>

                </div>
                <br />
                <br />
                <button className="newVoting-save-button" type="submit">저장</button>
                <button className="newVoting-close-button" onClick={cancelHandler}>닫기</button>
              </form>
              </div>
      </ReactModal>
    </>
  );
};

export default Voting;