import { BrowserRouter, Outlet, Route, Routes } from "react-router-dom";
import Layout from "./layout/Layout";
import Main from "./pages/Main";
import Notice from "./pages/Notice";
import Calendar from "./pages/Calendar.jsx";
import Students from "./pages/Students.js";
import Timer from "./pages/Timer.js";
import Seat from "./pages/Seat.js";
import RandomPickerWithRoulette from "./pages/RandomPickerWithRoulette.jsx";
import Voting from "./pages/Voting.js";
import QRCodeGenerator from "./pages/QRCodeGenerator.js";
import Login from "./pages/Login.js";
import Profile from "./pages/Profile.js";
import NoticeDetail from "./pages/NoticeDetail.js";
import ClassMaker from "./pages/ClassMaker.js";
import NoticeInsert from "./pages/NoticeRegister.js";
import NoticeUpdate from "./pages/NoticeUpdate.js";
import StudentDetail from "./pages/StudentDetail.js";
import AttendanceTotal from "./pages/AttendanceTotal.js";
import { AuthProvider } from "./contexts/AuthContext.js";
import DrawingApp from "./pages/DrawingApp.jsx";

function App() 
{
    return (
        <BrowserRouter>
            <AuthProvider>
                <Routes>
                    <Route path="/login" element={<Outlet />} >
                        <Route index element={<Login/>}/>
                    </Route>

                    <Route path="/classmaker" element={<ClassMaker />} />
                    <Route path="/" element={<Layout/>}>
                        <Route index element={<Main/>}/>                                            {/* 메인*/}
                        <Route path="notice" element={<Notice/>}/>    
                        <Route path="notice/:id" element={<NoticeDetail />} />                      {/* 공지사항 */}
                        <Route path="notice/update/:id" element={<NoticeUpdate/>} />
                        <Route path="notice/register" element={<NoticeInsert/>} />
                        <Route path="attendance" element={<AttendanceTotal />} />                   {/* 출석부 */}
                        <Route path="students" element={<Students/>}/>      
                        <Route path="students/:id" element={<StudentDetail/>}/>                     {/* 학생정보  */}    
                        <Route path="calendar" element={<Calendar/>}/>                              {/* 캘린더 */}
                        <Route path="timer" element={<Timer/>}/>                                    {/* 타이머 */}
                        <Route path="seat" element={<Seat/>}/>                                      {/* 좌석표*/}
                        <Route path="randompicker" element={<RandomPickerWithRoulette/>}/>          {/* 발표자 뽑기 */}
                        <Route path="voting" element={<Voting/>}/>                                  {/* 학급 투표*/}
                        <Route path="drawing" element={<DrawingApp/>}/>
                        <Route path="qrcode" element={<QRCodeGenerator/>}/>
                        <Route path="profile" element={<Profile/>}/>
                    </Route>
                </Routes>
            </AuthProvider>
        </BrowserRouter>
    );
}

export default App;
