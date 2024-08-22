import React from 'react';
import { Modal, Button } from 'react-bootstrap';

const DeleteModal = ({ show, onHide, onDelete, blogId }) => {
  const handleDelete = () => {
    onDelete(blogId);
    onHide();
  };

  return (
    <Modal show={show} onHide={onHide} backdrop="static" keyboard={false}>
      <Modal.Header className='bg-danger' closeButton>
        <Modal.Title >Confirm Delete</Modal.Title>
      </Modal.Header >
      <Modal.Body >Are you sure you want to delete this blog?</Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          No
        </Button>
        <Button variant="primary" onClick={handleDelete}>
          Yes
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default DeleteModal;