import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Header from '../../components/Header/Header';
import Sidebar from '../../components/sidebar/Sidebar';
import Pagetitle from '../../components/pagetitle/Pagetitle';
import SunEditor from 'suneditor-react';
import axios from 'axios';
import API_BASE_URL from '../../config/Config';
import { IKUpload } from 'imagekitio-react';

function EditBlog() {
  const { id } = useParams(); // Get the blog ID from the URL
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [image, setImage] = useState(null);
  const [existingImage, setExistingImage] = useState('');
  const navigate = useNavigate();

  // Fetch existing blog data on component mount
  useEffect(() => {
    const fetchBlogData = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/get-blogs/${id}`);
        if (response.ok) {
          const data = await response.json();
          setTitle(data.data.title);
          setContent(data.data.content); // Set content properly
          setExistingImage(data.data.images);
        } else {
          console.error('Error fetching blog data');
        }
      } catch (error) {
        console.error('Error:', error);
      }
    };

    fetchBlogData();
  }, [id]); // Only run this effect when `id` changes



  const handleTitleChange = (event) => {
    setTitle(event.target.value);
  };

  const handleSubmit = async () => {
    const data = {
      title,
      content,
      images: image,
    };
  
    try {
      const response = await axios.put(`${API_BASE_URL}/edit-blog/${id}`, data);
  
      if (response.status === 200) {
        navigate('/blogs-list'); // Redirect to blogs list
      } else {
        console.error('Error updating blog');
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
        <Pagetitle page='Edit Blog' />
        <section className='section'>
          <div className="card"> {/* Card component to wrap the form */}
            <div className="card-header">
              <h4>Edit Blog</h4> {/* Optional header for the card */}
            </div>
            <div className="card-body">
              <form onSubmit={(e) => { e.preventDefault(); handleSubmit(); }}>
                <div className="mb-3">
                  <label htmlFor="title" className="form-label">Blog Title</label>
                  <input
                    value={title}
                    id="title"
                    name="title"
                    className="form-control"
                    placeholder="Create your Title..."
                    type="text"
                    onChange={handleTitleChange} // Handle title input change
                    required
                  />
                </div>
                <hr />
                {content && ( // Only render SunEditor when content is available
                  <div className='mb-3'>
                    <label htmlFor="blog" className="form-label">Blog Content</label>
                    <SunEditor
                      setContents={content} // Use setContents to initialize content
                      setDefaultStyle='font-size:18px'
                      setOptions={{
                        buttonList: [
                          ['bold', 'underline', 'italic', 'strike', 'subscript', 'superscript'],
                          ['font', 'fontSize', 'formatBlock'],
                          ['align', 'horizontalRule', 'list', 'table'],
                          ['link', 'image'],
                          ['fullScreen', 'showBlocks', 'codeView']
                        ]
                      }}
                      onChange={newContent => setContent(newContent)}
                    />
                  </div>
                )}
                <hr />
                <div className="mt-3 col-md-3">
                  <label htmlFor="imageName" className="form-label">Blog Image</label>
                  {/* <input
                    id="imageName"
                    name='blogImage'
                    className="form-control"
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                  /> */}
                  <IKUpload
                      className='form-control'
                      fileName='b-img'
                      folder='/media'
                      onError={(err) => console.error("Error uploading image", err)}
                      onSuccess={(res) => {
                          console.log("Upload successful, image URL:", res.url);
                          setImage(res.url);
                      }}
                      
                  />
                  {existingImage && !image && (
                    <div className="mt-2">
                      <p>Current Image:</p>
                      <img src={existingImage} alt="Blog" style={{ width: '100px' }} />
                    </div>
                  )}
                </div>
                <button className='mt-2 btn btn-primary w-100' type='submit'>Update</button>
              </form>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}

export default EditBlog;
