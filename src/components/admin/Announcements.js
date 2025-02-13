import React, { useState } from 'react';
import { Container, Form, Button, Card } from 'react-bootstrap';

const Announcements = () => {
  const [announcements, setAnnouncements] = useState([]);
  const [newAnnouncement, setNewAnnouncement] = useState({
    title: '',
    content: '',
    image: null,
    imagePreview: null
  });

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setNewAnnouncement({
        ...newAnnouncement,
        image: file,
        imagePreview: URL.createObjectURL(file)
      });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (newAnnouncement.title && newAnnouncement.content) {
      setAnnouncements([
        {
          id: Date.now(),
          ...newAnnouncement,
          date: new Date().toLocaleDateString()
        },
        ...announcements
      ]);
      setNewAnnouncement({
        title: '',
        content: '',
        image: null,
        imagePreview: null
      });
    }
  };

  return (
    <section className="dashboard-sections dashboard-announcements">
      <h3>Announcements</h3>
      <Container>
        <Card className="mb-4">
          <Card.Body>
            <h4>Create New Announcement</h4>
            <Form onSubmit={handleSubmit}>
              <Form.Group className="mb-3">
                <Form.Label>Title</Form.Label>
                <Form.Control
                  type="text"
                  value={newAnnouncement.title}
                  onChange={(e) => setNewAnnouncement({
                    ...newAnnouncement,
                    title: e.target.value
                  })}
                  required
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Content</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  value={newAnnouncement.content}
                  onChange={(e) => setNewAnnouncement({
                    ...newAnnouncement,
                    content: e.target.value
                  })}
                  required
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Image</Form.Label>
                <Form.Control
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                />
                {newAnnouncement.imagePreview && (
                  <img
                    src={newAnnouncement.imagePreview}
                    alt="Preview"
                    className="mt-2"
                    style={{ maxWidth: '200px' }}
                  />
                )}
              </Form.Group>

              <Button type="submit" variant="primary">
                Post Announcement
              </Button>
            </Form>
          </Card.Body>
        </Card>

        <div className="announcements-list">
          {announcements.map((announcement) => (
            <Card key={announcement.id} className="mb-3">
              <Card.Body>
                <div className="d-flex justify-content-between align-items-start">
                  <div>
                    <Card.Title>{announcement.title}</Card.Title>
                    <Card.Subtitle className="mb-2 text-muted">
                      Posted on {announcement.date}
                    </Card.Subtitle>
                  </div>
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => setAnnouncements(announcements.filter(a => a.id !== announcement.id))}
                  >
                    Delete
                  </Button>
                </div>
                {announcement.imagePreview && (
                  <img
                    src={announcement.imagePreview}
                    alt="Announcement"
                    className="my-2"
                    style={{ maxWidth: '100%' }}
                  />
                )}
                <Card.Text>{announcement.content}</Card.Text>
              </Card.Body>
            </Card>
          ))}
        </div>
      </Container>
    </section>
  );
};

export default Announcements;