import React, { useEffect, useState } from 'react';
import DataTable from 'react-data-table-component';
import Header from '../../components/Header/Header';
import Sidebar from '../../components/sidebar/Sidebar';
import Pagetitle from '../../components/pagetitle/Pagetitle';
import DeleteModal from '../blog/DeleteModal';
import { useNavigate } from 'react-router-dom';
import { Modal, Button, Form } from 'react-bootstrap';
import API_BASE_URL from '../../config/Config';
import API_BASE_IMAGE_URL from '../../config/ImageConfig';

function ContactUsAddress() {
    
    const [formData, setFormData] = useState([]);
    const [showCreateModal, setShowCreateModal] = useState(false); // Create modal state
    const [showDeleteModal, setShowDeleteModal] = useState(false); // Delete modal state
    const [selectedAddress, setSelectedAddress] = useState(null);
    const [newAddressData, setNewAddressData] = useState({
        title: '',
        virtualTourLink: '',
        address: '',
        phone_no: '',
        mob_no: '',
        fax: '',
        icon: null,
    });
    
    const navigate = useNavigate();

    useEffect(() => {
        const fetchContactUsAddresses = async () => {
            try {
                const response = await fetch(`${API_BASE_URL}/get-contact-us-address`);
                if (response.ok) {
                    const data = await response.json();
                    setFormData(data.data);
                } else {
                    console.error('Error fetching contact us addresses');
                }
            } catch (error) {
                console.error('Error:', error);
            }
        };

        fetchContactUsAddresses();
    }, []);

    const handleDelete = async (addressId) => {
        try {
            const response = await fetch(`${API_BASE_URL}/delete-contact-us-address/${addressId}`, {
                method: 'DELETE',
            });

            if (response.ok) {
                setFormData(formData.filter(address => address._id !== addressId));
                setShowDeleteModal(false); // Close delete modal
            } else {
                console.error('Error deleting address');
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    const handleCreateModalOpen = () => {
        setNewAddressData({
            title: '',
            virtualTourLink: '',
            address: '',
            phone_no: '',
            mob_no: '',
            fax: '',
            icon: null,
        });
        setShowCreateModal(true); // Open create modal
    };

    const handleCreateModalClose = () => {
        setShowCreateModal(false); // Close create modal
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewAddressData({ ...newAddressData, [name]: value });
    };

    const handleFileChange = (e) => {
        setNewAddressData({ ...newAddressData, icon: e.target.files[0] });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const url = `${API_BASE_URL}/contact-us-address`;
        const formDataObj = new FormData();
        
        Object.keys(newAddressData).forEach(key => {
            formDataObj.append(key, newAddressData[key]);
        });

        try {
            const response = await fetch(url, {
                method: 'POST',
                body: formDataObj,
            });

            if (response.ok) {
                const data = await response.json();
                setFormData([...formData, data.data]); // Update the list with the new address
                handleCreateModalClose();
            } else {
                console.error('Error submitting the form');
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    const columns = [
        {
            name: 'Sr. No.',
            selector: (row, index) => index + 1,
            width: '70px',
        },
        {
            name: 'Title',
            selector: row => row.title,
        },
        
        {
            name: 'Address',
            selector: row => row.address,
        },
        
        {
            name: 'Mobile Number',
            selector: row => row.mob_no,
        },
        {
            name: 'Email',
            selector: row => row.email,
        },
        {
            name: 'Icon',
            cell: row => {
                const imageUrl = row.icon ? `${API_BASE_IMAGE_URL}/${row.icon}` : null;
                return imageUrl ? <img src={imageUrl} alt="icon" width="50" /> : null;
            }
        },
        {
            name: 'Actions',
            cell: row => (
                <>
                    <Button
                        variant="info"
                        size="sm"
                        onClick={() => navigate(`/edit-contact-us-address/${row._id}`)}
                    >
                        <i className="bi bi-pencil"></i>
                    </Button>
                    <Button
                        variant="danger"
                        size="sm"
                        onClick={() => {
                            setSelectedAddress(row);
                            setShowDeleteModal(true); // Open delete modal
                        }}
                    >
                        <i className="bi bi-trash"></i>
                    </Button>
                </>
            ),
        },
    ];

    return (
        <>
            <Header />
            <Sidebar />
            <main id="main" className="main">
                <Pagetitle page='Contact Us Addresses' />
                
                <section className='section'>
                    <div className="d-flex justify-content-end mb-3">
                        <Button
                            variant="primary"
                            onClick={handleCreateModalOpen}
                        >
                            Create Address
                        </Button>
                    </div>
                
                    <DataTable
                        className='data-table'
                        columns={columns}
                        data={formData}
                        pagination
                        highlightOnHover
                        persistTableHead
                        responsive
                        striped
                        pointerOnHover
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
                                    fontSize: '15px',
                                },
                            },
                        }}
                    />
                    {selectedAddress && (
                        <DeleteModal
                            show={showDeleteModal} // Use delete modal state
                            onHide={() => setShowDeleteModal(false)}
                            onDelete={() => handleDelete(selectedAddress._id)}
                            itemName={selectedAddress.title}
                        />
                    )}
                </section>

                {/* Create Address Modal */}
                <Modal
                    show={showCreateModal} // Use create modal state
                    onHide={handleCreateModalClose}
                    backdrop="static"
                    keyboard={false}
                >
                    <Modal.Header closeButton>
                        <Modal.Title>Create Contact Us Address</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form onSubmit={handleSubmit}>
                            <Form.Group controlId="formTitle">
                                <Form.Label>Title</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="Enter title"
                                    name="title"
                                    value={newAddressData.title}
                                    onChange={handleInputChange}
                                    required
                                />
                            </Form.Group>
                            <Form.Group controlId="formVirtualTourLink">
                                <Form.Label>Virtual Tour Link</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="Enter virtual tour link"
                                    name="virtualTourLink"
                                    value={newAddressData.virtualTourLink}
                                    onChange={handleInputChange}
                                />
                            </Form.Group>
                            <Form.Group controlId="formAddress">
                                <Form.Label>Address</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="Enter address"
                                    name="address"
                                    value={newAddressData.address}
                                    onChange={handleInputChange}
                                    required
                                />
                            </Form.Group>
                            <Form.Group controlId="formPhoneNo">
                                <Form.Label>Phone Number</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="Enter phone number"
                                    name="phone_no"
                                    value={newAddressData.phone_no}
                                    onChange={handleInputChange}
                                />
                            </Form.Group>
                            <Form.Group controlId="formMobNo">
                                <Form.Label>Mobile Number</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="Enter mobile number"
                                    name="mob_no"
                                    value={newAddressData.mob_no}
                                    onChange={handleInputChange}
                                />
                            </Form.Group>
                            <Form.Group controlId="formFax">
                                <Form.Label>Fax</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="Enter fax"
                                    name="fax"
                                    value={newAddressData.fax}
                                    onChange={handleInputChange}
                                />
                            </Form.Group>
                            <Form.Group controlId="email">
                                <Form.Label>Email</Form.Label>
                                <Form.Control
                                    type="email"
                                    placeholder="Enter your email"
                                    name="email"
                                    value={newAddressData.email}
                                    onChange={handleInputChange}
                                />
                            </Form.Group>
                            <Form.Group controlId="formIcon">
                                <Form.Label>Icon</Form.Label>
                                <Form.Control
                                    type="file"
                                    onChange={handleFileChange}
                                />
                            </Form.Group>
                            <Button variant="primary" type="submit">
                                Submit
                            </Button>
                        </Form>
                    </Modal.Body>
                </Modal>
            </main>
        </>
    );
}

export default ContactUsAddress;
