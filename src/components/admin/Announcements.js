import React, { useState, useMemo } from 'react';
import { Container, Form, Button, Card, Dropdown } from 'react-bootstrap';
import '../../css/Announcements.css';

const Announcements = () => {
  const [announcements, setAnnouncements] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [sortBy, setSortBy] = useState('newest');
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
      if (editingId) {
        setAnnouncements(announcements.map(announcement => 
          announcement.id === editingId 
            ? { 
                ...announcement, 
                ...newAnnouncement, 
                lastEdited: new Date().toLocaleDateString(),
                lastEditedTimestamp: new Date().getTime()
              }
            : announcement
        ));
        setEditingId(null);
      } else {
        const timestamp = new Date().getTime();
        setAnnouncements([
          {
            id: timestamp,
            ...newAnnouncement,
            date: new Date().toLocaleDateString(),
            timestamp: timestamp
          },
          ...announcements
        ]);
      }
      setNewAnnouncement({
        title: '',
        content: '',
        image: null,
        imagePreview: null
      });
      setShowForm(false);
    }
  };

  const handleEdit = (announcement) => {
    setEditingId(announcement.id);
    setNewAnnouncement({
      title: announcement.title,
      content: announcement.content,
      image: announcement.image,
      imagePreview: announcement.imagePreview
    });
    setShowForm(true);
  };

  const resetForm = () => {
    setEditingId(null);
    setNewAnnouncement({
      title: '',
      content: '',
      image: null,
      imagePreview: null
    });
    setShowForm(false);
  };

  const sortedAnnouncements = useMemo(() => {
    const sorted = [...announcements];
    switch (sortBy) {
      case 'newest':
        return sorted.sort((a, b) => b.timestamp - a.timestamp);
      case 'oldest':
        return sorted.sort((a, b) => a.timestamp - b.timestamp);
      case 'titleAZ':
        return sorted.sort((a, b) => a.title.localeCompare(b.title));
      case 'titleZA':
        return sorted.sort((a, b) => b.title.localeCompare(a.title));
      case 'lastEdited':
        return sorted.sort((a, b) => (b.lastEditedTimestamp || b.timestamp) - (a.lastEditedTimestamp || a.timestamp));
      default:
        return sorted;
    }
  }, [announcements, sortBy]);

  return (
    <section className="dashboard-announcements">
      <div className="announcements-header">
        <h3>Announcements</h3>
        <div className="announcements-controls">
          <Dropdown className="sort-dropdown">
            <Dropdown.Toggle variant="outline-secondary">
              Sort By: {sortBy.charAt(0).toUpperCase() + sortBy.slice(1)}
            </Dropdown.Toggle>
            <Dropdown.Menu>
              <Dropdown.Item onClick={() => setSortBy('newest')}>Newest First</Dropdown.Item>
              <Dropdown.Item onClick={() => setSortBy('oldest')}>Oldest First</Dropdown.Item>
              <Dropdown.Item onClick={() => setSortBy('titleAZ')}>Title (A-Z)</Dropdown.Item>
              <Dropdown.Item onClick={() => setSortBy('titleZA')}>Title (Z-A)</Dropdown.Item>
              <Dropdown.Item onClick={() => setSortBy('lastEdited')}>Last Edited</Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
          {!showForm && (
            <Button 
              className="btn-create-announcement" 
              onClick={() => setShowForm(true)}
            >
              + New Announcement
            </Button>
          )}
        </div>
      </div>

      <Container>
        {showForm && (
          <Card className="announcement-create-card">
            <h4>{editingId ? 'Edit Announcement' : 'Create New Announcement'}</h4>
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
                    className="image-preview"
                  />
                )}
              </Form.Group>

              <div className="form-actions">
                <Button type="submit" className="btn-primary">
                  {editingId ? 'Update Announcement' : 'Post Announcement'}
                </Button>
                <Button 
                  className="btn-secondary"
                  onClick={resetForm}
                >
                  Cancel
                </Button>
              </div>
            </Form>
          </Card>
        )}

        <div className="announcements-list">
          {sortedAnnouncements.map((announcement) => (
            <Card key={announcement.id} className="announcement-card">
              <div className="announcement-header">
                <div>
                  <h5 className="announcement-title">{announcement.title}</h5>
                  <p className="announcement-date">
                    Posted on {announcement.date}
                    {announcement.lastEdited && ` (Edited on ${announcement.lastEdited})`}
                  </p>
                </div>
                <div className="announcement-actions">
                  <Button
                    className="btn-edit"
                    onClick={() => handleEdit(announcement)}
                  >
                    Edit
                  </Button>
                  <Button
                    className="btn-delete"
                    onClick={() => setAnnouncements(announcements.filter(a => a.id !== announcement.id))}
                  >
                    Delete
                  </Button>
                </div>
              </div>
              {announcement.imagePreview && (
                <img
                  src={announcement.imagePreview}
                  alt="Announcement"
                  className="announcement-image"
                />
              )}
              <p className="announcement-content">{announcement.content}</p>
            </Card>
          ))}
        </div>
      </Container>
    </section>
  );
};

export default Announcements;