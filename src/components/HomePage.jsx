import React, { useState } from 'react';
import {
  Table,
  Button,
  Card,
  Badge,
  Spinner,
  Alert,
  Form,
  InputGroup,
  Modal,
} from 'react-bootstrap';

const HomePage = ({
  students,
  loading,
  error,
  onDelete,
  onEdit,
  onNavigateToAdd,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [studentToDelete, setStudentToDelete] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  // Filter students based on search term (name, email, course)
  const filteredStudents = students.filter((student) => {
    const term = searchTerm.toLowerCase();
    const fullName = `${student.firstName || ''} ${student.lastName || ''}`.toLowerCase();
    const email = (student.email || '').toLowerCase();
    const course = (student.course || '').toLowerCase();
    return (
      fullName.includes(term) || email.includes(term) || course.includes(term)
    );
  });

  const confirmDelete = async () => {
    if (!studentToDelete) return;
    const id = studentToDelete._id || studentToDelete.id;
    setDeletingId(id);
    try {
      await onDelete(id);
      setStudentToDelete(null);
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="py-2">
      {/* Header bar */}
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-4">
        <div>
          <h2 className="fw-bold tracking-tight mb-1 text-dark">
            Student Roster
          </h2>
          <p className="text-muted small mb-0">
            View, search, edit, or manage enrolled students.
          </p>
        </div>
        <div className="d-flex gap-2">
          <Button
            variant="dark"
            onClick={onNavigateToAdd}
            className="d-flex align-items-center gap-2 px-3 py-2 fw-medium shadow-sm"
          >
            <span>+</span> Add New Student
          </Button>
        </div>
      </div>

      {/* Error alert */}
      {error && (
        <Alert variant="danger" className="border-0 shadow-sm mb-4">
          <div className="fw-semibold">Error</div>
          <div className="small">{error}</div>
        </Alert>
      )}

      {/* Main Card with Table */}
      <Card className="border-0 shadow-sm rounded-3 overflow-hidden">
        {/* Search bar header */}
        <Card.Header className="bg-white border-bottom py-3 px-4">
          <div className="row g-2 align-items-center">
            <div className="col-12 col-md-6 col-lg-5">
              <InputGroup size="sm">
                <InputGroup.Text className="bg-light border-end-0 text-muted">
                  🔍
                </InputGroup.Text>
                <Form.Control
                  type="text"
                  placeholder="Search by name, email, or course..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="bg-light border-start-0 shadow-none"
                />
                {searchTerm && (
                  <Button
                    variant="outline-secondary"
                    size="sm"
                    onClick={() => setSearchTerm('')}
                    className="border-start-0"
                  >
                    ✕
                  </Button>
                )}
              </InputGroup>
            </div>
            <div className="col-12 col-md-6 col-lg-7 text-md-end text-muted small">
              Showing{' '}
              <span className="fw-semibold text-dark">
                {filteredStudents.length}
              </span>{' '}
              of{' '}
              <span className="fw-semibold text-dark">{students.length}</span>{' '}
              students
            </div>
          </div>
        </Card.Header>

        <Card.Body className="p-0">
          {loading ? (
            <div className="text-center py-5">
              <Spinner animation="border" variant="dark" size="sm" />
              <p className="text-muted small mt-2 mb-0">Loading student records...</p>
            </div>
          ) : filteredStudents.length === 0 ? (
            <div className="text-center py-5 px-3">
              <div
                className="bg-light rounded-circle d-inline-flex align-items-center justify-content-center mb-3"
                style={{ width: '60px', height: '60px', fontSize: '24px' }}
              >
                👥
              </div>
              <h5 className="fw-semibold text-dark mb-1">
                {searchTerm ? 'No matching students found' : 'No students yet'}
              </h5>
              <p className="text-muted small mb-3">
                {searchTerm
                  ? 'Try modifying your search keywords.'
                  : 'Start by adding your first student using the add form.'}
              </p>
              {!searchTerm && (
                <Button
                  variant="outline-dark"
                  size="sm"
                  onClick={onNavigateToAdd}
                  className="px-3"
                >
                  Add First Student
                </Button>
              )}
            </div>
          ) : (
            <div className="table-responsive">
              <Table hover className="align-middle mb-0">
                <thead className="table-light text-secondary text-uppercase small">
                  <tr>
                    <th className="px-4 py-3" style={{ width: '80px' }}>
                      # ID
                    </th>
                    <th className="py-3">First Name</th>
                    <th className="py-3">Last Name</th>
                    <th className="py-3">Email</th>
                    <th className="py-3">Course</th>
                    <th className="px-4 py-3 text-end" style={{ width: '180px' }}>
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredStudents.map((student, index) => {
                    const studentId = student._id || student.id;
                    return (
                      <tr key={studentId || index}>
                        {/* Table ID column indicates index + 1 */}
                        <td className="px-4 py-3">
                          <Badge
                            bg="light"
                            text="dark"
                            className="border fw-medium px-2 py-1"
                          >
                            {index + 1}
                          </Badge>
                        </td>
                        <td className="py-3 fw-medium text-dark">
                          {student.firstName}
                        </td>
                        <td className="py-3 text-secondary">
                          {student.lastName}
                        </td>
                        <td className="py-3 text-secondary font-monospace small">
                          {student.email}
                        </td>
                        <td className="py-3">
                          <span className="badge bg-secondary-subtle text-secondary-emphasis fw-medium px-2 py-1 rounded-pill">
                            {student.course}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-end">
                          <div className="d-inline-flex gap-2">
                            <Button
                              variant="outline-secondary"
                              size="sm"
                              onClick={() => onEdit(student)}
                              className="px-2 py-1 small"
                              title="Edit Student"
                            >
                              Edit
                            </Button>
                            <Button
                              variant="outline-danger"
                              size="sm"
                              onClick={() => setStudentToDelete(student)}
                              disabled={deletingId === studentId}
                              className="px-2 py-1 small"
                              title="Delete Student"
                            >
                              {deletingId === studentId ? (
                                <Spinner animation="border" size="sm" />
                              ) : (
                                'Delete'
                              )}
                            </Button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </Table>
            </div>
          )}
        </Card.Body>
      </Card>

      {/* Delete Confirmation Modal */}
      <Modal
        show={!!studentToDelete}
        onHide={() => setStudentToDelete(null)}
        centered
        size="sm"
      >
        <Modal.Header closeButton className="border-0 pb-0">
          <Modal.Title className="fs-6 fw-bold text-dark">
            Confirm Delete
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="pt-2 pb-3">
          <p className="text-secondary small mb-0">
            Are you sure you want to remove{' '}
            <strong className="text-dark">
              {studentToDelete?.firstName} {studentToDelete?.lastName}
            </strong>
            ? This action cannot be undone.
          </p>
        </Modal.Body>
        <Modal.Footer className="border-0 pt-0">
          <Button
            variant="light"
            size="sm"
            onClick={() => setStudentToDelete(null)}
            className="border"
          >
            Cancel
          </Button>
          <Button
            variant="danger"
            size="sm"
            onClick={confirmDelete}
            disabled={!!deletingId}
          >
            {deletingId ? 'Deleting...' : 'Delete'}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default HomePage;
