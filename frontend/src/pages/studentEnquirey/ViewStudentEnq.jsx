import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import API_BASE_URL from '../../config/Config';
import Header from '../../components/Header/Header';
import Sidebar from '../../components/sidebar/Sidebar';
import Pagetitle from '../../components/pagetitle/Pagetitle';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import { Row, Col } from 'react-bootstrap';

function ViewStudentEnquirey() {
    const { id } = useParams();  // Get the ID from the URL
    const [application, setApplication] = useState(null);

    useEffect(() => {
        const fetchApplication = async () => {
            try {
                const response = await fetch(`${API_BASE_URL}/getStudent-enquirey/${id}`);
                if (response.ok) {
                    const data = await response.json();
                    setApplication(data.data);
                } else {
                    console.error('Error fetching application');
                }
            } catch (error) {
                console.error('Error:', error);
            }
        };

        fetchApplication();
    }, [id]);

    if (!application) return <div>Loading...</div>;


  return (
    <>
        <Header />
            <Sidebar />
            <main id="main" className="main">
                <Pagetitle page='Student enquirey details' />
                <section className='section'>
                    <Card style={{ padding: '20px' }}>
                        <Card.Body>
                            <h3>Student Enquirey Details</h3>
                                <hr />
                            {/* Grid layout for fields (4 columns per row) */}
                            <Row>
                                <Col md={3}><strong> Name:</strong> {application.name || 'N/A'}</Col>
                                <Col md={3}><strong>MObile Number:</strong> {application.mobile || 'N/A'}</Col>
                                <Col md={3}><strong>Email:</strong> {application.email || 'N/A'}</Col>
                                <Col md={3}><strong>City:</strong> {application.city || 'N/A'}</Col>
                                <Col md={3}><strong>Course:</strong> {application.course || 'N/A'}</Col>
                            </Row>
                        </Card.Body>
                    </Card>
                </section>
            </main>
    </>
  )
}

export default ViewStudentEnquirey