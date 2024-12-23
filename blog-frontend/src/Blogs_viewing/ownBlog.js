import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import "./OwnBlog.css";

export default function ViewOwnBlog() {
    const [blogs, setBlogs] = useState([]); // Store the blogs
    const [loading, setLoading] = useState(true); // To handle loading state
    const [error, setError] = useState(null); // To handle errors
    const navigate = useNavigate(); // Initialize navigation

    useEffect(() => {
        const fetchBlogs = async () => {
            const token = localStorage.getItem("authToken");
            try {
                const response = await fetch("http://localhost:8000/showMyblog/", {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                });

                if (!response.ok) {
                    throw new Error("Failed to fetch blogs");
                }

                const data = await response.json();
                setBlogs(data.blogs); // Update state with blog data
                setLoading(false);
            } catch (error) {
                setError(error.message);
                setLoading(false);
            }
        };

        fetchBlogs();
    }, []);

    const handleBackToDashboard = () => {
        navigate("/Dashboard"); // Navigate to the dashboard route
    };

    if (loading) {
        return <div>Loading blogs...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    function readMore(bgid) {
        localStorage.setItem("blogid", bgid);
        navigate("/entireBlog");
    }

    return (
        <div className="BlogList">
            <header className="ListHead">
                <h1>My Blogs</h1>
                <button className="BackDashboardBtn" onClick={handleBackToDashboard}>
                    Back to Dashboard
                </button>
            </header>
            {blogs.length === 0 ? (
                <p>You don't have any blogs yet.</p>
            ) : (
                <div className="BlogContainer">
                    {blogs.map((blog, index) => (
                        <div key={index} className="BlogItem">
                            <h3 className="BlogTitle">{blog.title}</h3>
                            {/* Access author properties correctly */}
                            <p className="BlogAuthor">
                                Author: {blog.author?.username || "Unknown"}
                            </p>
                            <p className="BlogSnippet">{blog.content.slice(0, 200)}...</p>
                            <span>
                                Published on:{" "}
                                {new Date(blog.published_date).toLocaleDateString()}
                            </span>
                            <button
                                onClick={() => readMore(blog.id)}
                                className="ReadMore"
                            >
                                Read More
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
