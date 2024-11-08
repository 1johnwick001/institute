import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/Header/Header';
import Sidebar from '../../components/sidebar/Sidebar';
import Pagetitle from '../../components/pagetitle/Pagetitle';
import API_BASE_URL from '../../config/Config';
import axios from 'axios';

function CreateBgBanner() {

    const [title, setTitle] = useState('');
  const [shortContent, setShortContent] = useState('');
  const [logo, setLogo] = useState(null); // Use null to represent no file selected

  const navigate = useNavigate();

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
      formData.append('image', logo); // Append the file to FormData
    }

    try {
      const response = await axios.post(`${API_BASE_URL}/create-bgbanner`, formData);

      if (response.status === 201) {
        navigate('/bgBanners-list');
      } else {
        console.error('Error creating Background Banner');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to create Background Banner. Please try again.'); // User feedback
    }
  };

  return (
    <>
      <Header />
      <Sidebar />
      <main id="main" className="main">
        <Pagetitle page="Create Background Banner " />
        <section className="section">
          <div className="card">
            <div className="card-body">
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label htmlFor="title" className="form-label">Heading</label>
                  <input
                    id="title"
                    name="title"
                    className="form-control"
                    placeholder="Enter your title..."
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                  />
                </div>

                

                <div className="mb-3">
                  <label htmlFor="shortdescription" className="form-label">Sub Heading</label>
                    <textarea
                    id="shortdescription"
                    name="shortdescription"
                    className="form-control"
                    type="textarea"
                    onChange={(e) => setShortContent(e.target.value)}
                    required
                    >
                    </textarea>
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
                    required
                  />
                </div>

                
                <button className="mt-2 btn btn-primary w-100" type="submit">
                  Submit
                </button>
              </form>
            </div>
          </div>
        </section>
      </main>
    </>
  )
}

export default CreateBgBanner