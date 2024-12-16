import axios from "axios";

export const BASE_URL = "https://localhost:3013";

export const fetchFromAPI = async (endpoint, options = {}) => {
    const controller = new AbortController();
    const { signal } = controller;

    const timeoutId = setTimeout(() => controller.abort(), 5000); // 5-second timeout

    try {
        const response = await axios({
            url: `${BASE_URL}${endpoint}`,
            method: options.method || "GET", // Default to GET method
            data: options.body || {}, // Request body for POST, PUT, etc.
            headers: options.headers || {}, // Request headers
            signal: signal, // Attach signal for aborting requests
        });

        return response.data; // Axios automatically parses JSON responses
    } catch (error) {
        if (axios.isCancel(error)) {
            throw new Error("Request timed out");
        } else if (error.response) {
            const errorMessage = `API Error: ${error.response.status} ${error.response.statusText}`;
            throw new Error(errorMessage);
        } else {
            throw error;
        }
    } finally {
        clearTimeout(timeoutId); // Clear the timeout
    }
};
