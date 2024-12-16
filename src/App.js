import { BrowserRouter, Route, Routes } from "react-router-dom";
import TestMain from "./test/TestMain";
import PostMappingTest from "./test/PostMappingTest";
import GoogleLoginTest from "./test/GoogleLoginTest";
import MainPage from "./page/MainPage";

function App() 
{
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<TestMain />} />
                <Route path="/postmappingtest" element={<PostMappingTest />} />
                <Route path="/oauth2/authorization/google" element={<GoogleLoginTest />} />
                <Route path="/MainPage" element={<MainPage/>}/>
            </Routes>
        </BrowserRouter>
    );
}

export default App;
