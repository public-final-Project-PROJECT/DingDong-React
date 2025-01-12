import React, { useState } from 'react';
import "../asset/css/TopHeader.css"; 
import { useNavigate } from 'react-router-dom';
import GoogleLoginButton from './GoogleLoginButton';
import { GoogleOAuthProvider } from '@react-oauth/google';

const TopHeader = () => {
  const [show, setShow] = useState(false);
  const navigator = useNavigate();
  const clientId = process.env.REACT_APP_OAUTH2_GOOGLE_CLIENT_ID;

  const onClickHandler = (e) => {
    setShow(false);

    switch (e.target.className) {
      case "Main":
        navigator("/")
        break;
      case "Notice":
        navigator("/Notice");
        break;
      case "Attendance":
        navigator("/Attendance"); 
        break;
      case "Students":
        navigator("/Students");
        break;
      case "Calendar":
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
          <div className="Main" onClick={onClickHandler}>메인</div>
          <div className="Notice" onClick={onClickHandler}>공지사항</div>
          <div className="Attendance" onClick={onClickHandler}>출석부</div>
          <div className="Students" onClick={onClickHandler}>학생정보</div>
          <div className="Calendar" onClick={onClickHandler}>캘린더</div>
          <div onClick={toggleFunctions}>편의기능</div>
          <GoogleOAuthProvider clientId={clientId}>
            <GoogleLoginButton />
          </GoogleOAuthProvider>
        </div>

        {/* 헤더와 분리된 하위 버튼 영역 */}
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
