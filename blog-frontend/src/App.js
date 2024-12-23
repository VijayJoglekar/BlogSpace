import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import LandingView from "./User_functionality/Landing";
import SignupView from "./User_functionality/signup";
import Login from "./User_functionality/login";
import Validate from "./User_functionality/validate";
import DashBoard from "./Dashbord/Dashbord";
import WriteBlog from "./Dashbord/Writeblog";
import ViewOwnBlog from "./Blogs_viewing/ownBlog";
import BlogDetail from "./Blogs_viewing/Detailview";
import Explore from "./Blogs_viewing/explore";
import OtherBlog from "./Blogs_viewing/SeeOthersBlog";
import Forgotpass from "./User_functionality/Forgotpass";
import ResetPass from "./User_functionality/resetPassword";
import UpdateProfile from "./AccountDetails/changeDetails";

// import ForgotPasswordView from "./ForgotPasswordView";
// import ResetPasswordView from "./ResetPasswordView";

export default function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<LandingView />} />
                <Route path="/signup" element={<SignupView />} />
                <Route path="/login" element={<Login />} />
                <Route path="/validate" element={<Validate />} />
                <Route path="/Dashboard" element= {<DashBoard/>} />
                <Route path="/WriteBlog" element= {<WriteBlog/>}/>
                <Route path="/ViewMyBlog" element= {<ViewOwnBlog/>} />
                <Route path="/entireBlog" element={<BlogDetail />} />
                <Route path="/explore" element={<Explore/>}/>
                <Route path="/seeBlog" element={<OtherBlog/>}/>
                <Route path="/forgotpass" element={<Forgotpass/>}/>
                <Route path="/resetPass" element={<ResetPass/>}/>
                <Route path="/updatePro" element={<UpdateProfile/>}/>
                {/* <Route path="/forgot-password" element={<ForgotPasswordView />} />
                <Route path="/reset-password" element={<ResetPasswordView />} /> */}
            </Routes>
        </Router>
    );
}
