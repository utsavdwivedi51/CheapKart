// Application State Management

// Initial state
const initialState = {
    items: [],
    cart: [],
    user: null,
};

// Actions
const ADD_ITEM = 'ADD_ITEM';
const REMOVE_ITEM = 'REMOVE_ITEM';
const SET_USER = 'SET_USER';

// Reducer function
const reducer = (state = initialState, action) => {
    switch (action.type) {
        case ADD_ITEM:
            return { ...state, items: [...state.items, action.payload] };
        case REMOVE_ITEM:
            return { ...state, items: state.items.filter(item => item.id !== action.payload.id) };
        case SET_USER:
            return { ...state, user: action.payload };
        default:
            return state;
    }
};

// Exporting the reducer
export default reducer;