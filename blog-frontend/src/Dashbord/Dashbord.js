import { useNavigate } from "react-router-dom";
import "./dashbord.css";
import { useEffect, useState } from "react";

export default function DashBoard() {
  const [userData, setUserData] = useState(null);


  useEffect(() => {
    const token = localStorage.getItem("authToken")

   
    fetch("http://localhost:8000/get-user-details/", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`, 
      },
    })
      .then((response) => {
        if (response.ok) return response.json();
        throw new Error("Failed to fetch user details");
      })
      .then((data) => {
        setUserData({
          username: data.username,
          email: data.email,
          profile_picture: data.profile_picture,
        });
      })
      .catch((error) => console.error("Error:", error));
  }, []);

  if (!userData) return <p>Loading...</p>;

  return (
    <div className="dashboard-container">
      <DashboardHeader
        username={userData.username}
        email={userData.email}
        profilePic={userData.profile_picture}
      />
      <MiddleDashboard />
      <LastSection />
    </div>
  );
}

function DashboardHeader({ username, profilePic, email }) {
  return (
    <div className="profile-container">
      {profilePic ? (
        <img
          src={profilePic}  
          alt="Profile Pic"
          className="profile-pic"
        />
      ) : (
        <p>No profile picture</p>
      )}
      <h2 className="user-name">{username}</h2>
      <p className="user-email">{email}</p>
      <button className="logout-btn" onClick={handleLogout}>
        Logout
      </button>
    </div>
  );
}

function MiddleDashboard() {
  const navigate = useNavigate();
  const go_to_write = () => {
    navigate("/WriteBlog");
  };
  const go_to_explore = () => {
    navigate("/explore");
  };

  return (
    <div className="blog-container">
      <h3 className="section-header">Your Blogs</h3>
      <div className="no-blogs-message">
        <p>If you want to write a blog, click on the button below.</p>
        <button className="write-blog-btn" onClick={go_to_write}>
          Write Blog
        </button>
      </div>

      
      <div className="explore-blogs-message">
        <p>Want to read blogs from other users? Click below to explore.</p>
        <button className="explore-blogs-btn" onClick={go_to_explore}>
          Explore Blogs
        </button>
      </div>
    </div>
  );
}


function LastSection() {
  const navigate = useNavigate()
  const go_to_update_profile = ()=>{
    navigate("/updatePro")
  }
  return (
    <div className="account-settings-container">
      <h3 className="section-header">Account Settings</h3>
      <button className="update-account-btn" onClick={go_to_update_profile}>Change Account Details</button>
    </div>
  );
}

// Logout function
function handleLogout() {
  fetch("http://localhost:8000/logout/", {
    method: "POST",
    credentials: "include", // Include cookies to logout session
  })
    .then(() => {
      window.location.href = "/login"; // Redirect to login page after logout
    })
    .catch((error) => console.error("Logout error:", error));
}

// // Logout function
// function handleLogout() {
//   const token = localStorage.getItem('authToken'); 
//   if (!token) {
//     console.log("No auth token found, cannot log out");
//     return;
//   }

//   // Send the refresh token to the backend to blacklist it
//   fetch("http://localhost:8000/logout/", {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json",
//     },
//     body: JSON.stringify({ refresh_token: token }), // Send the token in the request body
//   })
//     .then((response) => {
//       if (response.ok) {
       
//         localStorage.removeItem('authToken');
//         window.location.href = "/login"; 
//       } else {
//         throw new Error('Logout failed');
//       }
//     })
//     .catch((error) => console.error("Logout error:", error));
// }