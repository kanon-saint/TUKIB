import React, { useState } from 'react';
import { Form, Button } from 'react-bootstrap';
import '../css/ContactForm.css';  

const ContactForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // form submission logic
    console.log('Form submitted:', formData);
  };

  return (
    <section className='contact-us'>
        <h6>Need Help?</h6>
        <h2>Contact Us</h2>
        <Form onSubmit={handleSubmit}>
            {/* Name Field */}
            <Form.Group controlId='name'>
            <Form.Label>Name</Form.Label>
            <Form.Control
                type='text'
                name='name'
                value={formData.name}
                onChange={handleChange}
                required
                placeholder='Enter your name'
            />
            </Form.Group>

            {/* Email Field */}
            <Form.Group controlId='email'>
            <Form.Label>Email address</Form.Label>
            <Form.Control
                type='email'
                name='email'
                value={formData.email}
                onChange={handleChange}
                required
                placeholder='Enter your email'
            />
            </Form.Group>

            {/* Message Field */}
            <Form.Group controlId='message'>
            <Form.Label>Message</Form.Label>
            <Form.Control
                as='textarea'
                rows={4}
                name='message'
                value={formData.message}
                onChange={handleChange}
                required
                placeholder='Enter your message'
            />
            </Form.Group>

            {/* Submit Button */}
            <Button type="submit" className="primary-button">
            Submit
            </Button>
        </Form>

        <div className='location'>
            <h2>Our Location</h2>
            <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2201.961444697611!2d122.22112810096463!3d10.642847900860765!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x33ae5d39c45fc653%3A0x3677cdbbf1b7509d!2sRegional%20Research%20Center!5e0!3m2!1sen!2sph!4v1731212160252!5m2!1sen!2sph"
                width="100%"
                height="450"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
        </div>

        </section>
    );
};

export default ContactForm;