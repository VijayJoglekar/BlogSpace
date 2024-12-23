import React from "react";
import { useNavigate } from "react-router-dom";
import "./landing.css";

export default function Landing() {
    const navigate = useNavigate();

    return (
        <div className="landing-container">
            <h1>Welcome to BlogSpace</h1>
            <p>Your go-to platform for managing and sharing blogs effortlessly.</p>
            <div className="cta-container">
                <button onClick={() => navigate("/signup")} className="btn">Sign Up</button>
                <button onClick={() => navigate("/login")} className="btn">Login</button>
            </div>
        </div>
    );
}
