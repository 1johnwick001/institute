import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Header from '../../components/Header/Header';
import Sidebar from '../../components/sidebar/Sidebar';
import Pagetitle from '../../components/pagetitle/Pagetitle';
import JoditEditor from 'jodit-react';
import API_BASE_URL from '../../config/Config';

function EditBlog() {
  const { id } = useParams(); // Get the blog ID from the URL
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
          setContent(data.data.content);
          setExistingImage(data.data.images);
        } else {
          console.error('Error fetching blog data');
        }
      } catch (error) {
        console.error('Error:', error);
      }
    };

    fetchBlogData();
  }, [id]);

  const handleImageChange = (event) => {
    setImage(event.target.files[0]);
  };

  const handleSubmit = async () => {
    const formData = new FormData();
    formData.append('content', content);

    if (image) {
      formData.append('blogImage', image); // Add the new image file only if a new one is selected
    }

    try {
      const response = await fetch(`${API_BASE_URL}/edit-blog/${id}`, {
        method: 'PUT',
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        console.log('Blog updated successfully', data);
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
        <form onSubmit={(e) => { e.preventDefault(); handleSubmit(); }}>
          <JoditEditor
            value={content}
            onChange={newContent => setContent(newContent)}
          />
          <div className="mt-3 col-md-3">
            <label htmlFor="imageName" className="form-label">Blog Image</label>
            <input
              id="imageName"
              name='blogImage'
              className="form-control"
              type="file"
              accept="image/*"
              onChange={handleImageChange}
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
      </main>
    </>
  );
}

export default EditBlog;