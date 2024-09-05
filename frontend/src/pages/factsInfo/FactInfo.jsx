import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Header from '../../components/Header/Header';
import Sidebar from '../../components/sidebar/Sidebar';
import Pagetitle from '../../components/pagetitle/Pagetitle';
import DataTable from 'react-data-table-component';
import API_BASE_URL from '../../config/Config';

function FactInfo() {

    // create hooks
    const [showModal, setShowModal] = useState(false);
    const [factName, setFactName] = useState('');
    const [factNumber, setFactNumber] = useState('');
    const [categories, setCategories] = useState([]); // State for categories
    const [selectedCategory, setSelectedCategory] = useState(''); // State for selected category

    // edit hooks
    const [isEditMode, setIsEditMode] = useState(false);
    const [currentFactId, setCurrentFactId] = useState(null);

    // State for fetching data
    const [data, setData] = useState([]);

    // State for managing delete modal visibility and fact ID
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [factsIdToDelete, setFactsIdToDelete] = useState(null);

    useEffect(() => {
        fetchData();
        fetchCategories();  // Fetch categories when component mounts
    }, []);

    const fetchCategories = async () => {
        try {
            const response = await axios.get(`${API_BASE_URL}/get-categories`);
            setCategories(response.data.data);
        } catch (error) {
            console.error('Error fetching categories:', error);
            setCategories([]);
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

    const fetchData = async () => {
        try {
            const response = await axios.get(`${API_BASE_URL}/get-factsInfo`);
            setData(response.data.data);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    const handleEditClick = (fact) => {
        setFactName(fact.factName);
        setFactNumber(fact.factNumber);
        setSelectedCategory(fact.category); // Assuming fact object contains category
        setIsEditMode(true);
        setCurrentFactId(fact._id);
        setShowModal(true);
    };

    const handleSaveFact = async () => {
        try {
            if (isEditMode) {
                await axios.put(`${API_BASE_URL}/edit-factsInfo/${currentFactId}`, {
                    factName,
                    factNumber,
                    category: selectedCategory,
                });
            } else {
                await axios.post(`${API_BASE_URL}/create-factsInfo`, {
                    factName,
                    factNumber,
                    category: selectedCategory,
                });
            }
            setShowModal(false);
            fetchData();
        } catch (error) {
            console.error(error);
        }
    };

    const handleDeleteClick = (id) => {
        setFactsIdToDelete(id);
        setShowDeleteModal(true);
    };

    const handleDeleteConfirmation = async () => {
        try {
            await axios.delete(`${API_BASE_URL}/delete-factsInfo/${factsIdToDelete}`);
            fetchData();
            setShowDeleteModal(false);
        } catch (error) {
            console.error('Error while deleting data', error);
        }
    };

    const handleDeleteCancellation = () => {
        setShowDeleteModal(false);
    };

    const columns = [
        {
            name: 'Sr. No.',
            selector: (row, index) => index + 1,
            sortable: true,
        },
        {
            name: 'Facts Name',
            selector: (row) => row.factName,
            sortable: true,
        },
        {
            name: 'Facts Number',
            selector: (row) => row.factNumber,
            sortable: true,
        },
        {
            name: 'Action',
            cell: (row) => (
                <>
                    <button className="btn btn-warning btn-sm m-2" onClick={() => handleEditClick(row)}>
                        <i className="fas fa-edit"></i> Edit
                    </button>
                    <button className="btn btn-danger btn-sm" onClick={() => handleDeleteClick(row._id)}>
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
                <Pagetitle page='Facts Information Section' />

                <section className='section'>
                    <div className="d-flex justify-content-end mb-3">
                        <button className='btn btn-primary' onClick={() => setShowModal(true)} data-bs-target="#staticBackdrop">
                            Create Facts Info
                        </button>
                    </div>
                    <DataTable
                        className='data-table'
                        columns={columns}
                        data={data}
                        pagination
                        persistTableHead
                        highlightOnHover
                        striped
                        responsive
                        customStyles={{
                            headCells: {
                                style: {
                                    backgroundColor: '#343a40',
                                    color: '#fff',
                                    fontSize: '18px',
                                    padding: '5px',
                                },
                            },
                            rows: {
                                style: {
                                    backgroundColor: '#fff',
                                    color: '#343a40',
                                    fontSize: '17px',
                                },
                            },
                            pagination: {
                                style: {
                                    border: '1px solid #413f3f',
                                    backgroundColor: 'white',
                                    color: '#343a40',
                                    fontSize: '16px',
                                },
                            },
                        }}
                    />
                </section>

                <div id="staticBackdrop" className={`modal fade ${showModal ? 'show' : ''}`} tabIndex="-1" style={{ display: showModal ? 'block' : 'none' }}>
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content">
                            <div className="modal-header bg-info">
                                <h5 className="modal-title">{isEditMode ? 'Edit Fact' : 'Create Fact'}</h5>
                                <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
                            </div>
                            <div className="modal-body">
                                <form>
                                    <div className="mb-3">
                                        <label htmlFor="category" className="form-label">Category</label>
                                        <select
                                            className="form-control"
                                            id="category"
                                            value={selectedCategory}
                                            onChange={(e) => setSelectedCategory(e.target.value)}
                                            required
                                        >
                                            <option value="">Select a category</option>
                                            {renderCategoryOptions(categories)}
                                        </select>
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label">Fact Name</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            value={factName}
                                            onChange={(e) => setFactName(e.target.value)}
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label">Fact Number</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            value={factNumber}
                                            onChange={(e) => setFactNumber(e.target.value)}
                                        />
                                    </div>
                                </form>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-primary" onClick={handleSaveFact}>
                                    {isEditMode ? 'Save Changes' : 'Create Fact'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
                {showModal && <div className="modal-backdrop fade show"></div>}

                <div className={`modal fade ${showDeleteModal ? 'show' : ''}`} tabIndex="-1" style={{ display: showDeleteModal ? 'block' : 'none' }}>
                    <div className="modal-dialog modal-dialog-centered" role="document">
                        <div className="modal-content">
                            <div className="modal-header bg-danger">
                                <h5 className="modal-title">Confirm Delete</h5>
                                <button type="button" className="btn-close" onClick={handleDeleteCancellation} aria-label="close">
                                    <span aria-hidden="true"> &times;</span>
                                </button>
                            </div>
                            <div className="modal-body">
                                Are you sure you want to delete this Info?
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" onClick={handleDeleteCancellation}>Cancel</button>
                                <button type="button" className="btn btn-danger" onClick={handleDeleteConfirmation}>Delete</button>
                            </div>
                        </div>
                    </div>
                </div>
                {showDeleteModal && <div className="modal-backdrop fade show"></div>}
            </main>
        </>
    );
}

export default FactInfo;