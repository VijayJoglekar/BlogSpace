import { useState } from "react"
import "./ResetPass.css"
import axios from "axios"
import qs from "qs"
import { useNavigate } from "react-router-dom"
export default function ResetPass(){
    const [email, setEmail] = useState('')
    const [OTP, setOtp] = useState(0)
    const [newPass, setNewPass] = useState('')
    const navigate = useNavigate()
    const RPsubmit = async (e)=>{
        e.preventDefault()
        console.log(OTP)
        try{
            const response = await axios.post(
                'http://127.0.0.1:8000/resetPass/', qs.stringify({
                    'email': email,
                    'new_password': newPass,
                    "otp": OTP
                }),{
                    withCredentials: true, 
                }
            )
            if(response.status === 200){
                navigate("/login")
            }
            else if ( response.status === 201){
                alert(response.message)
            }

            
        }
        catch(error){
            alert(error)
        }
    }
    return (
        <div className="RestPassContainer">
            <div className="RPHeading">
                <h2>Reset the Password</h2>
            </div>
            <div className="RPContainer">
                <input
                    type="email"
                    name="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter the email id"
                    className="RPinput"
                />
                <input
                    required
                    value={OTP}
                    type="number"
                    onChange={(e) => setOtp(e.target.value)}
                    placeholder="Enter the Otp"
                    className="RPinput"
                />
                <input
                    required
                    value={newPass}
                    type="text"
                    onChange={(e) => setNewPass(e.target.value)}
                    placeholder="Enter the New Password"
                    className="RPinput"
                />
                <button className="RPsubmit" onClick={RPsubmit}>submit</button>
            </div>
        </div>
    )
}