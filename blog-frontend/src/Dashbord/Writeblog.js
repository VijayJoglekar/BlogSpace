import { useState } from "react";
import "./writeblog.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function WriteBlog() {
  const [title, putTitle] = useState('');
  const [content, putContent] = useState('');
  const [blogImg, putImg] = useState(null);
  const [category, setCategory] = useState('');
  const navigate = useNavigate();
  return (
    <div className="Slate_container">
      <h2 className="page_head">Write a New Blog</h2>
      <WriteForm
        title={title}
        putTitle={putTitle}
        putContent={putContent}
        content={content}
        img={blogImg}
        putImg={putImg}
        category={category}
        setCategory={setCategory}
        navigate={navigate}
      />
    </div>
  );
}

function WriteForm({ title, putTitle, content, putContent, img, putImg, category, setCategory, navigate }) {
  const handleCategoryChange = (e) => {
    setCategory(e.target.value);
  };

  const submitBlog = async (event) => {
    event.preventDefault()
  
    if (!title || !content || !category || !img) {
      alert('Please fill out all fields');
      return;
    }
  
    const formData = new FormData();
    formData.append('title', title);
    formData.append('content', content);
    formData.append('category', category);  // Ensure it matches the backend field
    formData.append('image', img);
  
    const token = localStorage.getItem("authToken");
    console.log("Token from localStorage:", token);
  
    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/dopost/",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,  // Sending JWT token for authorization
          },
        }
      );
  
      console.log('Response:', response);
      if (response.status === 201) {
        alert(response.data.message);
        // Reset form fields
        putTitle('');
        putContent('');
        putImg(null);
        setCategory('');
        // Optionally reset other state variables if necessary
        navigate('/ViewMyBlog');  // Redirect to View My Blog
      }
    } catch (error) {
      console.error('Error:', error);
      if (error.response) {
        alert(error.response.data.error);
      } else {
        alert("Something went wrong. Please try again.");
      }
    }
  };

  return (
    <form className="Write_form" onSubmit={submitBlog}>
      <div className="Write_inputs">
        <label htmlFor="title">Blog Title</label>
        <input
          placeholder="Enter your blog title"
          type="text"
          value={title}
          id="title"
          onChange={(e) => putTitle(e.target.value)}
        />
      </div>

      <div className="Write_inputs">
        <label>Category</label>
        <select
          id="blog-category"
          name="blog-category"
          required
          value={category}
          onChange={handleCategoryChange}
        >
          <option value="">Select a category</option>
          <option value="Technology">Technology</option>
          <option value="Lifestyle">Lifestyle</option>
          <option value="Travel">Travel</option>
          <option value="Education">Education</option>
        </select>
      </div>

      <div className="Write_inputs">
        <label htmlFor="blog-content">Content</label>
        <textarea
          id="blog-content"
          name="blog-content"
          value={content}
          onChange={(e) => putContent(e.target.value)}
          placeholder="Write your blog here..."
          required
        ></textarea>
      </div>

      <div className="Write_inputs">
        <label htmlFor="blog-image">Upload Image</label>
        <input
          type="file"
          id="blog-image"
          name="blog-image"
          onChange={(e) => putImg(e.target.files[0])}
          accept="image/*"
        />
      </div>

      <button type="submit" className="submit-btn">Publish Blog</button>
    </form>
  );
}
