import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function SignupView() {
    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [UserImage, setImage] = useState(null); // State to hold the file
    const navigate = useNavigate();

    const submitSignup = async (event) => {
        event.preventDefault();

        try {
            // Create a FormData object
            const formData = new FormData();
            formData.append('username', username);
            formData.append('password', password);
            formData.append('email', email);
            formData.append('dp', UserImage); // Attach the file

            // Make the API call
            const response = await axios.post(
                "http://127.0.0.1:8000/signup/",
                formData, // Send the FormData object
                {
                    headers: {
                        'Content-Type': 'multipart/form-data', 
                    },
                    withCredentials: true, 
                }
            );

            console.log('Response:', response); // Log the server's response
            
            if (response.status === 201) {
                alert(response.data.message);
                navigate('/validate');
            }
        } catch (error) {
            console.error('Error:', error); // Log the error for debugging
            if (error.response) {
                alert(error.response.data.message);
            } else {
                alert("Something went wrong. Please try again.");
            }
        }
    };

    return (
        <div className="auth-container">
            <h2>Create an Account</h2>
            <form className="signup-form" onSubmit={submitSignup}>
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
                        type="email"
                        id="email"
                        name="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <label htmlFor="email">Email</label>
                    <i className="input-icon">&#128231;</i>
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
                <div className="input-group">
                    <input
                        type="file"
                        id="photo"
                        name="UserImage"
                        onChange={(e) => setImage(e.target.files[0])} // Attach the file directly
                        required
                    />
                    <label htmlFor="UserImage">Your DP</label>
                </div>
                <button type="submit" className="btn">Sign Up</button>
                <p className="auth-link">
                    Already have an account?{" "}
                    <span onClick={() => navigate('/login')}>Login here</span>
                </p>
            </form>
        </div>
    );
} 
