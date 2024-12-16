import { useState } from "react";
import { fetchFromAPI } from "../utils/api"; // Ensure this path matches your project structure
import { useNavigate } from "react-router-dom";

const PostMappingTest = () => {
    const [test, setTest] = useState(""); // Input value state
    const [responseData, setResponseData] = useState(null); // API response data state
    const [error, setError] = useState(null); // Error state
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            // Send POST request using fetchFromAPI
            const response = await fetchFromAPI("/api/test", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: { input: test }, // Axios handles object-to-JSON conversion automatically
            });

            setResponseData(response); // Save response to state
            console.log("Response:", response);
            setError(null); // Clear any existing errors
        } catch (err) {
            setError(err.message); // Handle errors
            console.error("Error fetching data:", err);
        }
    };

    return (
        <div>
            <h1>PostMappingTest</h1>
            <form onSubmit={handleSubmit}>
                <label htmlFor="testInput">Test Input: </label>
                <input
                    id="testInput"
                    type="text"
                    value={test}
                    onChange={(e) => setTest(e.target.value)} // Update state with input value
                />
                <button type="submit">Submit</button>
            </form>

            {/* Display error messages */}
            {error && (
                <div style={{ color: "red" }}>
                    <h2>Error:</h2>
                    <p>{error}</p>
                </div>
            )}

            {/* Display response data */}
            {responseData && (
                <div>
                    <h2>Response Data:</h2>
                    <pre>{JSON.stringify(responseData, null, 2)}</pre>
                </div>
            )}

            {/* Navigate back to main page */}
            <button onClick={() => navigate("/")}>Main</button>
        </div>
    );
};

export default PostMappingTest;
