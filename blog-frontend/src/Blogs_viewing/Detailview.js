import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import "./BlogDetail.css"
import axios from 'axios';

export default function BlogDetail() {
    const id = localStorage.getItem("blogid")
    const [blog, setBlog] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(false)
    const [message, setFail] = useState(false)
    const [comments , setComments] = useState([])
    const navigate = useNavigate()
    const [NewComment, setNewcomment] = useState("")

    useEffect(() => {
        const fetchData = async () => {
            const token = localStorage.getItem("authToken");
            console.log("Auth Token:", token);

            if (!token) {
                setError("Authentication token is missing.");
                setLoading(false);
                return;
            }

            try {
                const response = await fetch(`http://localhost:8000/viewblog/${id}/`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                if (response.status === 200) {
                    const result = await response.json()
                    console.log("Fetched Blog:", result.data);
                    setBlog(result.data);
                } else if (response.status === 404) {
                    setFail(true);
                } else {
                    throw new Error(`Unexpected status: ${response.status}`);
                }
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        }

        fetchData();
    }, [id]);

    

    if (loading) {
        return <p>Loading...</p>;
    }

    if (error) {
        return <p>Error: {error}</p>;
    }

    if (message) {
        return <p>Sorry, you don't have any blogs.</p>;
    }

    if (!blog) {
        return <p>No blog found!</p>;
    }

    const handleBackToBlogs =()=>{
        navigate("/ViewMyBlog")
    }
    const handleEditBlog =()=>{
        navigate("/")
    }

    const Addcom = async (event)=>{
        event.preventDefault()
        
        try{
            const token = localStorage.getItem("authToken")
            const Docom = await axios.post(
                "http://127.0.0.1:8000/docomments/",
                    {
                    "comment": NewComment,
                    "id" : id
                    },
                {
                    headers: {
                        "Content-Type": "multipart/form-data",
                        Authorization: `Bearer ${token}`,  // Sending JWT token for authorization
                      },

                }
            )
            if (Docom.status === 200){
                alert("New comment added sucessfully")
            }
        }catch(error){
            alert(error)
        }
    }

    return (
        <div className="blog-detail-container">
            <img src={`http://localhost:8000${blog.image}`} alt='img'/>
            <h1>{blog.title}</h1>
            <div className="blog-meta">

                <img src={`http://localhost:8000${blog.author.profile_picture}`} alt='user phot'/>
                <p>Author: {blog.author.username}</p>
                <p className='date'>Published on: {new Date(blog.published_date).toLocaleDateString()}</p>

            </div>
            
    
            <div className="blog-content">
                <p>{blog.content}</p>
            </div>

            <div className="comments-section">
                <h2>Comments</h2>
                <div className="comments-container">
                    {comments.length === 0 ? (
                        <p>No comments yet.</p>
                    ) : (
                        comments.map((comment, index) => (
                            <div key={index} className="comment-item">
                                <p>{comment.user.username}:</p>
                                <p>{comment.text}</p>
                            </div>
                        ))
                    )}
                </div>

                <form  className="comment-form" onSubmit={Addcom}>
                    <textarea 
                        value={NewComment} 
                        onChange={(e) => setNewcomment(e.target.value)} 
                        placeholder="Add a comment..." 
                        required
                    />
                    <button type="submit">Submit</button>
                </form>
            </div>
            
            <div className="buttons">
                <button onClick={handleBackToBlogs}>Back to Blogs</button>
                <button onClick={handleEditBlog}>Edit Blog</button>
            </div>

        </div>
    );
}
