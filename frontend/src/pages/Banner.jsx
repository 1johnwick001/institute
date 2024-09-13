import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Header from '../components/Header/Header';
import Sidebar from '../components/sidebar/Sidebar';
import Pagetitle from '../components/pagetitle/Pagetitle';
import DataTable from 'react-data-table-component';
import API_BASE_URL from '../config/Config';
import { IKUpload } from 'imagekitio-react';


function Banner() {
    const [showAddModal, setShowAddModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);

    const [categories, setCategories] = useState([]); // State for categories
    const [selectedCategory, setSelectedCategory] = useState(''); // State for selected category
    const [tabs, setTabs] = useState([]); // State for tabs
  const [selectedTab, setSelectedTab] = useState(''); // State for selected tab

    const [mediaType, setMediaType] = useState('');
    const [currentVideoUrl, setCurrentVideoUrl] = useState('');

    const [images, setImages] = useState([]);
    const [bannerName, setBannerName] = useState('');
    const [selectedImage, setSelectedImage] = useState(null);
    const [bannerImageFile, setBannerImageFile] = useState(null);
    const [currentImageUrl, setCurrentImageUrl] = useState('');

    const [uploading, setUploading] = useState(false);

    // Fetch Banner images from backend
    const fetchImages = async () => {
        try {
            const response = await axios.get(`${API_BASE_URL}/banner`);
            console.log('API response:', response.data.data);
            setImages(Array.isArray(response.data.data) ? response.data.data : []);
        } catch (error) {
            console.error('Error fetching images:', error);
            setImages([]);
        }
    };

    // Fetch Categories from backend
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
        fetchImages();
        fetchCategories();
    }, []);

    // Update when category changes
const handleCategoryChange = (e) => {
    const categoryId = e.target.value;
    setSelectedCategory(categoryId);
    fetchTabs(categoryId); // Fetch tabs based on the selected category
  };

    // Function to render category dropdown options recursively
    const renderCategoryOptions = (categories) => {
        return categories.map((category) => (
            <React.Fragment key={category._id}>
                <option value={category._id}>{category.name}</option>
                {category.subcategories && renderCategoryOptions(category.subcategories)}
            </React.Fragment>
        ));
    };

    // Handle banner image addition
    const handleAddImage = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('bannerName', bannerName);
        formData.append('bannerImage', bannerImageFile);
        formData.append('category', selectedCategory);
        formData.append('tab', selectedTab); // Adding the tab if selected
        formData.append('mediaType', mediaType);

        try {
            await axios.post(`${API_BASE_URL}/banner-upload`, formData, {
                headers: { 'Content-Type': 'application/json' },
            });
            fetchImages();
            setShowAddModal(false);
            setBannerName('');
            setBannerImageFile(null);
            setSelectedCategory('');
            setMediaType('');
        } catch (error) {
            console.error('Error adding banner image/video:', error);
        }
    };

    // Handle banner image editing
    const handleEditImage = async () => {
        if (!selectedImage?._id) {
            console.error('No banner image selected for editing');
            return;
        }

        const formData = new FormData();
        formData.append('bannerName', bannerName);
        if (bannerImageFile) {
            formData.append('bannerImage', bannerImageFile);
        }

        try {
            await axios.put(`${API_BASE_URL}/edit-banner/${selectedImage._id}`, formData, {
                headers: { 'Content-Type': 'application/json' },
            });
            fetchImages();
            setShowEditModal(false);
            setBannerName('');
            setBannerImageFile(null);
            setCurrentImageUrl('');
            setSelectedImage(null);
        } catch (error) {
            console.error('Error editing banner image:', error);
        }
    };

    // Handle banner image deletion
    const handleDeleteImage = async () => {
        if (!selectedImage?._id) {
            console.error('No banner image selected for deletion');
            return;
        }

        try {
            await axios.delete(`${API_BASE_URL}/delete-banner/${selectedImage._id}`);
            fetchImages();
            setShowDeleteModal(false);
            setSelectedImage(null);
        } catch (error) {
            console.error('Error deleting banner image:', error);
        }
    };

    const openAddModal = () => {
        setBannerName('');
        setBannerImageFile(null);
        setShowAddModal(true);
    };

    const openEditModal = (image) => {
        setSelectedImage(image);
        setBannerName(image.bannerName);
        if (image.mediaType === 'image') {
            setCurrentImageUrl(image.bannerImage);
        } else if (image.mediaType === 'video') {
            setCurrentVideoUrl(image.bannerVideo);
        }
        setShowEditModal(true);
    };

    // column configuration for the data table

    const columns = [

        {
            name: 'Sr. No.',
            selector: (row, index) => index + 1,
            sortable: true,
        },
        {
            name: 'Banner Name',
            selector: (row) => row.bannerName,
            sortable: true,
        },
        {
            name: 'Banner Media',
            cell: (row) => (
                row.mediaType === 'image' ? (
                    <img
                        src={row.bannerImage}
                        alt={row.bannerName}
                        style={{ width: '55px', height: '55px',  }}
                    />
                ) : (
                    <video
                        src={row.bannerVideo}
                        alt={row.bannerName}
                        style={{ width: '55px', height: '55px',  }}
                    />
                )
            ),
        },
        {
            name: 'Action',
            cell: (row) => (
                <>
                    <button className="btn btn-warning btn-sm m-2" onClick={() => {openEditModal(row);
                         setMediaType(row.mediaType);
                    }}>
                        <i className="fas fa-edit"></i> Edit
                    </button>
                    <button className="btn btn-danger btn-sm" onClick={() => {
                        setSelectedImage(row);
                        setShowDeleteModal(true);
                    }}>
                        <i className="fas fa-trash"></i> Delete
                    </button>
                </>
            ),
        },
    ];

    return (
        <>
            <Header />
            <Sidebar />
            <main id="main" className="main">
                <Pagetitle page='Banner Section' />

                <section className="section">
                    <div className="d-flex justify-content-end mb-3">
                        <button className='btn btn-primary' onClick={openAddModal}>Add Banner</button>
                    </div>
                    {/* Integrating the Data Table */}
                    <DataTable
                        className='data-table'
                        columns={columns}
                        data={images}
                        pagination
                        persistTableHead
                        highlightOnHover
                        striped
                        responsive
                        customStyles={{
                            headCells: {
                                style: {
                                    backgroundColor: '#343a40', // Dark background
                                    color: '#fff', // White text
                                    fontSize: '18px', // Font size
                                    padding: '5px', // Padding
                                },
                            },

                            rows: {
                                style: {
                                    backgroundColor: '#fff', // Light background for rows
                                    color: '#343a40',
                                    fontSize: '17px'
                                },
                            },
                            pagination: {
                                style: {
                                    border: '1px solid #413f3f', // Border for pagination
                                    backgroundColor: 'white',
                                    color: '#343a40', // Background color for pagination
                                    fontSize: '16px'
                                },
                            },
                        }}
                    />
                </section>

                {/* Add Image/Video Modal */}
                <div className={`modal fade ${showAddModal ? 'show' : ''}`} tabIndex="-1" style={{ display: showAddModal ? 'block' : 'none' }}>
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content">
                            <div className="modal-header bg-info">
                                <h5 className="modal-title">Add Banner Image/Video</h5>
                                <button type="button" className="btn-close" onClick={() => setShowAddModal(false)}></button>
                            </div>
                            <div className="modal-body">
                                <form onSubmit={handleAddImage}>
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
                                        <label htmlFor="bannerName" className="form-label">Banner Name</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            id="bannerName"
                                            value={bannerName}
                                            onChange={(e) => setBannerName(e.target.value)}
                                            placeholder="Enter image/video name"
                                            required
                                        />
                                    </div>

                                    <div className="mb-3">
                                        <label htmlFor="bannerImageFile" className="form-label">Banner Image/Video File</label>
                                        {/* <input
                                            type="file"
                                            className="form-control"
                                            id="bannerImageFile"
                                            onChange={(e) => setBannerImageFile(e.target.files[0])}
                                            required
                                        /> */}
                                        <IKUpload
                                            className='form-control'
                                            fileName={bannerName}
                                            folder='/media'
                                            onError={(err) => console.error("Error uploading image", err)}
                                            onSuccess={(res) => {
                                                console.log("Upload successful, image URL:", res.url);
                                                setBannerImageFile(res.url);
                                                setUploading(false);
                                            }}
                                            required
                                            onUploadStart={() => setUploading(true)}
                                        />
                                    </div>

                                    <div className="mb-3">
                                        <label className="form-label">Media Type</label>
                                        <select
                                            id="mediaType"
                                            className="form-control"
                                            value={mediaType}
                                            onChange={(e) => setMediaType(e.target.value)}
                                        >
                                            <option value="">Select media type</option>
                                            <option value="image">Image</option>
                                            <option value="video">Video</option>
                                        </select>
                                    </div>

                                    <hr />
                                    <div>
                                        <button type="submit" className="btn btn-primary w-100" disabled={uploading}>Submit</button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Edit Image Modal */}
                <div className={`modal fade ${showEditModal ? 'show' : ''}`} tabIndex="-1" style={{ display: showEditModal ? 'block' : 'none' }}>
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content">
                            <div className="modal-header bg-info">
                                <h5 className="modal-title">Edit Banner Image</h5>
                                <button type="button" className="btn-close" onClick={() => setShowEditModal(false)}></button>
                            </div>
                            <div className="modal-body">
                                <form onSubmit={(e) => {
                                    e.preventDefault();
                                    handleEditImage();
                                }}>
                                    <div className="mb-3">
                                        <label htmlFor="editBannerName" className="form-label">Banner Image Name</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            id="editBannerName"
                                            value={bannerName}
                                            onChange={(e) => setBannerName(e.target.value)}
                                            placeholder="Enter image name"
                                            required
                                        />
                                    </div>

                                    <div className="mb-3">
                                       
                                        <label className="form-label">Current Media:</label>
                                        
                                        {mediaType === 'image' && currentImageUrl ? (
                                            <img
                                                src={currentImageUrl}
                                                alt="Current"
                                                style={{ maxWidth: '65px', height: '65px' }}
                                            />
                                        ) :  (
                                            <video
                                                src={currentVideoUrl}
                                                style={{ maxWidth: '65px', height: '65px' }}
                                                controls
                                            />
                                        ) }
                                    </div>
                                    <div className="mb-3">
                                        <label htmlFor="editBannerImageFile" className="form-label">Banner Image File (optional)</label>
                                        {/* <input
                                            type="file"
                                            className="form-control"
                                            id="editBannerImageFile"
                                            onChange={(e) => setBannerImageFile(e.target.files[0])}
                                        /> */}
                                        <IKUpload
                                            className='form-control'
                                            fileName={bannerName}
                                            folder='/media'
                                            onError={(err) => console.error("Error uploading image", err)}
                                            onSuccess={(res) => {
                                                console.log("Upload successful, image URL:", res.url);
                                                setBannerImageFile(res.url);
                                            }}
                                            required
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label">Media Type</label>
                                        <select
                                            id="mediaType"
                                            className="form-control"
                                            value={mediaType}
                                            onChange={(e) => setMediaType(e.target.value)}
                                        >
                                            <option value="">Select media type</option>
                                            <option value="image">Image</option>
                                            <option value="video">Video</option>
                                        </select>
                                    </div>
                                    <hr />
                                    <div>
                                        <button type="submit" className="btn btn-primary w-100">Save Changes</button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Delete Image Modal */}
                <div className={`modal fade ${showDeleteModal ? 'show' : ''}`} tabIndex="-1" style={{ display: showDeleteModal ? 'block' : 'none' }}>
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content">
                            <div className="modal-header bg-danger">
                                <h5 className="modal-title">Confirm Deletion</h5>
                                <button type="button" className="btn-close" onClick={() => setShowDeleteModal(false)}></button>
                            </div>
                            <div className="modal-body">
                                <p>Are you sure you want to delete this banner image?</p>
                                <div className='d-flex justify-content-between'>
                                    <button
                                        className="btn btn-secondary"
                                        onClick={() => setShowDeleteModal(false)}
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        className="btn btn-danger"
                                        onClick={handleDeleteImage}
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </>
    );
}

export default Banner;