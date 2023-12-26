import React from 'react';
import ReactDOM from 'react-dom/client';
import GlobalStyle from './components/GlobalStyle';
import App from './App';
import reportWebVitals from './reportWebVitals';
import UserProvider from './stores/provider';
import { DataProvider } from './stores/DataContext';
import { CustomChat, FacebookProvider } from 'react-facebook'
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <UserProvider>
        <DataProvider>
            <GlobalStyle>
                <FacebookProvider appId="1325947341377754" chatSupport>
                    <CustomChat pageId="198008766726901" minimized={true} />
                </FacebookProvider>
                <App />
            </GlobalStyle>
        </DataProvider>
    </UserProvider>,
);

reportWebVitals();
