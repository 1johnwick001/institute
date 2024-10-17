import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import API_BASE_URL from '../../config/Config';
import Header from '../../components/Header/Header';
import Sidebar from '../../components/sidebar/Sidebar';
import Pagetitle from '../../components/pagetitle/Pagetitle';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import { Row, Col } from 'react-bootstrap';
import API_BASE_IMAGE_URL from '../../config/ImageConfig';


function ViewApplicationForm() {
    const { id } = useParams();  // Get the ID from the URL
    const [application, setApplication] = useState(null);

    useEffect(() => {
        const fetchApplication = async () => {
            try {
                const response = await fetch(`${API_BASE_URL}/getApplicationById/${id}`);
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
                <Pagetitle page='Application Details' />
                <section className='section'>
                    <Card style={{ padding: '20px' }}>
                        <Card.Body>
                            <h3>Application for {application.postAppliedFor}</h3>
                                <hr />
                            {/* Grid layout for fields (4 columns per row) */}
                            <Row>
                                <Col md={4}><strong>First Name:</strong> {application.firstName || 'N/A'}</Col>
                                <Col md={4}><strong>Last Name:</strong> {application.surname || 'N/A'}</Col>
                                <Col md={4}><strong>Phone No.:</strong> {application.cellNo || 'N/A'}</Col>
                            </Row>
                            <br />
                            <Row>

                                <Col md={4}><strong>Email:</strong> {application.emailAddress || 'N/A'}</Col>
                            
                            
                                <Col md={4}><strong>Applied For:</strong> {application.postAppliedFor || 'N/A'}</Col>
                                <Col md={4}><strong>UG Year of Passing:</strong> {application.educationalQualification.ug?.yearOfPassing || 'N/A'}</Col>
                            </Row>
                            <br />
                            <Row>    
                                <Col md={4}><strong>UG Percentage:</strong> {application.educationalQualification.ug?.passingPercentage || 'N/A'}</Col>
                                <Col md={4}><strong>UG Division:</strong> {application.educationalQualification.ug?.divisionOfPassing || 'N/A'}</Col>
                            
                                <Col md={4}><strong>UG Field of Specialization:</strong> {application.educationalQualification.ug?.fieldOfSpecialization || 'N/A'}</Col>
                            </Row>
                            <br />
                            <Row>    
                                <Col md={4}><strong>PG Year of Passing:</strong> {application.educationalQualification.pg?.yearOfPassing || 'N/A'}</Col>
                                <Col md={4}><strong>PG Percentage:</strong> {application.educationalQualification.pg?.passingPercentage || 'N/A'}</Col>
                                <Col md={4}><strong>PG Division:</strong> {application.educationalQualification.pg?.divisionOfPassing || 'N/A'}</Col>
                            </Row>
                            <br />
                            <Row>
                                <Col md={4}><strong>PG Field of Specialization:</strong> {application.educationalQualification.pg?.fieldOfSpecialization || 'N/A'}</Col>
                                <Col md={4}><strong>MPhil Year of Passing:</strong> {application.educationalQualification.mphil?.yearOfPassing || 'N/A'}</Col>
                                <Col md={4}><strong>MPhil Percentage:</strong> {application.educationalQualification.mphil?.passingPercentage || 'N/A'}</Col>
                            </Row> 
                            <br />
                            <Row>   
                                <Col md={4}><strong>MPhil Division:</strong> {application.educationalQualification.mphil?.divisionOfPassing || 'N/A'}</Col>
                            
                                <Col md={4}><strong>MPhil Field of Specialization:</strong> {application.educationalQualification.mphil?.fieldOfSpecialization || 'N/A'}</Col>
                                <Col md={4}><strong>PhD Year of Passing:</strong> {application.educationalQualification.phd?.yearOfPassing || 'N/A'}</Col>
                            </Row>  
                            <br />  
                            <Row>    
                                <Col md={4}><strong>PhD Percentage:</strong> {application.educationalQualification.phd?.passingPercentage || 'N/A'}</Col>
                                <Col md={4}><strong>PhD Division:</strong> {application.educationalQualification.phd?.divisionOfPassing || 'N/A'}</Col>
                           
                                <Col md={4}><strong>PhD Field of Specialization:</strong> {application.educationalQualification.phd?.fieldOfSpecialization || 'N/A'}</Col>
                            </Row>  
                            <br />  
                            <Row>    
                                <Col md={4}><strong>Qualified Exam in state / National:</strong> {application.nationalStateLevelExamination?.qualifiedExamName || 'N/A'}</Col>
                                <Col md={4}><strong>Qualifying Year:</strong> {application.nationalStateLevelExamination?.qualifyingYear || 'N/A'}</Col>
                                <Col md={4}>
  <strong>Resume:</strong>
  <Button variant="btn btn-info" 
          href={`${API_BASE_IMAGE_URL}/${application.resume}`} 
          target="_blank">
    View Resume
  </Button>
</Col>
                            </Row>
                        </Card.Body>
                    </Card>
                </section>
            </main>
        </>
    );
}

export default ViewApplicationForm;
