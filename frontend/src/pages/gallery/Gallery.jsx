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

    useEffect(() => {
        fetchImages();
    }, []);

    // Handle image addition
    const handleAddImage = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('imageName', imageName);
        formData.append('image', imageFile);
    
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
            } else {
                console.error('Error adding image, status not 200:', response.status);
            }
        } catch (error) {
            console.error('Error adding image:', error);
        }
    };

    // Handle image editing
    const handleEditImage = async () => {
        if (!selectedImage?._id) {
            console.error('No image selected for editing');
            return;
        }

        const formData = new FormData();
        formData.append('imageName', imageName);
        if (imageFile) {
            formData.append('image', imageFile);
        }

        try {
            await axios.put(`${API_BASE_URL}/edit-image/${selectedImage._id}`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            fetchImages();
            setShowEditModal(false);
            setImageName('');
            setImageFile(null);
            setCurrentImageUrl('');
            setSelectedImage(null);  // Clear the selected image
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

    // Columns configuration for the data table
    const columns = [
        {
            name: 'Sr No',
            selector: (row, index) => index + 1,
            sortable: true,
        },
        {
            name: 'Image Name',
            selector: (row) => row.imageName,
            sortable: true,
        },
        {
            name: 'Image',
            cell: (row) => (
                <img
                    src={row.image}
                    alt={row.imageName}
                    style={{ width: '75px', height: '75px', borderRadius: '35px' }}
                />
            ),
        },
        {
            name: 'Action',
            cell: (row) => (
                <>
                    <button
                        className="btn btn-warning btn-sm m-2"
                        onClick={() => {
                            setSelectedImage(row);
                            setImageName(row.imageName);
                            setCurrentImageUrl(row.image);
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
        },
    ];

    return (
        <>
            <Header />
            <Sidebar />
            <main id="main" className="main">
                <Pagetitle page="Gallery" />

                <section className="section">
                    <div className="d-flex justify-content-end mb-3">
                        <button className="btn btn-primary" onClick={() => setShowAddModal(true)}>
                            Add Image
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
                                    color:'#343a40',
                                    fontSize:'17px'
                                },
                            },
                            pagination: {
                                style: {
                                    border: '1px solid #413f3f', // Border for pagination
                                    backgroundColor: 'white',
                                    color:'#343a40', // Background color for pagination
                                    fontSize:'16px'
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
                                <h5 className="modal-title">Add Image</h5>
                                <button type="button" className="btn-close" onClick={() => setShowAddModal(false)}></button>
                            </div>
                            <div className="modal-body">
                                <form onSubmit={handleAddImage}>
                                    <div className="mb-3">
                                        <label htmlFor="imageName" className="form-label">Image Name</label>
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
                                        <label htmlFor="imageFile" className="form-label">Image File</label>
                                        <input
                                            type="file"
                                            className="form-control"
                                            id="imageFile"
                                            onChange={(e) => setImageFile(e.target.files[0])}
                                            required
                                        />
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
                <div className={`modal fade ${showEditModal ? 'show' : ''}`} tabIndex="-1" style={{ display: showEditModal ? 'block' : 'none' }}>
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content">
                            <div className="modal-header bg-info">
                                <h5 className="modal-title">Edit Image</h5>
                                <button type="button" className="btn-close" onClick={() => setShowEditModal(false)}></button>
                            </div>
                            <div className="modal-body">
                                <form onSubmit={(e) => {
                                    e.preventDefault();
                                    handleEditImage();
                                }}>
                                    <div className="mb-3">
                                        <label htmlFor="editImageName" className="form-label">Image Name</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            id="editImageName"
                                            value={imageName}
                                            onChange={(e) => setImageName(e.target.value)}
                                            placeholder="Enter image name"
                                            required
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label"> Current Image: </label>
                                        {currentImageUrl && (
                                            <img
                                                src={currentImageUrl}
                                                alt="Current"
                                                style={{ maxWidth: '80px', height: '80px' }}
                                            />
                                        )}
                                    </div>
                                    <div className="mb-3">
                                        <label htmlFor="editImageFile" className="form-label">Image File (optional)</label>
                                        <input
                                            type="file"
                                            className="form-control"
                                            id="editImageFile"
                                            onChange={(e) => setImageFile(e.target.files[0])}
                                        />
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
