import './landing.css';
import axios from 'axios';
import qs from 'qs';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';



export default function Validate() {
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState('');
    const navigate = useNavigate();
    
    const submitValidate = async (event) => {
        event.preventDefault();
        try {
          

            const response = await axios.post(
                "http://127.0.0.1:8000/validate/",
                qs.stringify({ email: email, Otp: otp }),
                {
                   
                    withCredentials: true, // Allow cookies to be sent
                }
            );

            if (response.status === 200) {
                alert(response.data.message);
                navigate("/login");
            } else {
                alert(response.data.message);
            }
        } catch (error) {
            if (error.response) {
                alert(error.response.data.message);
            } else {
                alert("Something went wrong. Please try again.");
            }
        }
    };

    return (
        <div className="auth-container">
            <h2>Validate OTP</h2>
            <form className="validate-form" onSubmit={submitValidate}>
                <div className="input-group">
                    <input
                        type="email"
                        id="Email"
                        name="Email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <label htmlFor="Email">Email</label>
                    <i className="input-icon">&#128100;</i>
                </div>
                <div className="input-group">
                    <input
                        type="number"  
                        id="Otp"
                        name="Otp"
                        required
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                    />
                    <label htmlFor="Otp">OTP</label>
                    <i className="input-icon">&#128274;</i>
                </div>
                <button type="submit" className="btn">Validate</button>
                <p className="auth-link">
                    <span onClick={() => navigate("/login")}>Login</span>
                </p>
            </form>
        </div>
    );
}
