import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Modal, Button, Form } from 'react-bootstrap';
import API_BASE_URL from '../../config/Config';
import API_BASE_IMAGE_URL from '../../config/ImageConfig';

function EditContactUsAddress() {
    const { id } = useParams(); // Get the ID from the URL
    const navigate = useNavigate();

    const [addressData, setAddressData] = useState({
        title: '',
        virtualTourLink: '',
        address: '',
        phone_no: '',
        mob_no: '',
        email: '',
        fax: '',
        icon: null,
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAddressData = async () => {
            try {
                const response = await fetch(`${API_BASE_URL}/contact-us-address/${id}`);
                if (response.ok) {
                    const data = await response.json();
                    setAddressData(data.data);
                } else {
                    console.error('Error fetching address data');
                }
            } catch (error) {
                console.error('Error:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchAddressData();
    }, [id]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setAddressData({ ...addressData, [name]: value });
    };

    const handleFileChange = (e) => {
        setAddressData({ ...addressData, icon: e.target.files[0] });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const url = `${API_BASE_URL}/edit-contact-us-address/${id}`;
        const formDataObj = new FormData();

        Object.keys(addressData).forEach(key => {
            formDataObj.append(key, addressData[key]);
        });

        try {
            const response = await fetch(url, {
                method: 'PUT',
                body: formDataObj,
            });

            if (response.ok) {
                navigate('/contactUSAddressForm'); // Redirect after successful update
            } else {
                console.error('Error updating the address');
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    if (loading) return <h1>Loading...</h1>; // Loading state

    return (
        <div>
            <h2>Edit Contact Us Address</h2>
            <Form onSubmit={handleSubmit}>
                <Form.Group controlId="formTitle">
                    <Form.Label>Title</Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="Enter title"
                        name="title"
                        value={addressData.title}
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
                        value={addressData.virtualTourLink}
                        onChange={handleInputChange}
                    />
                </Form.Group>
                <Form.Group controlId="formAddress">
                    <Form.Label>Address</Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="Enter address"
                        name="address"
                        value={addressData.address}
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
                        value={addressData.phone_no}
                        onChange={handleInputChange}
                    />
                </Form.Group>
                <Form.Group controlId="formMobNo">
                    <Form.Label>Mobile Number</Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="Enter mobile number"
                        name="mob_no"
                        value={addressData.mob_no}
                        onChange={handleInputChange}
                    />
                </Form.Group>
                <Form.Group controlId="formFax">
                    <Form.Label>Fax</Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="Enter fax number"
                        name="fax"
                        value={addressData.fax}
                        onChange={handleInputChange}
                    />
                </Form.Group>
                <Form.Group controlId="email">
                    <Form.Label>Email</Form.Label>
                    <Form.Control
                        type="email"
                        placeholder="Enter your email"
                        name="email"
                        value={addressData.email}
                        onChange={handleInputChange}
                    />
                </Form.Group>
                <Form.Group controlId="formIcon">
                    <Form.Label>Icon</Form.Label>
                    <Form.Control
                        type="file"
                        name="icon"
                        onChange={handleFileChange}
                    />
                    {addressData.icon && (
                        <img
                            src={`${API_BASE_IMAGE_URL}/${addressData.icon}`}
                            alt="Current Icon"
                            width="50"
                        />
                    )}
                </Form.Group>
                <Button variant="primary" type="submit">
                    Submit
                </Button>
            </Form>
        </div>
    );
}

export default EditContactUsAddress;
