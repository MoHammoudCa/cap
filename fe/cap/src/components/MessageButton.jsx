import React, { useState } from 'react';
import { Button, Modal, Form, Alert } from 'react-bootstrap';
import axios from 'axios';

const MessageButton = ({ organizerId, currentUserId }) => {
    const [show, setShow] = useState(false);
    const [title, setTitle] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [isSending, setIsSending] = useState(false);

    const handleSend = async () => {
        if (!title.trim()) {
            setError('Title cannot be empty');
            return;
        }
        if (!message.trim()) {
            setError('Message cannot be empty');
            return;
        }

        setIsSending(true);
        setError(''); // Clear any previous errors
        try {
            // Send message request
            const response = await axios.post('http://localhost:8080/api/messages', {
                senderId: currentUserId,
                recipientId: organizerId,
                title: title,
                content: message,
            });

            // Check if response is successful
            if (response.status === 200) {
                setShow(false);
                setTitle('');
                setMessage('');
            } else {
                setError('Failed to send message');
            }
        } catch (error) {
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
                    <Form.Group className="mb-3">
                        <Form.Label>Title</Form.Label>
                        <Form.Control
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="Enter message title"
                        />
                    </Form.Group>
                    <Form.Group>
                        <Form.Label>Message</Form.Label>
                        <Form.Control
                            as="textarea"
                            rows={3}
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            placeholder="Enter your message"
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