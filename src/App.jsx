import React, { useReducer, useEffect, useState, useCallback } from "react";
import { Container, Toast, ToastContainer, Alert } from "react-bootstrap";
import {
  studentReducer,
  initialState,
  ACTION_TYPES,
} from "./reducer/studentReducer";
import {
  getStudentsApi,
  createStudentApi,
  updateStudentApi,
  deleteStudentApi,
} from "./services/api";
import Navigation from "./components/Navigation";
import HomePage from "./components/HomePage";
import AddStudentPage from "./components/AddStudentPage";

function App() {
  const [state, dispatch] = useReducer(studentReducer, initialState);
  const [activeTab, setActiveTab] = useState("home"); // 'home' | 'add'
  const [toast, setToast] = useState({
    show: false,
    message: "",
    variant: "dark",
  });

  const showNotification = (message, variant = "dark") => {
    setToast({ show: true, message, variant });
  };

  // Fetch initial student list from the API
  const fetchStudents = useCallback(async () => {
    dispatch({ type: ACTION_TYPES.FETCH_START });
    try {
      const response = await getStudentsApi();
      // Handle array directly or { data: [...] } structure
      const studentData = Array.isArray(response)
        ? response
        : response.data || [];
      dispatch({ type: ACTION_TYPES.SET_STUDENTS, payload: studentData });
    } catch (err) {
      const errorMessage =
        err.response?.data?.message ||
        err.message ||
        "Unable to connect to backend server. Make sure API is running.";
      dispatch({
        type: ACTION_TYPES.FETCH_ERROR,
        payload: errorMessage,
      });
    }
  }, []);

  useEffect(() => {
    fetchStudents();
  }, [fetchStudents]);

  // Add a new student
  const handleAddStudent = async (studentData) => {
    try {
      const response = await createStudentApi(studentData);
      const newStudent = response.data || response;
      dispatch({ type: ACTION_TYPES.ADD_STUDENT, payload: newStudent });
      showNotification("Student added successfully!", "success");
      return newStudent;
    } catch (err) {
      const errorMsg =
        err.response?.data?.message || err.message || "Failed to add student.";
      showNotification(errorMsg, "danger");
      throw err;
    }
  };

  // Update existing student
  const handleUpdateStudent = async (id, updatedData) => {
    try {
      const response = await updateStudentApi(id, updatedData);
      const updatedStudent = response.data || response;
      dispatch({
        type: ACTION_TYPES.UPDATE_STUDENT,
        payload: updatedStudent,
      });
      showNotification("Student updated successfully!", "success");
      setActiveTab("home");
      return updatedStudent;
    } catch (err) {
      const errorMsg =
        err.response?.data?.message ||
        err.message ||
        "Failed to update student.";
      showNotification(errorMsg, "danger");
      throw err;
    }
  };

  // Delete student
  const handleDeleteStudent = async (id) => {
    try {
      await deleteStudentApi(id);
      dispatch({ type: ACTION_TYPES.DELETE_STUDENT, payload: id });
      showNotification("Student removed successfully.", "dark");
    } catch (err) {
      const errorMsg =
        err.response?.data?.message ||
        err.message ||
        "Failed to delete student.";
      showNotification(errorMsg, "danger");
      throw err;
    }
  };

  // Trigger edit mode for a student
  const handleEditSelect = (student) => {
    dispatch({ type: ACTION_TYPES.SET_EDITING_STUDENT, payload: student });
    setActiveTab("add");
  };

  // Cancel edit mode
  const handleCancelEdit = () => {
    dispatch({ type: ACTION_TYPES.CLEAR_EDITING_STUDENT });
    setActiveTab("home");
  };

  return (
    <div className="d-flex flex-column min-vh-100">
      {/* Top Navigation */}
      <Navigation
        activeTab={activeTab}
        setActiveTab={(tab) => {
          if (tab === "home" && state.editingStudent) {
            dispatch({ type: ACTION_TYPES.CLEAR_EDITING_STUDENT });
          }
          setActiveTab(tab);
        }}
        studentCount={state.students.length}
      />

      {/* Main Content Area */}
      <Container className="flex-grow-1 pb-5">
        {/* Environmental setup notification if API fails */}
        {state.error && (
          <Alert variant="warning" className="border-0 shadow-sm mb-4">
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <strong>Backend Status:</strong> {state.error}
              </div>
              <button
                className="btn btn-outline-dark btn-sm ms-3"
                onClick={fetchStudents}
              >
                Retry
              </button>
            </div>
          </Alert>
        )}

        {activeTab === "home" && (
          <HomePage
            students={state.students}
            loading={state.loading}
            error={state.error}
            onDelete={handleDeleteStudent}
            onEdit={handleEditSelect}
            onNavigateToAdd={() => {
              dispatch({ type: ACTION_TYPES.CLEAR_EDITING_STUDENT });
              setActiveTab("add");
            }}
          />
        )}

        {activeTab === "add" && (
          <AddStudentPage
            editingStudent={state.editingStudent}
            onAddStudent={handleAddStudent}
            onUpdateStudent={handleUpdateStudent}
            onCancelEdit={handleCancelEdit}
            onNavigateToHome={() => {
              dispatch({ type: ACTION_TYPES.CLEAR_EDITING_STUDENT });
              setActiveTab("home");
            }}
          />
        )}
      </Container>

      {/* Toast Notification */}
      <ToastContainer
        position="bottom-end"
        className="p-3 position-fixed"
        style={{ zIndex: 1060 }}
      >
        <Toast
          show={toast.show}
          onClose={() => setToast((prev) => ({ ...prev, show: false }))}
          delay={4000}
          autohide
          bg={toast.variant}
        >
          <Toast.Body
            className={toast.variant === "light" ? "text-dark" : "text-white"}
          >
            {toast.message}
          </Toast.Body>
        </Toast>
      </ToastContainer>

      {/* Minimal Footer */}
      <footer className="border-top py-3 text-center text-muted small mt-auto bg-white">
        <Container>
          <span>Student Management System </span>
        </Container>
      </footer>
    </div>
  );
}

export default App;
