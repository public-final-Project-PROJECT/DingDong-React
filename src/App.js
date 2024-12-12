import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import FetchTest from "./FetchTest";

function App() 
{
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Navigate to="/test" />} />
                <Route path="test" element={<FetchTest />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;
