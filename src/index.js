import React from 'react';
import ReactDOM from 'react-dom/client';
import GlobalStyle from './components/GlobalStyle';
import App from './App';
import reportWebVitals from './reportWebVitals';
import UserProvider from './stores/provider';
import { DataProvider } from './stores/DataContext';
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <UserProvider>
        <DataProvider>
            <GlobalStyle>
                <App />
            </GlobalStyle>
        </DataProvider>
    </UserProvider>,
);

reportWebVitals();
