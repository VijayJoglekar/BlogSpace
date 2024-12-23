import axios from "axios"
import { useState } from "react"
import qs from 'qs'
import { useNavigate } from "react-router-dom"
import "./forgot.css"

export default function Forgotpass(){
    const [email, setEmail] = useState('')
    const navigate = useNavigate()
    const subEmail =async (e)=>{
        e.preventDefault()
        try{
            const response = await axios.post(
                'http://127.0.0.1:8000/forgotpass/', qs.stringify(
                    {
                       "Email": email
                    }
                ),{
                    
                    withCredentials: true, 
                }
            )
            if (response.status === 200){
                navigate("/resetPass")
            }
            else if(response.status === 400){
                alert(response.message)
            }
        }catch(error){
            alert(error)
        }

    }
    return(
        <div className="ForgotPassContainer">
            <div className="FHeading">
                <h2>Validate Email</h2>
            </div>
            <div className="InputContainer">
                <input
                    className="fInputEmail"
                    type="email"
                    id="email"
                    name="email"
                    required
                    value={email}
                    onChange={(e)=>setEmail(e.target.value)}
                    placeholder="Enter the email id"
                />
                <button className="fbtn" onClick={subEmail}>submit</button>
            </div>
        </div>
    )
}