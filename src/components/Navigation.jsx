import React from 'react';
import { Navbar, Nav, Container, Badge } from 'react-bootstrap';

const Navigation = ({ activeTab, setActiveTab, studentCount }) => {
  return (
    <Navbar bg="white" expand="lg" className="border-bottom shadow-sm py-3 mb-4">
      <Container>
        <Navbar.Brand
          as="span"
          role="button"
          onClick={() => setActiveTab('home')}
          className="fw-bold tracking-tight text-dark d-flex align-items-center gap-2"
          style={{ cursor: 'pointer', letterSpacing: '-0.5px' }}
        >
          <span className="bg-dark text-white px-2 py-1 rounded-2 fs-6 fw-semibold">
            API
          </span>
          <span>Student Directory</span>
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto align-items-center gap-2 pt-2 pt-lg-0">
            <Nav.Link
              active={activeTab === 'home'}
              onClick={() => setActiveTab('home')}
              className={`px-3 py-2 rounded-2 fw-medium ${
                activeTab === 'home'
                  ? 'bg-light text-dark shadow-sm'
                  : 'text-secondary'
              }`}
            >
              Students List
              {studentCount > 0 && (
                <Badge bg="dark" pill className="ms-2 fw-normal">
                  {studentCount}
                </Badge>
              )}
            </Nav.Link>
            <Nav.Link
              active={activeTab === 'add'}
              onClick={() => setActiveTab('add')}
              className={`px-3 py-2 rounded-2 fw-medium ${
                activeTab === 'add'
                  ? 'bg-dark text-white shadow-sm'
                  : 'text-secondary'
              }`}
            >
              + Add Student
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Navigation;
