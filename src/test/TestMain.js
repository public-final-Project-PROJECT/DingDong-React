import { useNavigate } from "react-router-dom";

const TestMain = () =>
{
    const navigate = useNavigate();

    const nav = () =>
    {
        navigate("/postmappingtest");
    }


    const nav2 = () =>
    {
        navigate("/oauth2/authorization/google");
    }
    const nav3 = () => {
        navigate("/MainPage");
    }



    

    return (
        <>
            <button onClick={nav}>PostMappingTest</button>
            <br/>


            <button onClick={nav2}>GoogleLoginTest</button>
            <br/>
            <button onClick={nav3}>mainpage</button>


        </>
    )
}

export default TestMain;