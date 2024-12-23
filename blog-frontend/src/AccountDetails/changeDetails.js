import React, { useState } from "react";
import axios from "axios";
import "./UpdateProfile.css";

export default function UpdateProfile() {
    // State to manage the new username input
    const [userName, setUsername] = useState("");

    // Function to handle username update
    const usernameUpdate = async (event) => {
        event.preventDefault();
        try {
            // Sending the username to the backend
            const response = await axios.post(
                "http://127.0.0.1:8000/changeUser/",
                { username: userName }, // Sending data in request body
                {
                    headers: {
                        "Content-Type": "application/json", // Specify content type
                        Authorization: `Bearer ${localStorage.getItem("authToken")}`, // Add token for authentication
                    },
                }
            );
            if (response.status === 200){
                alert(response.message)
            }
        } catch (error) {
            // Handle error
            console.error("Error updating username:", error);
            alert("Failed to update username. Please try again.");
        }
    };

    return (
        <div className="UpdateProfileContainer">
            <div className="UpdateProHeading">
                <h2>Update Profile</h2>
            </div>
            <form onSubmit={usernameUpdate}>
                <label className="UpUser">Change Username</label>
                <input
                    className="UpUInput"
                    id="usernameUp"
                    value={userName}
                    onChange={(e) => setUsername(e.target.value)} // Update state on input change
                    placeholder="Enter New Username"
                />
                <button type="submit" className="update-button">
                    Update Username
                </button>
            </form>
        </div>
    );
}
