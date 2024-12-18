import { BrowserRouter, Route, Routes } from "react-router-dom";
import TestMain from "./test/TestMain";
import PostMappingTest from "./test/PostMappingTest";

function App() 
{
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<TestMain />} />
                <Route path="/postmappingtest" element={<PostMappingTest />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;
