import axios from 'axios';
import React, { useEffect, useState } from 'react';
import API_BASE_URL from '../../config/Config';
import Header from '../../components/Header/Header';
import Sidebar from '../../components/sidebar/Sidebar';
import Pagetitle from '../../components/pagetitle/Pagetitle';
import DataTable from 'react-data-table-component';

function Tabs() {
    const [showAddModal, setShowAddModal] = useState(false);
    const [tabName, setTabName] = useState('');
    const [tabs, setTabs] = useState([]);
    const [categories, setCategories] = useState([]); // State for categories
    const [selectedCategory, setSelectedCategory] = useState(''); // State for selected category

    // Fetch tabs from backend
    const fetchTabs = async () => {
        try {
            const response = await axios.get(`${API_BASE_URL}/get-tabs`);
            setTabs(Array.isArray(response.data.data) ? response.data.data : []);
        } catch (error) {
            console.error('Error fetching tabs:', error);
            setTabs([]);
        }
    };

    // Fetch categories from backend
    const fetchCategories = async () => {
        try {
            const response = await axios.get(`${API_BASE_URL}/get-categories`);
            setCategories(response.data.data);
        } catch (error) {
            console.error('Error fetching categories:', error);
            setCategories([]);
        }
    };

    // Handle tab deletion
    const handleDelete = async (id) => {
        try {
            await axios.delete(`${API_BASE_URL}/delete-tab/${id}`);
            fetchTabs(); // Refresh the tabs after deletion
        } catch (error) {
            console.error('Error deleting tab:', error);
        }
    };

    // Handle tab data submission
    const handleTabData = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('name', tabName);
        formData.append('category', selectedCategory);

        try {
            await axios.post(`${API_BASE_URL}/create-tabs`, formData, {
                headers: { 'Content-Type': 'application/json' },
            });
            fetchTabs();
            setShowAddModal(false);
            setTabName('');
            setSelectedCategory('');
        } catch (error) {
            console.error('Error adding tabs', error);
        }
    };

    useEffect(() => {
        fetchTabs();
        fetchCategories();
    }, []);

    // Function to render category dropdown options recursively
    const renderCategoryOptions = (categories) => {
        return categories.map((category) => (
            <React.Fragment key={category._id}>
                <option value={category._id}>{category.name}</option>
                {category.subcategories && renderCategoryOptions(category.subcategories)}
            </React.Fragment>
        ));
    };

    const columns = [
        {
            name: 'Sr. No.',
            selector: (row, index) => index + 1,
            sortable: true,
        },
        {
            name: 'Tabs Name',
            selector: (row) => row.name,
            sortable: true,
        },
        {
            name: 'Tabs Category',
            selector: (row) => row.category ? row.category.name : 'N/A',
            sortable: true,
        },
        {
            name: 'Action',
            cell: (row) => (
                <button className="btn btn-danger btn-sm" onClick={() => handleDelete(row._id)}>
                    <i className="fas fa-trash"></i> Delete
                </button>
            ),
        },
    ];

    const openAddModal = () => {
        setTabName('');
        setShowAddModal(true);
    };

    return (
        <>
            <Header />
            <Sidebar />
            <main id="main" className="main">
                <Pagetitle page='Tabs Section' />

                <section className="section">
                    <div className="d-flex justify-content-end mb-3">
                        <button className='btn btn-primary' onClick={openAddModal}>Add Tabs</button>
                    </div>
                    {/* Integrating the Data Table */}
                    <DataTable
                        className='data-table'
                        columns={columns}
                        data={tabs}
                        pagination
                        persistTableHead
                        highlightOnHover
                        striped
                        responsive
                        paginationPerPage={50} // Default rows per page
                        paginationRowsPerPageOptions={[10, 20, 50, 100]} // Custom pagination options
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

                {/* Add Tab Modal */}
                <div className={`modal fade ${showAddModal ? 'show' : ''}`} tabIndex="-1" style={{ display: showAddModal ? 'block' : 'none' }}>
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content">
                            <div className="modal-header bg-info">
                                <h5 className="modal-title">Add Tabs Data</h5>
                                <button type="button" className="btn-close" onClick={() => setShowAddModal(false)}></button>
                            </div>
                            <div className="modal-body">
                                <form onSubmit={handleTabData}>
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
                                        <label htmlFor="Name" className="form-label"> Name</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            id="bannerName"
                                            value={tabName}
                                            onChange={(e) => setTabName(e.target.value)}
                                            placeholder="Enter tab name"
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
            </main>    
        </>
    );
}

export default Tabs;
