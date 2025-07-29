import React, { useEffect, useState } from "react";
import axios from "../../../service/axiosInstance";
import "./Blog.scss";
import Navbar from "../Home/Navbar";
import Footer from "../Home/Footer";

const Blog = () => {
  const [blogs, setBlogs] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const res = await axios.get(`/blogs/get?page=${currentPage}`);
        setBlogs(res.data.blogs);
        setTotalPages(res.data.totalPages);
      } catch (error) {
        console.error("Error fetching blogs:", error);
      }
    };

    fetchBlogs();
  }, [currentPage]);

  const parseTags = (tags) => {
    if (Array.isArray(tags)) return tags;
    if (typeof tags === "string") {
      if (tags.startsWith("{") && tags.endsWith("}")) {
        return tags
          .slice(1, -1)
          .split(",")
          .map((tag) => tag.replace(/^"|"$/g, "").trim());
      }
      return tags.split(",").map((tag) => tag.trim());
    }
    return [];
  };

  const goToPage = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <>
      <Navbar />
      <div className="blog-page">
        <h2>Blog List</h2>
        {blogs.length === 0 && <p>No blog posts available.</p>}
        {blogs.map((blog) => (
          <div key={blog.blog_id} className="blog-card">
            <h3>{blog.title}</h3>
            <p>
              <strong>Content:</strong> {blog.content}
            </p>
            <p>
              <strong>Tags:</strong> {parseTags(blog.tags).join(", ")}
            </p>
            <p>
              <strong>Published At:</strong>{" "}
              {new Date(blog.published_at).toLocaleString()}
            </p>
          </div>
        ))}

        <div className="pagination">
          <button
            onClick={() => goToPage(currentPage - 1)}
            disabled={currentPage === 1}
          >
            Previous
          </button>
          <span>
            Page {currentPage} / {totalPages}
          </span>
          <button
            onClick={() => goToPage(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            Next
          </button>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Blog;
