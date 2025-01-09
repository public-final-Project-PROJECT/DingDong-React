import React, { useState } from 'react';
import "../asset/css/TopHeader.css"; 
import { useNavigate } from 'react-router-dom';
import GoogleLoginButton from './GoogleLoginButton';
import { GoogleOAuthProvider } from '@react-oauth/google';

const TopHeader = () => {
  const [show, setShow] = useState(false);
  const navigate = useNavigate();
  const clientId = process.env.REACT_APP_OAUTH2_GOOGLE_CLIENT_ID;

  const onClickHandler = (e) => {
    setShow(false);

    if (e.target.className === 'main') navigate("/");
    else navigate(`/${e.target.className}`);
  };

  const toggleFunctions = () => {
    setShow((prevState) => !prevState);
  };

  return (
    <div className="top-header">
      <div className="main-buttons">
        <div className="main" onClick={onClickHandler}>메인</div>
        <div className="notice" onClick={onClickHandler}>공지사항</div>
        <div className="attendance" onClick={onClickHandler}>출석부</div>
        <div className="students" onClick={onClickHandler}>학생정보</div>
        <div className="calendar" onClick={onClickHandler}>캘린더</div>
        <div onClick={toggleFunctions}>편의기능</div>
        <GoogleOAuthProvider clientId={clientId}>
          <GoogleLoginButton />
        </GoogleOAuthProvider>
      </div>

      {show && (
        <div className="convenience-buttons">
          <button className="timer" onClick={onClickHandler}>타이머</button>
          <button className="seat" onClick={onClickHandler}>자리바꾸기</button>
          <button className="randompicker" onClick={onClickHandler}>발표자 뽑기</button>
          <button className="voting" onClick={onClickHandler}>학급 투표</button>
          <button className="drawing" onClick={onClickHandler}>칠판</button>
        </div>
      )}
    </div>
  );
};

export default TopHeader;
