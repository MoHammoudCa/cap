import React, { useState } from 'react';
import { Button, Modal, Form, Alert } from 'react-bootstrap';
import axios from 'axios';

const MessageButton = ({ organizerId, currentUserId }) => {
    const [show, setShow] = useState(false);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [isSending, setIsSending] = useState(false);

    const handleSend = async () => {
        if (!message.trim()) {
            setError('Message cannot be empty');
            return;
        }

        setIsSending(true);
        setError(''); // Clear any previous errors
        try {
            // Send message request
            const response = await axios.post('http://localhost:8080/api/messages', {
                senderId: currentUserId, // Use UUID string for senderId
                recipientId: organizerId, // Use UUID string for recipientId
                content: message,
            });

            // Check if response is successful
            if (response.status === 200) {
                setShow(false);
                setMessage('');
            } else {
                setError('Failed to send message');
            }
        } catch (error) {
            // Handle network or unexpected errors
            console.error("Message sending error:", error);
            setError('Failed to send message, please try again later.');
        } finally {
            setIsSending(false);
        }
    };

    return (
        <>
            <Button variant="primary" onClick={() => setShow(true)}>
                Send Message
            </Button>

            <Modal show={show} onHide={() => setShow(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Send Message</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {error && <Alert variant="danger">{error}</Alert>}
                    <Form.Group>
                        <Form.Control
                            as="textarea"
                            rows={3}
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                        />
                    </Form.Group>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShow(false)}>
                        Cancel
                    </Button>
                    <Button variant="primary" onClick={handleSend} disabled={isSending}>
                        {isSending ? 'Sending...' : 'Send'}
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
};

export default MessageButton;