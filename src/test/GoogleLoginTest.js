import React, { useEffect, useState } from "react";
import axios from "axios";
import { BASE_URL } from "../utils/api";

const GoogleLoginTest = () => {
  const [user, setUser] = useState(null);

  const handleLogin = () => {
    window.open(BASE_URL + "login/oauth2/authorization/google", "Google Login", "width=500, height=600, scrollbars=yes, resizable=yes");
  };

  useEffect(() => {
    axios
      .get(BASE_URL + "/api/v1/user", { withCredentials: true })
      .then((response) => setUser(response.data))
      .catch((error) => console.error("Error fetching user info:", error));
  }, []);

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h1>Google Login with Spring Boot</h1>
      {!user ? (
        <button onClick={handleLogin} aria-label="Login with Google">
          Login with Google
        </button>
      ) : (
        <div>
          <h2>Welcome, {user.name}</h2>
          <p>Email: {user.email}</p>
          <img src={user.picture} alt="Profile" style={{ borderRadius: "50%" }} />
        </div>
      )}
    </div>
  );
};

export default GoogleLoginTest;
