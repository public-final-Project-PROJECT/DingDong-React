import { useNavigate } from "react-router-dom";

const TestMain = () =>
{
    const navigate = useNavigate();

    const nav = () =>
    {
        navigate("/postmappingtest");
    }

    return (
        <button onClick={nav}>PostMappingTest</button>
    )
}

export default TestMain;