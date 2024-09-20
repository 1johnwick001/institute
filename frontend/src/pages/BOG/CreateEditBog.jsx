import React,{ useState, useEffect } from "react";
import Header from '../../components/Header/Header';
import Sidebar from '../../components/sidebar/Sidebar';
import Pagetitle from '../../components/pagetitle/Pagetitle';
import axios from 'axios';
import { IKUpload } from 'imagekitio-react';
import { useNavigate, useParams } from 'react-router-dom';
import API_BASE_URL from "../../config/Config";

function CreateEditBog() {

  const [categories, setCategories] = useState([])
  const [selectedCategory, setSelectedCategory] = useState('')

  const [tabs, setTabs] = useState([]); // State for tabs
  const [selectedTab, setSelectedTab] = useState(''); // State for selected tab

  const [name, setName] = useState('');
  const [designation, setDesignation] = useState('');
  const [companyName, setCompany] = useState('');
  const [imageLink, setImageLink] = useState('');
  const [uploading, setUploading] = useState(false);

  const navigate = useNavigate();
  const { id } = useParams(); 

  const [bogId, setBogId] = useState(null);

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


const renderCategoryOptions = (categories) => {
  return categories.map((category) => (
    <React.Fragment key={category._id}>
      <option value={category._id}>{category.name}</option>
      {category.subcategories && renderCategoryOptions (category.subcategories)}
    </React.Fragment>
  ));
};

 // Update when category changes
 const handleCategoryChange = (e) => {
  const categoryId = e.target.value;
  setSelectedCategory(categoryId);
  fetchTabs(categoryId); // Fetch tabs based on the selected category
};



  useEffect(() => {
    if (id) {
      setBogId(id);
      // Fetch the BOG data for the given ID
      axios.get(`${API_BASE_URL}/get-bog/${id}`)
        .then(response => {
          // Assuming the BOG data is inside the 'data' field of the response
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
      const bogData = { category :selectedCategory ,name, designation, companyName, imageLink };

      const PostbogData = { category :selectedCategory ,name, designation, companyName, imageLink , tab:selectedTab };

      if (bogId) {
        await axios.put(`${API_BASE_URL}/edit-bog/${bogId}`, bogData);
      } else {
        await axios.post(`${API_BASE_URL}/create-bog`, PostbogData);
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
        <Pagetitle page="Create BOG" />
        <section className='section'>
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
                  <label htmlFor="imageFile" className="form-label">Bog Image / File</label>
                  {imageLink && (
                    <div className="mb-3">
                      <img src={imageLink} alt="BOG" style={{ width: '50px', height: '50px' }} />
                    </div>
                  )}
                  <IKUpload
                    className='form-control'
                    fileName={name}
                    folder='/media'
                    onError={(err) => console.error("Error uploading image", err)}
                    onSuccess={(res) => {
                      console.log("Upload successful, image URL:", res.url);
                      setImageLink(res.url);
                      setUploading(false);
                    }}
                    onUploadStart={() => setUploading(true)}
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Designation</label>
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
                  <label className="form-label">Company Name</label>
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
                  <button type="submit" className="btn btn-primary w-100" disabled={uploading}>Submit</button>
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
