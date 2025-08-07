/* eslint-disable no-unused-vars */
import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { FaFacebook, FaInstagram, FaTwitter, FaLinkedin } from 'react-icons/fa';

export default function Footer() {
  return (
    <footer style={{ backgroundColor: '#1c1c1c', color: '#f1f1f1', padding: '30px 0' }}>
      <Container>
        <Row>
          <Col md={4} className="text-center mb-3">
            <h5>Contact Us</h5>
            <p>Email: support@ecart.com</p>
            <p>Phone: +91 98765 43210</p>
          </Col>
          <Col md={4} className="text-center mb-3">
            <h5>Address</h5>
            <p>E-Cart Pvt. Ltd.</p>
            <p>123, Gandhi Street, Chennai - 600001</p>
            <p>Tamil Nadu, India</p>
          </Col>
          <Col md={4} className="text-center mb-3">
            <h5>Follow Us</h5>
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="mx-2" style={{ color: '#f1f1f1' }}>
              <FaFacebook size={24} />
            </a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="mx-2" style={{ color: '#f1f1f1' }}>
              <FaInstagram size={24} />
            </a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="mx-2" style={{ color: '#f1f1f1' }}>
              <FaTwitter size={24} />
            </a>
            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="mx-2" style={{ color: '#f1f1f1' }}>
              <FaLinkedin size={24} />
            </a>
          </Col>
        </Row>

        <hr style={{ backgroundColor: '#444' }} />
        <Row>
          <Col className="text-center">
            <p className="mb-0">© {new Date().getFullYear()} E-Cart. All rights reserved.</p>
          </Col>
        </Row>
      </Container>
    </footer>
  );
}
