import { useState, useEffect } from "react";
import axios from "axios";
import './explore.css'
import { useNavigate } from "react-router-dom";
export default function Explore() {
  const [catagory, setcatagory] = useState("")
  const [blogs, setBlog] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  

  return (
    <>
      <Heading catagory={catagory} setcatagory={setcatagory} />
      <MiddlePart
        catagory={catagory}
        blogs={blogs}
        setBlog={setBlog}
        loading={loading}
        setLoading={setLoading}
        error={error}
        setError={setError}
      />
    </>
  );
}

function Heading({ catagory, setcatagory }) {
  return (
    <div className="head">
      <div className="Header">
        <h1>Explore Blogs</h1>
      </div>
      <div className="search-bar">
        <input
          type="text"
          placeholder="Search Blogs..."
          value={catagory}
          onChange={(e) => setcatagory(e.target.value)}
          id="search-input"
        />
      </div>
    </div>
  );
}


function MiddlePart({ catagory, blogs, setBlog, loading, setLoading, error, setError }) {
  const navigate = useNavigate(); // Initialize the navigate hook

  useEffect(() => {
    const fetchBlog = async () => {
      const token = localStorage.getItem("authToken");
      setLoading(true);
      setError(null);

      try {
        const response = await axios.get("http://localhost:8000/explore/", {
          params: { catagory: catagory },
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.status === 200) {
          setBlog(response.data.data);
        } else {
          setError("Failed to fetch blogs");
        }
      } catch (err) {
        setError("Error fetching blogs: " + err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchBlog();
  }, [catagory, setBlog, setLoading, setError]);

  const handelReadMore = (blogid) => {
    navigate("/seeBlog", {
      state: { bid: blogid },
    });
  };

  return (
    <div className="blog-list">
      {loading ? (
        <p>Loading blogs...</p>
      ) : error ? (
        <p style={{ color: "red" }}>{error}</p>
      ) : blogs && blogs.length > 0 ? (
        blogs.map((blog) => (
          <div key={blog.id} className="blogitem">
            <h3>{blog.title}</h3>
            <p>{blog.content.slice(0, 60)}</p>
            <button className="ReadMore" onClick={() => handelReadMore(blog.id)}>
              Read More
            </button>
          </div>
        ))
      ) : (
        <p>No blogs available</p>
      )}
    </div>
  );
}
