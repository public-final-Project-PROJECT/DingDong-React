export const BASE_URL = "http://localhost:1601";

export const fetchFromAPI = async (endpoint, options = {}) => 
{
    const controller = new AbortController();
    const { signal } = controller;
    const timeoutId = setTimeout(() => controller.abort(), 5000); 

    try {
        const res = await fetch(`${BASE_URL}${endpoint}`, { ...options, signal });
        
        if (!res.ok) 
        {
            const errorMessage = `API Error: ${res.status} ${res.statusText}`;
            throw new Error(errorMessage);
        }

        const contentType = res.headers.get("Content-Type");
        if (contentType && contentType.includes("application/json")) 
        {
            return await res.json();
        } 
        else 
        {
            return await res.text();
        }
    } catch (error) {
        if (error.name === "AbortError") 
        {
            throw new Error("Request timed out");
        }
        throw error;
    } finally {
        clearTimeout(timeoutId); 
    }
};