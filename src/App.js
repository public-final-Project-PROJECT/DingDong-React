import { BrowserRouter, Outlet, Route, Routes } from "react-router-dom";
// import TestMain from "./test/TestMain";
import PostMappingTest from "./test/PostMappingTest";
import Layout from "./layout/Layout";
import Main from "./pages/Main";
import Notice from "./pages/Notice";
import Attendance from "./pages/Attendance.js";
import Calendar from "./pages/Calendar.js";
import Students from "./pages/Students.js";
import Timer from "./pages/Timer.js";
import Seat from "./pages/Seat.js";
import RandomPicker from "./pages/RandomPicker.js";
import Voting from "./pages/Voting.js";
import QRCodeGenerator from "./pages/QRCodeGenerator.js";
import Login from "./pages/Login.js";
import NoticeDetail from "./pages/NoticeDetail.js";
import NoticeUpdate from "./pages/NoticeRegister.js";

function App() 
{
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/login" element={<Outlet />} >
                    <Route index element={<Login/>}/>
                </Route>
                <Route path="/postmappingtest" element={<PostMappingTest />} />

                <Route path="/" element={<Layout/>}>
                    <Route index element={<Main/>}/>                                {/* 메인*/}
                    <Route path="Notice" element={<Notice/>}/>    
                    <Route path="/:id" element={<NoticeDetail />} />                    {/* 공지사항 */}
                    <Route path="/notice/update/:id" element={<NoticeUpdate/>} />
                    <Route path="Attendance" element={<Attendance/>}/>            {/* 출석부  */} 
                    <Route path="Students" element={<Students/>}/>                  {/* 학생정보  */}    
                    <Route path="Calendar" element={<Calendar/>}/>                  {/* 캘린더 */}

                    <Route path="Timer" element={<Timer/>}/>                        {/* 타이머 */}
                    <Route path="Seat" element={<Seat/>}/>                          {/* 좌석표*/}
                    <Route path="RandomPicker" element={<RandomPicker/>}/>          {/* 발표자 뽑기 */}
                    <Route path="voting" element={<Voting/>}/>                      {/* 학급 투표*/}
                    <Route path="qrcode" element={<QRCodeGenerator/>}/>
                </Route>
            
            </Routes>
        </BrowserRouter>
    );
}

export default App;
