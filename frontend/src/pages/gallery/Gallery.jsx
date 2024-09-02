import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Header from '../../components/Header/Header';
import Sidebar from '../../components/sidebar/Sidebar';
import Pagetitle from '../../components/pagetitle/Pagetitle';
import DataTable from 'react-data-table-component';
import API_BASE_URL from '../../config/Config';

function Gallery() {
    const [showAddModal, setShowAddModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);

    const [categories, setCategories] = useState([]); // State for categories
    const [selectedCategory, setSelectedCategory] = useState(''); // State for selected category
    const [mediaType, setMediaType] = useState('');
    const [currentVideoUrl, setCurrentVideoUrl] = useState('');

    const [images, setImages] = useState([]);

    const [imageName, setImageName] = useState('');
    const [selectedImage, setSelectedImage] = useState(null);
    const [imageFile, setImageFile] = useState(null);

    const [currentImageUrl, setCurrentImageUrl] = useState('');

    // Fetch images from backend
    const fetchImages = async () => {
        try {
            const response = await axios.get(`${API_BASE_URL}/gallery-images`);
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
            console.log('Fetched categories:', response.data.data);
            setCategories(response.data.data);
        } catch (error) {
            console.error('Error fetching categories:', error);
            setCategories([]);
        }
    };

    useEffect(() => {
        fetchImages();
        fetchCategories()
    }, []);

    const renderCategoryOptions = (categories) => {
        return categories.map((category) => (
            <React.Fragment key={category._id}>
                <option value={category._id}>{category.name}</option>
                {category.subcategories && renderCategoryOptions(category.subcategories)}
            </React.Fragment>
        ));
    };

    // Handle image addition
    const handleAddImage = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('galleryName', imageName);
        formData.append('galleryImage', imageFile);
        formData.append('category', selectedCategory);
        formData.append('mediaType', mediaType);

        try {
            const response = await axios.post(`${API_BASE_URL}/gallery-upload`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });

            if (response.status === 201) {
                // Re-fetch images after successful upload
                fetchImages();
                setShowAddModal(false);
                setImageName('');
                setImageFile(null);
                setSelectedCategory('');
                setMediaType('');
            } else {
                console.error('Error adding image, status not 200:', response.status);
            }
        } catch (error) {
            console.error('Error adding image:', error);
        }
    };

    // Handle gallery editing
    const handleEditImage = async () => {
        if (!selectedImage?._id) {
            console.error('No image selected for editing');
            return;
        }

        const formData = new FormData();
        formData.append('galleryName', imageName);
        if (imageFile) {
            formData.append('galleryImage', imageFile); // Only append if a new file is selected
        }
        formData.append('mediaType', mediaType);

        try {
            const response = await axios.put(`${API_BASE_URL}/edit-gallery/${selectedImage._id}`, formData)// This header should be removed

            if (response.status === 200) {
                fetchImages();
                setShowEditModal(false);
                setImageName('');
                setImageFile(null);
                setCurrentImageUrl('');
                setSelectedImage(null);  // Clear the selected image
            } else {
                console.error('Error editing image, status not 200:', response.status);
            }
        } catch (error) {
            console.error('Error editing image:', error);
        }
    };
    // Handle image deletion
    const handleDeleteImage = async () => {
        if (!selectedImage?._id) {
            console.error('No image selected for deletion');
            return;
        }

        try {
            await axios.delete(`${API_BASE_URL}/delete-image/${selectedImage._id}`);
            fetchImages();
            setShowDeleteModal(false);
            setSelectedImage(null);
        } catch (error) {
            console.error('Error deleting image:', error);
        }
    };

    const openEditModal = (image) => {
        setSelectedImage(image);
        setImageName(image.galleryName);
        if (image.mediaType === 'image') {
            setCurrentImageUrl(image.galleryImage);
        } else if (image.mediaType === 'video') {
            setCurrentVideoUrl(image.galleryVideo);
        }
        setShowEditModal(true);
    };

    // Columns configuration for the data table
    const columns = [
        {
            name: 'Sr No',
            selector: (row, index) => index + 1,
            sortable: true,
        },
        {
            name: 'Gallery Name',
            selector: (row) => row.galleryName,
            sortable: true,
        },
        {
            name: 'Gallery Media',
            cell: (row) => (
                row.mediaType === 'image' ? (
                    <img
                        src={row.galleryImage}
                        alt={row.galleryName}
                        style={{ width: '75px', height: '75px', borderRadius: '35px' }}
                    />
                ) : (
                    <video
                        src={row.galleryVideo}
                        alt={row.galleryName}
                        style={{ width: '90px', height: '85px', borderRadius: '35px' }}
                    />
                )
            ),
        },
        {
            name: 'Action',
            cell: (row) => (
                <>
                    <button
                        className="btn btn-warning btn-sm m-2"
                        onClick={() => {
                            openEditModal(row);

                            setMediaType(row.mediaType); // Set media type
                            setShowEditModal(true);
                        }}
                    >
                        <i className="fas fa-edit"></i> Edit
                    </button>
                    <button
                        className="btn btn-danger btn-sm"
                        onClick={() => {
                            setSelectedImage(row);
                            setShowDeleteModal(true);
                        }}
                    >
                        <i className="fas fa-trash"></i> Delete
                    </button>
                </>
            ),
        }
    ];

    return (
        <>
            <Header />
            <Sidebar />
            <main id="main" className="main">
                <Pagetitle page="Gallery Section" />

                <section className="section">
                    <div className="d-flex justify-content-end mb-3">
                        <button className="btn btn-primary" onClick={() => setShowAddModal(true)}>
                            Add Gallery Items
                        </button>
                    </div>

                    <DataTable
                        className='data-table'
                        columns={columns}
                        data={images}
                        pagination
                        persistTableHead
                        highlightOnHover
                        striped
                        responsive
                        pointerOnHover
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

                {/* Add Image Modal */}
                <div className={`modal fade ${showAddModal ? 'show' : ''}`} tabIndex="-1" style={{ display: showAddModal ? 'block' : 'none' }}>
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content">
                            <div className="modal-header bg-info">
                                <h5 className="modal-title">Add Gallery Image / Video </h5>
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
                                            onChange={(e) => setSelectedCategory(e.target.value)}
                                        >
                                            <option value="">Select a category</option>
                                            {renderCategoryOptions(categories)}
                                        </select>
                                    </div>
                                    <div className="mb-3">
                                        <label htmlFor="galleryName" className="form-label">gallery Name</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            id="imageName"
                                            value={imageName}
                                            onChange={(e) => setImageName(e.target.value)}
                                            placeholder="Enter image name"
                                            required
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <label htmlFor="imageFile" className="form-label">Gallery Image / video File</label>
                                        <input
                                            type="file"
                                            className="form-control"
                                            id="imageFile"
                                            onChange={(e) => setImageFile(e.target.files[0])}
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
                                        <button type="submit" className="btn btn-primary w-100">Submit</button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Edit Image Modal */}
                <div
                    className={`modal fade ${showEditModal ? 'show' : ''}`}
                    tabIndex="-1"
                    style={{ display: showEditModal ? 'block' : 'none' }}>
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content">
                            <div className="modal-header bg-info">
                                <h5 className="modal-title">Edit Gallery Items</h5>
                                <button type="button" className="btn-close" onClick={() => setShowEditModal(false)}></button>
                            </div>
                            <div className="modal-body">
                                <form onSubmit={(e) => {
                                    e.preventDefault();
                                    handleEditImage();
                                }}>
                                    <div className="mb-3">
                                        <label htmlFor="editgalleryName" className="form-label">Gallery Name</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            id="editgalleryName"
                                            value={imageName}
                                            onChange={(e) => setImageName(e.target.value)}
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
                                                style={{ maxWidth: '80px', height: '80px' }}
                                            />
                                        ) : mediaType === 'video' && currentVideoUrl ? (
                                            <video
                                                src={currentVideoUrl}
                                                style={{ maxWidth: '80px', height: '80px' }}
                                                controls
                                            />
                                        ) : (
                                            <p>No media available</p>
                                        )}
                                    </div>
                                    <div className="mb-3">
                                        <label htmlFor="editImageFile" className="form-label">Image/Video File (optional)</label>
                                        <input
                                            type="file"
                                            className="form-control"
                                            id="editImageFile"
                                            onChange={(e) => setImageFile(e.target.files[0])}
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
                                <p>Are you sure you want to delete this image?</p>
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

export default Gallery;
