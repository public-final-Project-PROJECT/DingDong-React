import { BrowserRouter, Route, Routes } from "react-router-dom";
import TestMain from "./test/TestMain";
import PostMappingTest from "./test/PostMappingTest";
import GoogleLoginTest from "./test/GoogleLoginTest";



import Layout from "./layout/Layout";
import Main from "./page/Main";
import Notice from "./page/Notice";
import Attendance from "./page/Attendance.js";
import Calendar from "./page/Calendar.js";
import Students from "./page/Students.js";
import Timer from "./page/Timer.js";
import Seat from "./page/Seat.js";
import RandomPicker from "./page/RandomPicker.js";
import Voting from "./page/Voting.js";



function App() 
{
    return (
        <BrowserRouter>
            <Routes>

                <Route path="/" element={<TestMain />} />
                <Route path="/postmappingtest" element={<PostMappingTest />} />
                <Route path="/oauth2/authorization/google" element={<GoogleLoginTest />} />
         

                {/* <Route path="/" element={<Main />} /> */}
                <Route path="/postmappingtest" element={<PostMappingTest />} />
                <Route path="/oauth2/authorization/google" element={<GoogleLoginTest />} /> 

                <Route path="/" element={<Layout/>}>
                    <Route index element={<Main/>}/>                                {/* 메인*/}
                    <Route path="Notice" element={<Notice/>}/>                      {/* 공지사항 */}
                      <Route path="Attendance" element={<Attendance/>}/>            {/* 출석부  */} 
                    <Route path="Students" element={<Students/>}/>                  {/* 학생정보  */}    
                    <Route path="Calendar" element={<Calendar/>}/>                  {/* 캘린더 */}

                    <Route path="Timer" element={<Timer/>}/>                        {/* 타이머 */}
                    <Route path="Seat" element={<Seat/>}/>                          {/* 좌석표*/}
                    <Route path="RandomPicker" element={<RandomPicker/>}/>          {/* 발표자 뽑기 */}
                    <Route path="voting" element={<Voting/>}/>                      {/* 학급 투표*/}
                </Route>
            

            </Routes>
        </BrowserRouter>
    );
}

export default App;
