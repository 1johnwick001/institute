import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Header from '../../components/Header/Header';
import Sidebar from '../../components/sidebar/Sidebar';
import Pagetitle from '../../components/pagetitle/Pagetitle';
import API_BASE_URL from '../../config/Config';
import axios from 'axios';
import API_BASE_IMAGE_URL from '../../config/ImageConfig';

function EditBgBanner() {

    const [title, setTitle] = useState('');
    const [shortContent, setShortContent] = useState('');
    const [logo, setLogo] = useState(null);
    const [existingImage, setExistingImage] = useState(null); 
    const navigate = useNavigate();
    const { id } = useParams(); 
  
    useEffect(() => {
      const fetchWebServices = async () => {
        try {
          const response = await axios.get(`${API_BASE_URL}/get-bgbannerbyId/${id}`);
          const { heading, subHeading, image } = response.data.data; 
          setTitle(heading);
          setShortContent(subHeading);
          setExistingImage(image);
        } catch (error) {
          console.error('Error fetching background banner:', error);
        }
      };
  
      fetchWebServices();
    }, [id]);
  
    const handleSubmit = async (e) => {
      e.preventDefault(); 
  
      if (!title) {
        alert('Please enter a title.');
        return;
      }
  
      const formData = new FormData();
      formData.append('heading', title);
      formData.append('subHeading', shortContent);
      
      if (logo) {
        formData.append('image', logo);
      }
  
      try {
        const response = await axios.put(`${API_BASE_URL}/update-bgbanner/${id}`, formData);
        if (response.status === 200) {
          navigate('/bgBanners-list');
        } else {
          console.error('Error updating background banner');
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
        <Pagetitle page="Edit Background Banner" />
        <section className="section">
          <div className="card">
            <div className="card-body">
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label htmlFor="title" className="form-label">heading</label>
                  <input
                    id="title"
                    name="title"
                    className="form-control"
                    placeholder="Enter your question..."
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                  />
                </div>

                <div className="mb-3">
                  <label htmlFor="logo" className="form-label">Image</label>
                  <input
                    id="logo"
                    name="logo"
                    className="form-control"
                    type="file"
                    accept="image/*" 
                    onChange={(e) => setLogo(e.target.files[0])} 
                  />
                  {/* Show the existing image if available and no new image is selected */}
                  {existingImage && !logo && (
                    <div className="mt-2">
                      <p>Current Image:</p>
                      <img src={`${API_BASE_IMAGE_URL}/${existingImage}`} alt="Current image" style={{ width: '80px' }} />
                    </div>
                  )}
                </div>

                <div className="mb-3">
                  <label htmlFor="shortdescription" className="form-label">Sub Heading </label>
                    <textarea
                    id="shortdescription"
                    name="shortdescription"
                    className="form-control"
                    type="textarea"
                    value={shortContent}
                    onChange={(e) => setShortContent(e.target.value)}
                    required
                    >
                    </textarea>
                </div>

                
                <button className="mt-2 btn btn-primary w-100" type="submit">
                  Update
                </button>
              </form>
            </div>
          </div>
        </section>
      </main>
    </>
  )
}

export default EditBgBanner