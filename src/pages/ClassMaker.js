import React, { useState } from "react";

const ClassMaker = () => {
  const [grade, setGrade] = useState("");
  const [className, setClassName] = useState("");
  const [nickname, setNickname] = useState("");
  const [responseMessage, setResponseMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = { grade, className, nickname };

    try {
      const response = await fetch("/api/class", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const result = await response.json();

      if (response.ok) {
        setResponseMessage("Class created successfully!");
      } else {
        setResponseMessage(result.error || "An error occurred.");
      }
    } catch (error) {
      setResponseMessage("Failed to connect to the server.");
    }
  };

  return (
    <div>
      <h1>학급 생성</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>
            학년:
            <input
              type="number"
              value={grade}
              onChange={(e) => setGrade(e.target.value)}
              required
            />
          </label>
        </div>
        <div>
          <label>
            반:
            <input
              type="text"
              value={className}
              onChange={(e) => setClassName(e.target.value)}
              required
            />
          </label>
        </div>
        <div>
          <label>
            별명:
            <input
              type="text"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              required
            />
          </label>
        </div>
        <button type="submit">Submit</button>
      </form>
      {responseMessage && <p>{responseMessage}</p>}
    </div>
  );
};

export default ClassMaker;
