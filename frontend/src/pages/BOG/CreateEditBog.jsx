import React, { useState, useEffect } from "react";
import Header from '../../components/Header/Header';
import Sidebar from '../../components/sidebar/Sidebar';
import Pagetitle from '../../components/pagetitle/Pagetitle';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import API_BASE_URL from "../../config/Config";




function CreateEditBog() {
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [tabs, setTabs] = useState([]);
  const [selectedTab, setSelectedTab] = useState('');
  const [name, setName] = useState('');
  const [designation, setDesignation] = useState('');
  const [companyName, setCompany] = useState('');
  const [imageFile, setImageFile] = useState(null);  // File state
  const [imageLink, setImageLink] = useState('');

  const navigate = useNavigate();
  const { id } = useParams();
  const [bogId, setBogId] = useState(null);

  const fetchCategories = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/get-categories`);
      setCategories(response.data.data);
    } catch (error) {
      console.error('Error fetching categories:', error);
      setCategories([]);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchTabs = async (categoryId) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/get-tabs-by-category/${categoryId}`);
      setTabs(response.data.data);
    } catch (error) {
      console.error('Error fetching tabs:', error);
      setTabs([]);
    }
  };

  const renderCategoryOptions = (categories) => {
    return categories.map((category) => (
      <React.Fragment key={category._id}>
        <option value={category._id}>{category.name}</option>
        {category.subcategories && renderCategoryOptions(category.subcategories)}
      </React.Fragment>
    ));
  };

  const handleCategoryChange = (e) => {
    const categoryId = e.target.value;
    setSelectedCategory(categoryId);
    fetchTabs(categoryId);
  };

  useEffect(() => {
    if (id) {
      setBogId(id);
      axios.get(`${API_BASE_URL}/get-bog/${id}`)
        .then(response => {
          const bogData = response.data.data;
          if (bogData) {
            setName(bogData.name || '');
            setDesignation(bogData.designation || '');
            setCompany(bogData.companyName || '');
            setImageLink(bogData.imageLink || '');
          }
        })
        .catch(error => {
          console.error('Error fetching BOG data', error);
        });
    }
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append('category', selectedCategory);
      formData.append('name', name);
      formData.append('designation', designation);
      formData.append('companyName', companyName);
      formData.append('tab', selectedTab);

      if (imageFile) {
        formData.append('image', imageFile);  // Attach the selected file
      }


      const EditformData = new FormData();
      EditformData.append('name', name);
      EditformData.append('designation', designation);
      EditformData.append('companyName', companyName);
      
      if (imageFile) {
        EditformData.append('image', imageFile);  // Attach the selected file
      }

      if (bogId) {
        await axios.put(`${API_BASE_URL}/edit-bog/${bogId}`, EditformData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
      } else {
        await axios.post(`${API_BASE_URL}/create-bog`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
      }
      navigate('/bog-details');
    } catch (error) {
      console.error(error);
      alert(error.message);
    }
  };

  return (
    <>
      <Header />
      <Sidebar />
      <main id="main" className="main">
        <Pagetitle page="Create Cards" />
        <section className="section">
          <div className="card">
            <div className="card-body">
              <form onSubmit={handleSubmit}>
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
                  <label htmlFor="bogName" className="form-label">Name</label>
                  <input
                    type="text"
                    className="form-control"
                    id="bogName"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter name"
                    required
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="imageFile" className="form-label">Cards Name Field</label>
                  {imageLink && (
                    <div className="mb-3">
                      <img src={imageLink} alt="BOG" style={{ width: '50px', height: '50px' }} />
                    </div>
                  )}
                  <input
                    type="file"
                    className="form-control"
                    id="imageFile"
                    onChange={(e) => setImageFile(e.target.files[0])}
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">second Field / Designation</label>
                  <input
                    type="text"
                    className="form-control"
                    id="designation"
                    value={designation}
                    onChange={(e) => setDesignation(e.target.value)}
                    placeholder="Enter designation"
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Company Name / Details</label>
                  <input
                    type="text"
                    className="form-control"
                    id="companyName"
                    value={companyName}
                    onChange={(e) => setCompany(e.target.value)}
                    placeholder="Enter company name"
                  />
                </div>
                <hr />
                <div>
                  <button type="submit" className="btn btn-primary w-100" >Submit</button>
                </div>
              </form>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}

export default CreateEditBog;
