import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import API_BASE_URL from '../../config/Config';
import Header from '../../components/Header/Header';
import Sidebar from '../../components/sidebar/Sidebar';
import Pagetitle from '../../components/pagetitle/Pagetitle';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import { Row, Col, Table } from 'react-bootstrap';

function ViewFeedback() {
    const { id } = useParams();  // Get the ID from the URL
    const [feedback, setFeedback] = useState(null);

    useEffect(() => {
        const fetchFeedback = async () => {
            try {
                const response = await fetch(`${API_BASE_URL}/getFeedbackById/${id}`);
                if (response.ok) {
                    const data = await response.json();
                    setFeedback(data.data);
                } else {
                    console.error('Error fetching feedback');
                }
            } catch (error) {
                console.error('Error:', error);
            }
        };

        fetchFeedback();
    }, [id]);

    if (!feedback) return <div>Loading...</div>;

    return (
        <>
            <Header />
            <Sidebar />
            <main id="main" className="main">
                <Pagetitle page='Feedback Details' />
                <section className='section'>
                    <Card style={{ padding: '20px' }}>
                        <Card.Body>
                            <h3>Feedback from {feedback.userName}</h3>
                            <hr />
                            <Row>
                                <Col md={3}><strong>Email:</strong> {feedback.email || 'N/A'}</Col>
                                <Col md={3}><strong>Department:</strong> {feedback.department || 'N/A'}</Col>
                                <Col md={3}><strong>Form Type:</strong> {feedback.formType || 'N/A'}</Col>
                                <Col md={3}>
                                    <strong>Date:</strong> 
                                    {feedback.createdAt ? new Intl.DateTimeFormat('en-GB').format(new Date(feedback.createdAt)) : 'N/A'}
                                </Col>
                            </Row>
                            <br />
                            <h4>Ratings</h4>
                            <Table striped bordered hover>
                                <thead>
                                    <tr>
                                        <th>Parameter</th>
                                        <th>Rating</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {feedback.ratings.length > 0 ? (
                                        feedback.ratings.map((ratingItem, index) => (
                                            <tr key={index}>
                                                <td>{ratingItem.parameter}</td>
                                                <td>{ratingItem.rating}</td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="2">No ratings available</td>
                                        </tr>
                                    )}
                                </tbody>
                            </Table>
                        </Card.Body>
                    </Card>
                </section>
            </main>
        </>
    );
}

export default ViewFeedback;
