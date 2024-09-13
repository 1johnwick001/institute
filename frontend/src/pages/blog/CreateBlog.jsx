import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/Header/Header';
import Sidebar from '../../components/sidebar/Sidebar';
import Pagetitle from '../../components/pagetitle/Pagetitle';
import API_BASE_URL from '../../config/Config';
import axios from 'axios';
import { IKUpload } from 'imagekitio-react';
import TestSunEditorJsx from './Editor';

function CreateBlog() {
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [tabs, setTabs] = useState([]); // State for tabs
  const [selectedTab, setSelectedTab] = useState(''); // State for selected tab
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [image, setImage] = useState(null);
  const navigate = useNavigate();
  const editor = useRef();

  const getSunEditorInstance = (sunEditor) => {
    editor.current = sunEditor;
  };

  const [uploading, setUploading] = useState(false);
  

  // Fetch categories
  const fetchCategories = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/get-categories`);
      setCategories(response.data.data);
    } catch (error) {
      console.error('Error fetching categories:', error);
      setCategories([]);
    }
  };

  // Fetch tabs for a selected category
  const fetchTabs = async (categoryId) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/get-tabs-by-category/${categoryId}`);
      setTabs(response.data.data); // Assuming the response contains tabs filtered by category
    } catch (error) {
      console.error('Error fetching tabs:', error);
      setTabs([]);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  // Update when category changes
const handleCategoryChange = (e) => {
  const categoryId = e.target.value;
  setSelectedCategory(categoryId);
  fetchTabs(categoryId); // Fetch tabs based on the selected category
};

  const renderCategoryOptions = (categories) => {
    return categories.map((category) => (
      <React.Fragment key={category._id}>
        <option value={category._id}>{category.name}</option>
        {category.subcategories && renderCategoryOptions(category.subcategories)}
      </React.Fragment>
    ));
  };

  const handleSubmit = async () => {
    if (!title) {
      alert('Please upload a blog image.');
      return;
    }

    const formData = new FormData();
    formData.append('category', selectedCategory);
    formData.append('tab', selectedTab); // Adding the tab if selected
    formData.append('title', title);
    formData.append('content', content);
    formData.append('images', image);

    try {
      const response = await axios.post(`${API_BASE_URL}/create-blog`, formData, {
        headers: { 'Content-Type': 'application/json' },
      });

      if (response.status === 201) {
        navigate('/blogs-list');
      } else {
        console.error('Error creating blog');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <>
      <Header />
      <Sidebar />
      <main id="main" className="main">
        <Pagetitle page="Create Blog" />
        <section className="section">
          <div className="card"> {/* Card component to wrap the form */}
            <div className="card-body">
            <form onSubmit={(e) => { e.preventDefault(); handleSubmit(); }}>
    <div className="mb-3">
      <label htmlFor="category" className="form-label">Select Category</label>
      <select
        id="category"
        className="form-control"
        value={selectedCategory}
        onChange={handleCategoryChange}
      >
        <option value="">Select a category</option>
        {renderCategoryOptions(categories)}
      </select>
    </div>

    {Array.isArray(tabs) && tabs.length > 0 && (
  <div className="mb-3">
    <label htmlFor="tab" className="form-label">Select Tab (optional)</label>
    <select
      id="tab"
      className="form-control"
      value={selectedTab}
      onChange={(e) => setSelectedTab(e.target.value)}
    >
      <option value="">Select a tab</option>
      {tabs.map((tab) => (
        <option key={tab._id} value={tab._id}>{tab.name}</option>
      ))}
    </select>
  </div>
)}
                <div className="mb-3">
                  <label htmlFor="title" className="form-label">Blog Title</label>
                  <input
                    id="title"
                    name="title"
                    className="form-control"
                    placeholder="Create your Title..."
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                  />
                </div>

                <div className="mb-3">
                  <label htmlFor="blog" className="form-label">Blog Content</label>
                  <TestSunEditorJsx
                    value={content}
                    onChange={(newContent) => setContent(newContent)} 
                  />
                </div>

                <div className="mt-3 col-md-3 mb-2">
                  <label htmlFor="imageName" className="form-label">Blog Icon</label>
                  <IKUpload
                    className="form-control"
                    fileName="b-img"
                    folder="/media"
                    onError={(err) => console.error("Error uploading image", err)}
                    onSuccess={(res) => {
                      console.log("Upload successful, image URL:", res.url);
                      setImage(res.url);
                      setUploading(false);
                    }}
                    onUploadStart={() => setUploading(true)}
                  />
                </div>

                <button className="mt-2 btn btn-primary w-100" type="submit" disabled={uploading}>
                  Submit
                </button>
              </form>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}

export default CreateBlog;
