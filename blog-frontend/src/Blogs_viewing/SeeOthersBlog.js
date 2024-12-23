import axios from "axios"
import { useEffect, useState, useRef     } from "react"
import { useLocation } from "react-router-dom"
import "./seeotherblog.css"
export default function OtherBlog(){
    const location = useLocation()
    const Bid = location.state?.bid
    const token = localStorage.getItem("authToken")
    console.log(Bid, token)
    return(
        <>
            <HeadOfView/>
            <BodyOfView 
                blogid = {Bid}
                token={token}
            />
            <FootOfView
                blogid={Bid}
                token={token}
            />
        </> 
    )
}

function HeadOfView(){
    
    const HandleBack = ()=>{
        
    }
    <div className="Navigator_to_back">
        <button onClick={HandleBack}>Back</button>
    </div>
}

function BodyOfView({ blogid, token}){
    const [blogs, setBlogss] = useState(null)
    const [loading, setloading] = useState(true)
    useEffect(()=>{
        const fetchBlog =async ()=>{
            try{
                const responce = await axios.get(`http://localhost:8000/exploreBlog/${blogid}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    }
                })
                if (responce.status === 400){
                }
                else if(responce.status === 200){ setBlogss(responce.data.data) 
                    console.log(responce.data.data)
                    setloading(false) }
            }
            catch(error){
                alert(error)
            }
        }
        fetchBlog()

    },[blogid, token])
    return loading?(<div><p>Loading</p></div>):(
        <div className="BlogData">
            <div className="Img_container">
                <img src={`http://localhost:8000${blogs.image}`} alt="Blog img"/>
            </div>
            <div className="Blog_Title">
                <h1 className="Blog_Head">{blogs.title}</h1>
            </div>
            <div className="PublisherData">
                <img src={`http://localhost:8000${blogs.author.profile_picture}`} alt="Publisher Img"/>
                <p>{blogs.author.username}</p>
                <p className="Publish_date"> {blogs.author.published_date}</p>
            </div>
            <div className="ContentBlog">
                <p>{blogs.content}</p>
            </div>
        </div>
    )
}




function FootOfView({ blogid, token }) {
    const [newComment, setNewComment] = useState('')
    const [previousComments, setPreviousComments] = useState([])
    const [loadingComments, setLoadingComments] = useState(true)
    const [message, setMessage] = useState('')

    // Ref for the comments container to manage scroll
    const commentsContainerRef = useRef(null)

    useEffect(() => {
        const fetchComments = async () => {
            try {
                const response = await axios.get(`http://localhost:8000/Getcomments/${blogid}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                })
                if (response.status === 200) {
                    setPreviousComments(response.data.comments)
                    setMessage('')
                } else {
                    setMessage(response.data.error || 'No comments yet.')
                }
            } catch (error) {
                alert('Error fetching comments: ' + error)
            } finally {
                setLoadingComments(false)
            }
        }

        fetchComments()
    }, [blogid, token])

    // Function to scroll the comments container to the bottom
    const scrollToBottom = () => {
        if (commentsContainerRef.current) {
            commentsContainerRef.current.scrollTop = commentsContainerRef.current.scrollHeight
        }
    }

    const handlePostComment = async () => {
        if (!newComment.trim()) {
            alert('Comment cannot be empty')
            return
        }

        try {
            const response = await axios.post(
                'http://localhost:8000/doCommemt/',
                { id: blogid, comment: newComment },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            )

            if (response.status === 201) {
                setPreviousComments([
                    ...previousComments,
                    { user: { username: 'You' }, content: newComment, created_at: new Date() },
                ])
                setNewComment('')
                // Scroll to the bottom after posting a new comment
                scrollToBottom()
            } else {
                alert(response.data.message || 'Failed to post comment')
            }
        } catch (error) {
            alert('Error posting comment: ' + error)
        }
    }

    return (
        <div className="comments-section">
            <h2>Comments</h2>
            <div className="comments-container" ref={commentsContainerRef}>
                {loadingComments ? (
                    <p>Loading comments...</p>
                ) : previousComments && previousComments.length > 0 ? (
                    <div className="comments-list">
                        {previousComments.map((comment, index) => (
                            <div key={index} className="comment-item">
                                <p>
                                    <strong>{comment.user.username}</strong>: {comment.content}
                                </p>
                                <p className="comment-date">{new Date(comment.created_at).toLocaleString()}</p>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p>{message || 'No comments yet. Be the first to comment!'}</p>
                )}
            </div>
            <div className="add-comment">
                <textarea
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Write a comment..."
                />
                <button onClick={handlePostComment}>Post Comment</button>
            </div>
        </div>
    )
}