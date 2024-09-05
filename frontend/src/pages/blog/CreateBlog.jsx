import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/Header/Header';
import Sidebar from '../../components/sidebar/Sidebar';
import Pagetitle from '../../components/pagetitle/Pagetitle';
import API_BASE_URL from '../../config/Config';
import SunEditor from 'suneditor-react';
import axios from 'axios';
import { IKUpload } from 'imagekitio-react';


function CreateBlog() {
  const [categories, setCategories] = useState([])
  const [selectedCategory, setSelectedCategory] = useState('')
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [image, setImage] = useState(null);
  const navigate = useNavigate();

  const [uploading, setUploading] = useState(false);

  const fetchCategories = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/get-categories`);
      setCategories(response.data.data)
    } catch (error) {
      console.error('Error fetching categories:', error);
      setCategories([]);
    }
  }

useEffect(() => {
    fetchCategories();
}, []);

const renderCategoryOptions = (categories) => {
  return categories.map((category) => (
    <React.Fragment key={category._id}>
      <option value={category._id}>{category.name}</option>
      {category.subcategories && renderCategoryOptions (category.subcategories)}
    </React.Fragment>
  ));
};

  const handleTitleChange = (event) => {
    setTitle(event.target.value);
  };



  const handleSubmit = async () => {
    if (!image) {
      alert('Please upload a blog image.');
      return;
    }

    const formData = new FormData();
    formData.append('category', selectedCategory);
    formData.append('title', title);
    formData.append('content', content);
    formData.append('images', image);

    try {
      const response = await axios.post(`${API_BASE_URL}/create-blog`, formData , {
        headers : {'Content-Type': 'application/json'}
      });

      if (response.status === 201) {
        const data = await response.data;
        navigate('/blogs-list'); // Redirect to blogs list
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
                    onChange={(e) => setSelectedCategory(e.target.value)}
                  >
                    <option value="">Select a category</option>
                    {renderCategoryOptions(categories)}
                  </select>
                </div>
                <div className="mb-3">
                  <label htmlFor="title" className="form-label">Blog Title</label>
                  <input
                    id="title"
                    name="title"
                    className="form-control"
                    placeholder="Create your Title..."
                    type="text"
                    value={title}
                    onChange={handleTitleChange} // Handle title input change
                    required
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="blog" className="form-label">Blog Content</label>
                  <SunEditor
                    value={content}
                    placeholder="Please type here..."
                    autoFocus={true}
                    setDefaultStyle="font-size:18px;"
                    setOptions={{
                      buttonList: [
                        ['bold', 'underline', 'italic', 'strike', 'subscript', 'superscript'],
                        ['font', 'fontSize', 'formatBlock'],
                        ['align', 'horizontalRule', 'list', 'table'],
                        ['link', 'image'],
                        ['fullScreen', 'showBlocks', 'codeView']
                      ]
                    }}
                    onChange={(newContent) => setContent(newContent)} // Handle content change
                  />
                </div>
                <div className="mt-3 col-md-3 mb-2">
                  <label htmlFor="imageName" className="form-label">Blog Image</label>
                  {/* <input
                    id="imageName"
                    name="blogImage"
                    className="form-control"
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange} // Handle image file change
                    required
                  /> */}
                  <IKUpload
                      className='form-control'
                      fileName='b-img'
                      folder='/media'
                      onError={(err) => console.error("Error uploading image", err)}
                      onSuccess={(res) => {
                          console.log("Upload successful, image URL:", res.url);
                          setImage(res.url);
                          setUploading(false);
                      }}
                      onUploadStart={() => setUploading(true)}
                      required
                  />
                </div>
                <button className="mt-2 btn btn-primary w-100" type="submit" disabled={uploading}>Submit</button>
              </form>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}

export default CreateBlog;
