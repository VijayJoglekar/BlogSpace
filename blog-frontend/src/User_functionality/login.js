import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./landing.css";

export default function Login() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false); // Loading state for better UX
    const navigate = useNavigate();

    const submitLogin = async (event) => {
        event.preventDefault();
        setLoading(true);

        try {
            const response = await axios.post(
                "http://127.0.0.1:8000/api/token/",
                { username, password },
                {
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            );  

            if (response.status === 200) {

                // Save tokens to localStorage
                localStorage.setItem("authToken", response.data.access); 
                alert("Login successful!");
                // localStorage.setItem("authToken", response.data.access);

                navigate("/Dashboard"); // Redirect to Dashboard
            }
        } catch (error) {
            if (error.response) {
                alert(error.response.data.detail || "Invalid credentials");
            } else {
                alert("Something went wrong. Please try again.");
            }
        } finally {
            setLoading(false);
        }
    };

    const handleForgotPassword = () => {
        navigate("/forgotpass");
    };

    return (
        <div className="auth-container">
            <h2>Welcome Back</h2>
            <form className="login-form" onSubmit={submitLogin}>
                <div className="input-group">
                    <input
                        type="text"
                        id="username"
                        name="username"
                        required
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                    <label htmlFor="username">Username</label>
                    <i className="input-icon">&#128100;</i>
                </div>
                <div className="input-group">
                    <input
                        type="password"
                        id="password"
                        name="password"
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <label htmlFor="password">Password</label>
                    <i className="input-icon">&#128274;</i>
                </div>
                <button type="submit" className="btn" disabled={loading}>
                    {loading ? "Logging in..." : "Login"}
                </button>
            </form>
            <p className="auth-link">
                <span onClick={handleForgotPassword}>Forgot Password?</span>
            </p>
            <p className="auth-link">
                Don't have an account?{" "}
                <span onClick={() => navigate("/signup")}>Sign Up</span>
            </p>
        </div>
    );
}
