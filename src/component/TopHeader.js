import React, { useState } from 'react';
import "../asset/css/TopHeader.css"; 
import { useNavigate } from 'react-router-dom';
import GoogleLoginButton from './GoogleLoginButton';
import { GoogleOAuthProvider } from '@react-oauth/google';

const TopHeader = () => {
  const clientId = process.env.REACT_APP_OAUTH2_GOOGLE_CLIENT_ID;
  const [show, setShow] = useState(false); // 편의기능 detail 버튼 show
  const navigator = useNavigate();


  const onClickHandler = (e) => {
    console.log(e.target.className);
    setShow(false);

    switch(e.target.className) {
        case "Notice":
          navigator("/Notice");
          break;
        case "Attendance":
          navigator("/Attendance"); 
          break;
        case "Students":
          navigator("/Students");
          break;
        case "Calendar" :
          navigator("/Calendar");
          break;
        case "Timer":
          navigator("/Timer");
          break;
        case "Seat":
          navigator("/Seat");
          break;
        case "RandomPicker":
          navigator("/RandomPicker");
          break;
        case "Voting":
          navigator("/Voting");
          break;
        default:
          break;
      }
    };
  
  
  const toggleFunctions = () => {
    setShow((prevState) => !prevState);
  };

  return (
    <div className="top-header">
      <div className="main-buttons">
        <button className="Notice" onClick={onClickHandler}>공지사항</button>
        <button className="Attendance" onClick={onClickHandler}>출석부</button>
        <button className="Students" onClick={onClickHandler}>학생정보</button>
        <button className="Calendar" onClick={onClickHandler}>캘린더</button>
        <button  onClick={toggleFunctions}>편의기능</button>
        <GoogleOAuthProvider clientId={clientId}>
          <GoogleLoginButton/>
        </GoogleOAuthProvider>
      </div>

      {show && (
        <div className="convenience-buttons">
          <button className="Timer" onClick={onClickHandler}>타이머</button>
          <button className="Seat" onClick={onClickHandler}>자리바꾸기</button>
          <button className="RandomPicker" onClick={onClickHandler}>발표자 뽑기</button>
          <button className="Voting" onClick={onClickHandler}>학급 투표</button>
        </div>
      )}
    </div>
  );
};

export default TopHeader;
