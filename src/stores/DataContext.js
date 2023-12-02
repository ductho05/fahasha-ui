import React, { createContext, useContext, useReducer } from 'react';

// Tạo một context mới
const DataContext = createContext();

// Reducer để quản lý trạng thái
const dataReducer = (state, action) => {
    switch (action.type) {
        case 'SET_DATA':
            return { ...state, ...action.payload };
        default:
            return state;
    }
};

// Tạo một custom hook để sử dụng context
export const useData = () => {
    const context = useContext(DataContext);
    if (!context) {
        throw new Error('useData must be used within a DataProvider');
    }
    return context;
};

// Tạo một Provider để bao bọc ứng dụng của bạn
export const DataProvider = ({ children }) => {
    const [data, dispatch] = useReducer(dataReducer, {});

    const setData = (newData) => {
        dispatch({ type: 'SET_DATA', payload: newData });
    };

    return <DataContext.Provider value={{ data, setData }}>{children}</DataContext.Provider>;
};
