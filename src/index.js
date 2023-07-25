import React from 'react';
import ReactDOM from 'react-dom/client';
import GlobalStyle from './components/GlobalStyle';
import App from './App';
import reportWebVitals from './reportWebVitals';
import UserProvider from './stores/provider';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <UserProvider>
    <GlobalStyle>
      <App />
    </GlobalStyle>
  </UserProvider>
);

reportWebVitals();
