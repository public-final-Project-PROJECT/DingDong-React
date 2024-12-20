import { useState } from "react";
import { fetchFromAPI } from "../utils/api";

const PostMappingTest = () => 
{
    const [test, setTest] = useState("");
    const [responseData, setResponseData] = useState(null);
    const [error, setError] = useState(null);

    const handleSubmit = async (e) => 
    {
        e.preventDefault();

        try {
            const response = await fetchFromAPI("/api/test", 
            {
                method: "POST",
                headers: { "Content-Type": "application/json", },
                body: JSON.stringify({ input: test }), 
            });
            setResponseData(response); 
            console.log("Response:", response);
            setError(null); 
        } catch (err) {
            setError(err.message); 
            console.error("Error fetching data:", err);
        }
    };

    return (
        <div>
            <h1>API Test</h1>
            <form onSubmit={handleSubmit}>
                <label htmlFor="testInput">Test Input: </label>
                <input
                    id="testInput"
                    type="text"
                    value={test}
                    onChange={(e) => setTest(e.target.value)}
                />
                <button type="submit">Submit</button>
            </form>

            {error && (
                <div style={{ color: "red" }}>
                    <h2>Error:</h2>
                    <p>{error}</p>
                </div>
            )}

            {responseData && (
                <div>
                    <h2>Response Data:</h2>
                    <pre>{JSON.stringify(responseData, null, 2)}</pre>
                </div>
            )}
        </div>
    );
};

export default PostMappingTest;