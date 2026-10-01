export const initialState = {
  students: [],
  loading: false,
  error: null,
  editingStudent: null,
};

export const ACTION_TYPES = {
  FETCH_START: 'FETCH_START',
  SET_STUDENTS: 'SET_STUDENTS',
  FETCH_ERROR: 'FETCH_ERROR',
  ADD_STUDENT: 'ADD_STUDENT',
  UPDATE_STUDENT: 'UPDATE_STUDENT',
  DELETE_STUDENT: 'DELETE_STUDENT',
  SET_EDITING_STUDENT: 'SET_EDITING_STUDENT',
  CLEAR_EDITING_STUDENT: 'CLEAR_EDITING_STUDENT',
  CLEAR_ERROR: 'CLEAR_ERROR',
};

export const studentReducer = (state, action) => {
  switch (action.type) {
    case ACTION_TYPES.FETCH_START:
      return {
        ...state,
        loading: true,
        error: null,
      };

    case ACTION_TYPES.SET_STUDENTS:
      return {
        ...state,
        loading: false,
        students: action.payload,
        error: null,
      };

    case ACTION_TYPES.FETCH_ERROR:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    case ACTION_TYPES.ADD_STUDENT:
      return {
        ...state,
        students: [action.payload, ...state.students],
        error: null,
      };

    case ACTION_TYPES.UPDATE_STUDENT: {
      const updated = action.payload;
      const updatedId = updated._id || updated.id;
      return {
        ...state,
        students: state.students.map((student) => {
          const currentId = student._id || student.id;
          return currentId === updatedId ? updated : student;
        }),
        editingStudent: null,
        error: null,
      };
    }

    case ACTION_TYPES.DELETE_STUDENT: {
      const deleteId = action.payload;
      return {
        ...state,
        students: state.students.filter(
          (student) => (student._id || student.id) !== deleteId
        ),
        error: null,
      };
    }

    case ACTION_TYPES.SET_EDITING_STUDENT:
      return {
        ...state,
        editingStudent: action.payload,
      };

    case ACTION_TYPES.CLEAR_EDITING_STUDENT:
      return {
        ...state,
        editingStudent: null,
      };

    case ACTION_TYPES.CLEAR_ERROR:
      return {
        ...state,
        error: null,
      };

    default:
      return state;
  }
};
